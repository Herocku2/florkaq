import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useLogout = () => {
  const { logout } = useAuth();

  const handleLogout = useCallback(() => {
    try {
      // Ejecutar logout sin confirmación para evitar problemas de hooks
      logout();
      return true;
    } catch (error) {
      console.error('Error durante logout:', error);
      
      // Fallback: limpiar manualmente y navegar
      try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/';
      } catch (fallbackError) {
        console.error('Error en fallback logout:', fallbackError);
        window.location.reload();
      }
      
      return false;
    }
  }, [logout]);

  return handleLogout;
};