import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../frontend/src/services/AuthContext.jsx';
import FrontendHeader from '../../frontend/src/components/Header.jsx';
import FrontendHomePage from '../../frontend/src/pages/home/Home.jsx';
import FrontendMainAuth from '../../frontend/src/pages/auth/MainAuth.jsx';
import '../../frontend/src/components/Header.css';
import '../../frontend/src/components/AdminHeader.css';
import '../../frontend/src/pages/home/Home.css';
import '../../frontend/src/pages/auth/MainAuth.css';
import About from '../../frontend/src/pages/about/about.jsx';
import Shipment from '../../frontend/src/pages/shipment/shipment.jsx';
import WhoWeAre from '../../frontend/src/pages/whoweare/WhoWeAre.jsx';
import '../../frontend/src/pages/about/about.css';
import '../../frontend/src/pages/shipment/shipment.css';
import '../../frontend/src/pages/whoweare/WhoWeAre.css';
import FrontendFooter from '../../frontend/src/components/Footer.jsx';
import '../../frontend/src/components/Footer.css';

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

function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FrontendHeader />
      <main className="main-content" style={{ paddingTop: '100px' }}>
        {children}
      </main>
      <FrontendFooter />
    </>
  );
}

function FrontendLayout() {
  return <BaseLayout><FrontendHomePage /></BaseLayout>;
}

function AuthLayout() {
  return <BaseLayout><FrontendMainAuth /></BaseLayout>;
}

function AboutLayout() {
  return <BaseLayout><About /></BaseLayout>;
}

function ShipmentLayout() {
  return <BaseLayout><Shipment /></BaseLayout>;
}

function WhoWeAreLayout() {
  return <BaseLayout><WhoWeAre /></BaseLayout>;
}

export default function FrontendHome() {
  return (
    <BrowserRouter basename="/frontend-home">
      <AuthContext.Provider value={mockAuth}>
        <Routes>
          <Route path="/" element={<FrontendLayout />} />
          <Route path="/login" element={<AuthLayout />} />
          <Route path="/auth/*" element={<AuthLayout />} />
          <Route path="/about" element={<AboutLayout />} />
          <Route path="/artwork" element={<AuthLayout />} />
          <Route path="/shipment" element={<ShipmentLayout />} />
          <Route path="/WhoWeAre" element={<WhoWeAreLayout />} />
          <Route path="/dashboard" element={<RedirectHome />} />
          <Route path="*" element={<RedirectHome />} />
        </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}
