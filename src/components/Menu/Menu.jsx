/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

export const Menu = ({
  className,
  line = "/img/line-1-1.svg",
  img = "/img/line-2-1.svg",
  line1 = "/img/line-2-1.svg",
  line2 = "/img/line-2-1.svg",
  line3 = "/img/line-2-1.svg",
  line4 = "/img/line-2-1.svg",
  line5 = "/img/line-2-1.svg",
  to,
  to1,
  to2,
  to3,
  to4,
  to5,
}) => {
  return (
    <div className={`menu ${className}`}>
      <Link className="text-wrapper-21" to={to2}>
        Home
      </Link>

      <img className="line-2" alt="Line" src={line} />

      <Link className="text-wrapper-22" to={to}>
        Vote
      </Link>

      <img className="line-2" alt="Line" src={img} />

      <Link className="text-wrapper-22" to={to1}>
        Publish project
      </Link>

      <img className="line-2" alt="Line" src={line1} />

      <Link className="text-wrapper-22" to={to3}>
        Create token
      </Link>

      <img className="line-2" alt="Line" src={line2} />

      <Link className="text-wrapper-22" to={to4}>
        Swap
      </Link>

      <img className="line-2" alt="Line" src={line3} />

      <Link className="text-wrapper-22" to={to5}>
        news
      </Link>

      <img className="line-2" alt="Line" src={line4} />

      <div className="text-wrapper-23">Forum</div>

      <img className="line-2" alt="Line" src={line5} />
    </div>
  );
};

Menu.propTypes = {
  line: PropTypes.string,
  img: PropTypes.string,
  line1: PropTypes.string,
  line2: PropTypes.string,
  line3: PropTypes.string,
  line4: PropTypes.string,
  line5: PropTypes.string,
  to: PropTypes.string,
  to1: PropTypes.string,
  to2: PropTypes.string,
  to3: PropTypes.string,
  to4: PropTypes.string,
  to5: PropTypes.string,
};
