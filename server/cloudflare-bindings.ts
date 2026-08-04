type PayloadRuntimeBindings = {
  DB: D1Database;
  BUCKET: R2Bucket;
};

declare global {
  var __NECYPAA_PAYLOAD_BINDINGS__: PayloadRuntimeBindings | undefined;
}

function bindingProxy<T extends object>(name: keyof PayloadRuntimeBindings): T {
  return new Proxy({} as T, {
    get(_target, property) {
      const binding = globalThis.__NECYPAA_PAYLOAD_BINDINGS__?.[name] as T | undefined;
      if (!binding) throw new Error(`Cloudflare ${name} binding is unavailable`);
      const value = Reflect.get(binding, property, binding);
      return typeof value === "function" ? value.bind(binding) : value;
    },
  });
}

export const payloadD1 = bindingProxy<D1Database>("DB");
export const payloadBucket = bindingProxy<R2Bucket>("BUCKET");

export function setPayloadBindings(bindings: PayloadRuntimeBindings) {
  globalThis.__NECYPAA_PAYLOAD_BINDINGS__ = bindings;
}
