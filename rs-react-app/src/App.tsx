import { useEffect, useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import SearchBar from './components/SearchBar';
import CardList from './components/CardList';
import Loader from './components/Loader';
import ErrorBoundary from './components/ErrorBoundary';
import BuggyComponent from './components/BuggyComponent';
import Pagination from './components/Pagination';
import { Navigation } from './components/Navigation';
import DetailsPanel from './components/DetailsPanel';

import type { SwapiPerson } from './types/swapi';
import { fetchSwapiPeople } from './utils/api';
import { extractId } from './utils/swapi_id'; // извлечение ID из URL

const App = () => {
  const [items, setItems] = useState<SwapiPerson[]>([]); // список персонажей
  const [currentPage, setCurrentPage] = useState(1); // текущая страница пагинации
  const [totalPages, setTotalPages] = useState(1); // общее количество страниц
  const [totalItems, setTotalItems] = useState(0); // всего найдено
  const [searchTerm, setSearchTerm] = useLocalStorage('searchTerm', ''); // поиск с сохранением в localStorage
  const [loading, setLoading] = useState(false); // индикатор загрузки
  const [error, setError] = useState(''); // сообщение об ошибке
  const [showBug, setShowBug] = useState(false); // включает глючный компонент
  const [selectedId, setSelectedId] = useState<string | null>(null); // выбранный персонаж

  // Загрузка данных при изменении поискового запроса или страницы
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      setItems([]); // очищаем при новом поиске

      try {
        const data = await fetchSwapiPeople({ searchTerm, page: currentPage });
        setItems(data.results); // сохраняем список
        setTotalItems(data.count); // всего найдено
        setTotalPages(Math.ceil(data.count / 10) || 1); // расчёт страниц
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Неизвестная ошибка';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // вызов на старте и при изменениях
  }, [searchTerm, currentPage]);

  //  При вводе нового поиска
  const handleSearch = (term: string) => {
    setCurrentPage(1); // сброс на первую страницу
    setSearchTerm(term); // обновить поиск
  };

  //  Смена страницы
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // плавный скролл вверх
  };

  //  Выбор персонажа (для DetailsPanel)
  const handleCardClick = (id: string) => {
    setSelectedId(id);
  };

  //  Включить баг для тестирования ErrorBoundary
  const triggerBug = () => setShowBug(true);

  //  Найти выбранного персонажа по ID
  const selectedPerson = selectedId
    ? items.find((p) => extractId(p.url) === selectedId)
    : null;

  return (
    //  Обёртка, защищающая от падения компонентов
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
      <div className="app-container" style={{ padding: '1rem' }}>
        <h1>SWAPI Поиск</h1>

        {/*  Поиск + Навигация */}
        <header className="search-section" style={{ marginBottom: '1rem' }}>
          <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
          <Navigation />
        </header>

        {/*  Основная зона: список + панель деталей */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          {/*  Левая часть: результаты */}
          <main className="results-section">
            {loading && <Loader />} {/* если идёт загрузка */}
            {/* если ошибка */}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {/*  Результаты */}
            {!loading && !error && (
              <>
                <CardList items={items} onCardClick={handleCardClick} />

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}

                <div className="cards_found">
                  Найдено персонажей: {totalItems}
                </div>
              </>
            )}
            {/*  Тестовая ошибка */}
            <button onClick={triggerBug}>Render BuggyComponent</button>
            {showBug && <BuggyComponent />}
          </main>

          {/*  Правая часть: панель деталей персонажа */}
          {selectedPerson && (
            <DetailsPanel
              person={selectedPerson}
              onClose={() => setSelectedId(null)}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
