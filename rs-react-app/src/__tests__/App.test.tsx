import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

// Перед каждым тестом сбрасываем моки и настраиваем глобальный fetch
beforeEach(() => {
  jest.resetAllMocks(); // очищаем все моки

  // Мокаем глобальный fetch, чтобы он возвращал успешный ответ
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve({
        count: 1,
        results: [
          {
            name: 'Luke Skywalker',
            birth_year: '19BBY',
            gender: 'male',
            url: 'https://swapi.dev/api/people/1/',
            height: '172',
            mass: '77',
            hair_color: 'blond',
            skin_color: 'fair',
            eye_color: 'blue',
            homeworld: '',
            films: [],
            species: [],
            vehicles: [],
            starships: [],
            created: '',
            edited: '',
          },
        ],
      }),
  });
});

describe('App component', () => {
  //  Проверяем, что заголовок и поле поиска отображаются
  test('renders header and search bar', () => {
    render(<App />);

    expect(screen.getByText('SWAPI Поиск')).toBeInTheDocument(); // заголовок
    expect(screen.getByRole('textbox')).toBeInTheDocument(); // поле ввода
  });

  // Проверяем, что Loader появляется, а затем карточка
  test('shows loader during fetch and then renders cards', async () => {
    const { container } = render(<App />); // рендерим компонент

    const loader = container.querySelector('.loader'); // ищем loader по классу
    expect(loader).not.toBeNull(); // проверяем, что он существует

    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument(); // карточка появилась
    });
  });

  // Проверяем, что поиск вызывает fetch с новым параметром
  test('handles search input and fetches new data', async () => {
    render(<App />); // рендерим компонент

    const input = screen.getByRole('textbox'); // получаем поле ввода
    fireEvent.change(input, { target: { value: 'Leia' } }); // вводим текст

    const button = screen.getByRole('button', { name: /search/i }); // находим кнопку
    fireEvent.click(button); // кликаем

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/people/?search=Leia'); // проверяем URL
    });
  });

  //  Проверяем, что отображается ошибка при плохом ответе
  test('shows error message if fetch fails', async () => {
    // Мокаем fetch с ошибкой
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Ошибка 500/)).toBeInTheDocument(); // сообщение об ошибке
    });
  });

  // Проверяем, что BuggyComponent выбрасывает ошибку и ErrorBoundary её ловит
  test('renders BuggyComponent when button is clicked', async () => {
    // Подавляем console.error, чтобы не засорять вывод
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<App />);

    const button = screen.getByText('Render BuggyComponent'); // находим кнопку
    fireEvent.click(button); // кликаем

    await waitFor(() => {
      expect(screen.getByText('Ошибка приложения')).toBeInTheDocument(); // fallback от ErrorBoundary
    });

    spy.mockRestore(); // возвращаем оригинальный console.error
  });
});
