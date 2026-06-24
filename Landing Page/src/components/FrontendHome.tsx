import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../frontend/src/services/AuthContext.jsx';
import FrontendHeader from '../../frontend/src/components/Header.jsx';
import FrontendHomePage from '../../frontend/src/pages/home/Home.jsx';
import '../../frontend/src/components/Header.css';
import '../../frontend/src/components/AdminHeader.css';
import '../../frontend/src/pages/home/Home.css';

const mockAuth = {
  isLoggedIn: false,
  user: null,
  client: null,
  loading: false,
  login: async () => null,
  logout: () => {},
  token: null
};

export default function FrontendHome() {
  return (
    <BrowserRouter>
      <AuthContext.Provider value={mockAuth}>
        <FrontendHeader />
        <main className="main-content" style={{ paddingTop: '100px' }}>
          <FrontendHomePage />
        </main>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}
