import React from "react";
import { Heder } from "../../components/Heder";
import { MenuTabla } from "../../components/MenuTabla";
import { Paginacion } from "../../components/Paginacion";
import { TarjetaProyectos } from "../../components/TarjetaProyectos";
import { TarjetaRanking } from "../../components/TarjetaRanking";
import "./style.css";

export const HomeNext = () => {
  return (
    <div className="home-next">
      <Heder className="heder-home" />

      {/* Título de la sección */}
      <div className="next-tokens-title">
        <span className="star-icon">⭐</span>
        <span className="title-text">Top 3 Next Tokens</span>
        <span className="star-icon">⭐</span>
      </div>

      <div className="frame-67">
        <div className="ranking-position">
          <TarjetaRanking
            className="tarjeta-ranking-2"
            tokenName="florkiño"
            tokenSymbol="flk"
            marketCap="Votos: 2"
            tokenImage="/img/image-4.png"
          />
          <div className="position-number position-2">2</div>
        </div>

        <div className="ranking-position">
          <TarjetaRanking
            className="tarjeta-ranking-3"
            tokenName="anto"
            tokenSymbol="ANT"
            marketCap="Votos: 4"
            tokenImage="/img/image-3.png"
          />
          <div className="position-number position-1">1</div>
        </div>

        <div className="ranking-position">
          <TarjetaRanking
            className="tarjeta-ranking-4"
            tokenName="nicolukas"
            tokenSymbol="NKL"
            marketCap="Votos: 1"
            tokenImage="/img/image-1.png"
          />
          <div className="position-number position-3">3</div>
        </div>
      </div>

      {/* Sección promocional */}
      <div className="promo-section">
        <p className="promo-text">
          From just $50, create your token with a free promo video and guaranteed exposure.
        </p>
        <button className="click-here-button">Click Here</button>
        <p className="promo-subtext">
          Launch your token for just $50 and go viral from day one
        </p>
        <p className="promo-details">
          Includes FREE promo video and official post on X. No hassle.
        </p>
      </div>

      {/* Título de la sección inferior */}
      <div className="next-tokens-bottom-title">
        <span className="star-icon">⭐</span>
        <span className="title-text">Next Tokens on Solana</span>
        <span className="star-icon">⭐</span>
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
            to="/homeu47detalletokenu47compra"
            tokenName="florkiño"
            tokenSymbol="flk"
            tokenImage="/img/image-4.png"
            marketCap="$22000"
            progress="12%"
            progressValue={12}
          />
          <TarjetaProyectos
            tokenName="anto"
            tokenSymbol="ANT"
            tokenImage="/img/image-3.png"
            marketCap="$35000"
            progress="28%"
            progressValue={28}
          />
        </div>

        <div className="frame-69">
          <TarjetaProyectos
            tokenName="nicolukas"
            tokenSymbol="NKL"
            tokenImage="/img/image-1.png"
            marketCap="$18000"
            progress="6%"
            progressValue={6}
          />
          <TarjetaProyectos
            tokenName="NEXT"
            tokenSymbol="NXT"
            tokenImage="/img/image-2.png"
            marketCap="$42000"
            progress="35%"
            progressValue={35}
          />
        </div>

        <div className="frame-69">
          <TarjetaProyectos
            tokenName="FUTURE"
            tokenSymbol="FUT"
            tokenImage="/img/image-5.png"
            marketCap="$15000"
            progress="9%"
            progressValue={9}
          />
          <TarjetaProyectos
            tokenName="MOON"
            tokenSymbol="MOON"
            tokenImage="/img/image-6.png"
            marketCap="$58000"
            progress="41%"
            progressValue={41}
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
