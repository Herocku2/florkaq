import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import forumService from '../services/forumService';
import { logger } from '../utils/logger';

export const useForum = () => {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Verificar si el usuario es moderador
  useEffect(() => {
    const checkModeratorStatus = async () => {
      console.log('🔍 Verificando estado de moderador...', { isAuthenticated, user });
      
      if (isAuthenticated && user) {
        console.log('👤 Usuario autenticado, verificando rol de moderador...');
        const moderatorStatus = await forumService.isUserModerator();
        setIsModerator(moderatorStatus);
        console.log(`🛡️ Usuario es moderador: ${moderatorStatus}`);
        logger.info(`Usuario es moderador: ${moderatorStatus}`);
        
        // Recargar foros cuando cambia el estado de moderador
        loadForums();
      } else {
        console.log('❌ Usuario no autenticado');
        setIsModerator(false);
        
        // También recargar foros cuando se desautentica
        loadForums();
      }
    };

    checkModeratorStatus();
  }, [isAuthenticated, user]);

  // Cargar foros
  const loadForums = async () => {
    setLoading(true);
    try {
      // Siempre limpiar cache antes de cargar
      forumService.clearForumsCache();
      
      const result = await forumService.getForums();
      if (result.success) {
        setForums(result.forums);
        console.log('✅ Foros cargados en useForum:', result.forums.length);
      } else {
        logger.error('Error cargando foros', result.error);
        setForums([]);
      }
    } catch (error) {
      logger.error('Error cargando foros', error);
      setForums([]);
    } finally {
      setLoading(false);
    }
  };

  // Crear foro (solo moderadores)
  const createForum = async (forumData) => {
    console.log('🔍 useForum.createForum - isModerator:', isModerator);
    console.log('🔍 useForum.createForum - isAuthenticated:', isAuthenticated);
    console.log('🔍 useForum.createForum - user:', user);
    
    if (!isModerator) {
      console.log('❌ Usuario no es moderador, rechazando creación');
      return { success: false, error: 'Solo los moderadores pueden crear foros' };
    }

    setLoading(true);
    try {
      console.log('📤 Enviando datos al forumService:', forumData);
      const result = await forumService.createForum(forumData);
      console.log('📥 Respuesta del forumService:', result);
      
      if (result.success) {
        await loadForums(); // Recargar foros
      }
      return result;
    } catch (error) {
      console.error('❌ Error en useForum.createForum:', error);
      logger.error('Error creando foro', error);
      return { success: false, error: 'Error creando foro: ' + error.message };
    } finally {
      setLoading(false);
    }
  };

  // Editar foro (solo moderadores)
  const updateForum = async (forumId, forumData) => {
    if (!isModerator) {
      return { success: false, error: 'Solo los moderadores pueden editar foros' };
    }

    setLoading(true);
    try {
      const result = await forumService.updateForum(forumId, forumData);
      if (result.success) {
        await loadForums(); // Recargar foros
      }
      return result;
    } catch (error) {
      logger.error('Error actualizando foro', error);
      return { success: false, error: 'Error actualizando foro' };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar foro (solo moderadores)
  const deleteForum = async (forumId) => {
    if (!isModerator) {
      return { success: false, error: 'Solo los moderadores pueden eliminar foros' };
    }

    setLoading(true);
    try {
      const result = await forumService.deleteForum(forumId);
      if (result.success) {
        await loadForums(); // Recargar foros
      }
      return result;
    } catch (error) {
      logger.error('Error eliminando foro', error);
      return { success: false, error: 'Error eliminando foro' };
    } finally {
      setLoading(false);
    }
  };

  // Crear comentario
  const createComment = async (forumId, commentText) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Debes iniciar sesión para comentar' };
    }

    try {
      const result = await forumService.createComment(forumId, commentText);
      return result;
    } catch (error) {
      logger.error('Error creando comentario', error);
      return { success: false, error: 'Error creando comentario' };
    }
  };

  // Eliminar comentario (solo moderadores)
  const deleteComment = async (commentId) => {
    if (!isModerator) {
      return { success: false, error: 'Solo los moderadores pueden eliminar comentarios' };
    }

    try {
      const result = await forumService.deleteComment(commentId);
      return result;
    } catch (error) {
      logger.error('Error eliminando comentario', error);
      return { success: false, error: 'Error eliminando comentario' };
    }
  };

  // Bloquear usuario (solo moderadores)
  const blockUser = async (userEmail) => {
    if (!isModerator) {
      return { success: false, error: 'Solo los moderadores pueden bloquear usuarios' };
    }

    try {
      const result = await forumService.blockUser(userEmail);
      return result;
    } catch (error) {
      logger.error('Error bloqueando usuario', error);
      return { success: false, error: 'Error bloqueando usuario' };
    }
  };

  return {
    forums,
    loading,
    isModerator,
    isAuthenticated,
    loadForums,
    createForum,
    updateForum,
    deleteForum,
    createComment,
    deleteComment,
    blockUser
  };
};