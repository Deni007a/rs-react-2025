import { useState } from 'react';
import React from 'react';

interface Props {
  onSearch: (term: string) => void;
  initialValue?: string;
}

function SearchBar({ onSearch, initialValue = '' }: Props) {
  const [input, setInput] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = () => {
    const term = input.trim();
    onSearch(term);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {/* Блок поиска */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          value={input}
          onChange={handleChange}
          placeholder="Введите имя персонажа"
        />
        <button onClick={handleSubmit}>Search</button>
      </div>
    </div>
  );
}

export default SearchBar;
