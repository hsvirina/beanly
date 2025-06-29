import './WelcomeBlock.scss';

export const WelcomeBlock: React.FC = () => {
  return (
    <div className="welcomeBlock">
      <div className="welcomeBlock__content">
        <h3 className="welcomeBlock__title">
          Explore <span className="welcomeBlock__highlight">the best</span> cafés in your area
        </h3>
        <span className="welcomeBlock__description body-font-1">
          Find your perfect café with just a few clicks. Browse through our curated list and discover your new favorite spot.
        </span>
        <div className="welcomeBlock__info">
          <div className="welcomeBlock__info-block">
            <h5 className="welcomeBlock__info-number">80%</h5>
            <span className="welcomeBlock__info-next body-font-1">Cozy, Instagrammable, and Perfect for Work</span>
          </div>
          <div className="welcomeBlock__info-block">
            <h5 className="welcomeBlock__info-number">30%</h5>
            <span className="welcomeBlock__info-next body-font-1">Affordable Options for Every Budget</span>
          </div>
        </div>
        <button className="welcomeBlock__button button-font">
          Go to Catalog
        </button>
      </div>

      <div className="welcomeBlock__image-wrapper">
        <img src="./placeholder-image.jpg" alt="Placeholder Image" className="welcomeBlock__image" />
      </div>
    </div>
  );
};