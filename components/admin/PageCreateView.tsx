"use client";

import { ArrowLeft, LoaderCircle, Plus } from "lucide-react";
import { FormEvent, useState } from "react";

import styles from "./page-create-view.module.css";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function responseError(body: unknown) {
  if (!body || typeof body !== "object") return "Unable to create the page.";
  const value = body as { errors?: Array<{ message?: string }>; message?: string };
  return value.errors?.find((error) => error.message)?.message || value.message || "Unable to create the page.";
}

export default function PageCreateView() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  async function createPage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    const cleanSlug = slugify(slug || title);

    if (!cleanTitle || !cleanSlug) {
      setError("Enter a page title and URL slug.");
      return;
    }

    setError("");
    setIsCreating(true);

    try {
      const response = await fetch("/api/pages?depth=0", {
        body: JSON.stringify({
          _status: "draft",
          builderData: {
            content: [],
            root: { props: { slug: cleanSlug, title: cleanTitle } },
          },
          layout: [],
          slug: cleanSlug,
          title: cleanTitle,
        }),
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const body = (await response.json().catch(() => null)) as { doc?: { id?: number | string } } | null;

      if (!response.ok) throw new Error(responseError(body));
      if (body?.doc?.id === undefined || body.doc.id === null) throw new Error("The page was created without a document ID.");

      window.location.assign(`/admin/visual-builder/${encodeURIComponent(String(body.doc.id))}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create the page.");
      setIsCreating(false);
    }
  }

  return (
    <main className={styles.page}>
      <a className={styles.back} href="/admin/collections/pages">
        <ArrowLeft aria-hidden="true" />
        Pages
      </a>
      <form aria-busy={isCreating} className={styles.form} onSubmit={(event) => void createPage(event)}>
        <header>
          <span>Pages</span>
          <h1>Create page</h1>
        </header>
        <label>
          <span>Page title</span>
          <input
            autoComplete="off"
            autoFocus
            disabled={isCreating}
            onChange={(event) => {
              const nextTitle = event.target.value;
              setTitle(nextTitle);
              if (!slugEdited) setSlug(slugify(nextTitle));
            }}
            required
            type="text"
            value={title}
          />
        </label>
        <label>
          <span>URL slug</span>
          <div className={styles.slugInput}>
            <span>/</span>
            <input
              autoComplete="off"
              disabled={isCreating}
              onChange={(event) => {
                setSlugEdited(true);
                setSlug(slugify(event.target.value));
              }}
              required
              type="text"
              value={slug}
            />
          </div>
        </label>
        <p aria-live="polite" className={styles.error} role="status">{error}</p>
        <div className={styles.actions}>
          <a href="/admin/collections/pages">Cancel</a>
          <button disabled={isCreating} type="submit">
            {isCreating ? <LoaderCircle aria-hidden="true" className={styles.spinner} /> : <Plus aria-hidden="true" />}
            {isCreating ? "Creating page" : "Create and open builder"}
          </button>
        </div>
      </form>
    </main>
  );
}
