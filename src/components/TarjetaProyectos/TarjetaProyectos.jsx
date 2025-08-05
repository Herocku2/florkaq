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
    <Link className="tarjeta-proyectos nft-card-horizontal" to={to}>
      {/* Imagen principal del NFT - Cuadrada a la izquierda */}
      <div className="nft-image-container-horizontal">
        <img 
          className="nft-image-horizontal" 
          alt={tokenName} 
          src={tokenImage}
          onError={(e) => {
            console.log('Error loading image in TarjetaProyectos:', tokenImage);
            e.target.src = "/img/image-4.png"; // Fallback image
          }}
          onLoad={() => {
            console.log('Image loaded successfully in TarjetaProyectos:', tokenImage);
          }}
        />
      </div>

      {/* Información del token - A la derecha */}
      <div className="nft-info-horizontal">
        <div className="token-header-horizontal">
          <h3 className="token-name-horizontal">{tokenName}</h3>
          <span className="approved-badge-horizontal">approved</span>
        </div>
        
        <div className="token-symbol-horizontal">CA: {tokenSymbol}...bonk 📋</div>
        <div className="token-time-horizontal">4m ago</div>
        
        <div className="token-stats-horizontal">
          <div className="stat-row-horizontal">
            <span className="stat-value-horizontal">Market Cap: {marketCap}</span>
          </div>
        </div>

        {/* Barra de progreso horizontal */}
        <div className="progress-container-horizontal">
          <div className="progress-bar-horizontal">
            <div 
              className="progress-fill-horizontal" 
              style={{ width: `${progressValue}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Link>
  );
};

TarjetaProyectos.propTypes = {
  openOutline: PropTypes.string,
  starOutline: PropTypes.string,
  to: PropTypes.string,
};
