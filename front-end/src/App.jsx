import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Login from './components/Login';
import Home from './components/Home';
import { refreshToken } from './authService';

function App() {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    role: null,
    username: "",
    loading: true
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setAuth({ isAuthenticated: false, role: null, username: "", loading: false });
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const { exp } = decoded;
        const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role;
        const username = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || decoded.name;
        const isExpired = Date.now() >= exp * 1000;

        if (!isExpired) {
          setAuth({ isAuthenticated: true, role, username, loading: false });
        } else {
          const newTokens = await refreshToken();
          if (newTokens) {
            localStorage.setItem('accessToken', newTokens.accessToken);
            localStorage.setItem('refreshToken', newTokens.refreshToken);
            const newDecoded = jwtDecode(newTokens.accessToken);
            const newRole = newDecoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || newDecoded.role;
            const newUsername = newDecoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || newDecoded.name;
            setAuth({ isAuthenticated: true, role: newRole, username: newUsername, loading: false });
          } else {
            localStorage.clear();
            setAuth({ isAuthenticated: false, role: null, username: "", loading: false });
          }
        }
      } catch (err) {
        console.error("Token decode error:", err);
        localStorage.clear();
        setAuth({ isAuthenticated: false, role: null, username: "", loading: false });
      }
    };

    initAuth();
  }, []);

  const handleLogin = ({ accessToken, refreshToken, email }) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('email', email);

    const decoded = jwtDecode(accessToken);
    const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role;
    const username = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || decoded.name;

    setAuth({ isAuthenticated: true, role, username, loading: false });
  };

  const handleLogout = () => {
    localStorage.clear();
    setAuth({ isAuthenticated: false, role: null, username: "", loading: false });
  };

  if (auth.loading) return <div>Loading...</div>;

  return auth.isAuthenticated ? (
    <Home
      onLogout={handleLogout}
      userRole={auth.role}
      username={auth.username}
    />
  ) : (
    <Login onLogin={handleLogin} />
  );
}

export default App;
