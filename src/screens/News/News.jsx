import React from "react";
import { BanerMovil } from "../../components/BanerMovil";
import "./style.css";

export const News = () => {
  return (
    <div className="news">
      <img className="heder-2" alt="Heder" src="/img/heder.svg" />

      <div className="titulo-pagina" />

      <BanerMovil
        className="baner-movil-instance"
        frame="/img/frame-31-1.svg"
        groupClassName="baner-movil-2"
        groupClassNameOverride="baner-movil-2"
        imageWrapperClassName="baner-movil-2"
        imageWrapperClassNameOverride="baner-movil-2"
      />
      <div className="frame-58">
        <div className="frame-59">
          <div className="text-wrapper-42">Marketing</div>

          <img
            className="rectangle-7"
            alt="Rectangle"
            src="/img/rectangle-17.png"
          />

          <img
            className="rectangle-7"
            alt="Rectangle"
            src="/img/rectangle-15.png"
          />

          <img
            className="rectangle-7"
            alt="Rectangle"
            src="/img/rectangle-16-2.png"
          />
        </div>

        <img className="line-4" alt="Line" src="/img/line-13.svg" />

        <div className="frame-59">
          <div className="text-wrapper-42">News</div>

          <img
            className="rectangle-7"
            alt="Rectangle"
            src="/img/rectangle-17-1.png"
          />

          <img
            className="rectangle-7"
            alt="Rectangle"
            src="/img/rectangle-15-1.png"
          />

          <img
            className="rectangle-7"
            alt="Rectangle"
            src="/img/rectangle-16.png"
          />
        </div>

        <img className="line-4" alt="Line" src="/img/line-13.svg" />

        <div className="frame-59">
          <div className="text-wrapper-42">Proximos lanzamientos</div>

          <img
            className="rectangle-7"
            alt="Rectangle"
            src="/img/rectangle-16-2.png"
          />

          <img
            className="rectangle-7"
            alt="Rectangle"
            src="/img/rectangle-15-2.png"
          />

          <img
            className="rectangle-7"
            alt="Rectangle"
            src="/img/rectangle-16-1.png"
          />
        </div>
      </div>
    </div>
  );
};
