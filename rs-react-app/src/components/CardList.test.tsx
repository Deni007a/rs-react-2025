import { render, screen } from '@testing-library/react';
import CardList from '../components/CardList';
import type { SwapiPerson } from '../types/swapi';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

//  Моковые персонажи (типизация через as, т.к. используем минимум полей)
const mockPeople = [
  {
    name: 'Luke Skywalker',
    birth_year: '19BBY',
    gender: 'male',
    url: 'https://swapi.dev/api/people/1/',
  },
  {
    name: 'Leia Organa',
    birth_year: '19BBY',
    gender: 'female',
    url: 'https://swapi.dev/api/people/5/',
  },
] as SwapiPerson[];

//  Тестовая группа
describe('CardList component', () => {
  test('renders bottom panel text', () => {
    render(
      <MemoryRouter>
        <CardList items={mockPeople} />
      </MemoryRouter>
    );

    expect(screen.getByText('НИЖНЯЯ ПАНЕЛЬ')).toBeInTheDocument();
  });

  test('renders all cards', () => {
    render(
      <MemoryRouter>
        <CardList items={mockPeople} />
      </MemoryRouter>
    );

    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    expect(screen.getByText('Leia Organa')).toBeInTheDocument();
  });

  test('renders no cards when items is empty', () => {
    render(
      <MemoryRouter>
        <CardList items={[]} />
      </MemoryRouter>
    );

    expect(screen.queryByText('Luke Skywalker')).not.toBeInTheDocument();
    expect(screen.queryByText('Leia Organa')).not.toBeInTheDocument();
    expect(screen.getByText('НИЖНЯЯ ПАНЕЛЬ')).toBeInTheDocument(); // панель всё равно есть
  });

  test('renders correct number of cards', () => {
    render(
      <MemoryRouter>
        <CardList items={mockPeople} />
      </MemoryRouter>
    );

    //  Проверяем количество элементов-ссылок Link
    const cardLinks = screen.getAllByRole('link');
    expect(cardLinks).toHaveLength(2);
  });
});
