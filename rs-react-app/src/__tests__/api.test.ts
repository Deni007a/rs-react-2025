import { fetchSwapiPeople } from '../utils/api';

describe('fetchSwapiPeople', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // очищаем моки перед каждым тестом
  });

  test('возвращает данные при успешном запросе', async () => {
    // Мокаем fetch, чтобы он вернул успешный ответ
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ count: 1, results: [{ name: 'Luke' }] }),
    });
    const result = await fetchSwapiPeople('Luke');

    // Проверяем, что fetch был вызван с нужным URL
    expect(global.fetch).toHaveBeenCalledWith('/api/people/?search=Luke');

    // Проверяем, что результат содержит имя
    expect(result.results[0].name).toBe('Luke');
  });

  test('выбрасывает ошибку при плохом ответе', async () => {
    // Мокаем fetch с ошибкой
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    // Проверяем, что функция выбрасывает исключение
    await expect(fetchSwapiPeople('Vader')).rejects.toThrow(
      'Ошибка 404: Not Found'
    );
  });
});
