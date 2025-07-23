import { useEffect, useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage'; // новый хук
import SearchBar from './components/SearchBar';
import CardList from './components/CardList';
import Loader from './components/Loader';
import ErrorBoundary from './components/ErrorBoundary';
import BuggyComponent from './components/BuggyComponent';

import type { SwapiPerson } from './types/swapi';
import { fetchSwapiPeople } from './utils/api';

const App = () => {
  //  Состояние списка результатов
  const [items, setItems] = useState<SwapiPerson[]>([]);

  //  Используем хук для работы с localStorage
  const [searchTerm, setSearchTerm] = useLocalStorage('searchTerm', '');

  // Флаг загрузки для отображения <Loader />
  const [loading, setLoading] = useState(false);

  // Храним текст ошибки (если запрос упал)
  const [error, setError] = useState('');

  // Флаг для отображения компонента, вызывающего ошибку
  const [showBug, setShowBug] = useState(false);

  // Загрузка данных при монтировании
  useEffect(() => {
    fetchData(searchTerm);
  }, []);

  /**
   * Асинхронная загрузка данных по имени персонажа
   */
  const fetchData = async (term: string) => {
    setLoading(true);
    setError('');
    setItems([]); // очищаем список перед новым запросом

    try {
      const data = await fetchSwapiPeople(term);
      setItems(data.results); // сохраняем полученные результаты
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(message); // сохраняем текст ошибки
    } finally {
      setLoading(false);
    }
  };

  /**
   * Обработчик поискового запроса
   */
  const handleSearch = (term: string) => {
    setSearchTerm(term); //  сохраняется в localStorage через хук
    fetchData(term);
  };

  /**
   * Активация компонента, вызывающего ошибку
   */
  const triggerBug = () => {
    setShowBug(true);
  };

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
          {/* Компонент ввода поискового запроса */}
          <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
        </header>

        <main className="results-section">
          {/* Показываем лоадер во время загрузки */}
          {loading && <Loader />}

          {/* Показываем текст ошибки */}
          {error && <div style={{ color: 'red' }}>{error}</div>}

          {/* Список карточек, если всё успешно */}
          {!loading && !error && <CardList items={items} />}

          {/* Кнопка для вызова компонента с ошибкой */}
          <button onClick={triggerBug}>Render BuggyComponent</button>

          {/* Потенциально сбойный компонент */}
          {showBug && <BuggyComponent />}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;
