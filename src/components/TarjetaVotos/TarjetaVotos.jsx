/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./style.css";

export const TarjetaVotos = ({ 
  className, 
  line = "/img/line-8-1.svg", 
  to, 
  text = "AI Bonk Complex", 
  text1 = "Complex", 
  imagen = "/img/image-4.png",
  tokenId,
  initialVotes = 0,
  hasUserVoted = false,
  onVote,
  onUnvote
}) => {
  const [votes, setVotes] = useState(initialVotes);
  const [userHasVoted, setUserHasVoted] = useState(hasUserVoted);
  const [isLoading, setIsLoading] = useState(false);

  // Actualizar el estado cuando cambien las props
  React.useEffect(() => {
    setVotes(initialVotes);
    setUserHasVoted(hasUserVoted);
  }, [initialVotes, hasUserVoted]);

  const handleVote = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (userHasVoted) {
        // Unvote
        const success = await onUnvote(tokenId);
        if (success) {
          setVotes(prev => prev - 1);
          setUserHasVoted(false);
        }
      } else {
        // Vote
        const success = await onVote(tokenId);
        if (success) {
          setVotes(prev => prev + 1);
          setUserHasVoted(true);
        }
      }
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={`tarjeta-votos-horizontal ${className}`}>
      <div className="token-card-container">
        <Link to={to} className="token-clickable-area">
          <div className="token-image-section">
            <img 
              className="token-image" 
              alt={text} 
              src={imagen}
              onError={(e) => {
                console.log('Error loading image:', imagen);
                e.target.src = "/img/image-4.png"; // Fallback image
              }}
              onLoad={() => {
                console.log('Image loaded successfully:', imagen);
              }}
            />
          </div>
          
          <div className="token-info-section">
            <div className="token-header">
              <h3 className="token-name">{text}</h3>
              <p className="token-description">{text1}</p>
            </div>
            
            <div className="token-stats">
              <div className="stat-item">
                <span className="stat-label">Market Cap:</span>
                <span className="stat-value">$4,680</span>
                <span className="stat-change positive">+0.5%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">24h Volume:</span>
                <span className="stat-value">$2,340</span>
                <span className="stat-change positive">+1.2%</span>
              </div>
            </div>
            
            <div className="token-progress">
              <div className="progress-info">
                <span className="progress-text">6M to go</span>
                <span className="progress-percentage">78%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '78%'}}></div>
              </div>
            </div>
          </div>
        </Link>
        
        <div className="vote-section">
          <button 
            className={`vote-button ${userHasVoted ? 'voted' : ''} ${isLoading ? 'loading' : ''}`}
            onClick={handleVote}
            disabled={isLoading}
            type="button"
          >
            <span className="vote-text">
              {isLoading ? 'Loading...' : userHasVoted ? 'Unvote' : 'Vote'}
            </span>
            {userHasVoted && <span className="voted-icon">✓</span>}
          </button>
          <div className="vote-count">
            <span className="votes-number">{votes}</span>
            <span className="votes-label">votes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

TarjetaVotos.propTypes = {
  className: PropTypes.string,
  line: PropTypes.string,
  to: PropTypes.string,
  text: PropTypes.string,
  text1: PropTypes.string,
  imagen: PropTypes.string,
  tokenId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  initialVotes: PropTypes.number,
  hasUserVoted: PropTypes.bool,
  onVote: PropTypes.func,
  onUnvote: PropTypes.func,
};
