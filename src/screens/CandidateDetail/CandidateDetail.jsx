import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heder } from '../../components/Heder';
import { useAuth } from '../../contexts/AuthContext';
import candidateService from '../../services/candidateService';
import './style.css';

export const CandidateDetail = () => {
  const { candidateName } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        setLoading(true);
        const response = await candidateService.getCandidateByName(candidateName);
        
        if (response && response.data) {
          setCandidate(response.data);
          
          // Verificar si el usuario ya votó por este candidato
          if (isAuthenticated) {
            const voteStatus = await candidateService.checkUserVote(response.data.id);
            setHasVoted(voteStatus.hasVoted);
          }
        } else {
          setError('Candidato no encontrado');
        }
      } catch (err) {
        console.error('Error fetching candidate details:', err);
        setError('Error al cargar los detalles del candidato');
      } finally {
        setLoading(false);
      }
    };

    if (candidateName) {
      fetchCandidateDetails();
    }
  }, [candidateName, isAuthenticated]);

  const handleVote = async () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (hasVoted) return;

    try {
      setVoting(true);
      const result = await candidateService.voteForCandidate(candidate.id);
      
      if (result.success) {
        setHasVoted(true);
        // Actualizar el conteo de votos
        setCandidate(prev => ({
          ...prev,
          attributes: {
            ...prev.attributes,
            totalVotos: (prev.attributes.totalVotos || 0) + 1
          }
        }));
      }
    } catch (err) {
      console.error('Error voting:', err);
      setError('Error al votar. Inténtalo de nuevo.');
    } finally {
      setVoting(false);
    }
  };

  const handleBackToVote = () => {
    navigate('/vote');
  };

  if (loading) {
    return (
      <div className="candidate-detail">
        <Heder />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando detalles del candidato...</p>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="candidate-detail">
        <Heder />
        <div className="error-container">
          <h2>Candidato no encontrado</h2>
          <p>{error || 'El candidato solicitado no existe'}</p>
          <button onClick={handleBackToVote} className="back-button">
            Volver a Votaciones
          </button>
        </div>
      </div>
    );
  }

  const candidateData = candidate.attributes || candidate;

  return (
    <div className="candidate-detail">
      <Heder />
      
      <div className="candidate-detail-container">
        <button onClick={handleBackToVote} className="back-to-vote">
          ← Back to Vote
        </button>

        <div className="candidate-header">
          <div className="candidate-image-container">
            <img 
              src={candidateData.imagen?.data?.attributes?.url || '/img/candidate-placeholder.png'} 
              alt={candidateData.nombre}
              className="candidate-image"
            />
            <div className="candidate-status">
              <span className="status-badge">Candidato</span>
            </div>
          </div>
          
          <div className="candidate-info">
            <h1 className="candidate-name">{candidateData.nombre}</h1>
            <p className="candidate-symbol">${candidateData.symbol || candidateData.nombre?.substring(0, 3).toUpperCase()}</p>
            <p className="candidate-description">{candidateData.descripcion}</p>
            
            <div className="vote-stats">
              <div className="vote-count">
                <span className="vote-number">{candidateData.totalVotos || 0}</span>
                <span className="vote-label">votos</span>
              </div>
              
              <button 
                onClick={handleVote}
                disabled={!isAuthenticated || hasVoted || voting}
                className={`vote-button ${hasVoted ? 'voted' : ''}`}
              >
                {voting ? 'Votando...' : 
                 hasVoted ? '✓ Ya votaste' : 
                 !isAuthenticated ? 'Inicia sesión para votar' : 
                 'Votar por este candidato'}
              </button>
            </div>
          </div>
        </div>

        <div className="candidate-details-section">
          <div className="candidate-proposal">
            <h2>Propuesta del Token</h2>
            <div className="proposal-content">
              <p>{candidateData.propuesta || candidateData.descripcion}</p>
              
              <div className="proposal-features">
                <h3>Características principales:</h3>
                <ul>
                  <li>Token meme innovador en Solana</li>
                  <li>Comunidad activa y comprometida</li>
                  <li>Roadmap claro y ejecutable</li>
                  <li>Equipo experimentado</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="voting-info">
            <h2>Información de Votación</h2>
            
            <div className="voting-rules">
              <div className="rule-item">
                <span className="rule-icon">🗳️</span>
                <div className="rule-content">
                  <h4>Un voto por usuario</h4>
                  <p>Solo puedes votar una vez por candidato</p>
                </div>
              </div>
              
              <div className="rule-item">
                <span className="rule-icon">⏰</span>
                <div className="rule-content">
                  <h4>Votación limitada</h4>
                  <p>La votación cierra cada semana</p>
                </div>
              </div>
              
              <div className="rule-item">
                <span className="rule-icon">🏆</span>
                <div className="rule-content">
                  <h4>Ganador semanal</h4>
                  <p>El más votado pasa a "Next"</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="candidate-roadmap">
          <h2>Roadmap si es seleccionado</h2>
          <div className="roadmap-steps">
            <div className="roadmap-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Desarrollo del Token</h4>
                <p>Creación y configuración del token en Solana</p>
              </div>
            </div>
            
            <div className="roadmap-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Lanzamiento</h4>
                <p>Deploy en mainnet y listado inicial</p>
              </div>
            </div>
            
            <div className="roadmap-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Crecimiento</h4>
                <p>Marketing y expansión de la comunidad</p>
              </div>
            </div>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="auth-prompt">
            <h3>¿Te gusta este candidato?</h3>
            <p>Inicia sesión para votar y ayudar a que este token sea lanzado</p>
            <button onClick={() => navigate('/auth')} className="auth-button">
              Iniciar Sesión para Votar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};