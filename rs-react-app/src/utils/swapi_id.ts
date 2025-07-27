/**
 * Извлекает ID из SWAPI URL, например:
 * "https://swapi.dev/api/people/1/" → "1"
 */
export function extractId(url: string): string {
  const parts = url.split('/');
  return parts.at(-2) ?? '';
}
