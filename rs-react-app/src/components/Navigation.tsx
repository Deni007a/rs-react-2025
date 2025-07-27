import { NavLink } from 'react-router-dom';

export function Navigation() {
  return (
    <nav
      className="link-active"
      style={{
        display: 'flex',
        gap: '1rem',
        margin: '1rem',
        justifyContent: 'center',
      }}
    >
      <NavLink
        to="/"
        end
        className={({ isActive }) => (isActive ? 'link active' : 'link')}
      >
        Главная
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) => (isActive ? 'link active' : 'link')}
      >
        О сайте
      </NavLink>
    </nav>
  );
}
