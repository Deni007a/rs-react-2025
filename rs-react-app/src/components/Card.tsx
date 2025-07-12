import React from 'react';
import type { SwapiPerson } from '../types/swapi';

interface Props {
  person: SwapiPerson;
}

class Card extends React.Component<Props> {
  render() {
    const { name, birth_year, gender } = this.props.person;
    return (
      <div>
        <h3>{name}</h3>
        <p>Birth year: {birth_year}</p>
        <p>Gender: {gender}</p>
      </div>
    );
  }
}

export default Card;
