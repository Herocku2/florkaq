import React, { useState, useEffect } from "react";
import { BanerMovil } from "../../components/BanerMovil";
import { Heder } from "../../components/Heder";
import { Paginacion } from "../../components/Paginacion";
import { TarjetaRanking } from "../../components/TarjetaRanking";
import { TarjetaVotos } from "../../components/TarjetaVotos";
import "./style.css";

export const Vote = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        console.log('Intentando obtener tokens de:', 'http://localhost:1337/api/tokens/candidatos');
        const response = await fetch('http://localhost:1337/api/tokens?filters[estado][$eq]=inactivo&populate=imagen');
        console.log('Respuesta del servidor:', response.status, response.ok);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Datos recibidos:', data);
          setTokens(data.data || []);
        } else {
          console.log('Error fetching tokens:', response.status);
          // Si hay error, usar datos de ejemplo
          setTokens([
            { id: 1, attributes: { nombre: "Bukele Coin", descripcion: "Token del presidente de El Salvador" }},
            { id: 2, attributes: { nombre: "Gustavo Petro Token", descripcion: "Token del presidente colombiano" }},
            { id: 3, attributes: { nombre: "Barack Obama Coin", descripcion: "Token del expresidente estadounidense" }}
          ]);
        }
      } catch (error) {
        console.log('Error de conexión:', error);
        // Datos de ejemplo si falla la conexión
        setTokens([
          { id: 1, attributes: { nombre: "Bukele Coin", descripcion: "Token del presidente de El Salvador" }},
          { id: 2, attributes: { nombre: "Gustavo Petro Token", descripcion: "Token del presidente colombiano" }},
          { id: 3, attributes: { nombre: "Barack Obama Coin", descripcion: "Token del expresidente estadounidense" }}
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  if (loading) {
    return <div>Cargando tokens...</div>;
  }

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
      <div className="tokens-list">
        {tokens.map((token, index) => {
          // Construir URL de la imagen
          const imagenUrl = token.attributes.imagen?.data?.attributes?.url 
            ? `http://localhost:1337${token.attributes.imagen.data.attributes.url}`
            : "/img/image-4.png"; // Imagen por defecto si no hay imagen
          
          return (
            <TarjetaVotos
              key={token.id}
              className="token-card-item"
              line={`/img/line-8-${index + 2}.svg`}
              to="/voteu47detalletokenu47vista"
              text={token.attributes.nombre}
              text1={token.attributes.descripcion}
              imagen={imagenUrl}
            />
          );
        })}
      </div>

      <Paginacion
        className="paginacion-4"
        iconChevronRight="/img/icon-chevron-right-8.png"
        img="/img/icon-chevron-right-9.png"
      />
    </div>
  );
};
