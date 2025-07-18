/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

export const Menu = ({ className }) => {
  return (
    <div className={`menu ${className}`}>
      <Link className="text-wrapper-21" to="/">
        Home
      </Link>

      <span className="menu-separator">|</span>

      <Link className="text-wrapper-22" to="/next">
        Next
      </Link>

      <span className="menu-separator">|</span>

      <Link className="text-wrapper-22" to="/vote">
        Vote
      </Link>

      <span className="menu-separator">|</span>

      <Link className="text-wrapper-22" to="/news">
        News
      </Link>

      <span className="menu-separator">|</span>

      <Link className="text-wrapper-22" to="/forum">
        Forum
      </Link>

      <span className="menu-separator">|</span>

      <Link className="text-wrapper-22" to="/create">
        Create
      </Link>

      <span className="menu-separator">|</span>

      <Link className="text-wrapper-22" to="/publish">
        Publish
      </Link>
    </div>
  );
};

Menu.propTypes = {
  className: PropTypes.string,
};
