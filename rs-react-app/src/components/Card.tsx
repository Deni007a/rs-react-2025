import type { SwapiPerson } from '../types/swapi';

interface Props {
  person: SwapiPerson;
}

const Card = ({ person }: Props) => {
  const { name, birth_year, gender } = person;

  return (
    <div>
      <h3>{name}</h3>
      <p>Birth year: {birth_year}</p>
      <p>Gender: {gender}</p>
    </div>
  );
};

export default Card;
