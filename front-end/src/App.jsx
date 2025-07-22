import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import Login from './components/Login';
import Home from './components/Home';

function App() {
  const [auth, setAuth] = useState({ 
    isAuthenticated: false, 
    role: null 
  });

  // On mount, check stored token
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const { exp, role } = jwtDecode(token);
      if (Date.now() < exp * 1000) {
        setAuth({ isAuthenticated: true, role });
      } else {
        localStorage.clear();
      }
    }
  }, []);

  const handleLogin = ({ accessToken, refreshToken, email }) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('email', email);
    const { role } = jwtDecode(accessToken);
    setAuth({ isAuthenticated: true, role });
  };

  const handleLogout = () => {
    localStorage.clear();
    setAuth({ isAuthenticated: false, role: null });
  };

  if (!auth.isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return <Home onLogout={handleLogout} userRole={auth.role} />;
}

export default App;
