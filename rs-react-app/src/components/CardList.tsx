import Card from './Card';
import type { SwapiPerson } from '../types/swapi';

interface Props {
  items: SwapiPerson[];
  onCardClick?: (id: string) => void; // 🔹 получаем из App.tsx
}

const CardList = ({ items, onCardClick }: Props) => {
  return (
    <div>
      <p>НИЖНЯЯ ПАНЕЛЬ</p>
      {items.map((person) => (
        <Card
          key={person.url}
          person={person}
          onClick={onCardClick} // 🔹 передаём обработчик в карточку
        />
      ))}
    </div>
  );
};

export default CardList;
