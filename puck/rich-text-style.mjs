const HEX_COLOR = /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;

export function extractLexicalTextColor(style) {
  if (typeof style !== "string") return undefined;

  for (const declaration of style.split(";")) {
    const separator = declaration.indexOf(":");
    if (separator < 0) continue;
    const property = declaration.slice(0, separator).trim().toLowerCase();
    const value = declaration.slice(separator + 1).trim();
    if (property === "color" && HEX_COLOR.test(value)) return value;
  }

  return undefined;
}
