import { fetchSwapiPeople } from '../utils/api';

describe('fetchSwapiPeople', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn();
  });

  test('успешный ответ возвращает данные', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        count: 1,
        results: [
          { name: 'Luke Skywalker', url: 'https://swapi.dev/api/people/1/' },
        ],
      }),
    });

    const result = await fetchSwapiPeople({ searchTerm: 'Luke', page: 1 });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('search=Luke')
    );
    expect(result.results).toHaveLength(1);
    expect(result.results[0].name).toBe('Luke Skywalker');
  });

  test('ошибка при плохом ответе', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(
      fetchSwapiPeople({ searchTerm: 'Vader', page: 2 })
    ).rejects.toThrow('Ошибка 500: Internal Server Error');
  });

  test('пустой searchTerm и страница передаются', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        count: 0,
        results: [],
      }),
    });

    await fetchSwapiPeople({ searchTerm: '', page: 3 });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('page=3')
    );
  });
});
