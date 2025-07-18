import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  test('отображает кнопку ввода и поиска', () => {
    render(<SearchBar onSearch={() => {}} />);

    //проверяем поле
    const input = screen.getByPlaceholderText(/введите имя персонажа/i);
    expect(input).toBeInTheDocument();

    //проверяем кнопку
    const button = screen.getByRole('button', { name: /search/i });
    expect(button).toBeInTheDocument();
  });

  test('обновляет входное значение при вводе', () => {
    render(<SearchBar onSearch={() => {}} />);
    const input = screen.getByPlaceholderText(/введите имя персонажа/i);

    //  Вводим текст и проверяем, что он появился
    fireEvent.change(input, { target: { value: 'Luke' } });
    expect(input).toHaveValue('Luke');
  });

  test('вызывает onSearch с обрезанным значением при нажатии кнопки', () => {
    const mockSearch = jest.fn();
    render(<SearchBar onSearch={mockSearch} />);
    const input = screen.getByPlaceholderText(/введите имя персонажа/i);
    const button = screen.getByRole('button', { name: /search/i });

    //  Вводим текст с пробелами
    fireEvent.change(input, { target: { value: '  Leia  ' } });
    fireEvent.click(button);

    //  Проверяем, что onSearch вызван с очищенным значением
    expect(mockSearch).toHaveBeenCalledWith('Leia');
    expect(mockSearch).toHaveBeenCalledTimes(1);
  });

  test('shows initial value from props if provided', () => {
    render(<SearchBar onSearch={() => {}} initialValue="Yoda" />);
    const input = screen.getByPlaceholderText(/введите имя персонажа/i);

    // 📌 Проверяем начальное значение
    expect(input).toHaveValue('Yoda');
  });
});
