/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const TarjetaRanking = ({ className, groupClassName, text = "3" }) => {
  return (
    <div className={`tarjeta-ranking ${className}`}>
      <div className="frame-10">
        <div className="frame-11">
          <div className="element-wrapper">
            <div className="element">{text}</div>
          </div>
        </div>

        <div className="frame-12">
          <div className="frame-13">
            <div className={`image-wrapper ${groupClassName}`}>
              <img className="image-2" alt="Image" src="/img/image-3.png" />
            </div>
          </div>

          <div className="frame-14">
            <div className="frame-15">
              <div className="text-wrapper-6">AI Bonk Complex</div>
            </div>

            <div className="frame-16">
              <div className="text-wrapper-7">Complex</div>

              <div className="text-wrapper-8">just now</div>
            </div>
          </div>
        </div>

        <div className="frame-17">
          <div className="frame-18">
            <div className="frame-19">
              <div className="text-wrapper-9">MC:</div>

              <div className="text-wrapper-9">$12.1K</div>
            </div>
          </div>

          <div className="frame-20">
            <div className="frame-21">
              <div className="text-wrapper-10">+ 0.001 SOL</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TarjetaRanking.propTypes = {
  text: PropTypes.string,
};
