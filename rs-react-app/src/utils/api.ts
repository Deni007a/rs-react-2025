import type { SwapiPerson, SwapiResponse } from '../types/swapi';

export async function fetchSwapiPeople(
  term: string
): Promise<SwapiResponse<SwapiPerson>> {
  const trimmed = term.trim();

  // Если поиск пустой — запрос без параметров
  const url = trimmed
    ? `/api/people/?search=${encodeURIComponent(trimmed)}`
    : `/api/people/`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Ошибка ${res.status}: ${res.statusText}`);
  }

  return res.json();
}
