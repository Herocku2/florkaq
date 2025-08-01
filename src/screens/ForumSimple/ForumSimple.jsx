import React, { useState, useEffect } from 'react';
import { Heder } from '../../components/Heder/Heder';
import { useAuth } from '../../contexts/AuthContext';
import tokenService from '../../services/tokenService';
import './style.css';

export const ForumSimple = () => {
  const { isAuthenticated, user } = useAuth();
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('launched'); // 'launched', 'next', 'voting'

  // Cargar foros al iniciar
  useEffect(() => {
    loadForums();
  }, []);

  // Función simple para cargar foros
  const loadForums = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:1337/api/foros');
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        setForums(data.data);
        setMessage('');
      } else {
        throw new Error('Formato de datos inválido');
      }
    } catch (error) {
      console.error('Error cargando foros:', error);
      setMessage('Error al cargar los foros. Mostrando datos de ejemplo.');
      // Usar datos de ejemplo si falla
      setForums([
        {
          id: 1,
          attributes: {
            titulo: "Test Foro",
            descripcion: "Foro de prueba",
            tokenRelacionado: "TestToken",
            creador: "Admin"
          }
        },
        {
          id: 2,
          attributes: {
            titulo: "Javier Milei",
            descripcion: "Presidente de Argentina",
            tokenRelacionado: "MILEI",
            creador: "Moderador"
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Función simple para cargar comentarios
  const loadComments = async (forumId) => {
    setLoading(true);
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
      setMessage('Error al cargar comentarios');
    } finally {
      setLoading(false);
    }
  };

  // Seleccionar foro
  const selectForum = (forum) => {
    setSelectedForum(forum);
    loadComments(forum.id);
    setNewComment('');
    setMessage('');
  };

  // Enviar comentario
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
          usuario: user?.username || user?.email || 'Usuario Anónimo',
          foroRelacionado: selectedForum.id.toString(),
          aprobado: true,
          fechaCreacion: new Date().toISOString()
        }
      };

      const response = await fetch(`http://localhost:1337/api/foros/${selectedForum.id}/comentarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('¡Comentario enviado exitosamente!');
        setNewComment('');
        // Recargar comentarios después de un breve delay
        setTimeout(() => {
          loadComments(selectedForum.id);
          setMessage('');
        }, 1000);
      } else {
        setMessage('Error al enviar comentario. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error enviando comentario:', error);
      setMessage('Error de conexión. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forum-simple">
      <Heder />
      
      <div className="forum-container">
        <h1>Foros de Discusión</h1>
        
        <div className="forum-layout">
          {/* Lista de foros */}
          <div className="forum-list">
            <h2>Temas</h2>
            {loading && forums.length === 0 ? (
              <div className="loading-indicator">
                <p>Cargando foros...</p>
              </div>
            ) : (
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
                    {loading && comments.length === 0 ? (
                      <div className="loading-indicator">
                        <p>Cargando comentarios...</p>
                      </div>
                    ) : comments.length > 0 ? (
                      comments.map((comment) => (
                        <div key={comment.id} className="comment">
                          <div className="comment-header">
                            <strong>{comment.attributes?.usuario || comment.usuario}</strong>
                            <span className="comment-date">
                              {new Date(comment.attributes?.createdAt || comment.createdAt).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                          <p className="comment-text">{comment.attributes?.texto || comment.texto}</p>
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