import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("every non-default campaign variant has a concrete visual rule", async () => {
  const [definitions, styles] = await Promise.all([
    source("puck/campaign-alt-definitions.ts"),
    source("puck/puck.module.css"),
  ]);

  const definitionPattern = /type:\s*"([^"]+)"[\s\S]*?variants:\s*\[([^\]]+)\]/g;
  const missing = [];
  for (const match of definitions.matchAll(definitionPattern)) {
    const variants = Array.from(match[2].matchAll(/"([^"]+)"/g), (entry) => entry[1]);
    variants.slice(1).filter((variant) => variant !== "default").forEach((variant) => {
      if (!styles.includes(`data-variant="${variant}"`)) missing.push(`${match[1]}:${variant}`);
    });
  }

  assert.deepEqual(missing, []);
});

test("builder and Payload expose the same modern element contract", async () => {
  const [dropZones, puck, payloadBlocks, pageData] = await Promise.all([
    source("puck/drop-zones.ts"),
    source("puck/config.tsx"),
    source("blocks/page-blocks.ts"),
    source("puck/page-data.ts"),
  ]);

  assert.match(dropZones, /"Icon"/);
  assert.doesNotMatch(dropZones, /"PayPal"/);
  assert.match(puck, /Icon:\s*\{/);
  assert.match(payloadBlocks, /slug:\s*"Icon"/);
  assert.match(pageData, /type === "PayPal" \? "Button"/);
});

test("width, blank-line, tab-editor, Posts, and MCP contracts stay wired", async () => {
  const [styles, config, posts, payloadConfig, catalog] = await Promise.all([
    source("puck/puck.module.css"),
    source("puck/config.tsx"),
    source("collections/Posts.ts"),
    source("payload.config.ts"),
    source("mcp/block-catalog.ts"),
  ]);

  assert.match(styles, /data-presentation="contained"[^\n]*max-width:\s*1120px/);
  assert.match(styles, /data-presentation="fullBleed"[^\n]*max-width:\s*none/);
  assert.match(styles, /p:empty[^\n]*min-height:/);
  assert.match(styles, /campaignAltTabs\[data-editing="true"\]/);
  assert.match(config, /backgroundColor:\s*themeColorField\("Button color"\)/);
  assert.match(posts, /type:\s*"richText"/);
  assert.match(payloadConfig, /mcpPlugin\(\{/);
  assert.match(payloadConfig, /collection[s]?:[\s\S]*posts:/);
  assert.match(catalog, /builderData\.zones/);
});
