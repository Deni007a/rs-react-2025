import { useEffect, useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import SearchBar from './components/SearchBar';
import CardList from './components/CardList';
import Loader from './components/Loader';
import ErrorBoundary from './components/ErrorBoundary';
import BuggyComponent from './components/BuggyComponent';
import Pagination from './components/Pagination';
import { Navigation } from './components/Navigation';

import type { SwapiPerson } from './types/swapi';
import { fetchSwapiPeople } from './utils/api';

const App = () => {
  // Список полученных персонажей
  const [items, setItems] = useState<SwapiPerson[]>([]);

  // Пагинация: текущая страница, всего страниц, всего результатов
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Поисковый запрос сохраняется в localStorage
  const [searchTerm, setSearchTerm] = useLocalStorage('searchTerm', '');

  // Состояние загрузки
  const [loading, setLoading] = useState(false);

  // Ошибка, если запрос не удался
  const [error, setError] = useState('');

  //  Управление отображением багового компонента
  const [showBug, setShowBug] = useState(false);

  /**
   * useEffect: вызывается при каждом изменении searchTerm или currentPage
   * Загружает данные из SWAPI и обновляет состояние
   */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Показываем лоадер
      setError(''); // Сброс текста ошибки
      setItems([]); // Сброс предыдущих результатов

      try {
        const data = await fetchSwapiPeople({ searchTerm, page: currentPage });
        setItems(data.results); // Обновляем список персонажей
        setTotalItems(data.count); // Кол-во всего найденных
        setTotalPages(Math.ceil(data.count / 10) || 1); // Кол-во страниц (SWAPI отдаёт по 10)
      } catch (err: unknown) {
        // Перехватываем ошибку и выводим сообщение
        const msg = err instanceof Error ? err.message : 'Неизвестная ошибка';
        setError(msg);
      } finally {
        setLoading(false); // тключаем лоадер
      }
    };
    fetchData(); // Запуск функции при любом изменении searchTerm / currentPage
  }, [searchTerm, currentPage]);

  /**
   * Обработка нового поискового запроса от компонента SearchBar
   */
  const handleSearch = (term: string) => {
    setCurrentPage(1); // Сброс страницы на первую
    setSearchTerm(term); // Сохраняем запрос (в localStorage через хук)
  };

  /**
   * Обработка смены страницы от компонента Pagination
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Устанавливаем новую страницу
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Прокрутка вверх
  };

  //Включаем баговый компонент вручную
  const triggerBug = () => setShowBug(true);

  return (
    <ErrorBoundary
      fallback={
        <div
          style={{
            padding: '1rem',
            color: 'red',
            textAlign: 'center',
            border: '1px solid green',
            margin: '1rem',
          }}
        >
          <h2>Ошибка приложения</h2>
          <p>Компонент дал сбой. Попробуйте перезапустить приложение.</p>
        </div>
      }
    >
      <div className="app-container">
        <h1>SWAPI Поиск</h1>

        <header className="search-section">
          {/* поиск + навигация */}
          <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
          <Navigation />
        </header>

        <main className="results-section">
          {/* Лоадер */}
          {loading && <Loader />}

          {/* Ошибка запроса */}
          {error && <div style={{ color: 'red' }}>{error}</div>}

          {/* Осное */}
          {!loading && !error && (
            <>
              <CardList items={items} /> {/* 📋 Список персонажей */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '1rem',
                  color: '#666',
                }}
              >
                Найдено персонажей: {totalItems}
              </div>
            </>
          )}

          {/* Кнопка для отображения компонента с ошибкой */}
          <button onClick={triggerBug}>Render BuggyComponent</button>

          {/* Отображаем ошибочный компонент */}
          {showBug && <BuggyComponent />}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;
