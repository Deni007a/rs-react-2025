import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div style={{ padding: '2rem', color: 'crimson' }}>
    <h2>404 Страница не найдена</h2>
    <Link to="/">Вернуться на главную</Link>
  </div>
);
export default NotFoundPage;
