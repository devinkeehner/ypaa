//#region server/cloudflare-bindings.ts
function bindingProxy(name) {
	return new Proxy({}, { get(_target, property) {
		const binding = globalThis.__NECYPAA_PAYLOAD_BINDINGS__?.[name];
		if (!binding) throw new Error(`Cloudflare ${name} binding is unavailable`);
		const value = Reflect.get(binding, property, binding);
		return typeof value === "function" ? value.bind(binding) : value;
	} });
}
var payloadD1 = bindingProxy("DB");
var payloadBucket = bindingProxy("BUCKET");
function setPayloadBindings(bindings) {
	globalThis.__NECYPAA_PAYLOAD_BINDINGS__ = bindings;
}
//#endregion
export { payloadD1 as n, setPayloadBindings as r, payloadBucket as t };
