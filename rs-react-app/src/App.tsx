import React from 'react';
import SearchBar from './components/SearchBar';
import CardList from './components/CardList';
import Loader from './components/Loader';
import ErrorBoundary from './components/ErrorBoundary';
import BuggyComponent from './components/BuggyComponent';

import type { SwapiPerson } from './types/swapi';
import { fetchSwapiPeople } from './utils/api';

interface State {
  items: SwapiPerson[];
  searchTerm: string; // состояние для хранения поискового запроса
  loading: boolean; // состояние для индикатора загрузки
  error: string; // состояние для ошибки
  showBug: boolean; // состояние для компонента BuggyComponent
}

class App extends React.Component<Record<string, never>, State> {
  constructor(props: Record<string, never>) {
    super(props);
    const savedTerm = localStorage.getItem('searchTerm') || '';
    this.state = {
      items: [],
      searchTerm: savedTerm,
      loading: false,
      error: '',
      showBug: false,
    };
  }

  componentDidMount() {
    this.fetchData(this.state.searchTerm); //Загрузка при монтировании
  }

  async fetchData(term: string) {
    this.setState({ loading: true, error: '', items: [] }); // Сброс состояний
    try {
      const data = await fetchSwapiPeople(term);
      this.setState({ items: data.results, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
      this.setState({ error: message, loading: false });
    }
  }

  /**
   * Обработчик изменения поискового запроса
   * @param term
   */
  handleSearch = (term: string) => {
    localStorage.setItem('searchTerm', term);
    this.setState({ searchTerm: term });
    this.fetchData(term);
  };
  /**
   * Функция, вызываемая при нажатии кнопки "Render BuggyComponent"
   */
  triggerBug = () => {
    this.setState({ showBug: true });
  };

  render() {
    const { searchTerm, items, loading, error, showBug } = this.state;

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
            <SearchBar onSearch={this.handleSearch} initialValue={searchTerm} />
          </header>

          <main className="results-section">
            {loading && <Loader />}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {!loading && !error && <CardList items={items} />}

            <button onClick={this.triggerBug}>Render BuggyComponent</button>

            {showBug && <BuggyComponent />}
          </main>
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;
