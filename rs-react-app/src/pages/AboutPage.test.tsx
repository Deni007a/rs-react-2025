import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import AboutPage from './AboutPage';

describe('AboutPage', () => {
  it('корректно рендерит страницу "О приложении"', () => {
    // Рендерим компонент с MemoryRouter для работы с Navigation
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    // Проверяем заголовок
    const heading = screen.getByRole('heading', {
      level: 2,
      name: /о приложении/i,
    });
    expect(heading).toBeInTheDocument();

    // Проверяем информацию об авторе
    const authorInfo = screen.getByText(/автор:/i);
    expect(authorInfo).toBeInTheDocument();
    expect(authorInfo).toHaveTextContent('Денис');

    // Проверяем ссылку на курс RS School
    const rsSchoolLink = screen.getByRole('link', {
      name: /курс rs school react/i,
    });
    expect(rsSchoolLink).toBeInTheDocument();
    expect(rsSchoolLink).toHaveAttribute('href', 'https://rs.school/react/');
    expect(rsSchoolLink).toHaveAttribute('target', '_blank');
    expect(rsSchoolLink).toHaveAttribute('rel', 'noopener noreferrer');

    // Проверяем наличие навигационного меню
    const navigation = screen.getByRole('navigation');
    expect(navigation).toBeInTheDocument();
  });
});
