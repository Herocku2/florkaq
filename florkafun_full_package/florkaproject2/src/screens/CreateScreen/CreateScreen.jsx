import React from "react";
import { Link } from "react-router-dom";
import { BanerMovil } from "../../components/BanerMovil";
import "./style.css";

export const CreateScreen = () => {
  return (
    <div className="create-screen">
      <img className="heder-9" alt="Heder" src="/img/heder-9.svg" />

      <div className="titulo-pagina-12" />

      <BanerMovil className="baner-movil-13" frame="/img/frame-31-9.svg" />
      <div className="frame-149">
        <div className="frame-150">
          <div className="frame-151">
            <div className="frame-152">
              <div className="text-wrapper-124">1</div>
            </div>
          </div>

          <img className="line-8" alt="Line" src="/img/line-10-2.svg" />

          <div className="frame-151">
            <div className="frame-153">
              <div className="text-wrapper-125">2</div>
            </div>
          </div>

          <img className="line-8" alt="Line" src="/img/line-11-2.svg" />

          <div className="frame-151">
            <div className="frame-154">
              <div className="text-wrapper-126">3</div>
            </div>
          </div>

          <img className="line-8" alt="Line" src="/img/line-12.svg" />

          <div className="frame-151">
            <div className="frame-155">
              <div className="text-wrapper-127">4</div>
            </div>
          </div>
        </div>

        <div className="frame-156">
          <div className="frame-157">
            <div className="frame-158">
              <div className="text-wrapper-128">Twitter:</div>

              <div className="rectangle-20" />

              <div className="text-wrapper-129">Enlace a perfile oficial.</div>
            </div>

            <div className="frame-158">
              <div className="text-wrapper-128">Telegram:</div>

              <div className="rectangle-20" />

              <div className="text-wrapper-129">Enlace a perfile oficial.</div>
            </div>
          </div>

          <div className="frame-157">
            <div className="frame-159">
              <div className="text-wrapper-128">LinkedIn:</div>

              <div className="rectangle-20" />

              <div className="text-wrapper-129">Enlace a perfile oficial.</div>
            </div>

            <div className="frame-159">
              <div className="text-wrapper-128">Discord:</div>

              <div className="rectangle-20" />

              <div className="text-wrapper-129">Enlace a perfile oficial.</div>
            </div>
          </div>

          <div className="frame-157">
            <div className="frame-159">
              <div className="text-wrapper-128">Facebook:</div>

              <div className="rectangle-20" />

              <div className="text-wrapper-129">Enlace a perfile oficial.</div>
            </div>

            <div className="frame-159">
              <div className="text-wrapper-128">Web::</div>

              <div className="rectangle-20" />

              <p className="text-wrapper-129">Enlace a la web oficial.</p>
            </div>
          </div>

          <div className="frame-157">
            <div className="frame-159">
              <div className="text-wrapper-128">Correo de Contacto:</div>

              <div className="rectangle-20" />

              <p className="text-wrapper-129">
                Proveer un correo electrónico de contacto para consultas o
                problemas.
              </p>
            </div>

            <div className="frame-159">
              <p className="text-wrapper-128">
                Enlace al Canal de Soporte (Telegram):
              </p>

              <div className="rectangle-20" />

              <p className="text-wrapper-129">
                Enlace a un canal oficial donde los participantes puedan recibir
                soporte.
              </p>
            </div>
          </div>
        </div>

        <div className="frame-160">
          <div className="frame-161">
            <div className="text-wrapper-130">Back</div>
          </div>

          <Link className="frame-161" to="/create5">
            <div className="text-wrapper-130">Next</div>
          </Link>
        </div>
      </div>
    </div>
  );
};
