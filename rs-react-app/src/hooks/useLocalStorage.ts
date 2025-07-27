import { useState } from 'react';

/**
 * Хук для работы с localStorage как с состоянием
 * @param key - ключ localStorage
 * @param initialValue - значение по умолчанию
 */
export function useLocalStorage(key: string, initialValue: string) {
  const [value, setValue] = useState(() => {
    // Пытаемся получить значение из localStorage
    try {
      return localStorage.getItem(key) || initialValue;
    } catch {
      // Если localStorage не доступен, возвращаем значение по умолчанию для браузеров в приватном режиме
      return initialValue;
    }
  });

  const updateValue = (newValue: string) => {
    localStorage.setItem(key, newValue);
    setValue(newValue);
  };

  return [value, updateValue] as const;
}
