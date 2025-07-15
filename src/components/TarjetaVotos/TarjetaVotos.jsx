/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

export const TarjetaVotos = ({ className, line = "/img/line-8-1.svg", to }) => {
  return (
    <Link className={`tarjeta-votos ${className}`} to={to}>
      <div className="group-7">
        <div className="overlap-group-2">
          <div className="rectangle-5" />

          <img
            className="rectangle-6"
            alt="Rectangle"
            src="/img/rectangle-11.png"
          />
        </div>
      </div>

      <div className="frame-48">
        <div className="frame-49">
          <div className="group-8">
            <img className="image-4" alt="Image" src="/img/image-4.png" />
          </div>
        </div>

        <div className="frame-50">
          <div className="frame-51">
            <div className="text-wrapper-33">AI Bonk Complex</div>
          </div>

          <div className="text-wrapper-34">Complex</div>

          <div className="text-wrapper-35">6M a go</div>
        </div>

        <div className="frame-52">
          <div className="frame-53">
            <div className="frame-54">
              <div className="text-wrapper-36">Mcap:</div>

              <div className="text-wrapper-37">+ 0,5%</div>
            </div>

            <div className="text-wrapper-38">$ 4.680</div>
          </div>

          <div className="frame-55">
            <div className="frame-54">
              <div className="text-wrapper-39">24 H vol:</div>

              <div className="text-wrapper-37">+ 0,5%</div>
            </div>

            <div className="text-wrapper-38">$ 4.680</div>
          </div>
        </div>

        <img className="line-3" alt="Line" src={line} />

        <div className="frame-56">
          <div className="text-wrapper-40">6M a go</div>
        </div>

        <div className="frame-57">
          <div className="text-wrapper-41">Vote</div>
        </div>
      </div>
    </Link>
  );
};

TarjetaVotos.propTypes = {
  line: PropTypes.string,
  to: PropTypes.string,
};
