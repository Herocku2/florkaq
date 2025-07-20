/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

export const TarjetaProyectos = ({
  groupClassName,
  openOutline = "/img/open-outline.svg",
  starOutline = "/img/star-outline.svg",
  to,
  tokenName = "CAT",
  tokenSymbol = "CAT",
  tokenImage = "/img/image-4.png",
  marketCap = "$20000",
  progress = "15%",
  progressValue = 15
}) => {
  return (
    <Link className="tarjeta-proyectos nft-card" to={to}>
      {/* Imagen principal del NFT */}
      <div className="nft-image-container">
        <img className="nft-image" alt={tokenName} src={tokenImage} />
      </div>

      {/* Información del token */}
      <div className="nft-info">
        <div className="token-header">
          <h3 className="token-name">{tokenName}</h3>
          <span className="approved-badge">approved</span>
        </div>
        
        <div className="token-symbol">{tokenSymbol}</div>
        
        <div className="token-stats">
          <div className="stat-row">
            <span className="stat-label">Market Cap</span>
            <span className="stat-value">{marketCap}</span>
          </div>
          
          <div className="stat-row">
            <span className="stat-label">Progress</span>
            <span className="stat-value">{progress}</span>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressValue}%` }}
            ></div>
          </div>
        </div>

        {/* Botón de acción */}
        <button className="view-details-btn">
          View Project Details
          <span className="btn-icon">/{tokenSymbol.toLowerCase()}</span>
        </button>
      </div>
    </Link>
  );
};

TarjetaProyectos.propTypes = {
  openOutline: PropTypes.string,
  starOutline: PropTypes.string,
  to: PropTypes.string,
};
