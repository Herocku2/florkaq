import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heder } from "../../components/Heder";
import { useAuth } from "../../contexts/AuthContext";
import "./style.css";

export const Auth = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: ''
  });

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        // Handle login usando el contexto
        const result = await login({
          email: formData.email,
          password: formData.password
        });

        if (result.success) {
          setSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
          setTimeout(() => {
            navigate('/'); // Redirigir a la página principal
          }, 1500);
        } else {
          setError(result.error);
        }
      } else {
        // Handle registration usando el contexto
        if (formData.password !== formData.confirmPassword) {
          setError('Las contraseñas no coinciden');
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres');
          setLoading(false);
          return;
        }

        const result = await register({
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password
        });

        if (result.success) {
          setSuccess('¡Registro exitoso! Redirigiendo...');
          setTimeout(() => {
            navigate('/'); // Redirigir a la página principal
          }, 1500);
        } else {
          setError(result.error);
        }
      }
    } catch (error) {
      setError('Error inesperado. Por favor, intenta de nuevo.');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <Heder className="heder-auth" />
      
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h1>
            <p className="auth-subtitle">
              {isLogin 
                ? 'Accede a tu cuenta de FlorkaFun' 
                : 'Únete a la comunidad de FlorkaFun'
              }
            </p>
          </div>

          {/* Mensajes de error y éxito */}
          {error && (
            <div className="auth-message error-message">
              {error}
            </div>
          )}
          
          {success && (
            <div className="auth-message success-message">
              {success}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  placeholder="Tu nombre completo"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="tu@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="••••••••"
                />
              </div>
            )}

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
            </button>
          </form>

          <div className="auth-switch">
            <p>
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              <button 
                type="button" 
                className="switch-button"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Regístrate' : 'Inicia Sesión'}
              </button>
            </p>
          </div>

          <div className="auth-info">
            <h3>Tipos de Usuario:</h3>
            <ul>
              <li><strong>Usuario Estándar:</strong> Vota, comenta y solicita tokens</li>
              <li><strong>Moderador:</strong> Gestiona foros y modera contenido</li>
              <li><strong>Administrador:</strong> Control total de la plataforma</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};