import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // On app load — check if user is already logged in
  useEffect(() => {
    const token  = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const fullName = localStorage.getItem('fullName');

    if (token && userId) {
      setUser({ token, userId, fullName });
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    const response = await API.post('/api/auth/login', { email, password });
    const { token, userId, fullName } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('fullName', fullName);

    setUser({ token, userId, fullName });
    navigate('/');
  };

  // Register function
  const register = async (formData) => {
    const response = await API.post('/api/auth/register', formData);
    const { token, userId, fullName } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('fullName', fullName);

    setUser({ token, userId, fullName });
    navigate('/');
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — use this anywhere
export function useAuth() {
  return useContext(AuthContext);
}