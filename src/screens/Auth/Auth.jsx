import React, { useState } from "react";
import { Heder } from "../../components/Heder";
import "./style.css";

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      // Handle login
      console.log('Login attempt:', { email: formData.email, password: formData.password });
    } else {
      // Handle registration
      if (formData.password !== formData.confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }
      console.log('Registration attempt:', formData);
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

            <button type="submit" className="auth-button">
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
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