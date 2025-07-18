/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

export const Boton = ({ className }) => {
  return (
    <Link to="/auth" className={`boton ${className}`}>
      <div className="text-wrapper-24">Get Started</div>
    </Link>
  );
};
