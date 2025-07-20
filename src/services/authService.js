const API_BASE_URL = 'http://localhost:1337/api';

class AuthService {
  // Registrar nuevo usuario
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/local/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.nombre,
          email: userData.email,
          password: userData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar token y datos del usuario
        localStorage.setItem('token', data.jwt);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, user: data.user, token: data.jwt };
      } else {
        return { 
          success: false, 
          error: data.error?.message || 'Error en el registro' 
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
      const response = await fetch(`${API_BASE_URL}/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar token y datos del usuario
        localStorage.setItem('token', data.jwt);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, user: data.user, token: data.jwt };
      } else {
        return { 
          success: false, 
          error: data.error?.message || 'Credenciales incorrectas' 
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth';
  }

  // Obtener usuario actual
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Obtener token
  getToken() {
    return localStorage.getItem('token');
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

      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('user', JSON.stringify(user));
        return user;
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
      const token = this.getToken();
      const user = this.getCurrentUser();
      
      if (!token || !user) {
        return { success: false, error: 'No autenticado' };
      }

      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        return { success: true, user: data };
      } else {
        return { 
          success: false, 
          error: data.error?.message || 'Error actualizando perfil' 
        };
      }
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