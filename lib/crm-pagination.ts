/** Fetch every API page; visual result pagination must not hide unloaded records. */
export async function fetchAllCRMRecords<T>(path: string, fetcher: typeof fetch = fetch): Promise<T[]> {
  const docs: T[] = [];
  let page = 1;
  while (true) {
    const separator = path.includes("?") ? "&" : "?";
    const response = await fetcher(`${path}${separator}limit=500&page=${page}`, { credentials: "same-origin", cache: "no-store" });
    if (!response.ok) throw new Error(response.status === 401 || response.status === 403 ? "unauthorized" : "Unable to load CRM records");
    const result = await response.json() as { docs: T[]; hasNextPage: boolean; nextPage?: number };
    if (!Array.isArray(result.docs)) throw new Error("Invalid CRM response");
    docs.push(...result.docs);
    if (!result.hasNextPage) return docs;
    if (!result.nextPage || result.nextPage <= page) throw new Error("Invalid CRM pagination");
    page = result.nextPage;
  }
}
