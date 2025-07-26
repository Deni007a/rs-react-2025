import type { SwapiPerson, SwapiResponse } from '../types/swapi';

export interface FetchPeopleOptions {
  searchTerm?: string; //Поисковый запрос (необязательный)
  page?: number; //Номер страницы (начинается с 1, необязательный)
}

export async function fetchSwapiPeople(
  options: FetchPeopleOptions = {}
): Promise<SwapiResponse<SwapiPerson>> {
  // Извлекаем и обрабатываем параметры запроса
  const { searchTerm = '', page } = options;
  const trimmed = searchTerm.trim();

  // Создаем базовый URL для запроса к API
  const url = new URL('/api/people/', window.location.origin);

  // Создаем объект для хранения параметров запроса
  const params = new URLSearchParams();

  // Добавляем поисковый запрос, если он есть
  if (trimmed) {
    params.append('search', trimmed);
  }

  // Добавляем номер страницы, если он больше 1
  if (page && page > 1) {
    params.append('page', page.toString());
  }

  // Добавляем параметры к URL, если они есть
  const queryString = params.toString();
  if (queryString) {
    url.search = queryString;
  }

  // Выполняем запрос к API
  const res = await fetch(url.toString());

  // Проверяем статус ответа
  if (!res.ok) {
    throw new Error(`Ошибка ${res.status}: ${res.statusText}`);
  }

  // Возвращаем распарсенный JSON-ответ
  return res.json();
}
