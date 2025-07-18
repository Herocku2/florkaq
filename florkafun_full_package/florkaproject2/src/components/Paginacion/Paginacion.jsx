/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const Paginacion = ({
  className,
  iconChevronRight = "/img/icon-chevron-right.png",
  img = "/img/icon-chevron-right-1.png",
}) => {
  return (
    <div className={`paginacion ${className}`}>
      <img
        className="icon-chevron-right"
        alt="Icon chevron right"
        src={iconChevronRight}
      />

      <div className="element-de">1&nbsp;&nbsp;de&nbsp;&nbsp;10</div>

      <img className="icon-chevron-right" alt="Icon chevron right" src={img} />
    </div>
  );
};

Paginacion.propTypes = {
  iconChevronRight: PropTypes.string,
  img: PropTypes.string,
};
