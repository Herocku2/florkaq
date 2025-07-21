import { getApiBaseUrl } from '../config/environment';
import { logger } from '../utils/logger';

const API_BASE_URL = getApiBaseUrl();

class ForumService {
  // Obtener el token del usuario actual
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Obtener headers con autenticación
  getAuthHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Verificar si el usuario es moderador
  async isUserModerator() {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.email) return false;

      // Lista de emails de moderadores (para testing)
      const moderatorEmails = [
        'giovanoti2@gmail.com',
        'demo@florkafun.com' // Agregar demo como moderador para testing
      ];

      // Verificar si el email está en la lista de moderadores
      if (moderatorEmails.includes(user.email)) {
        return true;
      }

      // Intentar verificar en el backend si está disponible
      try {
        const response = await fetch(`${API_BASE_URL}/usuarios?filters[email][$eq]=${user.email}`, {
          headers: this.getAuthHeaders()
        });

        if (response.ok) {
          const data = await response.json();
          const usuario = data.data?.[0];
          return usuario?.attributes?.rol === 'moderador';
        }
      } catch (backendError) {
        // Si el backend no está disponible, usar la lista local
        logger.info('Backend no disponible, usando lista local de moderadores');
      }

      return false;
    } catch (error) {
      logger.error('Error verificando rol de moderador', error);
      return false;
    }
  }

  // Obtener todos los foros
  async getForums() {
    try {
      const response = await fetch(`${API_BASE_URL}/foros?populate=*&sort=createdAt:desc`, {
        headers: this.getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, forums: data.data || [] };
      }
      
      // Si el backend no está disponible, usar datos de ejemplo
      return this.getExampleForums();
    } catch (error) {
      logger.error('Error obteniendo foros, usando datos de ejemplo', error);
      return this.getExampleForums();
    }
  }

  // Datos de ejemplo para foros (cuando el backend no está disponible)
  getExampleForums() {
    const exampleForums = [
      {
        id: 1,
        attributes: {
          titulo: "🚀 Discusión General sobre Tokens Meme",
          descripcion: "Un espacio para discutir sobre el futuro de los tokens meme en Solana. Comparte tus opiniones, estrategias y análisis sobre el mercado.",
          token_relacionado: "GENERAL",
          creador: "demo",
          moderado: true,
          activo: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 día atrás
          fecha_creacion: new Date(Date.now() - 86400000).toISOString()
        }
      },
      {
        id: 2,
        attributes: {
          titulo: "💎 Análisis de Bukele Coin",
          descripcion: "Foro dedicado al análisis técnico y fundamental de Bukele Coin. Discutamos las perspectivas de este token y su potencial en el mercado.",
          token_relacionado: "BUKELE",
          creador: "giovanoti2",
          moderado: true,
          activo: true,
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 días atrás
          fecha_creacion: new Date(Date.now() - 172800000).toISOString()
        }
      },
      {
        id: 3,
        attributes: {
          titulo: "🗳️ Estrategias de Votación",
          descripcion: "Comparte tus estrategias para votar por los mejores tokens. ¿Cómo decides por cuál token votar? ¿Qué factores consideras más importantes?",
          token_relacionado: null,
          creador: "demo",
          moderado: true,
          activo: true,
          createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 días atrás
          fecha_creacion: new Date(Date.now() - 259200000).toISOString()
        }
      }
    ];

    return { success: true, forums: exampleForums };
  }

  // Crear un nuevo foro (solo moderadores)
  async createForum(forumData) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const response = await fetch(`${API_BASE_URL}/foros`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          data: {
            titulo: forumData.titulo,
            descripcion: forumData.descripcion,
            token_relacionado: forumData.tokenRelacionado || null,
            creador: user.username || user.email,
            moderado: true,
            activo: true,
            fecha_creacion: new Date().toISOString()
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        logger.success('Foro creado exitosamente');
        return { success: true, forum: data.data };
      }
      return { success: false, error: 'Error creando foro' };
    } catch (error) {
      logger.error('Error creando foro', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // Editar foro (solo moderadores)
  async updateForum(forumId, forumData) {
    try {
      const response = await fetch(`${API_BASE_URL}/foros/${forumId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          data: {
            titulo: forumData.titulo,
            descripcion: forumData.descripcion,
            token_relacionado: forumData.tokenRelacionado || null,
            moderado: true
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        logger.success('Foro actualizado exitosamente');
        return { success: true, forum: data.data };
      }
      return { success: false, error: 'Error actualizando foro' };
    } catch (error) {
      logger.error('Error actualizando foro', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // Eliminar foro (solo moderadores)
  async deleteForum(forumId) {
    try {
      const response = await fetch(`${API_BASE_URL}/foros/${forumId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (response.ok) {
        logger.success('Foro eliminado exitosamente');
        return { success: true };
      }
      return { success: false, error: 'Error eliminando foro' };
    } catch (error) {
      logger.error('Error eliminando foro', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // Obtener comentarios de un foro
  async getForumComments(forumId) {
    try {
      const response = await fetch(`${API_BASE_URL}/comentarios?filters[foro_relacionado][$eq]=${forumId}&populate=*&sort=createdAt:asc`, {
        headers: this.getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, comments: data.data || [] };
      }
      return { success: false, error: 'Error obteniendo comentarios' };
    } catch (error) {
      logger.error('Error obteniendo comentarios', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // Crear comentario en foro
  async createComment(forumId, commentText) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const response = await fetch(`${API_BASE_URL}/comentarios`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          data: {
            texto: commentText,
            usuario: user.username || user.email,
            foro_relacionado: forumId.toString(),
            aprobado: true,
            fecha_creacion: new Date().toISOString()
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        logger.success('Comentario creado exitosamente');
        return { success: true, comment: data.data };
      }
      return { success: false, error: 'Error creando comentario' };
    } catch (error) {
      logger.error('Error creando comentario', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // Eliminar comentario (solo moderadores)
  async deleteComment(commentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/comentarios/${commentId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (response.ok) {
        logger.success('Comentario eliminado exitosamente');
        return { success: true };
      }
      return { success: false, error: 'Error eliminando comentario' };
    } catch (error) {
      logger.error('Error eliminando comentario', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // Bloquear usuario (solo moderadores)
  async blockUser(userEmail) {
    try {
      // En una implementación real, esto actualizaría el estado del usuario
      // Por ahora, simular el bloqueo
      const blockedUsers = JSON.parse(localStorage.getItem('blockedUsers') || '[]');
      if (!blockedUsers.includes(userEmail)) {
        blockedUsers.push(userEmail);
        localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers));
      }
      
      logger.success('Usuario bloqueado exitosamente');
      return { success: true };
    } catch (error) {
      logger.error('Error bloqueando usuario', error);
      return { success: false, error: 'Error bloqueando usuario' };
    }
  }

  // Verificar si un usuario está bloqueado
  isUserBlocked(userEmail) {
    const blockedUsers = JSON.parse(localStorage.getItem('blockedUsers') || '[]');
    return blockedUsers.includes(userEmail);
  }
}

export default new ForumService();