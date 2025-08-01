import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForum } from '../../hooks/useForum';
import { Heder } from '../../components/Heder/Heder';
import { Boton } from '../../components/Boton/Boton';
import forumService from '../../services/forumService';
import './style.css';

export const Forum = () => {
  const { forums, loading, isModerator, loadForums, createForum, updateForum, deleteForum, createComment } = useForum();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [selectedForum, setSelectedForum] = useState(null);
  const [comments, setComments] = useState([]);
  const [newForumData, setNewForumData] = useState({ 
    titulo: '', 
    descripcion: '', 
    tokenRelacionado: '',
    imagen: '',
    imagenFile: null,
    enlaceWeb: '',
    redesSociales: {
      twitter: '',
      telegram: '',
      discord: ''
    }
  });
  const [newComment, setNewComment] = useState('');
  const [showNewForumForm, setShowNewForumForm] = useState(false);
  const [editingForum, setEditingForum] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mostrar mensaje de autenticación requerida si no está logueado
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="forum-screen">
        <Heder />
        <div className="forum-container">
          <div className="auth-required-message">
            <h1>Acceso Restringido</h1>
            <p>Debes iniciar sesión para acceder a los foros de discusión.</p>
            <div className="auth-actions">
              <a href="/auth" className="auth-button">
                Iniciar Sesión / Registrarse
              </a>
            </div>
            <div className="user-roles-info">
              <h3>Tipos de Usuario:</h3>
              <ul>
                <li><strong>Usuario Estándar:</strong> Puede comentar en foros existentes</li>
                <li><strong>Moderador:</strong> Puede crear y moderar foros, eliminar comentarios</li>
                <li><strong>Administrador:</strong> Control total de la plataforma</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cargar foros al montar el componente
  useEffect(() => {
    loadForums();
  }, []);

  // Debug: Mostrar estado de autenticación
  useEffect(() => {
    console.log('🔍 Estado de autenticación en Forum:', { isAuthenticated, user });
  }, [isAuthenticated, user]);

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
        setNewForumData({ 
          titulo: '', 
          descripcion: '', 
          tokenRelacionado: '',
          imagen: '',
          imagenFile: null,
          enlaceWeb: '',
          redesSociales: { twitter: '', telegram: '', discord: '' }
        });
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
        <div className="forum-header" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>
          <h1>Foros de Discusión</h1>
          
          {/* Botón para crear nuevo foro - SOLO para moderadores */}
          {isModerator && (
            <button
              className="create-forum-button"
              onClick={() => setShowNewForumForm(!showNewForumForm)}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              {showNewForumForm ? "Cancelar" : "Crear Nuevo Foro"}
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Formulario para crear nuevo foro - SOLO moderadores */}
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

              <div className="form-group">
                <label htmlFor="imagen">Imagen del Foro:</label>
                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                  <input
                    type="file"
                    id="imagenFile"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        // Crear URL temporal para preview
                        const imageUrl = URL.createObjectURL(file);
                        setNewForumData({...newForumData, imagen: imageUrl, imagenFile: file});
                      }
                    }}
                    style={{
                      padding: '10px',
                      border: '2px dashed #ccc',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{fontSize: '12px', color: '#666'}}>
                    O ingresa una URL de imagen:
                  </span>
                  <input
                    type="url"
                    id="imagen"
                    value={newForumData.imagen}
                    onChange={(e) => setNewForumData({...newForumData, imagen: e.target.value})}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  {newForumData.imagen && (
                    <div style={{marginTop: '10px'}}>
                      <img 
                        src={newForumData.imagen} 
                        alt="Preview" 
                        style={{maxWidth: '200px', maxHeight: '150px', borderRadius: '8px'}}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="enlaceWeb">Enlace Web (opcional):</label>
                <input
                  type="url"
                  id="enlaceWeb"
                  value={newForumData.enlaceWeb}
                  onChange={(e) => setNewForumData({...newForumData, enlaceWeb: e.target.value})}
                  placeholder="https://ejemplo.com"
                />
              </div>

              <div className="form-group">
                <label>Redes Sociales (opcional):</label>
                <div style={{display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr 1fr'}}>
                  <input
                    type="text"
                    placeholder="Twitter @usuario"
                    value={newForumData.redesSociales.twitter}
                    onChange={(e) => setNewForumData({
                      ...newForumData, 
                      redesSociales: {...newForumData.redesSociales, twitter: e.target.value}
                    })}
                  />
                  <input
                    type="text"
                    placeholder="Telegram @canal"
                    value={newForumData.redesSociales.telegram}
                    onChange={(e) => setNewForumData({
                      ...newForumData, 
                      redesSociales: {...newForumData.redesSociales, telegram: e.target.value}
                    })}
                  />
                  <input
                    type="text"
                    placeholder="Discord servidor"
                    value={newForumData.redesSociales.discord}
                    onChange={(e) => setNewForumData({
                      ...newForumData, 
                      redesSociales: {...newForumData.redesSociales, discord: e.target.value}
                    })}
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginRight: '10px'
                  }}
                >
                  Crear Foro
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewForumForm(false)}
                  style={{
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Formulario para editar foro - SOLO moderadores */}
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
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginRight: '10px'
                  }}
                >
                  Actualizar Foro
                </button>
                <button
                  type="button"
                  onClick={() => setEditingForum(null)}
                  style={{
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
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
                            {isModerator && (
                              <button 
                                onClick={() => {
                                  if (window.confirm('¿Eliminar este comentario?')) {
                                    // TODO: Implementar eliminación de comentario
                                    console.log('Eliminar comentario:', comment.id);
                                  }
                                }}
                                style={{
                                  background: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                  marginLeft: '10px'
                                }}
                              >
                                Eliminar
                              </button>
                            )}
                          </div>
                          <p className="comment-text">{comment.attributes.texto}</p>
                          
                          {/* Sistema de reacciones */}
                          <div className="comment-reactions" style={{marginTop: '10px', display: 'flex', gap: '10px', alignItems: 'center'}}>
                            <button 
                              onClick={() => console.log('Like:', comment.id)}
                              style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px'}}
                            >
                              👍 0
                            </button>
                            <button 
                              onClick={() => console.log('Dislike:', comment.id)}
                              style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px'}}
                            >
                              👎 0
                            </button>
                            <button 
                              onClick={() => console.log('Heart:', comment.id)}
                              style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px'}}
                            >
                              ❤️ 0
                            </button>
                            <button 
                              onClick={() => console.log('Laugh:', comment.id)}
                              style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px'}}
                            >
                              😂 0
                            </button>
                          </div>
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
                      <button
                        type="submit"
                        style={{
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          marginTop: '10px'
                        }}
                      >
                        Enviar Comentario
                      </button>
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