import React from "react";
import { MenuTabla } from "../../components/MenuTabla";
import { Paginacion } from "../../components/Paginacion";
import { TarjetaProyectos } from "../../components/TarjetaProyectos";
import { TarjetaRanking } from "../../components/TarjetaRanking";
import "./style.css";

export const HomeNext = () => {
  return (
    <div className="home-next">
      <img className="img-4" alt="Heder" src="/img/heder-3.svg" />

      <div className="frame-66">
        <img
          className="fair-launches-the-2"
          alt="Fair launches the"
          src="/img/fair-launches-the-dev-gets-80-and-marketing-is-on-us.png"
        />

        <img
          className="no-need-for-a-2"
          alt="No need for a"
          src="/img/no-need-for-a-community-everyone-s-here-waiting-to-blow-up-you.png"
        />

        <img
          className="element-launches-a-month-2"
          alt="Element launches a month"
          src="/img/2-launches-a-month-only-the-best-takes-the-crown.png"
        />
      </div>

      <img
        className="img-4"
        alt="Frame logo isotipo"
        src="/img/frame-logo-isotipo.png"
      />

      <img className="baner-2" alt="Baner" src="/img/baner-1.png" />

      <div className="titulo-pagina-4" />

      <div className="frame-67">
        <TarjetaRanking
          className="tarjeta-ranking-instance"
          groupClassName="design-component-instance-node-2"
        />
        <TarjetaRanking
          className="tarjeta-ranking-5"
          groupClassName="design-component-instance-node-2"
        />
        <TarjetaRanking
          className="tarjeta-ranking-6"
          groupClassName="design-component-instance-node-2"
        />
      </div>

      <MenuTabla
        className="menu-tabla-2"
        img="/img/line-1-3.svg"
        line="/img/line-3-3.svg"
        line1="/img/line-3-3.svg"
        to1="/homeu47new"
        to2="/homeu47all"
      />
      <div className="frame-68">
        <div className="frame-69">
          <TarjetaProyectos
            groupClassName="design-component-instance-node-2"
            openOutline="/img/open-outline-1.svg"
            starOutline="/img/star-outline-7.svg"
            to="/homeu47detalletokenu47compra"
          />
          <TarjetaProyectos
            groupClassName="design-component-instance-node-2"
            openOutline="/img/open-outline-1.svg"
            starOutline="/img/star-outline-8.svg"
          />
        </div>

        <div className="frame-69">
          <TarjetaProyectos
            groupClassName="design-component-instance-node-2"
            openOutline="/img/open-outline-1.svg"
            starOutline="/img/star-outline-9.svg"
          />
          <TarjetaProyectos
            groupClassName="design-component-instance-node-2"
            openOutline="/img/open-outline-1.svg"
            starOutline="/img/star-outline-10.svg"
          />
        </div>

        <div className="frame-69">
          <TarjetaProyectos
            groupClassName="design-component-instance-node-2"
            openOutline="/img/open-outline-1.svg"
            starOutline="/img/star-outline-11.svg"
          />
          <TarjetaProyectos
            groupClassName="design-component-instance-node-2"
            openOutline="/img/open-outline-1.svg"
            starOutline="/img/star-outline-12.svg"
          />
        </div>

        <Paginacion
          className="paginacion-2"
          iconChevronRight="/img/icon-chevron-right-2.png"
          img="/img/icon-chevron-right-3.png"
        />
      </div>
    </div>
  );
};
