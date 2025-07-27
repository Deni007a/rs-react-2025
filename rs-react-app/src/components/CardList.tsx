import { Link } from 'react-router-dom';
import Card from './Card';
import type { SwapiPerson } from '../types/swapi';

interface Props {
  items: SwapiPerson[];
  onCardClick?: (id: string) => void;
  currentPage?: number; // 🔹 можно передавать из родителя
}

const CardList = ({ items, onCardClick, currentPage = 1 }: Props) => {
  return (
    <div>
      <p>НИЖНЯЯ ПАНЕЛЬ</p>
      {items.map((person) => {
        const id = person.url.split('/').filter(Boolean).pop();
        const link = `/?page=${currentPage}&people=${id}`;

        return (
          <Link
            key={person.url}
            to={link}
            style={{
              display: 'block',
              textDecoration: 'none', // подчёркивание
              color: 'inherit', //  убираем синий цвет
              cursor: 'default', // убираем руку при наведении
            }}
          >
            <div className="card">
              <Card person={person} onClick={onCardClick} />
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default CardList;
