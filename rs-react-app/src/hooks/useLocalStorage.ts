import { useState } from 'react';

/**
 * Хук для работы с localStorage как с состоянием
 * @param key - ключ localStorage
 * @param initialValue - значение по умолчанию
 */
export function useLocalStorage(key: string, initialValue: string) {
  const [value, setValue] = useState(() => {
    return localStorage.getItem(key) || initialValue;
  });

  const updateValue = (newValue: string) => {
    localStorage.setItem(key, newValue);
    setValue(newValue);
  };

  return [value, updateValue] as const;
}
