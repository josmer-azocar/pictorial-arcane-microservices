import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../frontend/src/services/AuthContext.jsx';
import FrontendHeader from '../../frontend/src/components/Header.jsx';
import FrontendHomePage from '../../frontend/src/pages/home/Home.jsx';
import FrontendMainAuth from '../../frontend/src/pages/auth/MainAuth.jsx';
import '../../frontend/src/components/Header.css';
import '../../frontend/src/components/AdminHeader.css';
import '../../frontend/src/pages/home/Home.css';
import '../../frontend/src/pages/auth/MainAuth.css';

const mockAuth = {
  isLoggedIn: false,
  user: null,
  client: null,
  loading: false,
  login: async () => null,
  logout: () => {},
  token: null
};

function RedirectHome() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/');
  }, [navigate]);
  return null;
}

function FrontendLayout() {
  return (
    <>
      <FrontendHeader />
      <main className="main-content" style={{ paddingTop: '100px' }}>
        <FrontendHomePage />
      </main>
    </>
  );
}

function AuthLayout() {
  return (
    <>
      <FrontendHeader />
      <main className="main-content" style={{ paddingTop: '100px' }}>
        <FrontendMainAuth />
      </main>
    </>
  );
}

export default function FrontendHome() {
  return (
    <BrowserRouter basename="/frontend-home">
      <AuthContext.Provider value={mockAuth}>
        <Routes>
          <Route path="/" element={<FrontendLayout />} />
          <Route path="/login" element={<AuthLayout />} />
          <Route path="/auth/*" element={<AuthLayout />} />
          <Route path="/about" element={<RedirectHome />} />
          <Route path="/artwork" element={<AuthLayout />} />
          <Route path="/shipment" element={<RedirectHome />} />
          <Route path="/dashboard" element={<RedirectHome />} />
          <Route path="*" element={<RedirectHome />} />
        </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}
