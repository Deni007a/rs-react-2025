import React from 'react';
import styles from './Pagination.module.css';

// Типизация props, которые принимает компонент
type Props = {
  currentPage: number; // текущая активная страница
  totalPages: number; // всего страниц
  onPageChange: (page: number) => void; // callback для смены страницы
  className?: string; // необязательный дополнительный класс
};

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: Props) {
  // Если страниц ≤ 1 — пагинация не нужна, не рендерим компонент
  if (totalPages <= 1) return null;

  // Генератор массива номеров страниц для отображения
  const getPageNumbers = (): number[] => {
    const maxPages = 5; // максимальное кол-во кнопок страниц, отображаемое одновременно

    // Вычисляем стартовую страницу, стараемся центрировать текущую
    let start = Math.max(1, currentPage - Math.floor(maxPages / 2));

    // Вычисляем конечную страницу, ограничивая её totalPages
    const end = Math.min(totalPages, start + maxPages - 1);

    // Смещаем старт назад, если отступ до конца был слишком мал
    // Гарантирует, что диапазон [start..end] будет полной длины,
    // даже если start изначально был слишком большой.
    start = Math.max(1, end - maxPages + 1);

    // Создаём массив страниц от start до end
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageNumbers = getPageNumbers(); // Получаем видимый диапазон страниц
  const lastPage = pageNumbers.at(-1); // Получаем последнюю видимую страницу

  return (
    <nav
      className={`${styles.pagination} ${className}`}
      aria-label="Навигация по страницам"
    >
      {/* Кнопка перехода на первую страницу */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={`${styles.pageItem} ${currentPage === 1 ? styles.disabled : ''}`}
        aria-label="Первая страница"
      >
        «
      </button>

      {/* Кнопка перехода на предыдущую страницу */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${styles.pageItem} ${currentPage === 1 ? styles.disabled : ''}`}
        aria-label="Предыдущая страница"
      >
        ‹
      </button>

      {/* Если первая видимая страница больше 1 — показываем троеточие слева */}
      {pageNumbers[0] > 1 && <span className={styles.ellipsis}>…</span>}

      {/* Основные кнопки с номерами страниц */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`${styles.pageItem} ${currentPage === page ? styles.active : ''}`}
          aria-current={currentPage === page ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {/* Если последняя видимая страница < totalPages — показываем троеточие справа */}
      {lastPage !== undefined && lastPage < totalPages && (
        <span className={styles.ellipsis}>…</span>
      )}

      {/* Кнопка перехода на следующую страницу */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${styles.pageItem} ${currentPage === totalPages ? styles.disabled : ''}`}
        aria-label="Следующая страница"
      >
        ›
      </button>

      {/* Кнопка перехода на последнюю страницу */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`${styles.pageItem} ${currentPage === totalPages ? styles.disabled : ''}`}
        aria-label="Последняя страница"
      >
        »
      </button>
    </nav>
  );
}

export default Pagination;
