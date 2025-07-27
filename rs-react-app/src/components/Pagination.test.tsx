import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Pagination from './Pagination';

describe('Pagination', () => {
  it('не отображает компонент, если totalPages <= 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('корректно рендерит номера страниц и активную страницу', () => {
    render(
      <Pagination currentPage={3} totalPages={10} onPageChange={() => {}} />
    );

    // Проверяем активную страницу
    const activePage = screen.getByRole('button', {
      name: '3',
      current: 'page',
    });
    expect(activePage).toBeInTheDocument();

    // Проверяем навигационные кнопки
    expect(screen.getByLabelText('Первая страница')).toBeInTheDocument();
    expect(screen.getByLabelText('Предыдущая страница')).toBeInTheDocument();
    expect(screen.getByLabelText('Следующая страница')).toBeInTheDocument();
    expect(screen.getByLabelText('Последняя страница')).toBeInTheDocument();
  });

  it('вызывает onPageChange с правильными значениями при кликах', () => {
    const mockChange = jest.fn();
    render(
      <Pagination currentPage={3} totalPages={10} onPageChange={mockChange} />
    );

    // Тестируем клик по номеру страницы
    fireEvent.click(screen.getByText('4'));
    expect(mockChange).toHaveBeenCalledWith(4);
    mockChange.mockClear();

    // Тестируем навигационные кнопки
    fireEvent.click(screen.getByLabelText('Предыдущая страница'));
    expect(mockChange).toHaveBeenCalledWith(2);
    mockChange.mockClear();

    fireEvent.click(screen.getByLabelText('Следующая страница'));
    expect(mockChange).toHaveBeenCalledWith(4);
    mockChange.mockClear();

    fireEvent.click(screen.getByLabelText('Первая страница'));
    expect(mockChange).toHaveBeenCalledWith(1);
    mockChange.mockClear();

    fireEvent.click(screen.getByLabelText('Последняя страница'));
    expect(mockChange).toHaveBeenCalledWith(10);
  });

  it('отображает троеточие слева, когда первая видимая страница > 1', () => {
    render(
      <Pagination currentPage={5} totalPages={10} onPageChange={() => {}} />
    );
    const ellipsis = screen.getAllByText('…');
    expect(ellipsis.length).toBeGreaterThan(0);
  });

  it('отображает троеточие справа, когда последняя видимая страница < totalPages', () => {
    render(
      <Pagination currentPage={2} totalPages={10} onPageChange={() => {}} />
    );
    const ellipsis = screen.getAllByText('…');
    expect(ellipsis.length).toBeGreaterThan(0);
  });

  it('отключает навигационные кнопки на первой и последней страницах', () => {
    // Тестируем первую страницу
    const { rerender } = render(
      <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />
    );

    expect(screen.getByLabelText('Первая страница')).toBeDisabled();
    expect(screen.getByLabelText('Предыдущая страница')).toBeDisabled();
    expect(screen.getByLabelText('Следующая страница')).not.toBeDisabled();
    expect(screen.getByLabelText('Последняя страница')).not.toBeDisabled();

    // Тестируем последнюю страницу
    rerender(
      <Pagination currentPage={10} totalPages={10} onPageChange={() => {}} />
    );

    expect(screen.getByLabelText('Последняя страница')).toBeDisabled();
    expect(screen.getByLabelText('Следующая страница')).toBeDisabled();
    expect(screen.getByLabelText('Первая страница')).not.toBeDisabled();
    expect(screen.getByLabelText('Предыдущая страница')).not.toBeDisabled();
  });
});
