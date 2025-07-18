import { render, screen } from '@testing-library/react';
import CardList from '../components/CardList';
import type { SwapiPerson } from '../types/swapi';
import '@testing-library/jest-dom';

// [] моковых персонажей и приведени типа вручную через AS так как нам достаточно неполных данных
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

// Группа тестов для компонента CardList
describe('CardList component', () => {
  // Проверяем, что отображается текст "НИЖНЯЯ ПАНЕЛЬ"
  test('renders bottom panel text', () => {
    render(<CardList items={mockPeople} />);
    expect(screen.getByText('НИЖНЯЯ ПАНЕЛЬ')).toBeInTheDocument();
  });

  // Проверяем, что все карточки отображаются
  test('renders all cards', () => {
    render(<CardList items={mockPeople} />);
    // Проверяем, что 1 персонаж отображается
    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    // Проверяем, что 2 персонаж отображается
    expect(screen.getByText('Leia Organa')).toBeInTheDocument();
  });
  //  Проверяем, что ничего не отображается при пустом списке
  test('renders no cards when items is empty', () => {
    render(<CardList items={[]} />);
    expect(screen.queryByText('Luke Skywalker')).not.toBeInTheDocument();
    expect(screen.queryByText('Leia Organa')).not.toBeInTheDocument();
    expect(screen.getByText('НИЖНЯЯ ПАНЕЛЬ')).toBeInTheDocument(); // панель всё ещё отображается
  });
  // Проверяем, что правильное количество карточек отображается
  test('renders correct number of cards', () => {
    const { container } = render(<CardList items={mockPeople} />);

    // Ищем все <div>, содержащие <h3> — предполагаем, что каждая карточка содержит имя в заголовке
    const cardElements = container.querySelectorAll('div > h3');
    expect(cardElements).toHaveLength(2);
  });
});
