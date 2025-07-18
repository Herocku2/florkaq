import React from "react";
import { Link } from "react-router-dom";
import { BanerMovil } from "../../components/BanerMovil";
import "./style.css";

export const Screen15 = () => {
  return (
    <div className="screen-15">
      <img className="heder-13" alt="Heder" src="/img/heder-13.svg" />

      <div className="titulo-pagina-16" />

      <BanerMovil
        className="baner-movil-18"
        frame="/img/frame-31-13.svg"
        groupClassName="baner-movil-19"
        groupClassNameOverride="baner-movil-19"
        imageWrapperClassName="baner-movil-19"
        imageWrapperClassNameOverride="baner-movil-19"
      />
      <div className="frame-212">
        <div className="frame-213">
          <div className="frame-214">
            <div className="frame-215">
              <div className="text-wrapper-165">1</div>
            </div>
          </div>

          <img className="line-14" alt="Line" src="/img/line-10-4.svg" />

          <div className="frame-214">
            <div className="frame-216">
              <div className="text-wrapper-166">2</div>
            </div>
          </div>

          <img className="line-14" alt="Line" src="/img/line-11-4.svg" />

          <div className="frame-214">
            <div className="frame-217">
              <div className="text-wrapper-167">3</div>
            </div>
          </div>

          <img className="line-14" alt="Line" src="/img/line-12-1.svg" />

          <div className="frame-214">
            <div className="frame-217">
              <div className="text-wrapper-168">4</div>
            </div>
          </div>
        </div>

        <div className="frame-218">
          <div className="frame-219">
            <div className="text-wrapper-169">Logo del Token:</div>

            <img
              className="rectangle-24"
              alt="Rectangle"
              src="/img/rectangle-12-2.svg"
            />
          </div>

          <div className="frame-220">
            <div className="frame-221">
              <div className="frame-222">
                <div className="text-wrapper-169">Nombre del Token:</div>

                <div className="rectangle-25" />

                <p className="text-wrapper-170">
                  Nombre completo del token que se va a emitir.
                </p>
              </div>

              <div className="frame-222">
                <div className="text-wrapper-169">Símbolo del Token:</div>

                <div className="rectangle-25" />

                <p className="text-wrapper-170">
                  Abreviatura o ticker del token (ej. BTC, ETH, DOGE).
                </p>
              </div>
            </div>

            <div className="frame-221">
              <div className="frame-222">
                <div className="text-wrapper-169">Tipo de Token:</div>

                <div className="rectangle-25" />

                <p className="text-wrapper-170">
                  Especificar si es un token ERC-20, BEP-20, o en otra cadena
                  compatible (ERC-721, ERC-1155, etc.).
                </p>
              </div>

              <div className="frame-223">
                <div className="text-wrapper-169">
                  Cantidad Total de Tokens:
                </div>

                <div className="rectangle-25" />

                <p className="text-wrapper-170">
                  Número total de tokens que se emitirán.
                </p>
              </div>
            </div>

            <div className="frame-221">
              <div className="frame-222">
                <p className="text-wrapper-169">
                  Cantidad de Tokens en Circulación Inicial:
                </p>

                <div className="rectangle-25" />

                <p className="text-wrapper-170">
                  Cuántos tokens estarán disponibles inicialmente en
                  circulación.
                </p>
              </div>

              <div className="frame-223">
                <div className="text-wrapper-169">Decimal de Token:</div>

                <div className="rectangle-25" />

                <p className="text-wrapper-170">
                  El número de decimales que el token podrá tener (ej. 18
                  decimales en Ethereum).
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="frame-224">
          <div className="frame-225">
            <div className="frame-226">
              <div className="text-wrapper-169">Descripción del proyecto:</div>

              <div className="rectangle-26" />

              <p className="text-wrapper-170">
                {" "}
                Breve descripción sobre el propósito del token y la utilidad
                dentro de la plataforma o ecosistema..
              </p>
            </div>
          </div>
        </div>

        <div className="frame-227">
          <Link className="frame-228" to="/create1">
            <div className="text-wrapper-171">Back</div>
          </Link>

          <div className="frame-228">
            <div className="text-wrapper-171">Next</div>
          </div>
        </div>
      </div>
    </div>
  );
};
