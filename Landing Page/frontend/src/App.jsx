import './App.css'
import Header from './components/Header.jsx';
import MainAuth from './pages/auth/MainAuth.jsx';
import Home from './pages/home/Home.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './services/AuthContext.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<MainAuth />} />
            <Route path='/auth/*' element={<MainAuth/>} />
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  );
}

export default App
