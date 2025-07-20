import React from "react";
import { Heder } from "../../components/Heder";
import { MenuTabla } from "../../components/MenuTabla";
import { Paginacion } from "../../components/Paginacion";
import { TarjetaProyectos } from "../../components/TarjetaProyectos";
import { TarjetaRanking } from "../../components/TarjetaRanking";
import "./style.css";

export const HomeNew = () => {
  return (
    <div className="home-new">
      <Heder className="heder-home" />

      <div className="frame-70">
        <img
          className="fair-launches-the-3"
          alt="Fair launches the"
          src="/img/fair-launches-the-dev-gets-80-and-marketing-is-on-us.png"
        />

        <img
          className="no-need-for-a-3"
          alt="No need for a"
          src="/img/no-need-for-a-community-everyone-s-here-waiting-to-blow-up-you.png"
        />

        <img
          className="element-launches-a-month-3"
          alt="Element launches a month"
          src="/img/2-launches-a-month-only-the-best-takes-the-crown.png"
        />
      </div>

      <img
        className="img-5"
        alt="Frame logo isotipo"
        src="/img/frame-logo-isotipo.png"
      />

      <img className="baner-3" alt="Baner" src="/img/baner1-2.png" />

      <div className="titulo-pagina-5" />

      <div className="frame-71">
        <TarjetaRanking
          className="tarjeta-ranking-7"
          tokenName="Shina inu"
          tokenSymbol="SBH"
          marketCap="$150000"
          tokenImage="/img/image-4.png"
        />

        <TarjetaRanking
          className="tarjeta-ranking-8"
          tokenName="CAt"
          tokenSymbol="CAT"
          marketCap="$20000"
          tokenImage="/img/image-3.png"
        />

        <TarjetaRanking
          className="tarjeta-ranking-9"
          tokenName="florka"
          tokenSymbol="FLK"
          marketCap="$25000"
          tokenImage="/img/image-1.png"
        />
      </div>

      <MenuTabla
        className="menu-tabla-4"
        divClassName1="menu-tabla-3"
        divClassNameOverride="menu-tabla-5"
        img="/img/line-2-3.svg"
        line="/img/line-3-3.svg"
        line1="/img/line-1-3.svg"
        text="New"
        to="/homeu47next"
        to2="/homeu47all"
      />
      <div className="frame-72">
        <div className="frame-73">
          <TarjetaProyectos
            to="/homeu47detalletokenu47compra"
            tokenName="CAT"
            tokenSymbol="CAT"
            tokenImage="/img/image-3.png"
            marketCap="$20000"
            progress="15%"
            progressValue={15}
          />
          <TarjetaProyectos
            tokenName="Shina inu"
            tokenSymbol="SBH"
            tokenImage="/img/image-4.png"
            marketCap="$150000"
            progress="4%"
            progressValue={4}
          />
        </div>

        <div className="frame-73">
          <TarjetaProyectos
            tokenName="florka"
            tokenSymbol="FLK"
            tokenImage="/img/image-1.png"
            marketCap="$25000"
            progress="18%"
            progressValue={18}
          />
          <TarjetaProyectos
            tokenName="DOGE"
            tokenSymbol="DOGE"
            tokenImage="/img/image-2.png"
            marketCap="$45000"
            progress="32%"
            progressValue={32}
          />
        </div>

        <div className="frame-73">
          <TarjetaProyectos
            tokenName="PEPE"
            tokenSymbol="PEPE"
            tokenImage="/img/image-5.png"
            marketCap="$12000"
            progress="8%"
            progressValue={8}
          />
          <TarjetaProyectos
            tokenName="BONK"
            tokenSymbol="BONK"
            tokenImage="/img/image-6.png"
            marketCap="$67000"
            progress="25%"
            progressValue={25}
          />
        </div>

        <Paginacion
          className="paginacion-3"
          iconChevronRight="/img/icon-chevron-right-2.png"
          img="/img/icon-chevron-right-3.png"
        />
      </div>
    </div>
  );
};
