import React from "react";
import { Link } from "react-router-dom";
import { BanerMovil } from "../../components/BanerMovil";
import "./style.css";

export const PublishWrapper = () => {
  return (
    <div className="publish-wrapper">
      <img className="heder-10" alt="Heder" src="/img/heder-10.svg" />

      <div className="titulo-pagina-13" />

      <BanerMovil className="baner-movil-14" frame="/img/frame-31-10.svg" />
      <div className="frame-162">
        <div className="frame-163">
          <div className="frame-164">
            <div className="frame-165">
              <div className="text-wrapper-131">1</div>
            </div>
          </div>

          <img className="line-9" alt="Line" src="/img/line-10-3.svg" />

          <div className="frame-164">
            <div className="frame-166">
              <div className="text-wrapper-132">2</div>
            </div>
          </div>

          <img className="line-9" alt="Line" src="/img/line-10-2.svg" />

          <div className="frame-164">
            <div className="frame-167">
              <div className="text-wrapper-133">3</div>
            </div>
          </div>
        </div>

        <div className="frame-168">
          <div className="frame-169">
            <div className="frame-170">
              <div className="text-wrapper-134">Twitter:</div>

              <div className="rectangle-21" />

              <div className="text-wrapper-135">Enlace a perfile oficial.</div>
            </div>

            <div className="frame-170">
              <div className="text-wrapper-134">Telegram:</div>

              <div className="rectangle-21" />

              <div className="text-wrapper-135">Enlace a perfile oficial.</div>
            </div>
          </div>

          <div className="frame-169">
            <div className="frame-171">
              <div className="text-wrapper-134">LinkedIn:</div>

              <div className="rectangle-21" />

              <div className="text-wrapper-135">Enlace a perfile oficial.</div>
            </div>

            <div className="frame-171">
              <div className="text-wrapper-134">Discord:</div>

              <div className="rectangle-21" />

              <div className="text-wrapper-135">Enlace a perfile oficial.</div>
            </div>
          </div>

          <div className="frame-169">
            <div className="frame-171">
              <div className="text-wrapper-134">Facebook:</div>

              <div className="rectangle-21" />

              <div className="text-wrapper-135">Enlace a perfile oficial.</div>
            </div>

            <div className="frame-171">
              <div className="text-wrapper-134">Web::</div>

              <div className="rectangle-21" />

              <p className="text-wrapper-135">Enlace a la web oficial.</p>
            </div>
          </div>

          <div className="frame-169">
            <div className="frame-171">
              <div className="text-wrapper-134">Correo de Contacto:</div>

              <div className="rectangle-21" />

              <p className="text-wrapper-135">
                Proveer un correo electrónico de contacto para consultas o
                problemas.
              </p>
            </div>

            <div className="frame-171">
              <p className="text-wrapper-134">
                Enlace al Canal de Soporte (Telegram):
              </p>

              <div className="rectangle-21" />

              <p className="text-wrapper-135">
                Enlace a un canal oficial donde los participantes puedan recibir
                soporte.
              </p>
            </div>
          </div>

          <div className="frame-169">
            <div className="frame-171">
              <div className="text-wrapper-134">
                Auditoría de Smart Contract:
              </div>

              <div className="rectangle-22" />

              <p className="text-wrapper-136">
                Incluir la información sobre si el contrato inteligente ha sido
                auditado por una firma externa..
              </p>
            </div>
          </div>
        </div>

        <div className="frame-172">
          <Link className="frame-173" to="/publish2">
            <div className="text-wrapper-137">Back</div>
          </Link>

          <Link className="frame-173" to="/publish4">
            <div className="text-wrapper-137">Send</div>
          </Link>
        </div>
      </div>
    </div>
  );
};
