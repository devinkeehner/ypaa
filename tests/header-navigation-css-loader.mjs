// SSR tests only: Node cannot load CSS modules; browser QA uses the real stylesheet.
export async function load(url, context, nextLoad) {
  if (url.endsWith('.module.css')) return { format: 'module', shortCircuit: true, source: 'export default new Proxy({}, { get: (_, key) => String(key) });' };
  return nextLoad(url, context);
}
