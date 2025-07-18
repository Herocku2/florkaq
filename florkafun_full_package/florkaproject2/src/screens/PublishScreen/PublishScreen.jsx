import React from "react";
import { Link } from "react-router-dom";
import { BanerMovil } from "../../components/BanerMovil";
import "./style.css";

export const PublishScreen = () => {
  return (
    <div className="publish-screen">
      <img className="heder-8" alt="Heder" src="/img/heder-8.svg" />

      <div className="titulo-pagina-11" />

      <BanerMovil
        className="baner-movil-11"
        frame="/img/frame-31-8.svg"
        groupClassName="baner-movil-12"
        groupClassNameOverride="baner-movil-12"
        imageWrapperClassName="baner-movil-12"
        imageWrapperClassNameOverride="baner-movil-12"
      />
      <div className="frame-138">
        <div className="frame-139">
          <div className="frame-140">
            <div className="frame-141">
              <div className="text-wrapper-118">1</div>
            </div>
          </div>

          <img className="line-7" alt="Line" src="/img/line-10.svg" />

          <div className="frame-140">
            <div className="frame-142">
              <div className="text-wrapper-119">2</div>
            </div>
          </div>

          <img className="line-7" alt="Line" src="/img/line-11.svg" />

          <div className="frame-140">
            <div className="frame-141">
              <div className="text-wrapper-120">3</div>
            </div>
          </div>
        </div>

        <div className="frame-143">
          <div className="frame-144">
            <div className="frame-145">
              <div className="text-wrapper-121">
                Dirección del Smart Contract
              </div>

              <div className="rectangle-18" />

              <p className="text-wrapper-122">
                La dirección del contrato inteligente del token (si es que ya
                está en la blockchain).
              </p>
            </div>

            <div className="frame-145">
              <p className="text-wrapper-121">URL del Explorador de Bloques:</p>

              <div className="rectangle-18" />

              <p className="text-wrapper-122">
                Un enlace a un explorador de bloques para que los usuarios
                puedan verificar la información sobre el contrato (como
                Etherscan o BscScan).
              </p>
            </div>
          </div>

          <div className="frame-144">
            <div className="frame-145">
              <div className="text-wrapper-121">Código del Smart Contract:</div>

              <div className="rectangle-19" />

              <p className="text-wrapper-122">
                {" "}
                Opcional,&nbsp;&nbsp;pero en algunos casos se puede requerir el
                código fuente del contrato si es personalizado.
              </p>
            </div>
          </div>

          <div className="frame-144">
            <div className="frame-146">
              <div className="text-wrapper-121">Método de Distribución:</div>

              <div className="rectangle-18" />

              <p className="text-wrapper-122">
                Indicar si el token se va a distribuir mediante una oferta
                pública, airdrop, recompensas, etc.
              </p>
            </div>

            <div className="frame-146">
              <div className="text-wrapper-121">Precio por Token:</div>

              <div className="rectangle-18" />

              <p className="text-wrapper-122">
                El costo de cada token en la moneda de la oferta (por ejemplo,
                USD, ETH, BNB, etc.).
              </p>
            </div>
          </div>

          <div className="frame-144">
            <div className="frame-146">
              <p className="text-wrapper-121">Fecha de Inicio de la Oferta:</p>

              <div className="rectangle-18" />

              <p className="text-wrapper-122">
                El día y hora exactos en que comenzará la venta del token.
              </p>
            </div>

            <div className="frame-146">
              <p className="text-wrapper-121">
                Fecha de Finalización de la Oferta:
              </p>

              <div className="rectangle-18" />

              <p className="text-wrapper-122">
                El día y hora en que finalizará la venta.
              </p>
            </div>
          </div>

          <div className="frame-144">
            <div className="frame-146">
              <p className="text-wrapper-121">
                Porcentaje de Tokens para la Venta Pública:
              </p>

              <div className="rectangle-18" />

              <p className="text-wrapper-122">
                Cuál es el porcentaje de la oferta total destinado a la venta
                pública.
              </p>
            </div>

            <div className="frame-146">
              <p className="text-wrapper-121">
                Porcentaje de Tokens para el Equipo de Desarrollo:
              </p>

              <div className="rectangle-18" />

              <p className="text-wrapper-122">
                Cuánto se destina a los creadores y desarrolladores (normalmente
                bloqueado por un periodo).
              </p>
            </div>
          </div>

          <div className="frame-144">
            <div className="frame-146">
              <div className="text-wrapper-121">
                Porcentaje para el Marketing:
              </div>

              <div className="rectangle-18" />

              <p className="text-wrapper-122">
                Cuánto de la oferta se destina a la promoción y actividades de
                marketing..
              </p>
            </div>

            <div className="frame-146">
              <div className="text-wrapper-121">
                Porcentaje para Partners/Inversores Privados:
              </div>

              <div className="rectangle-18" />

              <p className="text-wrapper-122">
                Si hay tokens reservados para inversores privados o socios
                estratégicos.
              </p>
            </div>
          </div>
        </div>

        <div className="frame-147">
          <Link className="frame-148" to="/publish1">
            <div className="text-wrapper-123">Back</div>
          </Link>

          <Link className="frame-148" to="/publish3">
            <div className="text-wrapper-123">Next</div>
          </Link>
        </div>
      </div>
    </div>
  );
};
