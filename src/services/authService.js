import apiService from './api.js';

class AuthService {
  // Registrar nuevo usuario
  async register(userData) {
    try {
      const response = await apiService.post('simple-auth/register', {
        username: userData.nombre,
        email: userData.email,
        password: userData.password,
      });

      if (response.success) {
        // Guardar token y datos del usuario de forma segura
        localStorage.setItem('authToken', response.jwt);
        localStorage.setItem('user', JSON.stringify(response.user));
        apiService.setToken(response.jwt);
        return { success: true, user: response.user, token: response.jwt };
      } else {
        return { 
          success: false, 
          error: response.error || 'Error en el registro' 
        };
      }
    } catch (error) {
      console.error('Error en registro:', error);
      return { 
        success: false, 
        error: 'Error de conexión. Verifica que el servidor esté funcionando.' 
      };
    }
  }

  // Iniciar sesión
  async login(credentials) {
    try {
      const response = await apiService.post('simple-auth/login', {
        identifier: credentials.email,
        password: credentials.password,
      });

      if (response.success) {
        // Guardar token y datos del usuario de forma segura
        localStorage.setItem('authToken', response.jwt);
        localStorage.setItem('user', JSON.stringify(response.user));
        apiService.setToken(response.jwt);
        return { success: true, user: response.user, token: response.jwt };
      } else {
        return { 
          success: false, 
          error: response.error || 'Credenciales incorrectas' 
        };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        error: 'Error de conexión. Verifica que el servidor esté funcionando.' 
      };
    }
  }

  // Cerrar sesión
  logout() {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      apiService.setToken(null);
      
      // No usar window.location.href directamente desde el servicio
      // Dejar que el contexto maneje la navegación
      console.log('🚪 Logout completado desde authService');
    } catch (error) {
      console.error('Error en logout:', error);
    }
  }

  // Obtener usuario actual
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Obtener token
  getToken() {
    return localStorage.getItem('authToken');
  }

  // Verificar si está autenticado
  isAuthenticated() {
    return !!this.getToken();
  }

  // Obtener datos del usuario desde el servidor
  async getMe() {
    try {
      const token = this.getToken();
      if (!token) return null;

      const response = await apiService.get('simple-auth/me');

      if (response.success) {
        localStorage.setItem('user', JSON.stringify(response.user));
        return response.user;
      } else {
        // Token inválido, cerrar sesión
        this.logout();
        return null;
      }
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return null;
    }
  }

  // Actualizar perfil de usuario
  async updateProfile(userData) {
    try {
      const user = this.getCurrentUser();
      
      if (!user) {
        return { success: false, error: 'No autenticado' };
      }

      const response = await apiService.put(`users/${user.id}`, userData);

      localStorage.setItem('user', JSON.stringify(response));
      return { success: true, user: response };
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      return { 
        success: false, 
        error: 'Error de conexión' 
      };
    }
  }
}

export default new AuthService();