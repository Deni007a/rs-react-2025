import type { SwapiPerson, SwapiResponse } from '../types/swapi';

export async function fetchSwapiPeople(
  term: string
): Promise<SwapiResponse<SwapiPerson>> {
  const query = encodeURIComponent(term.trim());
  //const url = `https://swapi.dev/api/people/?search=${query}`;
  const url = `/api/people/?search=${query}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Ошибка ${res.status}: ${res.statusText}`);
  }

  return res.json();
}
