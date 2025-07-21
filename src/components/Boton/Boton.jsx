/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./style.css";

export const Boton = ({ className }) => {
  const { isAuthenticated, user, logout, loading } = useAuth();

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
          <span className="username">👋 {user.username}</span>
          <button 
            className="logout-btn" 
            onClick={logout}
            title="Cerrar sesión"
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
