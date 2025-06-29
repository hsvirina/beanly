import React from 'react';
import './FeedbackSection.scss';

export const FeedbackSection: React.FC = () => {
  return (
    <div className="feedbackSection">
      <h5 className="feedbackSection__title">Like Larks & Owls? </h5>

      <span className="feedbackSection__description body-font-1">Help other coffee lovers discover this place by sharing your experience!</span>

      <div className="feedbackSection__buttons">
        <button className="feedbackSection__button feedbackSection__button--blue button-font">
          <img src="./icons/solar_star-linear.png" alt="Star icon" className="feedbackSection__icon" />
          <span>Leave a Review</span>
        </button>
        <button className="feedbackSection__button button-font">
          <img src="./icons/heart-blue.png" alt="Heart icon" className="feedbackSection__icon" />
          <span>Save to Favorites</span>
        </button>
        
        <button className="feedbackSection__button button-font">
          <img src="./icons/share.png" alt="Share icon" className="feedbackSection__icon" />
          <span>Share Link</span>
        </button>
      </div>
    </div>
  );
};
