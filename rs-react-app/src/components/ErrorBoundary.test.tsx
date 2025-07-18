import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';
import '@testing-library/jest-dom';

//  Компонент, который выбрасывает ошибку
const Bomb = () => {
  throw new Error('Boom!');
};

// Компонент, который работает нормально
const Safe = () => <div>Всё хорошо</div>;

describe('ErrorBoundary', () => {
  test('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <Safe />
      </ErrorBoundary>
    );
    expect(screen.getByText('Всё хорошо')).toBeInTheDocument();
  });

  test('renders fallback when error occurs', () => {
    render(
      <ErrorBoundary fallback={<div>Ошибка поймана</div>}>
        <Bomb />
      </ErrorBoundary>
    );
    expect(screen.getByText('Ошибка поймана')).toBeInTheDocument();
  });

  test('calls componentDidCatch', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );
    expect(spy).toHaveBeenCalled(); // Проверяем, что ошибка была логированна через console.error
    spy.mockRestore(); // Возвращаем оригинальный console.error мы отменяем подмену
  });
});
