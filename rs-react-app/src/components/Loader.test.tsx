import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Loader from '../components/Loader';

describe('Loader component', () => {
  test('renders without crashing', () => {
    const { container } = render(<Loader />);
    // Проверяем, что  div с классом loader
    const loaderDiv = container.querySelector('.loader');
    expect(loaderDiv).not.toBeNull(); // div существует
  });
  // проверяем, что div имеет правильный класс
  test('has correct class name', () => {
    const { container } = render(<Loader />);
    const loaderDiv = container.querySelector('div');
    expect(loaderDiv?.className).toBe('loader');
  });
});
