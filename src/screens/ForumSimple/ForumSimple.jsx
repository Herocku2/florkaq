import React, { useState, useEffect } from 'react';
import { Heder } from '../../components/Heder/Heder';
import { useAuth } from '../../contexts/AuthContext';
import './style.css';

export const ForumSimple = () => {
  const { isAuthenticated, user } = useAuth();
  const [forums, setForums] = useState([]);
  const [selectedForum, setSelectedForum] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [reactions, setReactions] = useState({}); // {commentId: {like: 5, love: 2, laugh: 1, angry: 0}}

  // Cargar foros al iniciar
  useEffect(() => {
    loadForums();
  }, []);

  // Función SIMPLE para cargar foros
  const loadForums = async () => {
    try {
      const response = await fetch('http://localhost:1337/api/foros');
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        setForums(data.data);
      } else {
        setForums([]);
      }
    } catch (error) {
      console.error('Error cargando foros:', error);
      setForums([]);
    }
  };

  // Función SIMPLE para cargar comentarios
  const loadComments = async (forumId) => {
    try {
      const response = await fetch(`http://localhost:1337/api/foros/${forumId}/comentarios`);
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        setComments(data.data);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error('Error cargando comentarios:', error);
      setComments([]);
    }
  };

  // Seleccionar foro
  const selectForum = (forum) => {
    setSelectedForum(forum);
    loadComments(forum.id);
    setNewComment('');
    setMessage('');
  };

  // Enviar comentario SIMPLE
  const submitComment = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setMessage('Debes iniciar sesión para comentar');
      return;
    }

    if (!newComment.trim()) {
      setMessage('El comentario no puede estar vacío');
      return;
    }

    setLoading(true);
    setMessage('Enviando comentario...');

    try {
      const commentData = {
        data: {
          texto: newComment.trim(),
          usuario: user?.username || user?.email || 'Usuario',
          foroRelacionado: selectedForum.id.toString(),
          aprobado: true,
          fechaCreacion: new Date().toISOString()
        }
      };

      console.log('Enviando comentario:', commentData);

      const response = await fetch(`http://localhost:1337/api/foros/${selectedForum.id}/comentarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData)
      });

      console.log('Respuesta del servidor:', response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log('Comentario creado:', result);
        setMessage('¡Comentario enviado exitosamente!');
        setNewComment('');
        // Recargar comentarios
        setTimeout(() => {
          loadComments(selectedForum.id);
          setMessage('');
        }, 1500);
      } else {
        const errorData = await response.text();
        console.error('Error del servidor:', errorData);
        setMessage(`Error al enviar comentario: ${response.status}`);
      }
    } catch (error) {
      console.error('Error enviando comentario:', error);
      setMessage('Error de conexión. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar reacciones
  const handleReaction = (commentId, reactionType) => {
    if (!isAuthenticated) {
      setMessage('Debes iniciar sesión para reaccionar');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setReactions(prev => {
      const commentReactions = prev[commentId] || { like: 0, love: 0, laugh: 0, angry: 0 };
      const newReactions = {
        ...prev,
        [commentId]: {
          ...commentReactions,
          [reactionType]: commentReactions[reactionType] + 1
        }
      };
      
      // Simular persistencia local
      localStorage.setItem('forum-reactions', JSON.stringify(newReactions));
      return newReactions;
    });
  };

  // Cargar reacciones desde localStorage al iniciar
  useEffect(() => {
    const savedReactions = localStorage.getItem('forum-reactions');
    if (savedReactions) {
      try {
        setReactions(JSON.parse(savedReactions));
      } catch (error) {
        console.error('Error cargando reacciones:', error);
      }
    }
  }, []);

  return (
    <div className="forum-simple">
      <Heder />
      
      <div className="forum-container">
        <h1>Foros de Discusión</h1>
        
        <div className="forum-layout">
          {/* Lista de foros */}
          <div className="forum-list">
            <h2>Temas</h2>
            {forums.length > 0 ? (
              forums.map((forum) => (
                <div 
                  key={forum.id} 
                  className={`forum-item ${selectedForum?.id === forum.id ? 'active' : ''}`}
                  onClick={() => selectForum(forum)}
                >
                  <h3>{forum.attributes.titulo}</h3>
                  <p>{forum.attributes.descripcion}</p>
                  <small>Token: {forum.attributes.tokenRelacionado} | Por: {forum.attributes.creador}</small>
                </div>
              ))
            ) : (
              <p className="no-forums">No hay foros disponibles</p>
            )}
          </div>

          {/* Área de comentarios */}
          <div className="forum-content">
            {selectedForum ? (
              <>
                <div className="forum-header">
                  <h2>{selectedForum.attributes.titulo}</h2>
                  <p>{selectedForum.attributes.descripcion}</p>
                </div>

                {/* Comentarios */}
                <div className="comments-section">
                  <h3>Comentarios ({comments.length})</h3>
                  
                  <div className="comments-list">
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <div key={comment.id} className="comment">
                          <div className="comment-header">
                            <strong>{comment.usuario}</strong>
                            <span className="comment-date">
                              {new Date(comment.createdAt).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                          <p className="comment-text">{comment.texto}</p>
                          
                          {/* Sistema de reacciones */}
                          <div className="comment-reactions">
                            <button 
                              className="reaction-btn"
                              onClick={() => handleReaction(comment.id, 'like')}
                              disabled={!isAuthenticated}
                            >
                              👍 {reactions[comment.id]?.like || 0}
                            </button>
                            <button 
                              className="reaction-btn"
                              onClick={() => handleReaction(comment.id, 'love')}
                              disabled={!isAuthenticated}
                            >
                              ❤️ {reactions[comment.id]?.love || 0}
                            </button>
                            <button 
                              className="reaction-btn"
                              onClick={() => handleReaction(comment.id, 'laugh')}
                              disabled={!isAuthenticated}
                            >
                              😂 {reactions[comment.id]?.laugh || 0}
                            </button>
                            <button 
                              className="reaction-btn"
                              onClick={() => handleReaction(comment.id, 'angry')}
                              disabled={!isAuthenticated}
                            >
                              😠 {reactions[comment.id]?.angry || 0}
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-comments">No hay comentarios aún. ¡Sé el primero en comentar!</p>
                    )}
                  </div>

                  {/* Formulario de comentario */}
                  {isAuthenticated ? (
                    <form onSubmit={submitComment} className="comment-form">
                      <h4>Añadir comentario</h4>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escribe tu comentario aquí..."
                        rows={4}
                        disabled={loading}
                      />
                      <button type="submit" disabled={loading || !newComment.trim()}>
                        {loading ? 'Enviando...' : 'Enviar Comentario'}
                      </button>
                    </form>
                  ) : (
                    <div className="login-prompt">
                      <p>Debes <a href="/auth">iniciar sesión</a> para comentar.</p>
                    </div>
                  )}

                  {/* Mensajes */}
                  {message && (
                    <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                      {message}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="no-forum-selected">
                <h2>Selecciona un foro</h2>
                <p>Elige un tema de la lista para ver los comentarios y participar en la discusión.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumSimple;