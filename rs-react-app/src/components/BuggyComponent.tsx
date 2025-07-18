import React from 'react';

class BuggyComponent extends React.Component {
  render(): React.ReactNode {
    throw new Error('Преднамеренная ошибка для тестирования ErrorBoundary');
    return null;
  }
}

export default BuggyComponent;
