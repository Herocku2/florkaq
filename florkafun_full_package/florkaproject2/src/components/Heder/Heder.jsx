/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { Logo } from "../../icons/Logo";
import { Boton } from "../Boton";
import { Isotipo } from "../Isotipo";
import { Menu } from "../Menu";
import "./style.css";

export const Heder = ({
  className,
  logoColor = "url(#pattern0_2011_971)",
  menuLine = "/img/line-2.svg",
  menuImg = "/img/line-1.svg",
  menuLine1 = "/img/line-2.svg",
  menuLine2 = "/img/line-2.svg",
  menuLine3 = "/img/line-2.svg",
  menuLine4 = "/img/line-2.svg",
  menuLine5 = "/img/line-2.svg",
  to,
  to1,
  to2,
  to3,
  to4,
  to5,
}) => {
  return (
    <div className={`heder ${className}`}>
      <div className="frame">
        <Logo className="logo-3" color={logoColor} />
        <Isotipo className="design-component-instance-node" />
      </div>

      <div className="div">
        <Menu
          className="design-component-instance-node"
          img={menuLine1}
          line={menuImg}
          line1={menuLine4}
          line2={menuLine5}
          line3={menuLine}
          line4={menuLine2}
          line5={menuLine3}
          to={to}
          to1={to1}
          to2={to2}
          to3={to4}
          to4={to3}
          to5={to5}
        />
        <Boton className="design-component-instance-node" />
      </div>
    </div>
  );
};

Heder.propTypes = {
  logoColor: PropTypes.string,
  menuLine: PropTypes.string,
  menuImg: PropTypes.string,
  menuLine1: PropTypes.string,
  menuLine2: PropTypes.string,
  menuLine3: PropTypes.string,
  menuLine4: PropTypes.string,
  menuLine5: PropTypes.string,
  to: PropTypes.string,
  to1: PropTypes.string,
  to2: PropTypes.string,
  to3: PropTypes.string,
  to4: PropTypes.string,
  to5: PropTypes.string,
};
