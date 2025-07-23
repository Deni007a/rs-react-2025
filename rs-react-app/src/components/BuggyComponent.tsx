const BuggyComponent = () => {
  throw new Error('Преднамеренная ошибка для тестирования ErrorBoundary');
  // unreachable, но TS всё ещё ожидает возврат JSX
  return null;
};

export default BuggyComponent;
