import React, { useState, useEffect } from "react";
import { BanerMovil } from "../../components/BanerMovil";
import { Heder } from "../../components/Heder";
import { Paginacion } from "../../components/Paginacion";
import { TarjetaRanking } from "../../components/TarjetaRanking";
import { TarjetaVotos } from "../../components/TarjetaVotos";
import { useVoting } from "../../hooks/useVoting";
import "./style.css";

export const Vote = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tokenVotes, setTokenVotes] = useState({});
  const { vote, unvote, getVoteCount, hasUserVoted, loading: votingLoading } = useVoting();

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        console.log('Intentando obtener tokens de:', 'http://localhost:1337/api/tokens/candidatos');
        const response = await fetch('http://localhost:1337/api/tokens?filters[estado][$eq]=inactivo&populate=imagen');
        console.log('Respuesta del servidor:', response.status, response.ok);
        
        let tokensData = [];
        if (response.ok) {
          const data = await response.json();
          console.log('Datos recibidos:', data);
          tokensData = data.data || [];
        } else {
          console.log('Error fetching tokens:', response.status);
          // Si hay error, usar datos de ejemplo
          tokensData = [
            { id: 1, attributes: { nombre: "Bukele Coin", descripcion: "Token del presidente de El Salvador" }},
            { id: 2, attributes: { nombre: "Gustavo Petro Token", descripcion: "Token del presidente colombiano" }},
            { id: 3, attributes: { nombre: "Barack Obama Coin", descripcion: "Token del expresidente estadounidense" }}
          ];
        }
        
        setTokens(tokensData);
        
        // Obtener conteos de votos para cada token
        const voteCountsPromises = tokensData.map(async (token) => {
          const count = await getVoteCount(token.id);
          return { tokenId: token.id, count };
        });
        
        const voteCounts = await Promise.all(voteCountsPromises);
        const voteCountsMap = {};
        voteCounts.forEach(({ tokenId, count }) => {
          voteCountsMap[tokenId] = count;
        });
        
        setTokenVotes(voteCountsMap);
        
      } catch (error) {
        console.log('Error de conexión:', error);
        // Datos de ejemplo si falla la conexión
        const fallbackTokens = [
          { id: 1, attributes: { nombre: "Bukele Coin", descripcion: "Token del presidente de El Salvador" }},
          { id: 2, attributes: { nombre: "Gustavo Petro Token", descripcion: "Token del presidente colombiano" }},
          { id: 3, attributes: { nombre: "Barack Obama Coin", descripcion: "Token del expresidente estadounidense" }}
        ];
        setTokens(fallbackTokens);
        
        // Conteos de ejemplo
        setTokenVotes({
          1: 45,
          2: 32,
          3: 28
        });
        
        // Simular que el usuario ya votó por el token 1 para testing
        localStorage.setItem('userId', 'test_user_123');
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [getVoteCount]);

  if (loading) {
    return (
      <div className="vote">
        <Heder className="heder-home" />
        <div className="loading-container">
          <div className="loading-text">Cargando tokens...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="vote">
      <Heder className="heder-home" />
      <div className="titulo-pagina-10" />

      <div className="frame-135">
        <TarjetaRanking
          className="tarjeta-ranking-10"
          tokenName="Shina inu"
          tokenSymbol="SBH"
          marketCap="$150000"
          tokenImage="/img/image-4.png"
        />
        <TarjetaRanking
          className="tarjeta-ranking-11"
          tokenName="CAt"
          tokenSymbol="CAT"
          marketCap="$20000"
          tokenImage="/img/image-3.png"
        />
        <TarjetaRanking
          className="tarjeta-ranking-12"
          tokenName="florka"
          tokenSymbol="FLK"
          marketCap="$25000"
          tokenImage="/img/image-1.png"
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
              tokenId={token.id}
              initialVotes={tokenVotes[token.id] || 0}
              hasUserVoted={hasUserVoted(token.id)}
              onVote={async (tokenId) => {
                const success = await vote(tokenId);
                if (success) {
                  setTokenVotes(prev => ({
                    ...prev,
                    [tokenId]: (prev[tokenId] || 0) + 1
                  }));
                }
                return success;
              }}
              onUnvote={async (tokenId) => {
                const success = await unvote(tokenId);
                if (success) {
                  setTokenVotes(prev => ({
                    ...prev,
                    [tokenId]: Math.max((prev[tokenId] || 0) - 1, 0)
                  }));
                }
                return success;
              }}
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
