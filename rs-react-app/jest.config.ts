export default {
  // используем ts-jest, чтобы Jest умел работать с TypeScript
  preset: 'ts-jest',

  // Указываем, что тесты должны запускаться в окружении браузера
  testEnvironment: 'jest-environment-jsdom',

  // Файл для подключения расширенных матчеров и полифиллов (TextEncoder/TextDecoder)
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Используем ts-jest как трансформер для ts/tsx-файлов
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },

  // Мокаем импорты CSS/SCSS, чтобы тесты не падали на стилях
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  // Указываем, какие файлы учитывать при сборе покрытия
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}', // Все ts/tsx внутри src
    '!src/**/*.d.ts', // Исключаем типы
    '!src/**/__tests__/**', // Исключаем сами тесты
    '!src/index.tsx', // Точка входа не тестируется
    '!src/setupTests.ts', // Альтернативный setup-файл (если используешь)
    '!jest.setup.ts', // Не включаем сам setup-файл в покрытие
  ],

  // Минимальные требования к покрытию — по заданию
  coverageThreshold: {
    global: {
      statements: 80, // Общее количество утверждений
      branches: 50, // Условия (if, switch и т.п.)
      functions: 50, // Все функции
      lines: 50, // Строки кода
    },
  },
};
