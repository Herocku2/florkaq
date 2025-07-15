/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const BanerMovil = ({
  className,
  frame = "/img/frame-31.svg",
  groupClassName,
  groupClassNameOverride,
  imageWrapperClassName,
  imageWrapperClassNameOverride,
}) => {
  return (
    <div className={`baner-movil ${className}`}>
      <div className="frame-wrapper">
        <img className="img" alt="Frame" src={frame} />
      </div>

      <div className="frame-2">
        <div className="frame-3">
          <div className="frame-4">
            <div className="group-wrapper">
              <div className={`group ${groupClassName}`}>
                <img className="image" alt="Image" src="/img/image.png" />
              </div>
            </div>

            <div className="frame-5">
              <div className="frame-6">
                <div className="text-wrapper">AI Bonk Complex</div>
              </div>

              <div className="frame-7">
                <div className="text-wrapper-2">MC:</div>

                <div className="text-wrapper-3">0.003 Sol</div>
              </div>
            </div>
          </div>
        </div>

        <div className="frame-3">
          <div className="frame-4">
            <div className="group-wrapper">
              <div className={`group ${groupClassNameOverride}`}>
                <img className="image" alt="Image" src="/img/image-1.png" />
              </div>
            </div>

            <div className="frame-5">
              <div className="frame-8">
                <div className="text-wrapper-4">AI Bonk Complex</div>
              </div>

              <div className="frame-9">
                <div className="text-wrapper-2">MC:</div>

                <div className="text-wrapper-3">0.003 Sol</div>
              </div>
            </div>
          </div>
        </div>

        <div className="frame-3">
          <div className="frame-4">
            <div className="group-wrapper">
              <div className={`group ${imageWrapperClassName}`}>
                <img className="image" alt="Image" src="/img/image-1.png" />
              </div>
            </div>

            <div className="frame-5">
              <div className="frame-8">
                <div className="text-wrapper-5">AI Bonk Complex</div>
              </div>

              <div className="frame-9">
                <div className="text-wrapper-2">MC:</div>

                <div className="text-wrapper-3">0.003 Sol</div>
              </div>
            </div>
          </div>
        </div>

        <div className="frame-3">
          <div className="frame-4">
            <div className="group-wrapper">
              <div className={`group ${imageWrapperClassNameOverride}`}>
                <img className="image" alt="Image" src="/img/image-1.png" />
              </div>
            </div>

            <div className="frame-5">
              <div className="frame-8">
                <div className="text-wrapper-4">AI Bonk Complex</div>
              </div>

              <div className="frame-9">
                <div className="text-wrapper-2">Vol:</div>

                <div className="text-wrapper-3">35%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

BanerMovil.propTypes = {
  frame: PropTypes.string,
};
