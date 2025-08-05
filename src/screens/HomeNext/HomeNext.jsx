import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heder } from "../../components/Heder";
{/* import { MenuTabla } from "../../components/MenuTabla"; */}
{/* import { Paginacion } from "../../components/Paginacion"; */}
import { TarjetaProyectos } from "../../components/TarjetaProyectos";
import { TarjetaRanking } from "../../components/TarjetaRanking";
import tokenService from "../../services/tokenService";
import { useAuth } from "../../contexts/AuthContext";
import "./style.css";

// Helper function para construir URLs de imágenes
const buildImageUrl = (imageData, tokenName = '') => {
  // PRIORIDAD 1: Si hay imagen real del backend, usarla
  if (imageData?.data?.attributes?.url) {
    const url = imageData.data.attributes.url;
    const finalUrl = url.startsWith('http') ? url : `http://localhost:1337${url}`;
    console.log('Using backend image URL:', finalUrl);
    return finalUrl;
  }
  
  // PRIORIDAD 2: Mapeo específico para candidatos conocidos (fallback)
  const candidateImageMap = {
    'bukele': '/img/bukele.png',
    'gustavo petro': '/img/petro.png',
    'gustavo petro token': '/img/petro.png',
    'barack obama': '/img/obama.png',
    'barack obama coin': '/img/obama.png',
    'next token 1': '/img/image-1.png',
    'next token 2': '/img/image-3.png',
    'next token 3': '/img/image-4.png',
    'anto': '/img/image-3.png',
    'florkiño': '/img/image-4.png',
    'nicolukas': '/img/image-1.png'
  };
  
  const normalizedName = tokenName.toLowerCase();
  if (candidateImageMap[normalizedName]) {
    console.log('Using mapped fallback image for token:', normalizedName, candidateImageMap[normalizedName]);
    return candidateImageMap[normalizedName];
  }
  
  // PRIORIDAD 3: Fallback genérico
  return "/img/image-4.png";
};

// Datos de ejemplo como fallback
const fallbackNextTokens = [
  { tokenName: "florkiño", tokenSymbol: "flk", tokenImage: "/img/image-4.png", marketCap: "$22000", progress: "12%", progressValue: 12 },
  { tokenName: "anto", tokenSymbol: "ANT", tokenImage: "/img/image-3.png", marketCap: "$35000", progress: "28%", progressValue: 28 },
  { tokenName: "nicolukas", tokenSymbol: "NKL", tokenImage: "/img/image-1.png", marketCap: "$18000", progress: "6%", progressValue: 6 },
  { tokenName: "NEXT", tokenSymbol: "NXT", tokenImage: "/img/image-2.png", marketCap: "$42000", progress: "35%", progressValue: 35 },
  { tokenName: "FUTURE", tokenSymbol: "FUT", tokenImage: "/img/image-5.png", marketCap: "$15000", progress: "9%", progressValue: 9 },
  { tokenName: "MOON", tokenSymbol: "MOON", tokenImage: "/img/image-6.png", marketCap: "$58000", progress: "41%", progressValue: 41 }
];

