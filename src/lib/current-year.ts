/** Current year, cached so pages can still be prerendered (Cache Components). */
export async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}
