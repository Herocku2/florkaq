import React from "react";
import { BanerMovil } from "../../components/BanerMovil";
import { Heder } from "../../components/Heder";
import { Paginacion } from "../../components/Paginacion";
import { TarjetaRanking } from "../../components/TarjetaRanking";
import { TarjetaVotos } from "../../components/TarjetaVotos";
import "./style.css";

export const Vote = () => {
  return (
    <div className="vote">
      <Heder
        className="heder-7"
        logoColor="url(#pattern0_2089_1302)"
        menuImg="/img/line-1-7.svg"
        menuLine="/img/line-2-7.svg"
        menuLine1="/img/line-2-7.svg"
        menuLine2="/img/line-2-7.svg"
        menuLine3="/img/line-2-7.svg"
        menuLine4="/img/line-2-7.svg"
        menuLine5="/img/line-2-7.svg"
        to1="/publish1"
        to2="/homeu47all"
        to3="/swap"
        to4="/create1"
        to5="/news"
      />
      <div className="titulo-pagina-10" />

      <div className="frame-135">
        <TarjetaRanking
          className="tarjeta-ranking-10"
          groupClassName="design-component-instance-node-3"
          text="2"
        />
        <TarjetaRanking
          className="tarjeta-ranking-11"
          groupClassName="design-component-instance-node-3"
          text="1"
        />
        <TarjetaRanking
          className="tarjeta-ranking-12"
          groupClassName="design-component-instance-node-3"
          text="3"
        />
      </div>

      <BanerMovil
        className="design-component-instance-node-4"
        frame="/img/frame-31-7.svg"
        groupClassName="design-component-instance-node-3"
        groupClassNameOverride="design-component-instance-node-3"
        imageWrapperClassName="design-component-instance-node-3"
        imageWrapperClassNameOverride="design-component-instance-node-3"
      />
      <div className="frame-136">
        <TarjetaVotos
          className="design-component-instance-node-4"
          line="/img/line-8-2.svg"
          to="/voteu47detalletokenu47vista"
        />
        <TarjetaVotos
          className="design-component-instance-node-4"
          line="/img/line-8-3.svg"
          to="/voteu47detalletokenu47vista"
        />
        <TarjetaVotos
          className="design-component-instance-node-4"
          line="/img/line-8-4.svg"
          to="/voteu47detalletokenu47vista"
        />
      </div>

      <div className="frame-137">
        <TarjetaVotos
          className="design-component-instance-node-4"
          line="/img/line-8-5.svg"
          to="/voteu47detalletokenu47vista"
        />
        <TarjetaVotos
          className="design-component-instance-node-4"
          line="/img/line-8-6.svg"
          to="/voteu47detalletokenu47vista"
        />
        <TarjetaVotos
          className="design-component-instance-node-4"
          line="/img/line-8-7.svg"
          to="/voteu47detalletokenu47vista"
        />
      </div>

      <Paginacion
        className="paginacion-4"
        iconChevronRight="/img/icon-chevron-right-8.png"
        img="/img/icon-chevron-right-9.png"
      />
    </div>
  );
};
