import { Route, Routes } from 'react-router-dom';
import Layout from '../layout/Layout';
import App from '../App';
import AboutPage from '../pages/AboutPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<App />} />
        <Route path="about" element={<AboutPage />} />
        <Route path=":page/:detailsId?" element={<App />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