export const HomeNext = () => {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState([]);
  const [topVotedTokens, setTopVotedTokens] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTokens, setTotalTokens] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remindedTokens, setRemindedTokens] = useState([]);
  const [sortOrder, setSortOrder] = useState('date'); // 'date' o 'votes'
  const { isAuthenticated, user } = useAuth();
  const cardsPerPage = 6;

  // Cargar tokens próximos desde el backend
  useEffect(() => {
    const fetchNextTokens = async () => {
      try {
        setLoading(true);
        // Obtener tokens con estado "próximo"
        const response = await tokenService.getNextTokens(currentPage, cardsPerPage, sortOrder);
        
        if (response && response.data) {
          // Transformar datos para el formato que espera TarjetaProyectos
          const transformedTokens = response.data.map(token => {
            const tokenData = tokenService.transformTokenData(token);
            return {
              id: tokenData.id,
              tokenName: tokenData.nombre,
              tokenSymbol: tokenData.symbol,
              tokenImage: buildImageUrl(tokenData.imagen, tokenData.nombre),
              marketCap: `${tokenData.marketCap.toLocaleString()}`,
              progress: `${tokenData.progress}%`,
              progressValue: tokenData.progress,
              launchDate: tokenData.fechaLanzamiento
            };
          });
          
          setTokens(transformedTokens);
          setTotalTokens(response.meta?.pagination?.total || transformedTokens.length);
        } else {
          // Si no hay datos, usar fallback
          setTokens(fallbackNextTokens);
          setTotalTokens(fallbackNextTokens.length);
        }
      } catch (error) {
        console.error("Error fetching next tokens:", error);
        setError("Error loading next tokens. Using sample data.");
        setTokens(fallbackNextTokens);
        setTotalTokens(fallbackNextTokens.length);
      } finally {
        setLoading(false);
      }
    };

    fetchNextTokens();
  }, [currentPage, sortOrder]);

  // Cargar top 3 tokens más votados para ranking - PÁGINA NEXT
  useEffect(() => {
    const fetchTopVotedTokens = async () => {
      try {
        console.log('Fetching top tokens for NEXT page...');
        const response = await tokenService.getTop3TokensNext();
        
        if (response && response.data) {
          // Transformar datos para el formato que espera TarjetaRanking
          const transformedTopTokens = response.data.map(ranking => {
            const rankingData = tokenService.transformRankingData(ranking);
            return {
              id: rankingData.id,
              position: rankingData.posicion,
              tokenName: rankingData.token?.nombre || "Token",
              tokenSymbol: rankingData.token?.symbol || "TKN",
              tokenImage: buildImageUrl(rankingData.token?.imagen, rankingData.token?.nombre),
              totalVotes: rankingData.totalVotos || 0,
              marketCap: `Votos: ${rankingData.totalVotos || 0}`
            };
          });
          
          console.log('Transformed top tokens for NEXT:', transformedTopTokens);
          setTopVotedTokens(transformedTopTokens);
        }
      } catch (error) {
        console.error("Error fetching top voted tokens for NEXT:", error);
        // Usar datos de ejemplo si falla
        setTopVotedTokens([
          { position: 2, tokenName: "florkiño", tokenSymbol: "flk", tokenImage: "/img/image-4.png", marketCap: "Votos: 2" },
          { position: 1, tokenName: "anto", tokenSymbol: "ANT", tokenImage: "/img/image-3.png", marketCap: "Votos: 4" },
          { position: 3, tokenName: "nicolukas", tokenSymbol: "NKL", tokenImage: "/img/image-1.png", marketCap: "Votos: 1" }
        ]);
      }
    };

    fetchTopVotedTokens();
  }, []);

  // Cargar recordatorios guardados
  useEffect(() => {
    if (isAuthenticated) {
      const savedReminders = localStorage.getItem(`remindedTokens_${user?.id}`);
      if (savedReminders) {
        setRemindedTokens(JSON.parse(savedReminders));
      }
    }
  }, [isAuthenticated, user]);

  // Función para recordar un token
  const handleRemindMe = (tokenId) => {
    if (!isAuthenticated) {
      alert("You must log in to use this feature");
      return;
    }

    const updatedReminders = [...remindedTokens];
    const index = updatedReminders.indexOf(tokenId);
    
    if (index === -1) {
      // Añadir recordatorio
      updatedReminders.push(tokenId);
    } else {
      // Quitar recordatorio
      updatedReminders.splice(index, 1);
    }
    
    setRemindedTokens(updatedReminders);
    localStorage.setItem(`remindedTokens_${user?.id}`, JSON.stringify(updatedReminders));
  };

  // Función para cambiar el orden
  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  // Función para manejar el click del botón "Click Here"
  const handleClickHere = () => {
    navigate('/create');
  };

  // Calcular total de páginas
  const totalPages = Math.ceil(totalTokens / cardsPerPage);

  // Funciones de navegación
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  return (
    <div className="home-next">
      <Heder className="heder-home" />

      {/* Título de la sección */}
      <div className="next-tokens-title">
        <span className="star-icon">⭐</span>
        <span className="title-text">Top 3 Next Tokens</span>
        <span className="star-icon">⭐</span>
      </div>

      <div className="frame-67">
        {topVotedTokens.length >= 3 ? (
          <>
            <TarjetaRanking
              className="tarjeta-ranking-instance"
              tokenName={topVotedTokens[1]?.tokenName || "florkiño"}
              tokenSymbol={topVotedTokens[1]?.tokenSymbol || "flk"}
              marketCap={`Votos: ${topVotedTokens[1]?.totalVotes || 2}`}
              tokenImage={topVotedTokens[1]?.tokenImage || "/img/image-4.png"}
            />

            <TarjetaRanking
              className="tarjeta-ranking-5"
              tokenName={topVotedTokens[0]?.tokenName || "anto"}
              tokenSymbol={topVotedTokens[0]?.tokenSymbol || "ANT"}
              marketCap={`Votos: ${topVotedTokens[0]?.totalVotes || 4}`}
              tokenImage={topVotedTokens[0]?.tokenImage || "/img/image-3.png"}
            />

            <TarjetaRanking
              className="tarjeta-ranking-6"
              tokenName={topVotedTokens[2]?.tokenName || "nicolukas"}
              tokenSymbol={topVotedTokens[2]?.tokenSymbol || "NKL"}
              marketCap={`Votos: ${topVotedTokens[2]?.totalVotes || 1}`}
              tokenImage={topVotedTokens[2]?.tokenImage || "/img/image-1.png"}
            />
          </>
        ) : (
          <>
            <TarjetaRanking
              className="tarjeta-ranking-instance"
              tokenName="florkiño"
              tokenSymbol="flk"
              marketCap="Votos: 2"
              tokenImage="/img/image-4.png"
            />

            <TarjetaRanking
              className="tarjeta-ranking-5"
              tokenName="anto"
              tokenSymbol="ANT"
              marketCap="Votos: 4"
              tokenImage="/img/image-3.png"
            />

            <TarjetaRanking
              className="tarjeta-ranking-6"
              tokenName="nicolukas"
              tokenSymbol="NKL"
              marketCap="Votos: 1"
              tokenImage="/img/image-1.png"
            />
          </>
        )}
      </div>

      {/* Sección promocional */}
      <div className="promo-section">
        <p className="promo-text">
          From just $50, create your token with a free promo video and guaranteed exposure.
        </p>
        <button className="click-here-button" onClick={handleClickHere}>Click Here</button>
        <p className="promo-subtext">
          Launch your token for just $50 and go viral from day one
        </p>
        <p className="promo-details">
          Includes FREE promo video and official post on X. No hassle.
        </p>
      </div>

      {/* Título de la sección inferior */}
      <div className="next-tokens-bottom-title">
        <span className="star-icon">⭐</span>
        <span className="title-text">Next Tokens on Solana</span>
        <span className="star-icon">⭐</span>
      </div>

{/* MenuTabla removido según solicitud del usuario */}
      {/* Opciones de ordenación */}
      <div className="sort-options">
        <span className="sort-label">Sort by:</span>
        <button 
          className={`sort-button ${sortOrder === 'date' ? 'active' : ''}`}
          onClick={() => handleSortChange('date')}
        >
          Launch Date
        </button>
        <button 
          className={`sort-button ${sortOrder === 'votes' ? 'active' : ''}`}
          onClick={() => handleSortChange('votes')}
        >
          Popularity
        </button>
      </div>

      <div className="frame-68">
        {/* Grid de cards - 3 por fila */}
        <div className="cards-grid">
          {loading ? (
            <div className="loading-message">Loading next tokens...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : tokens.length > 0 ? (
            tokens.map((token, index) => (
              <div className="token-card-container" key={`${token.tokenSymbol}-${index}`}>
                <TarjetaProyectos
                  to={`/token/${token.tokenName}`}
                  tokenName={token.tokenName}
                  tokenSymbol={token.tokenSymbol}
                  tokenImage={token.tokenImage}
                  marketCap={token.marketCap}
                  progress={token.progress}
                  progressValue={token.progressValue}
                />
                {token.launchDate && (
                  <div className="launch-date">
                    Launch: {new Date(token.launchDate).toLocaleDateString()}
                  </div>
                )}
                <button 
                  className={`remind-button ${remindedTokens.includes(token.id) ? 'reminded' : ''}`}
                  onClick={() => handleRemindMe(token.id)}
                >
                  {remindedTokens.includes(token.id) ? '✓ Reminder Active' : '🔔 Remind Me'}
                </button>
              </div>
            ))
          ) : (
            <div className="no-tokens-message">No next tokens available.</div>
          )}
        </div>

        {/* Controles de paginación personalizados */}
        <div className="pagination-controls">
          <button 
            className="pagination-btn prev-btn" 
            onClick={goToPrevPage}
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
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};