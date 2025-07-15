import React from "react";
import { BanerMovil } from "../../components/BanerMovil";
import { Swap } from "../../components/Swap";
import "./style.css";

export const SwapScreen = () => {
  return (
    <div className="swap-screen">
      <img className="heder-3" alt="Heder" src="/img/heder-2.svg" />

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

        <Swap
          className="swap-instance"
          divClassName="swap-5"
          divClassNameOverride="swap-5"
          frameClassName="swap-2"
          frameClassNameOverride="swap-2"
          frameWrapperClassName="swap-8"
          group="/img/group-12-2.png"
          group1="/img/group-12-6.png"
          group2="/img/group-12-7.png"
          groupClassName="swap-2"
          groupClassName1="swap-2"
          groupClassName2="swap-2"
          groupClassNameOverride="swap-2"
          groupWrapperClassName="swap-2"
          groupWrapperClassNameOverride="swap-2"
          img="/img/group-12-5.png"
          imgClassName="swap-7"
          imgClassNameOverride="swap-2"
          instandClassName="swap-4"
          overlapClassName="swap-3"
          overlapClassNameOverride="swap-3"
          overlapGroupClassName="swap-3"
          overlapWrapperClassName="swap-6"
        />
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
