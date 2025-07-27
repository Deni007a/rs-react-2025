import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { extractId } from './utils/swapi_id';
const App = () => {
  //  Основной список персонажей, получаемых из SWAPI API
  const [items, setItems] = useState<SwapiPerson[]>([]);

  //  Общее количество страниц (рассчитывается из общего количества персонажей)
  const [totalPages, setTotalPages] = useState(1);

  //  Общее число найденных персонажей по фильтру
  const [totalItems, setTotalItems] = useState(0);

  //  Поисковый запрос. useLocalStorage сохраняет значение между сессиями
  const [searchTerm, setSearchTerm] = useLocalStorage('searchTerm', '');

  //  Статусы загрузки и ошибки
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  //  Тоггл для демонстрации компонента с ошибкой
  const [showBug, setShowBug] = useState(false);

  //  Чтение и изменение URL-параметров (например, ?page=2&people=5)
  const [searchParams, setSearchParams] = useSearchParams();

  //  ID выбранного персонажа из параметра ?people
  const selectedId = searchParams.get('people');

  //  Инициализация текущей страницы: читаем из URL либо по умолчанию 1
  const pageFromUrl = Number(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromUrl);

  //  Синхронизация currentPage при изменении параметров URL
  useEffect(() => {
    const newPage = Number(searchParams.get('page')) || 1;
    if (newPage !== currentPage) setCurrentPage(newPage);
  }, [searchParams, currentPage]);

  //  Загрузка персонажей при изменении поискового запроса или страницы
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // показываем прелоадер
      setError(''); // очищаем старую ошибку
      setItems([]); // сбрасываем старые данные

      try {
        //  Получаем данные из SWAPI API
        const data = await fetchSwapiPeople({ searchTerm, page: currentPage });

        //  Сохраняем результаты
        setItems(data.results);
        setTotalItems(data.count);
        setTotalPages(Math.ceil(data.count / 10) || 1); // делим на 10 результатов на страницу
      } catch (err) {
        //  Обработка ошибок API
        const msg = err instanceof Error ? err.message : 'Неизвестная ошибка';
        setError(msg);
      } finally {
        setLoading(false); // убираем прелоадер
      }
    };

    fetchData(); //  Вызываем загрузку
  }, [searchTerm, currentPage]);

  //  Проверяем: если выбранный ID отсутствует в загруженных персонажах — удаляем его из URL
  useEffect(() => {
    if (selectedId) {
      const exists = items.some((p) => extractId(p.url) === selectedId);
      if (!exists) {
        searchParams.delete('people'); // удаляем ID
        setSearchParams(searchParams); // обновляем URL
      }
    }
  }, [items, selectedId, searchParams, setSearchParams]);

  //  Полноценный поиск персонажа по имени на всех доступных страницах
  const findPersonPage = async (
    term: string
  ): Promise<{ page: number; id: string } | null> => {
    const normalizedTerm = term.trim().toLowerCase();

    //  Ищем по страницам (ограничено 9 для производительности)
    for (let page = 1; page <= 9; page++) {
      const data = await fetchSwapiPeople({ searchTerm: term, page });

      //  Находим первого совпавшего персонажа по имени
      const match = data.results.find((p) =>
        p.name.trim().toLowerCase().includes(normalizedTerm)
      );

      if (match) {
        const id = extractId(match.url); // извлекаем ID из URL API
        return { page, id };
      }
    }

    return null; // ❌ Не нашли
  };

  //  Обработка ввода в поиске
  const handleSearch = async (term: string) => {
    setSearchTerm(term); // сохраняем запрос

    const result = await findPersonPage(term);

    if (result) {
      //  Персонаж найден — записываем страницу и ID
      searchParams.set('page', String(result.page));
      searchParams.set('people', result.id);
    } else {
      //  Не найден — сбрасываем выбор
      searchParams.set('page', '1');
      searchParams.delete('people');
    }

    setSearchParams(searchParams); // применяем обновлённые параметры
  };

  //  Переход по страницам (Pagination → onPageChange)
  const handlePageChange = (page: number) => {
    searchParams.set('page', String(page)); // меняем страницу
    setSearchParams(searchParams); // обновляем параметры
    window.scrollTo({ top: 0, behavior: 'smooth' }); // плавный скролл вверх
  };

  //  Выбор карточки персонажа
  const handleCardClick = (id: string) => {
    searchParams.set('people', id); // добавляем параметр people
    setSearchParams(searchParams); // применяем в URL
  };

  //  Получаем персонажа из списка по ID (для DetailsPanel)
  const selectedPerson = selectedId
    ? items.find((p) => extractId(p.url) === selectedId)
    : null;

  // 💣 Кнопка для вызова багнутого компонента
  const triggerBug = () => setShowBug(true);

  return (
    //  Оборачиваем приложение в ErrorBoundary — для отлова ошибок
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

        {/*  Блок поиска и навигации */}
        <header className="search-section" style={{ marginBottom: '1rem' }}>
          <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
          <Navigation />
        </header>

        {/* ⚙ Основная зона: список + панель деталей */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <main className="results-section">
            {/*  Загрузка или ошибка */}
            {loading && <Loader />}
            {error && <div style={{ color: 'red' }}>{error}</div>}

            {/* 🧾 Результаты поиска и пагинация */}
            {!loading && !error && (
              <>
                <CardList
                  items={items}
                  onCardClick={handleCardClick}
                  currentPage={currentPage}
                />

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

            {/* 💣 Кнопка для отладки */}
            <button onClick={triggerBug}>Render BuggyComponent</button>
            {showBug && <BuggyComponent />}
          </main>

          {/*  Панель деталей выбранного персонажа */}
          {selectedPerson && (
            <DetailsPanel
              person={selectedPerson}
              onClose={() => {
                searchParams.delete('people'); // сбрасываем выбор
                setSearchParams(searchParams); // обновляем URL
              }}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
