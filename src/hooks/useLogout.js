import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useLogout = () => {
  const { logout } = useAuth();

  const handleLogout = useCallback(async () => {
    try {
      // Mostrar confirmación
      const confirmed = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
      
      if (!confirmed) {
        return false;
      }

      // Ejecutar logout
      await logout();
      
      return true;
    } catch (error) {
      console.error('Error durante logout:', error);
      
      // Fallback: limpiar manualmente y recargar
      try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/auth';
      } catch (fallbackError) {
        console.error('Error en fallback logout:', fallbackError);
        window.location.reload();
      }
      
      return false;
    }
  }, [logout]);

  return handleLogout;
};