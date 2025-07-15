import React from "react";
import { BanerDetelleToken } from "../../components/BanerDetelleToken";
import { BanerMovil } from "../../components/BanerMovil";
import { TarjetaDetalle } from "../../components/TarjetaDetalle";
import "./style.css";

export const VoteDetalletoken = () => {
  return (
    <div className="vote-detalletoken">
      <img className="heder-5" alt="Heder" src="/img/heder-6.svg" />

      <div className="titulo-pagina-8" />

      <BanerMovil
        className="baner-movil-7"
        frame="/img/frame-31-5.svg"
        groupClassName="baner-movil-8"
        groupClassNameOverride="baner-movil-8"
        imageWrapperClassName="baner-movil-8"
        imageWrapperClassNameOverride="baner-movil-8"
      />
      <div className="frame-110">
        <BanerDetelleToken />
        <TarjetaDetalle
          className="tarjeta-detalle-2"
          earthOutline="/img/earth-outline-2.svg"
          symbolSvgClassName="tarjeta-detalle-4"
          xLogoSvgClassName="tarjeta-detalle-3"
        />
      </div>

      <div className="frame-111">
        <div className="frame-112">
          <div className="text-wrapper-94">About</div>

          <p className="text-wrapper-95">
            Koma Inu – The Most Memeable Memecoin on BSC! Koma Inu is a
            dog-themed token built around community-driven decentralization and
            adoption. Powered by pure meme energy, $KOMA is created by the
            community, for the community. The cats had their time—now it&#39;s
            the dogs&#39; turn to lead and make BSC memecoins great again!.
          </p>

          <div className="text-wrapper-96">Token</div>

          <div className="frame-113">
            <div className="frame-114">
              <div className="text-wrapper-97">Address</div>

              <a
                className="text-wrapper-98"
                href="https://bscscan.com/address/0xd5eaAaC47bD1993d661bc087E15dfb079a7f3C19"
                rel="noopener noreferrer"
                target="_blank"
              >
                0xd5eaAaC47bD1993d661bc087E15dfb079a7f3C19
              </a>
            </div>

            <div className="frame-114">
              <div className="text-wrapper-97">Name</div>

              <div className="text-wrapper-99">Koma Inu</div>
            </div>

            <div className="frame-114">
              <div className="text-wrapper-100">Symbol</div>

              <div className="text-wrapper-101">KOMA</div>
            </div>

            <div className="frame-114">
              <div className="text-wrapper-97">Decimals</div>

              <div className="text-wrapper-99">18</div>
            </div>

            <div className="frame-114">
              <div className="text-wrapper-102">Total supply</div>

              <div className="text-wrapper-103">1,000,000,000</div>
            </div>
          </div>

          <div className="text-wrapper-96">Pool info</div>

          <div className="frame-113">
            <div className="frame-114">
              <div className="text-wrapper-104">Manual Listing</div>

              <p className="text-wrapper-105">
                Liquidity will not be automatically added!
              </p>
            </div>

            <div className="frame-114">
              <div className="text-wrapper-97">Address</div>

              <div className="text-wrapper-106">
                0x497CAc1A0b1458fA900D1e9C73071Ac0ed975853
              </div>
            </div>

            <div className="frame-114">
              <div className="text-wrapper-104">Tokens For Presale</div>

              <p className="text-wrapper-107">
                Do not send BNB to the pool address
              </p>
            </div>

            <div className="frame-114">
              <div className="text-wrapper-97">SoftCap</div>

              <div className="text-wrapper-99">150,000,000 KOMA</div>
            </div>

            <div className="frame-114">
              <div className="text-wrapper-108">HardCap</div>

              <div className="text-wrapper-103">150 BNB</div>
            </div>

            <div className="frame-114">
              <div className="text-wrapper-108">Presale rate</div>

              <div className="text-wrapper-103">300 BNB</div>
            </div>

            <div className="frame-114">
              <div className="text-wrapper-108">Start time</div>

              <p className="text-wrapper-103">1 BNB = 500,000 KOMA</p>
            </div>

            <div className="frame-114">
              <div className="text-wrapper-108">Unsold tokens</div>

              <div className="text-wrapper-103">Refund</div>
            </div>

            <div className="frame-114">
              <div className="text-wrapper-108">Liquidity percent</div>

              <div className="text-wrapper-109">(Manual Listing)</div>
            </div>
          </div>
        </div>

        <div className="frame-115">
          <div className="text-wrapper-110">Newsletters</div>

          <p className="text-wrapper-95">
            Sign up our mailing list to receive our new presales, features, tips
            and reviews for next 100x projects
          </p>

          <div className="frame-116">
            <div className="text-wrapper-110">Email</div>

            <div className="rectangle-14" />

            <div className="frame-117">
              <div className="text-wrapper-111">Subscribe</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
