import React from "react";
import { Link } from "react-router-dom";
import { BanerMovil } from "../../components/BanerMovil";
import "./style.css";

export const Publish = () => {
  return (
    <div className="publish">
      <img className="heder-6" alt="Heder" src="/img/heder-7.svg" />

      <div className="titulo-pagina-9" />

      <BanerMovil
        className="baner-movil-9"
        frame="/img/frame-31-6.svg"
        groupClassName="baner-movil-10"
        groupClassNameOverride="baner-movil-10"
        imageWrapperClassName="baner-movil-10"
        imageWrapperClassNameOverride="baner-movil-10"
      />
      <div className="frame-118">
        <div className="frame-119">
          <div className="frame-120">
            <div className="frame-121">
              <div className="text-wrapper-112">1</div>
            </div>
          </div>

          <img className="line-6" alt="Line" src="/img/line-10.svg" />

          <div className="frame-120">
            <div className="frame-122">
              <div className="text-wrapper-113">2</div>
            </div>
          </div>

          <img className="line-6" alt="Line" src="/img/line-11.svg" />

          <div className="frame-120">
            <div className="frame-123">
              <div className="text-wrapper-114">3</div>
            </div>
          </div>
        </div>

        <div className="frame-124">
          <div className="frame-125">
            <div className="frame-126">
              <div className="text-wrapper-115">Logo del Token:</div>

              <img
                className="rectangle-15"
                alt="Rectangle"
                src="/img/rectangle-12-1.svg"
              />
            </div>

            <div className="frame-127">
              <div className="frame-128">
                <div className="frame-129">
                  <div className="text-wrapper-115">Nombre del Token:</div>

                  <div className="rectangle-16" />

                  <p className="text-wrapper-116">
                    Nombre completo del token que se va a emitir.
                  </p>
                </div>

                <div className="frame-129">
                  <div className="text-wrapper-115">Símbolo del Token:</div>

                  <div className="rectangle-16" />

                  <p className="text-wrapper-116">
                    Abreviatura o ticker del token (ej. BTC, ETH, DOGE).
                  </p>
                </div>
              </div>

              <div className="frame-128">
                <div className="frame-129">
                  <div className="text-wrapper-115">Tipo de Token:</div>

                  <div className="rectangle-16" />

                  <p className="text-wrapper-116">
                    Especificar si es un token ERC-20, BEP-20, o en otra cadena
                    compatible (ERC-721, ERC-1155, etc.).
                  </p>
                </div>

                <div className="frame-130">
                  <div className="text-wrapper-115">
                    Cantidad Total de Tokens:
                  </div>

                  <div className="rectangle-16" />

                  <p className="text-wrapper-116">
                    Número total de tokens que se emitirán.
                  </p>
                </div>
              </div>

              <div className="frame-128">
                <div className="frame-129">
                  <p className="text-wrapper-115">
                    Cantidad de Tokens en Circulación Inicial:
                  </p>

                  <div className="rectangle-16" />

                  <p className="text-wrapper-116">
                    Cuántos tokens estarán disponibles inicialmente en
                    circulación.
                  </p>
                </div>

                <div className="frame-130">
                  <div className="text-wrapper-115">Decimal de Token:</div>

                  <div className="rectangle-16" />

                  <p className="text-wrapper-116">
                    El número de decimales que el token podrá tener (ej. 18
                    decimales en Ethereum).
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="frame-131">
            <div className="frame-132">
              <div className="frame-133">
                <div className="text-wrapper-115">Descripción del Token:</div>

                <div className="rectangle-17" />

                <p className="text-wrapper-116">
                  {" "}
                  Breve descripción sobre el propósito del token y la utilidad
                  dentro de la plataforma o ecosistema..
                </p>
              </div>
            </div>
          </div>

          <Link className="frame-134" to="/publish2">
            <div className="text-wrapper-117">Next</div>
          </Link>
        </div>
      </div>
    </div>
  );
};
