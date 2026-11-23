import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";
import { checkoutFixture, historicalManifest, manualReceiptFixture } from "./historical-import-fixture.ts";

const base = "http://127.0.0.1:3029";
const endpoint = `${base}/api/admin/registration-import`;
const runId = randomUUID().replaceAll("-", "");
const fixture = checkoutFixture(runId);
const payerEmail = `historical-payer-${runId}@example.invalid`;
const attendeeEmail = `historical-attendee-${runId}@example.invalid`;
const payment = {
  ...fixture,
  purchaser: { ...fixture.purchaser, email: payerEmail },
  registrations: fixture.registrations.map((registration) => ({ ...registration, email: attendeeEmail })),
};
const capturedFixtureMail = async () => (await readFile(".local-registration/mail.ndjson", "utf8"))
  .split("\n").filter((line) => line.includes(payerEmail) || line.includes(attendeeEmail));
const manualPayments = Array.from({ length: 20 }, (_, index) => {
  const cashReference = createHash("sha256").update(`${runId}:${index}`).digest("hex");
  return { ...manualReceiptFixture(index), cashReference, sourceKey: `historical:manual:${cashReference}` };
});
const upload = {
  name: `synthetic-historical-${runId}.json`,
  mimeType: "application/json",
  buffer: Buffer.from(JSON.stringify(historicalManifest([payment, ...manualPayments]))),
};
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});

try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const login = await context.request.post(`${base}/api/users/login`, {
    timeout: 120_000,
    data: { email: "browser-admin@example.invalid", password: "LocalSyntheticBrowserOnly123!" },
  });
  assert.equal(login.status(), 200);
  const anonymous = await browser.newContext();
  assert.equal((await anonymous.request.get(endpoint)).status(), 403);
  await anonymous.close();

  const page = await context.newPage();
  page.setDefaultTimeout(120_000);
  page.setDefaultNavigationTimeout(120_000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("503")) errors.push(message.text());
  });
  const beforeMail = await capturedFixtureMail();
  let confirmations = 0;
  await page.route(endpoint, async (route) => {
    const request = route.request();
    if (request.method() === "POST" && request.postData()?.includes('name="confirmation"')) {
      confirmations++;
      if (confirmations === 2) {
        await route.fulfill({ status: 503, json: { error: "Synthetic interruption. Retry the same selection." } });
        return;
      }
    }
    await route.continue();
  });

  const navigation = await page.goto(`${base}/admin/registration-import`);
  assert.equal(navigation?.status(), 200);
  assert.equal(new URL(page.url()).pathname, "/admin/registration-import");
  assert.ok(await page.title());
  await page.getByRole("heading", { name: "Import registrations", exact: true }).waitFor();
  assert.ok(await page.getByLabel("Tracker workbook").isVisible());
  await page.getByLabel("Historical import JSON").setInputFiles(upload);
  await page.getByRole("button", { name: "Preview JSON" }).click();
  const review = page.getByRole("heading", { name: "Review historical purchases" });
  await review.waitFor();
  await page.getByText(/21 new payments · 0 already recorded/).waitFor();
  await page.getByText(/1 paid seats · 3 breakfast tickets · 1 scholarship contributions · 22 merchandise units/).waitFor();
  await page.getByText(/1 fellowship, 1 accommodation, 1 interpretation, and 1 mobility/).waitFor();
  await page.getByText("Source review (1)").click();
  await page.getByText("Stripe payment is not present in the reconciled tracker.", { exact: false }).waitFor();
  const previewText = await page.locator("body").innerText();
  assert.doesNotMatch(previewText, /Synthetic confidential answer/);
  assert.ok(!previewText.includes(attendeeEmail));
  await review.scrollIntoViewIfNeeded();
  await page.screenshot({ path: ".local-registration/historical-preview-desktop.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await review.scrollIntoViewIfNeeded();
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  await page.screenshot({ path: ".local-registration/historical-preview-mobile.png" });

  await page.getByRole("button", { name: "Select all new payments" }).click();
  const submit = page.getByRole("button", { name: "Import selected payments (21)" });
  await submit.click();
  assert.equal(confirmations, 0);
  await page.getByLabel(/I verified the selected Stripe payments/).check();
  await page.getByLabel(/I verified the identities and form answers/).check();
  await page.getByLabel(/I reviewed the purchase quantities/).check();
  await submit.click();
  await page.getByRole("alert").filter({ hasText: "Synthetic interruption" }).waitFor();
  await page.getByRole("status").filter({ hasText: "Imported 20 of 21 selected payments." }).waitFor();
  assert.ok(await page.getByRole("button", { name: "Clear selection" }).isDisabled());
  const batchHistory = page.getByRole("listitem").filter({ hasText: upload.name });
  await batchHistory.filter({ hasText: /In progress · 20 of 21 payments/ }).waitFor();
  await page.getByRole("button", { name: "Resume selected payments (21)" }).click();
  await page.getByRole("status").filter({ hasText: "Import complete. 1 paid seats, 3 breakfast tickets" }).waitFor();
  assert.equal(confirmations, 3);
  await batchHistory.filter({ hasText: /imported · 21 of 21 payments/ }).waitFor();
  assert.deepEqual(await capturedFixtureMail(), beforeMail);

  await page.getByRole("button", { name: "Preview JSON" }).click();
  await page.getByText(/0 new payments · 21 already recorded/).waitFor();
  const checkoutRow = page.getByRole("row").filter({ hasText: payment.sourceKey });
  assert.ok(await checkoutRow.getByRole("checkbox").isDisabled());
  await page.getByRole("button", { name: "Select all new payments" }).click();
  assert.ok(await page.getByRole("button", { name: "Import selected payments (0)" }).isDisabled());
  assert.deepEqual(errors, []);
  console.log("Historical import browser checks passed: preview, role restriction, responsive layout, required confirmations, interrupted batch recovery, duplicate skip, and mail capture.");
  await context.close();
} finally {
  await browser.close();
}
