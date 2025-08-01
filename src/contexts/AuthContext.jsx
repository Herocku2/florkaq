import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { logger } from '../utils/logger';
import { safeNavigate, clearAuthState } from '../utils/navigation';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    let isMounted = true; // Flag para evitar actualizaciones después del desmontaje
    
    const checkAuth = async () => {
      try {
        const token = authService.getToken();
        if (token && isMounted) {
          const userData = await authService.getMe();
          if (userData && isMounted) {
            setUser(userData);
            setIsAuthenticated(true);
            logger.success('Usuario autenticado correctamente');
          } else if (isMounted) {
            // Token inválido, limpiar
            authService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        if (isMounted) {
          logger.error('Error verificando autenticación', error);
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const result = await authService.login(credentials);
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        logger.success('Login exitoso');
        return result;
      }
      return result;
    } catch (error) {
      logger.error('Error en login', error);
      return { success: false, error: 'Error de conexión' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const result = await authService.register(userData);
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        logger.success('Registro exitoso');
        return result;
      }
      return result;
    } catch (error) {
      logger.error('Error en registro', error);
      return { success: false, error: 'Error de conexión' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      // Limpiar estado inmediatamente
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      
      // Limpiar completamente el estado de autenticación
      clearAuthState();
      
      // Limpiar token del API service
      if (typeof window !== 'undefined') {
        const apiService = require('../services/api.js').default;
        apiService.setToken(null);
      }
      
      logger.info('Usuario desconectado');
      
      // Navegación segura a home
      safeNavigate('/', 50);
      
    } catch (error) {
      console.error('Error en logout:', error);
      // Fallback: navegación directa
      safeNavigate('/', 0);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};