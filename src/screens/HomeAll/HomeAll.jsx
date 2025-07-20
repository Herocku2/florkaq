import React, { useState } from "react";
import { Heder } from "../../components/Heder";
import { MenuTabla } from "../../components/MenuTabla";
import { Paginacion } from "../../components/Paginacion";
import { TarjetaProyectos } from "../../components/TarjetaProyectos";
import { TarjetaRanking } from "../../components/TarjetaRanking";
import "./style.css";

// Datos de ejemplo para las cards
const allTokens = [
  { tokenName: "CAT", tokenSymbol: "CAT", tokenImage: "/img/image-3.png", marketCap: "$20000", progress: "15%", progressValue: 15 },
  { tokenName: "Shina inu", tokenSymbol: "SBH", tokenImage: "/img/image-4.png", marketCap: "$150000", progress: "4%", progressValue: 4 },
  { tokenName: "florka", tokenSymbol: "FLK", tokenImage: "/img/image-1.png", marketCap: "$25000", progress: "18%", progressValue: 18 },
  { tokenName: "DOGE", tokenSymbol: "DOGE", tokenImage: "/img/image-2.png", marketCap: "$45000", progress: "32%", progressValue: 32 },
  { tokenName: "PEPE", tokenSymbol: "PEPE", tokenImage: "/img/image-5.png", marketCap: "$12000", progress: "8%", progressValue: 8 },
  { tokenName: "BONK", tokenSymbol: "BONK", tokenImage: "/img/image-6.png", marketCap: "$67000", progress: "25%", progressValue: 25 },
  { tokenName: "SHIB", tokenSymbol: "SHIB", tokenImage: "/img/image-3.png", marketCap: "$89000", progress: "42%", progressValue: 42 },
  { tokenName: "FLOKI", tokenSymbol: "FLOKI", tokenImage: "/img/image-4.png", marketCap: "$34000", progress: "19%", progressValue: 19 },
  { tokenName: "MEME", tokenSymbol: "MEME", tokenImage: "/img/image-1.png", marketCap: "$56000", progress: "37%", progressValue: 37 },
  { tokenName: "DEGEN", tokenSymbol: "DEGEN", tokenImage: "/img/image-2.png", marketCap: "$78000", progress: "28%", progressValue: 28 },
  { tokenName: "WOJAK", tokenSymbol: "WOJAK", tokenImage: "/img/image-5.png", marketCap: "$23000", progress: "11%", progressValue: 11 },
  { tokenName: "CHAD", tokenSymbol: "CHAD", tokenImage: "/img/image-6.png", marketCap: "$91000", progress: "45%", progressValue: 45 }
];

export const HomeAll = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;
  const totalPages = Math.ceil(allTokens.length / cardsPerPage);

  // Calcular las cards para la página actual
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentTokens = allTokens.slice(startIndex, endIndex);

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
        <TarjetaRanking
          className="tarjeta-ranking-2"
          tokenName="Shina inu"
          tokenSymbol="SBH"
          marketCap="$150000"
          tokenImage="/img/image-4.png"
        />

        <TarjetaRanking
          className="tarjeta-ranking-3"
          tokenName="CAt"
          tokenSymbol="CAT"
          marketCap="$20000"
          tokenImage="/img/image-3.png"
        />

        <TarjetaRanking
          className="tarjeta-ranking-4"
          tokenName="florka"
          tokenSymbol="FLK"
          marketCap="$25000"
          tokenImage="/img/image-1.png"
        />
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
          {currentTokens.map((token, index) => (
            <TarjetaProyectos
              key={`${token.tokenSymbol}-${index}`}
              to={index === 0 ? "/homeu47detalletokenu47compra" : undefined}
              tokenName={token.tokenName}
              tokenSymbol={token.tokenSymbol}
              tokenImage={token.tokenImage}
              marketCap={token.marketCap}
              progress={token.progress}
              progressValue={token.progressValue}
            />
          ))}
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
              ({allTokens.length} total tokens)
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
