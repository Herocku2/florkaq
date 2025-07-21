import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { logger } from '../utils/logger';

const API_BASE_URL = 'http://localhost:1337/api';

export const useVoting = () => {
  const [userVotes, setUserVotes] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Obtener el usuario actual desde el contexto de autenticación
  const getCurrentUser = () => {
    if (isAuthenticated && user && user.id) {
      return user.id.toString();
    }
    return localStorage.getItem('userId') || 'anonymous_user';
  };

  // Obtener votos del usuario al cargar (solo una vez)
  useEffect(() => {
    const fetchUserVotes = async () => {
      try {
        logger.info('Cargando votos del usuario');
        
        // Para evitar bucles infinitos, usar datos estáticos por ahora
        // En producción, esto haría una llamada real al backend
        const userId = getCurrentUser();
        
        // Validar que userId existe antes de usarlo
        if (!userId || userId === 'anonymous_user') {
          setUserVotes(new Set()); // Usuario anónimo no ha votado
          return;
        }
        
        // Simular algunos votos para testing sin hacer llamadas al servidor
        if (userId === '1' || userId === 'test_user_123') {
          setUserVotes(new Set(['1'])); // Usuario ya votó por token 1
        } else {
          setUserVotes(new Set()); // Usuario no ha votado
        }
        
        logger.success('Votos del usuario cargados');
        
      } catch (error) {
        logger.error('Error cargando votos del usuario', error);
        setUserVotes(new Set());
      }
    };

    // Solo ejecutar si el contexto de autenticación está listo
    if (typeof isAuthenticated === 'boolean') {
      fetchUserVotes();
    }
  }, [isAuthenticated, user?.id]); // Solo re-ejecutar si cambia la autenticación

  // Función para votar (simulada para evitar problemas de servidor)
  const vote = async (tokenId) => {
    setLoading(true);
    try {
      logger.info('Procesando voto');
      
      // Simular el voto localmente para evitar sobrecargar el servidor
      // En producción, esto haría una llamada real al backend
      await new Promise(resolve => setTimeout(resolve, 500)); // Simular delay de red
      
      setUserVotes(prev => new Set([...prev, tokenId.toString()]));
      logger.success('Voto registrado exitosamente');
      return true;
      
    } catch (error) {
      logger.error('Error votando', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Función para quitar voto (simulada para evitar problemas de servidor)
  const unvote = async (tokenId) => {
    setLoading(true);
    try {
      logger.info('Removiendo voto');
      
      // Simular la remoción del voto localmente para evitar sobrecargar el servidor
      // En producción, esto haría una llamada real al backend
      await new Promise(resolve => setTimeout(resolve, 500)); // Simular delay de red
      
      setUserVotes(prev => {
        const newSet = new Set(prev);
        newSet.delete(tokenId.toString());
        return newSet;
      });
      
      logger.success('Voto removido exitosamente');
      return true;
      
    } catch (error) {
      logger.error('Error removiendo voto', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener el conteo de votos de un token (simulado para evitar bucles)
  const getVoteCount = async (tokenId) => {
    // Para evitar bucles infinitos, retornar conteos estáticos
    // En producción, esto haría una llamada real al backend
    const staticCounts = {
      '1': 45,
      '2': 32,
      '3': 28
    };
    
    return staticCounts[tokenId.toString()] || 0;
  };

  // Verificar si el usuario ha votado por un token específico
  const hasUserVoted = (tokenId) => {
    return userVotes.has(tokenId.toString());
  };

  return {
    vote,
    unvote,
    getVoteCount,
    hasUserVoted,
    loading,
    userVotes
  };
};