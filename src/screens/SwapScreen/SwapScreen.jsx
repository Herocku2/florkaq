import React from "react";
import { BanerMovil } from "../../components/BanerMovil";
import { Heder } from "../../components/Heder";
import { SwapForm } from "../../components/SwapForm/SwapForm";
import "./style.css";

export const SwapScreen = () => {
  return (
    <div className="swap-screen">
      <Heder className="heder-home" />

      <div className="titulo-pagina-3" />

      <BanerMovil
        className="baner-movil-3"
        frame="/img/frame-31-2.svg"
        groupClassName="baner-movil-4"
        groupClassNameOverride="baner-movil-4"
        imageWrapperClassName="baner-movil-4"
        imageWrapperClassNameOverride="baner-movil-4"
      />
      <div className="frame-64">
        <img
          className="rectangle-8"
          alt="Rectangle"
          src="/img/rectangle-2-1.svg"
        />

        <SwapForm />
      </div>

      <div className="frame-65">
        <div className="text-wrapper-43">About</div>

        <p className="koma-inu-the-most">
          Koma Inu – The Most Memeable Memecoin on BSC! Koma Inu is a dog-themed
          token built around community-driven decentralization and adoption.
          Powered by pure meme energy, $KOMA is created by the community, for
          the community. The cats had their time—now it&#39;s the dogs&#39; turn
          to lead and make BSC memecoins great again!.
        </p>
      </div>
    </div>
  );
};
