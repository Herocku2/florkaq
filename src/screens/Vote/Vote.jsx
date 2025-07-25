import React, { useState, useEffect } from "react";
import { BanerMovil } from "../../components/BanerMovil";
import { Heder } from "../../components/Heder";
import { Paginacion } from "../../components/Paginacion";
import { TarjetaRanking } from "../../components/TarjetaRanking";
import { TarjetaVotos } from "../../components/TarjetaVotos";
import { useVoting } from "../../hooks/useVoting";
import tokenService from "../../services/tokenService";
import "./style.css";

// Helper function para construir URLs de imágenes
const buildImageUrl = (imageData) => {
  if (!imageData?.data?.attributes?.url) {
    return "/img/image-4.png";
  }
  
  const url = imageData.data.attributes.url;
  return url.startsWith('http') ? url : `http://localhost:1337${url}`;
};

export const Vote = () => {
  const [tokens, setTokens] = useState([]);
  const [topTokens, setTopTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTokens, setTotalTokens] = useState(0);
  const [tokenVotes, setTokenVotes] = useState({});
  const { vote, unvote, getVoteCount, hasUserVoted, loading: votingLoading } = useVoting();
  const tokensPerPage = 5;

  // Cargar tokens en votación
  useEffect(() => {
    const fetchTokensInVoting = async () => {
      try {
        setLoading(true);
        
        // Obtener tokens con estado "votacion"
        const response = await tokenService.getTokensInVoting(currentPage, tokensPerPage);
        
        if (response && response.data) {
          setTokens(response.data);
          setTotalTokens(response.meta?.pagination?.total || response.data.length);
          setTotalPages(response.meta?.pagination?.pageCount || 1);
          
          // Obtener conteo de votos para cada token
          const votesData = {};
          for (const token of response.data) {
            try {
              const voteCount = await getVoteCount(token.id);
              votesData[token.id] = voteCount;
            } catch (error) {
              console.error(`Error getting vote count for token ${token.id}:`, error);
              votesData[token.id] = 0;
            }
          }
          
        } else {
          // Usar datos estáticos si no hay respuesta
          const fallbackTokens = [
            { id: 1, attributes: { nombre: "Bukele Coin", descripcion: "Token del presidente de El Salvador" }},
            { id: 2, attributes: { nombre: "Gustavo Petro Token", descripcion: "Token del presidente colombiano" }},
            { id: 3, attributes: { nombre: "Barack Obama Coin", descripcion: "Token del expresidente estadounidense" }}
          ];
          
          setTokens(fallbackTokens);
          setTotalTokens(fallbackTokens.length);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching tokens in voting:", error);
        setError("Error al cargar los tokens en votación. Usando datos de ejemplo.");
        
        // Datos de ejemplo si falla
        const fallbackTokens = [
          { id: 1, attributes: { nombre: "Bukele Coin", descripcion: "Token del presidente de El Salvador" }},
          { id: 2, attributes: { nombre: "Gustavo Petro Token", descripcion: "Token del presidente colombiano" }},
          { id: 3, attributes: { nombre: "Barack Obama Coin", descripcion: "Token del expresidente estadounidense" }}
        ];
        
        setTokens(fallbackTokens);
        setTotalTokens(fallbackTokens.length);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchTokensInVoting();
  }, [currentPage]);

  // Cargar top 3 tokens para ranking
  useEffect(() => {
    const fetchTopTokens = async () => {
      try {
        const response = await tokenService.getTop3Tokens();
        
        if (response && response.data) {
          // Transformar datos para el formato que espera TarjetaRanking
          const transformedTopTokens = response.data.map(ranking => {
            const rankingData = tokenService.transformRankingData(ranking);
            return {
              id: rankingData.id,
              position: rankingData.posicion,
              tokenName: rankingData.token?.nombre || "Token",
              tokenSymbol: rankingData.token?.symbol || "TKN",
              tokenImage: rankingData.token?.imagen?.data?.attributes?.url || "/img/image-placeholder.png",
              marketCap: `$${rankingData.token?.marketCap.toLocaleString() || "0"}`
            };
          });
          
          setTopTokens(transformedTopTokens);
        }
      } catch (error) {
        console.error("Error fetching top tokens:", error);
        // No establecemos error aquí para no afectar la experiencia principal
      }
    };

    fetchTopTokens();
  }, []);

  // Función para manejar cambio de página
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

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
        {loading ? (
          <div className="loading-message">Cargando tokens en votación...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : tokens.length > 0 ? (
          tokens.map((token, index) => {
            // Construir URL de la imagen usando helper function
            const imagenUrl = buildImageUrl(token.attributes.imagen);
            
            console.log('Rendering token:', token.attributes.nombre, 'with image:', imagenUrl);
            
            return (
              <TarjetaVotos
                key={token.id}
                className="token-card-item"
                line={`/img/line-8-${index + 2}.svg`}
                to={`/voteu47detalletokenu47vista?id=${token.id}`}
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
          })
        ) : (
          <div className="no-tokens-message">No hay tokens en votación actualmente.</div>
        )}
      </div>

      {/* Paginación personalizada */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button 
            className="pagination-btn prev-btn" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          
          <div className="pagination-info">
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <span className="total-info">
              ({totalTokens} total tokens)
            </span>
          </div>
          
          <button 
            className="pagination-btn next-btn" 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};
