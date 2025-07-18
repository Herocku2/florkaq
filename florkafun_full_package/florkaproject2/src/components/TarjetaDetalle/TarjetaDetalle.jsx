/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const TarjetaDetalle = ({
  className,
  earthOutline = "/img/earth-outline.svg",
  xLogoSvgClassName,
  symbolSvgClassName,
}) => {
  return (
    <div className={`tarjeta-detalle ${className}`}>
      <div className="make-sure-the-wrapper">
        <p className="make-sure-the">
          <span className="text-wrapper-25">Make sure the website in</span>

          <span className="text-wrapper-26"> meteora</span>
        </p>
      </div>

      <div className="frame-44">
        <div className="text-wrapper-27">Dogecoin</div>

        <div className="frame-45">
          <img
            className="earth-outline"
            alt="Earth outline"
            src={earthOutline}
          />

          <div className={`x-logo-svg ${xLogoSvgClassName}`} />

          <div className={`symbol-svg ${symbolSvgClassName}`} />
        </div>
      </div>

      <div className="frame-46">
        <div className="frame-47">
          <div className="text-wrapper-28">Status</div>

          <div className="text-wrapper-29">Ended</div>
        </div>

        <div className="frame-47">
          <div className="text-wrapper-28">Sale type</div>

          <div className="text-wrapper-30">Whitelist Only</div>
        </div>

        <div className="frame-47">
          <div className="text-wrapper-28">Unsold tokens</div>

          <div className="text-wrapper-31">200 Doge</div>
        </div>

        <div className="frame-47">
          <div className="text-wrapper-32">Claim time:</div>

          <div className="text-wrapper-31">2024.10.09 15:54 (UTC)</div>
        </div>

        <div className="frame-47">
          <div className="text-wrapper-28">Total contributors</div>

          <div className="text-wrapper-31">256</div>
        </div>
      </div>
    </div>
  );
};

TarjetaDetalle.propTypes = {
  earthOutline: PropTypes.string,
};
