/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Boton } from "../Boton";
import { Menu } from "../Menu";
import "./style.css";

export const Heder = ({
  className,
  logoColor = "url(#pattern0_2011_971)",
}) => {
  return (
    <div className={`heder ${className}`}>
      <div className="frame">
        <Link to="/" className="logo-container">
          <div className="flower-icon">🌸</div>
          <span className="logo-text">Florka Fun</span>
          <span className="beta-badge">BETA</span>
        </Link>
      </div>

      <div className="div">
        <Menu className="design-component-instance-node" />
        <Boton className="design-component-instance-node" />
      </div>
    </div>
  );
};

Heder.propTypes = {
  className: PropTypes.string,
  logoColor: PropTypes.string,
};
