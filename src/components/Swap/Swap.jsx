/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const Swap = ({
  className,
  groupClassName,
  overlapGroupClassName,
  instandClassName,
  groupClassNameOverride,
  overlapClassName,
  divClassName,
  overlapWrapperClassName,
  overlapClassNameOverride,
  divClassNameOverride,
  frameClassName,
  imgClassName,
  group = "/img/group-12.png",
  frameClassNameOverride,
  imgClassNameOverride,
  img = "/img/group-12-3.png",
  groupWrapperClassName,
  groupClassName1,
  group1 = "/img/group-12-4.png",
  frameWrapperClassName,
  groupWrapperClassNameOverride,
  groupClassName2,
  group2 = "/img/group-12-1.png",
}) => {
  return (
    <div className={`swap ${className}`}>
      <div className="frame-37">
        <div className={`overlap-group-wrapper ${groupClassName}`}>
          <div className={`overlap-group ${overlapGroupClassName}`}>
            <img
              className={`instand ${instandClassName}`}
              alt="Instand"
              src="/img/instand-1.png"
            />
          </div>
        </div>

        <div className={`overlap-wrapper ${groupClassNameOverride}`}>
          <div className={`overlap ${overlapClassName}`}>
            <div className={`text-wrapper-18 ${divClassName}`}>Tigger</div>
          </div>
        </div>

        <div className={`group-2 ${overlapWrapperClassName}`}>
          <div className={`overlap-2 ${overlapClassNameOverride}`}>
            <div className={`text-wrapper-19 ${divClassNameOverride}`}>
              Holdings
            </div>
          </div>
        </div>
      </div>

      <div className="frame-38">
        <div className={`frame-39 ${frameClassName}`}>
          <img className={`group-3 ${imgClassName}`} alt="Group" src={group} />
        </div>

        <div className={`frame-39 ${frameClassNameOverride}`}>
          <img
            className={`group-4 ${imgClassNameOverride}`}
            alt="Group"
            src={img}
          />
        </div>
      </div>

      <div className="frame-38">
        <div className={`frame-40 ${groupWrapperClassName}`}>
          <img
            className={`group-5 ${groupClassName1}`}
            alt="Group"
            src={group1}
          />
        </div>
      </div>

      <div className={`frame-41 ${frameWrapperClassName}`}>
        <div className={`frame-42 ${groupWrapperClassNameOverride}`}>
          <img
            className={`group-6 ${groupClassName2}`}
            alt="Group"
            src={group2}
          />
        </div>
      </div>
    </div>
  );
};

Swap.propTypes = {
  group: PropTypes.string,
  img: PropTypes.string,
  group1: PropTypes.string,
  group2: PropTypes.string,
};
