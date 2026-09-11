const sharp = require('sharp');
const fs = require('node:fs/promises');
// The title is baked once into the base asset; per-player rendering adds results only.
async function main() {
  const source = process.argv[2];
  if (!source) throw new Error('Pass the clean generated base PNG path.');
  const title = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <g fill="#f6eefb" font-family="Arial" font-weight="700" font-size="32">
      <text x="743" y="110">One</text><text x="815" y="110" fill="#ad9cba">day</text><text x="881" y="110">at a time.</text>
    </g>
    <path d="M813 101 L871 90" stroke="#ffaf78" stroke-width="3" stroke-linecap="round"/>
    <text x="817" y="83" fill="#c4a2ff" font-family="Segoe Print, cursive" font-style="italic" font-weight="700" font-size="26" transform="rotate(-7 817 83)">word</text>
    <text x="900" y="601" fill="#c1b5cf" font-family="Arial" font-size="19" text-anchor="middle">Play with me · necypaact.com</text>
  </svg>`);
  const png = await sharp(source).resize(1200, 630).composite([{ input: title }]).png().toBuffer();
  await fs.writeFile('public/images/word-puzzle-share-base.png', png);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
