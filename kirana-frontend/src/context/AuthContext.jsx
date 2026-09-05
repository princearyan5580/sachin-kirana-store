/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (storedUser && token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return JSON.parse(storedUser);
      }
    } catch (e) {
      console.error("Auth state parsing failed:", e);
    }
    return null;
  });

  const [loading] = useState(false);

  const login = async (emailInput, passwordInput) => {
    try {
      let finalEmail = '';
      let finalPassword = '';

      // Agar pehla argument object ho
      if (typeof emailInput === 'object' && emailInput !== null) {
        finalEmail = emailInput.email || '';
        finalPassword = emailInput.password || '';
      } else {
        finalEmail = emailInput || '';
        finalPassword = passwordInput || '';
      }

      // Agar email ke andar dobara nesting ho
      if (typeof finalEmail === 'object' && finalEmail !== null) {
        finalPassword = finalEmail.password || finalPassword;
        finalEmail = finalEmail.email || '';
      }

      const cleanPayload = {
        email: String(finalEmail).trim().toLowerCase(),
        password: String(finalPassword)
      };

      const res = await API.post('/auth/login', cleanPayload);

      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        API.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: res.data?.message || 'Login failed' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid credentials!';
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await API.post('/auth/register', { name, email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        API.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: res.data.message || 'Registration failed' };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || err.message || 'Registration failure' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete API.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};