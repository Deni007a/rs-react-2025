import React from 'react';
import Card from './Card';
import type { SwapiPerson } from '../types/swapi';

interface Props {
  items: SwapiPerson[];
}

class CardList extends React.Component<Props> {
  render() {
    return (
      <div>
        <p>КАРД ЛИСТ НИЖНЯЯ ПАНЕЛЬ</p>
        {this.props.items.map((person) => (
          <Card key={person.url} person={person} />
        ))}
      </div>
    );
  }
}

export default CardList;
