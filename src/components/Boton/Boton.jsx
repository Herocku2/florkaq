/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./style.css";

export const Boton = ({ className }) => {
  const { isAuthenticated, user, loading, logout } = useAuth();

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      logout();
    } catch (error) {
      console.error('Error en logout:', error);
      // Fallback directo
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
  };

  // Renderizar siempre la misma estructura para evitar problemas de hooks
  if (loading) {
    return (
      <div className={`boton ${className}`}>
        <div className="text-wrapper-24">Cargando...</div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className={`boton-user ${className}`}>
        <div className="user-info">
          <span className="username">👋 {user.username || user.nombre || user.email}</span>
          <button 
            className="logout-btn" 
            onClick={handleLogout}
            title="Cerrar sesión"
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              marginLeft: '8px'
            }}
          >
            Salir
          </button>
        </div>
      </div>
    );
  }

  return (
    <Link to="/auth" className={`boton ${className}`}>
      <div className="text-wrapper-24">Get Started</div>
    </Link>
  );
};
