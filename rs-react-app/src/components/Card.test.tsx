// Импортируем функции для рендера компонента и поиска элементов на экране
import { render, screen } from '@testing-library/react';
import Card from '../components/Card';
import type { SwapiPerson } from '../types/swapi';
import '@testing-library/jest-dom';

// Создаём мок-объект персонажа
const mockPerson: SwapiPerson = {
  name: 'Luke Skywalker',
  birth_year: '19BBY',
  gender: 'male',
  url: 'https://swapi.dev/api/people/1/',
  height: '172',
  mass: '77',
  hair_color: 'blond',
  skin_color: 'fair',
  eye_color: 'blue',
  homeworld: 'https://swapi.dev/api/planets/1/',
  films: [],
  species: [],
  vehicles: [],
  starships: [],
  created: '',
  edited: '',
};

describe('Card component', () => {
  test('renders name, birth year, and gender', () => {
    // Рендерим компонент с моковыми данными
    render(<Card person={mockPerson} />);

    // Проверяем, что имя персонажа отображается
    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();

    // Проверяем, что отображается год рождения
    expect(screen.getByText('Birth year: 19BBY')).toBeInTheDocument();

    // Проверяем, что отображается пол
    expect(screen.getByText('Gender: male')).toBeInTheDocument();
  });
});
