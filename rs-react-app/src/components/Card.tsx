import type { SwapiPerson } from '../types/swapi';

interface Props {
  person: SwapiPerson;
  onClick?: (id: string) => void; // 🔹 обработчик клика
}

// Функция извлечения ID из URL
function extractId(url: string): string {
  const segments = url.split('/');
  return segments.at(-2) ?? '';
}

const Card = ({ person, onClick }: Props) => {
  const { name, birth_year, gender, url } = person;
  const id = extractId(url);

  const handleClick = () => {
    onClick?.(id); // 🔹 сообщаем ID вверх
  };

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      <h3>{name}</h3>
      <p>Birth year: {birth_year}</p>
      <p>Gender: {gender}</p>
    </div>
  );
};

export default Card;
