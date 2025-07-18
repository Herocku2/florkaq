import React from "react";
import { Heder } from "../../components/Heder";
import { MenuTabla } from "../../components/MenuTabla";
import { Paginacion } from "../../components/Paginacion";
import { TarjetaProyectos } from "../../components/TarjetaProyectos";
import { TarjetaRanking } from "../../components/TarjetaRanking";
import "./style.css";

export const HomeAll = () => {
  return (
    <div className="home-all">
      <Heder className="heder-home" />

      <div className="frame-60">
        <img
          className="fair-launches-the"
          alt="Fair launches the"
          src="/img/fair-launches-the-dev-gets-80-and-marketing-is-on-us.png"
        />

        <img
          className="no-need-for-a"
          alt="No need for a"
          src="/img/no-need-for-a-community-everyone-s-here-waiting-to-blow-up-you.png"
        />

        <img
          className="element-launches-a-month"
          alt="Element launches a month"
          src="/img/2-launches-a-month-only-the-best-takes-the-crown.png"
        />
      </div>

      <img
        className="img-3"
        alt="Frame logo isotipo"
        src="/img/frame-logo-isotipo.png"
      />

      <img className="baner" alt="Baner" src="/img/baner-1.png" />

      <div className="titulo-pagina-2" />

      <div className="frame-61">
        <TarjetaRanking
          className="tarjeta-ranking-2"
          tokenName="Shina inu"
          tokenSymbol="SBH"
          marketCap="$150000"
          tokenImage="/img/image-4.png"
        />

        <TarjetaRanking
          className="tarjeta-ranking-3"
          tokenName="CAt"
          tokenSymbol="CAT"
          marketCap="$20000"
          tokenImage="/img/image-3.png"
        />

        <TarjetaRanking
          className="tarjeta-ranking-4"
          tokenName="florka"
          tokenSymbol="FLK"
          marketCap="$25000"
          tokenImage="/img/image-1.png"
        />
      </div>

      <MenuTabla
        className="menu-tabla-1"
        divClassName="menu-tabla-instance"
        divClassNameOverride="menu-tabla-1-instance"
        img="/img/line-2-3.svg"
        line="/img/line-1-3.svg"
        line1="/img/line-3-3.svg"
        to="/homeu47next"
        to1="/homeu47new"
      />
      <div className="frame-62">
        <div className="frame-63">
          <TarjetaProyectos
            groupClassName="tarjeta-proyectos-instance"
            openOutline="/img/open-outline-1.svg"
            starOutline="/img/star-outline-1.svg"
            to="/homeu47detalletokenu47compra"
          />
          <TarjetaProyectos
            groupClassName="tarjeta-proyectos-instance"
            openOutline="/img/open-outline-1.svg"
            starOutline="/img/star-outline-2.svg"
          />
        </div>

        <div className="frame-63">
          <TarjetaProyectos
            groupClassName="tarjeta-proyectos-instance"
            openOutline="/img/open-outline-1.svg"
            starOutline="/img/star-outline-3.svg"
          />
          <TarjetaProyectos
            groupClassName="tarjeta-proyectos-instance"
            openOutline="/img/open-outline-1.svg"
            starOutline="/img/star-outline-4.svg"
          />
        </div>

        <div className="frame-63">
          <TarjetaProyectos
            groupClassName="tarjeta-proyectos-instance"
            openOutline="/img/open-outline-1.svg"
            starOutline="/img/star-outline-5.svg"
          />
          <TarjetaProyectos
            groupClassName="tarjeta-proyectos-instance"
            openOutline="/img/open-outline-1.svg"
            starOutline="/img/star-outline-6.svg"
          />
        </div>

        <Paginacion
          className="paginacion-instance"
          iconChevronRight="/img/icon-chevron-right-2.png"
          img="/img/icon-chevron-right-3.png"
        />
      </div>
    </div>
  );
};
