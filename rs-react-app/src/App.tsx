import React from 'react';
import SearchBar from './components/SearchBar';
import CardList from './components/CardList';
import Loader from './components/Loader';

import type { SwapiPerson } from './types/swapi';
import { fetchSwapiPeople } from './utils/api';

interface State {
  items: SwapiPerson[];
  searchTerm: string;
  loading: boolean;
  error: string;
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
    };
  }

  componentDidMount() {
    if (this.state.searchTerm) {
      this.fetchData(this.state.searchTerm);
    }
  }

  async fetchData(term: string) {
    this.setState({ loading: true, error: '', items: [] });
    try {
      const data = await fetchSwapiPeople(term);
      this.setState({ items: data.results, loading: false });
    } catch (err: any) {
      this.setState({
        error: err.message || 'Ошибка загрузки',
        loading: false,
      });
    }
  }

  handleSearch = (term: string) => {
    localStorage.setItem('searchTerm', term);
    this.setState({ searchTerm: term });
    this.fetchData(term);
  };

  render() {
    const { searchTerm, items, loading, error } = this.state;

    return (
      <div className="app-container">
        <h1>SWAPI Поиск</h1>
        <SearchBar onSearch={this.handleSearch} initialValue={searchTerm} />
        {loading && <Loader />}
        {error && (
          <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>
        )}
        {!loading && !error && <CardList items={items} />}
      </div>
    );
  }
}

export default App;
