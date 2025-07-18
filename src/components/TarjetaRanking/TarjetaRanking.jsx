/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const TarjetaRanking = ({ 
  className, 
  groupClassName, 
  text = "3",
  tokenName = "Token Name",
  tokenSymbol = "TKN", 
  marketCap = "$0",
  tokenImage = "/img/image-3.png"
}) => {
  return (
    <div className={`tarjeta-ranking ${className}`}>
      <div className="frame-10">
        {/* Imagen del token en la parte superior */}
        <div className="token-image-container">
          <img className="token-image" alt={tokenName} src={tokenImage} />
        </div>

        {/* Nombre del token */}
        <div className="token-name">
          {tokenName}
        </div>

        {/* Símbolo del token */}
        <div className="token-symbol">
          {tokenSymbol}
        </div>

        {/* Market Cap */}
        <div className="market-cap">
          MC: {marketCap}
        </div>

        {/* Botón View Details */}
        <div className="view-details-button">
          View Details
        </div>
      </div>
    </div>
  );
};

TarjetaRanking.propTypes = {
  text: PropTypes.string,
};
