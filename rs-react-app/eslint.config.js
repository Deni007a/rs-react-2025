import js from '@eslint/js'; // официальный ESLint конфиг для JS
import globals from 'globals'; // список глобальных переменных (например, window, document)
import reactHooks from 'eslint-plugin-react-hooks'; // проверка корректного использования хуков
import reactRefresh from 'eslint-plugin-react-refresh'; // поддержка hot-reload компонентов
import react from 'eslint-plugin-react'; // линтинг JSX, компонентов и best practices React
import tseslint from 'typescript-eslint'; // ESLint-конфигурация и правила для TypeScript
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'; // интеграция с Prettier
import reactCompiler from 'eslint-plugin-react-compiler'; // проверка совместимости с React Compiler

export default tseslint.config(
  { ignores: ['dist'] }, // исключает папку dist из линтинга
  {
    extends: [
      js.configs.recommended, //рекомендуемые JS-правила
      ...tseslint.configs.strict, // строгие TS-правила (например, никаких any)
      eslintPluginPrettier, // включает Prettier и отключает конфликтующие ESLint-правила
    ],
    files: ['**/*.{ts,tsx}'], // линтинг только TS и TSX файлов
    languageOptions: {
      ecmaVersion: 2020, // позволяет использовать современные фичи JS
      globals: globals.browser, // разрешает window, document и другие браузерные глобалы
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react-compiler': reactCompiler,
    },
    rules: {
      ...reactHooks.configs.recommended.rules, // проверка правил хуков
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ], // предупреждение, если экспортируем не компонент (важно для Hot Reload)
      'react-compiler/react-compiler': 'error', // запрещает несовместимые с компилятором конструкции
      ...react.configs.recommended.rules, // рекомендуемые правила React
      ...react.configs['jsx-runtime'].rules, // поддержка нового JSX Runtime (без импорта React)
    },
    settings: {
      react: {
        version: 'detect', // автоматически определяет версию React из node_modules
      },
    },
  }
);

//Defolts
// import js from '@eslint/js'
// import globals from 'globals'
// import reactHooks from 'eslint-plugin-react-hooks'
// import reactRefresh from 'eslint-plugin-react-refresh'
// import tseslint from 'typescript-eslint'
// import { globalIgnores } from 'eslint/config'
//
// export default tseslint.config([
//   globalIgnores(['dist']),
//   {
//     files: ['**/*.{ts,tsx}'],
//     extends: [
//       js.configs.recommended,
//       tseslint.configs.recommended,
//       reactHooks.configs['recommended-latest'],
//       reactRefresh.configs.vite,
//     ],
//     languageOptions: {
//       ecmaVersion: 2020,
//       globals: globals.browser,
//     },
//   },
// ])
