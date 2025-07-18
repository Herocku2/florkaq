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
}) => {
  return (
    <Link className="tarjeta-proyectos" to={to}>
      <div className="frame-22">
        <div className="frame-23">
          <div className="frame-24">
            <div className={`img-wrapper ${groupClassName}`}>
              <img className="image-3" alt="Image" src="/img/image-4.png" />
            </div>
          </div>

          <div className="frame-25">
            <div className="frame-26">
              <div className="text-wrapper-13">AI Bonk Complex</div>
            </div>

            <div className="frame-27">
              <div className="text-wrapper-14">Complex</div>

              <div className="text-wrapper-15">just now</div>
            </div>
          </div>
        </div>

        <div className="frame-28">
          <img className="img-2" alt="Open outline" src={openOutline} />

          <img className="img-2" alt="Star outline" src={starOutline} />
        </div>
      </div>

      <div className="frame-29">
        <div className="frame-30">
          <div className="frame-31">
            <div className="text-wrapper-16">MC:</div>

            <div className="text-wrapper-16">$12.1K</div>
          </div>
        </div>

        <div className="frame-32">
          <div className="frame-33">
            <div className="text-wrapper-17">+ 0.001 SOL</div>
          </div>
        </div>
      </div>

      <div className="frame-34">
        <div className="frame-35">
          <div className="frame-36">
            <div className="text-wrapper-16">Progres</div>

            <div className="text-wrapper-16">50%</div>
          </div>
        </div>

        <div className="rectangle-wrapper">
          <div className="rectangle" />
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
