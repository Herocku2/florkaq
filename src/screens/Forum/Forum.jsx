import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForum } from '../../hooks/useForum';
import { Heder } from '../../components/Heder/Heder';
import { Boton } from '../../components/Boton/Boton';
import forumService from '../../services/forumService';
import './style.css';

export const Forum = () => {
  const { forums, loading, isModerator, loadForums, createForum, updateForum, deleteForum, createComment } = useForum();
  const { isAuthenticated, user } = useAuth();
  const [selectedForum, setSelectedForum] = useState(null);
  const [comments, setComments] = useState([]);
  const [newForumData, setNewForumData] = useState({ titulo: '', descripcion: '', tokenRelacionado: '' });
  const [newComment, setNewComment] = useState('');
  const [showNewForumForm, setShowNewForumForm] = useState(false);
  const [editingForum, setEditingForum] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar foros al montar el componente
  useEffect(() => {
    loadForums();
  }, []);

  // Cargar comentarios cuando se selecciona un foro
  const handleSelectForum = async (forum) => {
    setSelectedForum(forum);
    setNewComment('');
    
    try {
      const result = await forumService.getForumComments(forum.id);
      if (result.success) {
        setComments(result.comments);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error('Error cargando comentarios', error);
      setComments([]);
    }
  };

  // Manejar creación de foro
  const handleCreateForum = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newForumData.titulo || !newForumData.tokenRelacionado) {
      setError('El título y el token relacionado son obligatorios');
      return;
    }

    try {
      const result = await createForum(newForumData);
      if (result.success) {
        setSuccess('Foro creado exitosamente');
        setNewForumData({ titulo: '', descripcion: '', tokenRelacionado: '' });
        setShowNewForumForm(false);
      } else {
        setError(result.error || 'Error al crear el foro');
      }
    } catch (error) {
      setError('Error al crear el foro');
    }
  };

  // Manejar actualización de foro
  const handleUpdateForum = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!editingForum || !editingForum.titulo || !editingForum.tokenRelacionado) {
      setError('El título y el token relacionado son obligatorios');
      return;
    }

    try {
      const result = await updateForum(editingForum.id, {
        titulo: editingForum.titulo,
        descripcion: editingForum.descripcion,
        tokenRelacionado: editingForum.tokenRelacionado
      });

      if (result.success) {
        setSuccess('Foro actualizado exitosamente');
        setEditingForum(null);
      } else {
        setError(result.error || 'Error al actualizar el foro');
      }
    } catch (error) {
      setError('Error al actualizar el foro');
    }
  };

  // Manejar eliminación de foro
  const handleDeleteForum = async (forumId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este foro? Esta acción no se puede deshacer.')) {
      setError('');
      setSuccess('');

      try {
        const result = await deleteForum(forumId);
        if (result.success) {
          setSuccess('Foro eliminado exitosamente');
          if (selectedForum && selectedForum.id === forumId) {
            setSelectedForum(null);
            setComments([]);
          }
        } else {
          setError(result.error || 'Error al eliminar el foro');
        }
      } catch (error) {
        setError('Error al eliminar el foro');
      }
    }
  };

  // Manejar creación de comentario
  const handleCreateComment = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newComment) {
      setError('El comentario no puede estar vacío');
      return;
    }

    if (!selectedForum) {
      setError('Debes seleccionar un foro para comentar');
      return;
    }

    try {
      const result = await createComment(selectedForum.id, newComment);
      if (result.success) {
        setSuccess('Comentario enviado exitosamente');
        setNewComment('');
        
        // Recargar comentarios
        const commentsResult = await forumService.getForumComments(selectedForum.id);
        if (commentsResult.success) {
          setComments(commentsResult.comments);
        }
      } else {
        setError(result.error || 'Error al enviar el comentario');
      }
    } catch (error) {
      setError('Error al enviar el comentario');
    }
  };

  return (
    <div className="forum-screen">
      <Heder />
      
      <div className="forum-container">
        <div className="forum-header">
          <h1>Foros de Discusión</h1>
          {isModerator && (
            <Boton
              className="create-forum-button"
              onClick={() => setShowNewForumForm(!showNewForumForm)}
              text={showNewForumForm ? "Cancelar" : "Crear Nuevo Foro"}
            />
          )}
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Formulario para crear nuevo foro (solo moderadores) */}
        {showNewForumForm && isModerator && (
          <div className="new-forum-form-container">
            <h2>Crear Nuevo Foro</h2>
            <form onSubmit={handleCreateForum} className="forum-form">
              <div className="form-group">
                <label htmlFor="titulo">Título:</label>
                <input
                  type="text"
                  id="titulo"
                  value={newForumData.titulo}
                  onChange={(e) => setNewForumData({...newForumData, titulo: e.target.value})}
                  maxLength={200}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="descripcion">Descripción:</label>
                <textarea
                  id="descripcion"
                  value={newForumData.descripcion}
                  onChange={(e) => setNewForumData({...newForumData, descripcion: e.target.value})}
                  maxLength={1000}
                  rows={4}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="tokenRelacionado">Token Relacionado:</label>
                <input
                  type="text"
                  id="tokenRelacionado"
                  value={newForumData.tokenRelacionado}
                  onChange={(e) => setNewForumData({...newForumData, tokenRelacionado: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-actions">
                <Boton
                  type="submit"
                  text="Crear Foro"
                  className="submit-button"
                />
                <Boton
                  type="button"
                  text="Cancelar"
                  className="cancel-button"
                  onClick={() => setShowNewForumForm(false)}
                />
              </div>
            </form>
          </div>
        )}

        {/* Formulario para editar foro (solo moderadores) */}
        {editingForum && isModerator && (
          <div className="edit-forum-form-container">
            <h2>Editar Foro</h2>
            <form onSubmit={handleUpdateForum} className="forum-form">
              <div className="form-group">
                <label htmlFor="edit-titulo">Título:</label>
                <input
                  type="text"
                  id="edit-titulo"
                  value={editingForum.titulo}
                  onChange={(e) => setEditingForum({...editingForum, titulo: e.target.value})}
                  maxLength={200}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-descripcion">Descripción:</label>
                <textarea
                  id="edit-descripcion"
                  value={editingForum.descripcion}
                  onChange={(e) => setEditingForum({...editingForum, descripcion: e.target.value})}
                  maxLength={1000}
                  rows={4}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-tokenRelacionado">Token Relacionado:</label>
                <input
                  type="text"
                  id="edit-tokenRelacionado"
                  value={editingForum.tokenRelacionado}
                  onChange={(e) => setEditingForum({...editingForum, tokenRelacionado: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-actions">
                <Boton
                  type="submit"
                  text="Actualizar Foro"
                  className="submit-button"
                />
                <Boton
                  type="button"
                  text="Cancelar"
                  className="cancel-button"
                  onClick={() => setEditingForum(null)}
                />
              </div>
            </form>
          </div>
        )}

        <div className="forum-content">
          {/* Lista de foros */}
          <div className="forum-list">
            <h2>Temas de Discusión</h2>
            {loading ? (
              <p>Cargando foros...</p>
            ) : forums.length > 0 ? (
              <ul>
                {forums.map((forum) => (
                  <li 
                    key={forum.id} 
                    className={`forum-item ${selectedForum && selectedForum.id === forum.id ? 'selected' : ''}`}
                    onClick={() => handleSelectForum(forum)}
                  >
                    <div className="forum-item-header">
                      <h3>{forum.attributes.titulo}</h3>
                      <span className="token-badge">{forum.attributes.tokenRelacionado}</span>
                    </div>
                    <p className="forum-description">{forum.attributes.descripcion}</p>
                    <div className="forum-meta">
                      <span>Creado por: {forum.attributes.creador}</span>
                      <span>Fecha: {new Date(forum.attributes.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    {isModerator && (
                      <div className="forum-actions">
                        <button 
                          className="edit-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingForum({
                              id: forum.id,
                              titulo: forum.attributes.titulo,
                              descripcion: forum.attributes.descripcion,
                              tokenRelacionado: forum.attributes.tokenRelacionado
                            });
                          }}
                        >
                          Editar
                        </button>
                        <button 
                          className="delete-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteForum(forum.id);
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay foros disponibles.</p>
            )}
          </div>

          {/* Detalle del foro seleccionado y comentarios */}
          <div className="forum-detail">
            {selectedForum ? (
              <>
                <div className="selected-forum-header">
                  <h2>{selectedForum.attributes.titulo}</h2>
                  <span className="token-badge">{selectedForum.attributes.tokenRelacionado}</span>
                </div>
                <p className="selected-forum-description">{selectedForum.attributes.descripcion}</p>
                
                <div className="comments-section">
                  <h3>Comentarios</h3>
                  
                  {comments.length > 0 ? (
                    <ul className="comments-list">
                      {comments.map((comment) => (
                        <li key={comment.id} className="comment-item">
                          <div className="comment-header">
                            <span className="comment-author">{comment.attributes.usuario}</span>
                            <span className="comment-date">
                              {new Date(comment.attributes.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="comment-text">{comment.attributes.texto}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No hay comentarios en este foro.</p>
                  )}
                  
                  {isAuthenticated ? (
                    <form onSubmit={handleCreateComment} className="comment-form">
                      <h4>Añadir comentario</h4>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escribe tu comentario aquí..."
                        maxLength={1000}
                        rows={4}
                        required
                      />
                      <Boton
                        type="submit"
                        text="Enviar Comentario"
                        className="submit-comment-button"
                      />
                    </form>
                  ) : (
                    <p className="login-prompt">
                      Debes <a href="/auth">iniciar sesión</a> para comentar.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="no-forum-selected">
                <p>Selecciona un foro para ver los detalles y comentarios.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;