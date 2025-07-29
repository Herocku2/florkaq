import React, { useState, useEffect } from "react";
import { Heder } from "../../components/Heder";
import { MenuTabla } from "../../components/MenuTabla";
import { Paginacion } from "../../components/Paginacion";
import { TarjetaProyectos } from "../../components/TarjetaProyectos";
import { TarjetaRanking } from "../../components/TarjetaRanking";
import tokenService from "../../services/tokenService";
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
    'barack obama coin': '/img/obama.png'
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
const fallbackTokens = [
  { tokenName: "CAT", tokenSymbol: "CAT", tokenImage: "/img/image-3.png", marketCap: "$20000", progress: "15%", progressValue: 15 },
  { tokenName: "Shina inu", tokenSymbol: "SBH", tokenImage: "/img/image-4.png", marketCap: "$150000", progress: "4%", progressValue: 4 },
  { tokenName: "florka", tokenSymbol: "FLK", tokenImage: "/img/image-1.png", marketCap: "$25000", progress: "18%", progressValue: 18 },
  { tokenName: "DOGE", tokenSymbol: "DOGE", tokenImage: "/img/image-2.png", marketCap: "$45000", progress: "32%", progressValue: 32 },
  { tokenName: "PEPE", tokenSymbol: "PEPE", tokenImage: "/img/image-5.png", marketCap: "$12000", progress: "8%", progressValue: 8 },
  { tokenName: "BONK", tokenSymbol: "BONK", tokenImage: "/img/image-6.png", marketCap: "$67000", progress: "25%", progressValue: 25 }
];

export const HomeAll = () => {
  const [tokens, setTokens] = useState([]);
  const [topTokens, setTopTokens] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTokens, setTotalTokens] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardsPerPage = 6;

  // Cargar tokens lanzados desde el backend
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        const response = await tokenService.getLaunchedTokens(currentPage, cardsPerPage);
        
        if (response && response.data) {
          // Transformar datos para el formato que espera TarjetaProyectos
          const transformedTokens = response.data.map(token => {
            const tokenData = tokenService.transformTokenData(token);
            return {
              id: tokenData.id,
              tokenName: tokenData.nombre,
              tokenSymbol: tokenData.symbol,
              tokenImage: buildImageUrl(tokenData.imagen, tokenData.nombre),
              marketCap: `$${tokenData.marketCap.toLocaleString()}`,
              progress: `${tokenData.progress}%`,
              progressValue: tokenData.progress
            };
          });
          
          setTokens(transformedTokens);
          setTotalTokens(response.meta?.pagination?.total || transformedTokens.length);
        } else {
          // Si no hay datos, usar fallback
          setTokens(fallbackTokens);
          setTotalTokens(fallbackTokens.length);
        }
      } catch (error) {
        console.error("Error fetching tokens:", error);
        setError("Error al cargar los tokens. Usando datos de ejemplo.");
        setTokens(fallbackTokens);
        setTotalTokens(fallbackTokens.length);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
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
              tokenImage: buildImageUrl(rankingData.token?.imagen, rankingData.token?.nombre),
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
    <div className="home-all">
      <Heder className="heder-home" />

      <div className="frame-60">
        <img
          className="fair-launches-the"
          alt="Fair launches the"
          src="/img/fair-launches-the-dev-gets-80-and-marketing-is-on-us.png"
        />

        <img
          className="no-need-for-a"
          alt="No need for a"
          src="/img/no-need-for-a-community-everyone-s-here-waiting-to-blow-up-you.png"
        />

        <img
          className="element-launches-a-month"
          alt="Element launches a month"
          src="/img/2-launches-a-month-only-the-best-takes-the-crown.png"
        />
      </div>

      <img
        className="img-3"
        alt="Frame logo isotipo"
        src="/img/frame-logo-isotipo.png"
      />

      <img className="baner" alt="Baner" src="/img/baner-1.png" />

      <div className="titulo-pagina-2" />

      <div className="frame-61">
        {topTokens.length >= 3 ? (
          <>
            <TarjetaRanking
              className="tarjeta-ranking-2"
              tokenName={topTokens[1]?.tokenName || "Shina inu"}
              tokenSymbol={topTokens[1]?.tokenSymbol || "SBH"}
              marketCap={`MC: ${topTokens[1]?.marketCap || "$150000"}`}
              tokenImage={topTokens[1]?.tokenImage || "/img/image-4.png"}
            />

            <TarjetaRanking
              className="tarjeta-ranking-3"
              tokenName={topTokens[0]?.tokenName || "CAT"}
              tokenSymbol={topTokens[0]?.tokenSymbol || "CAT"}
              marketCap={`MC: ${topTokens[0]?.marketCap || "$20000"}`}
              tokenImage={topTokens[0]?.tokenImage || "/img/image-3.png"}
            />

            <TarjetaRanking
              className="tarjeta-ranking-4"
              tokenName={topTokens[2]?.tokenName || "florka"}
              tokenSymbol={topTokens[2]?.tokenSymbol || "FLK"}
              marketCap={`MC: ${topTokens[2]?.marketCap || "$25000"}`}
              tokenImage={topTokens[2]?.tokenImage || "/img/image-1.png"}
            />
          </>
        ) : (
          <>
            <TarjetaRanking
              className="tarjeta-ranking-2"
              tokenName="Shina inu"
              tokenSymbol="SBH"
              marketCap="MC: $150000"
              tokenImage="/img/image-4.png"
            />

            <TarjetaRanking
              className="tarjeta-ranking-3"
              tokenName="CAT"
              tokenSymbol="CAT"
              marketCap="MC: $20000"
              tokenImage="/img/image-3.png"
            />

            <TarjetaRanking
              className="tarjeta-ranking-4"
              tokenName="florka"
              tokenSymbol="FLK"
              marketCap="MC: $25000"
              tokenImage="/img/image-1.png"
            />
          </>
        )}
      </div>

      <MenuTabla
        className="menu-tabla-1"
        divClassName="menu-tabla-instance"
        divClassNameOverride="menu-tabla-1-instance"
        img="/img/line-2-3.svg"
        line="/img/line-1-3.svg"
        line1="/img/line-3-3.svg"
        to="/homeu47next"
        to1="/homeu47new"
      />
      <div className="frame-62">
        {/* Grid de cards - 3 por fila */}
        <div className="cards-grid">
          {loading ? (
            <div className="loading-message">Cargando tokens...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : tokens.length > 0 ? (
            tokens.map((token, index) => (
              <TarjetaProyectos
                key={`${token.tokenSymbol}-${index}`}
                to={`/homeu47detalletokenu47compra?id=${token.id}`}
                tokenName={token.tokenName}
                tokenSymbol={token.tokenSymbol}
                tokenImage={token.tokenImage}
                marketCap={token.marketCap}
                progress={token.progress}
                progressValue={token.progressValue}
              />
            ))
          ) : (
            <div className="no-tokens-message">No hay tokens disponibles.</div>
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
