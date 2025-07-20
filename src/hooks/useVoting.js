import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:1337/api';

export const useVoting = () => {
  const [userVotes, setUserVotes] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // Simular obtener el usuario actual (en una app real vendría del contexto de auth)
  const getCurrentUser = () => {
    return localStorage.getItem('userId') || 'anonymous_user';
  };

  // Obtener votos del usuario al cargar
  useEffect(() => {
    const fetchUserVotes = async () => {
      try {
        const userId = getCurrentUser();
        const response = await fetch(`${API_BASE_URL}/votos?filters[usuario][$eq]=${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          const votedTokens = new Set(data.data.map(vote => vote.attributes.candidatoVotado));
          setUserVotes(votedTokens);
        } else {
          // Si no hay conexión al backend, simular algunos votos para testing
          console.log('Backend not available, using test votes');
          // Simular que el usuario ya votó por el token 1
          setUserVotes(new Set(['1']));
        }
      } catch (error) {
        console.error('Error fetching user votes:', error);
        // Simular algunos votos para testing cuando no hay backend
        setUserVotes(new Set(['1']));
      }
    };

    fetchUserVotes();
  }, []);

  // Función para votar
  const vote = async (tokenId) => {
    setLoading(true);
    try {
      const userId = getCurrentUser();
      const response = await fetch(`${API_BASE_URL}/votos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            usuario: userId,
            votacion: 'general',
            candidatoVotado: tokenId.toString(),
            fechaVoto: new Date().toISOString(),
            ipAddress: 'unknown' // En producción se obtendría la IP real
          }
        })
      });

      if (response.ok) {
        setUserVotes(prev => new Set([...prev, tokenId.toString()]));
        console.log(`✅ Vote successful for token ${tokenId}`);
        return true;
      } else {
        console.error('Error voting:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error voting, using local simulation:', error);
      // Si no hay backend, simular el voto localmente
      setUserVotes(prev => new Set([...prev, tokenId.toString()]));
      console.log(`✅ Vote simulated locally for token ${tokenId}`);
      return true;
    } finally {
      setLoading(false);
    }
  };

  // Función para quitar voto (unvote)
  const unvote = async (tokenId) => {
    setLoading(true);
    try {
      const userId = getCurrentUser();
      
      // Primero encontrar el voto del usuario para este token
      const findResponse = await fetch(
        `${API_BASE_URL}/votos?filters[usuario][$eq]=${userId}&filters[candidatoVotado][$eq]=${tokenId}`
      );
      
      if (findResponse.ok) {
        const findData = await findResponse.json();
        
        if (findData.data.length > 0) {
          const voteId = findData.data[0].id;
          
          // Eliminar el voto
          const deleteResponse = await fetch(`${API_BASE_URL}/votos/${voteId}`, {
            method: 'DELETE',
          });
          
          if (deleteResponse.ok) {
            setUserVotes(prev => {
              const newSet = new Set(prev);
              newSet.delete(tokenId.toString());
              return newSet;
            });
            console.log(`✅ Unvote successful for token ${tokenId}`);
            return true;
          }
        }
      }
      
      console.error('Error unvoting');
      return false;
    } catch (error) {
      console.error('Error unvoting, using local simulation:', error);
      // Si no hay backend, simular el unvote localmente
      setUserVotes(prev => {
        const newSet = new Set(prev);
        newSet.delete(tokenId.toString());
        return newSet;
      });
      console.log(`✅ Unvote simulated locally for token ${tokenId}`);
      return true;
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener el conteo de votos de un token
  const getVoteCount = async (tokenId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/votos?filters[candidatoVotado][$eq]=${tokenId}`
      );
      
      if (response.ok) {
        const data = await response.json();
        return data.data.length;
      }
      return 0;
    } catch (error) {
      console.error('Error getting vote count:', error);
      return 0;
    }
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