import Card from './Card';
import type { SwapiPerson } from '../types/swapi';

interface Props {
  items: SwapiPerson[];
}

const CardList = ({ items }: Props) => {
  return (
    <div>
      <p>НИЖНЯЯ ПАНЕЛЬ</p>
      {items.map((person) => (
        <Card key={person.url} person={person} />
      ))}
    </div>
  );
};

export default CardList;
