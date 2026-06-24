import './App.css'
import Header from './components/Header.jsx';
import MainAuth from './pages/auth/MainAuth.jsx';
import Artwork from './pages/artwork/Artwork.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ArtworkDetail from './components/artworkDetail/ArtworkDetail.jsx';
import ArtistProfile from './pages/auth/ArtistProfile.jsx';
import Home from './pages/home/Home.jsx';
import About from './pages/about/about.jsx';
import Shipment from './pages/shipment/shipment.jsx';
import WhoWeAre from './pages/whoweare/WhoWeAre.jsx';
import Footer from './components/Footer.jsx';

import AuthProvider from './services/AuthContext.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import PrivateRoutes from './services/PrivateRoutes.jsx';
import PrivateRoutesAdmin from './services/PrivateRoutesAdmin.jsx';
import Admin from './pages/admin/Admin.jsx';
import { NotificationProvider } from './services/NotificationContext';
import PendingRegistrationGuard from './services/PendingRegistrationGuard';
import CompleteRegistration from './pages/auth/CompleteRegistration.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Header />
          <main className="main-content">
            <PendingRegistrationGuard>
              <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/about" element={<About />} />
                <Route path="/shipment" element={<Shipment />} />
                <Route path="/login" element={<MainAuth />} />
                <Route path='/auth/*' element={<MainAuth/>} />
                <Route path="/completar-registro" element={<CompleteRegistration />} />
                <Route path='/artwork/:id' element={<ArtworkDetail />} />
                <Route path='/artwork' element={<Artwork/>}/>
                <Route path="/artist/:id" element={<ArtistProfile />} />
                <Route element={<PrivateRoutes/>}>
                  <Route path='/dashboard/*' element={<Dashboard/>}/>
                </Route>
                <Route element={<PrivateRoutesAdmin/>}>
                  <Route path='/admin/*' element={<Admin/>}/>
                </Route>
                <Route path="/WhoWeAre" element={<WhoWeAre />} />
              </Routes>
            </PendingRegistrationGuard>
          </main>
          <Footer />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App
