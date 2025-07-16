/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

export const TarjetaVotos = ({ className, line = "/img/line-8-1.svg", to, text = "AI Bonk Complex", text1 = "Complex", imagen = "/img/image-4.png" }) => {
  return (
    <Link className={`tarjeta-votos-horizontal ${className}`} to={to}>
      <div className="token-card-container">
        <div className="token-image-section">
          <img className="token-image" alt={text} src={imagen} />
        </div>
        
        <div className="token-info-section">
          <div className="token-header">
            <h3 className="token-name">{text}</h3>
            <p className="token-description">{text1}</p>
          </div>
          
          <div className="token-stats">
            <div className="stat-item">
              <span className="stat-label">Market Cap:</span>
              <span className="stat-value">$4,680</span>
              <span className="stat-change positive">+0.5%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">24h Volume:</span>
              <span className="stat-value">$2,340</span>
              <span className="stat-change positive">+1.2%</span>
            </div>
          </div>
          
          <div className="token-progress">
            <div className="progress-info">
              <span className="progress-text">6M to go</span>
              <span className="progress-percentage">78%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: '78%'}}></div>
            </div>
          </div>
        </div>
        
        <div className="vote-section">
          <button className="vote-button">
            <span className="vote-text">Vote</span>
          </button>
          <div className="vote-count">
            <span className="votes-number">1,234</span>
            <span className="votes-label">votes</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

TarjetaVotos.propTypes = {
  line: PropTypes.string,
  to: PropTypes.string,
  text: PropTypes.string,
  text1: PropTypes.string,
  imagen: PropTypes.string,
};
