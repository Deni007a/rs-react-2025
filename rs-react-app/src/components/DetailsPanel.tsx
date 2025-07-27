import type { SwapiPerson } from '../types/swapi';

interface Props {
  person: SwapiPerson;
  onClose: () => void;
}

const DetailsPanel = ({ person, onClose }: Props) => {
  return (
    <aside className="details-panel">
      <h2>Детали персонажа</h2>
      <p>
        <strong>Имя:</strong> {person.name}
      </p>
      <p>
        <strong>Год рождения:</strong> {person.birth_year}
      </p>
      <p>
        <strong>Пол:</strong> {person.gender}
      </p>
      <button onClick={onClose}>Закрыть</button>
    </aside>
  );
};

export default DetailsPanel;
