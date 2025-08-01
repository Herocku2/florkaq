// Utilidad para navegación segura
export const safeNavigate = (path, delay = 100) => {
  try {
    // Usar setTimeout para evitar problemas de hooks
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        // Limpiar cualquier estado pendiente
        window.history.replaceState(null, '', path);
        window.location.href = path;
      }
    }, delay);
  } catch (error) {
    console.error('Error en navegación:', error);
    // Fallback: recarga completa
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }
};

// Limpiar completamente el estado de autenticación
export const clearAuthState = () => {
  try {
    // Limpiar localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Limpiar sessionStorage también por si acaso
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    
    // Limpiar cualquier cache del API
    if (typeof window !== 'undefined' && window.caches) {
      window.caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('api') || name.includes('auth')) {
            window.caches.delete(name);
          }
        });
      });
    }
    
    console.log('✅ Estado de autenticación limpiado completamente');
  } catch (error) {
    console.error('Error limpiando estado:', error);
  }
};