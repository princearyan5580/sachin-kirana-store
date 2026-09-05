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

  // kirana-frontend/src/context/AuthContext.jsx

  // kirana-frontend/src/context/AuthContext.jsx

  const login = async (emailInput, passwordInput) => {
    try {
      let finalEmail = emailInput;
      let finalPassword = passwordInput;

      // Agar data object me pass hua ho: { email, password }
      if (typeof emailInput === 'object' && emailInput !== null) {
        finalEmail = emailInput.email || emailInput.username;
        finalPassword = emailInput.password;
      }

      // Agar email ke andar dobara nested object aa gaya ho (Payload bug fix)
      if (typeof finalEmail === 'object' && finalEmail !== null) {
        finalPassword = finalEmail.password || finalPassword;
        finalEmail = finalEmail.email;
      }

      const res = await API.post('/auth/login', {
        email: typeof finalEmail === 'string' ? finalEmail.trim() : '',
        password: finalPassword,
      });

      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
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