import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AllProjectsPage from './pages/AllProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import AdminPage from './pages/AdminPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<AllProjectsPage />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </>
  );
}
