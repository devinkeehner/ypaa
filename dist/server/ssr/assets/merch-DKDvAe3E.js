//#region components/site/merch.ts
var merchandiseTypeLabels = {
	"t-shirt": "T-shirt",
	"long-sleeve": "Long-sleeve shirt",
	hoodie: "Hoodie",
	crewneck: "Crewneck sweatshirt",
	hat: "Hat",
	sticker: "Sticker",
	pin: "Pin",
	tote: "Tote bag",
	mug: "Mug",
	other: "Other"
};
function formatMerchandisePrice(value) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: value % 1 ? 2 : 0
	}).format(value);
}
function inventoryKey(option, index = 0) {
	return option.id || [
		option.size || "",
		option.color || "",
		option.sku || "",
		index
	].join("::");
}
function inventoryLabel(option) {
	return [option.color, option.size].filter(Boolean).join(" / ") || "Standard item";
}
function inStockInventory(item) {
	return (item.inventory || []).filter((option) => option.quantity > 0);
}
function totalInventory(item) {
	return (item.inventory || []).reduce((total, option) => total + Math.max(0, option.quantity || 0), 0);
}
//#endregion
export { merchandiseTypeLabels as a, inventoryLabel as i, inStockInventory as n, totalInventory as o, inventoryKey as r, formatMerchandisePrice as t };
