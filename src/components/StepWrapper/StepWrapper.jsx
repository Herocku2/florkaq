import React from "react";
import PropTypes from "prop-types";
import { BanerMovil } from "../../components/BanerMovil";
import "./StepWrapper.css";

export const StepWrapper = ({ 
  className = "", 
  headerImage, 
  bannerFrame, 
  bannerProps = {},
  children,
  stepCount = 3,
  currentStep = 1
}) => {
  const renderStepIndicator = () => {
    const steps = [];
    for (let i = 1; i <= stepCount; i++) {
      const isActive = i <= currentStep;
      const isCompleted = i < currentStep;
      
      steps.push(
        <div key={i} className="step-indicator">
          <div className={`step-circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
            <div className="step-number">{i}</div>
          </div>
        </div>
      );
      
      if (i < stepCount) {
        steps.push(<div key={`line-${i}`} className="step-line" />);
      }
    }
    return steps;
  };

  return (
    <div className={`step-wrapper ${className}`}>
      {headerImage && (
        <img className="header-image" alt="Header" src={headerImage} />
      )}

      <div className="title-section" />

      <BanerMovil
        className="banner-mobile"
        frame={bannerFrame}
        {...bannerProps}
      />
      
      <div className="content-container">
        <div className="step-indicator-container">
          {renderStepIndicator()}
        </div>
        
        <div className="step-content">
          {children}
        </div>
      </div>
    </div>
  );
};

StepWrapper.propTypes = {
  className: PropTypes.string,
  headerImage: PropTypes.string,
  bannerFrame: PropTypes.string,
  bannerProps: PropTypes.object,
  children: PropTypes.node.isRequired,
  stepCount: PropTypes.number,
  currentStep: PropTypes.number
};