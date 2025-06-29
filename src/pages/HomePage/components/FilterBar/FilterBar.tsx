import './FilterBar.scss';

export const FilterBar: React.FC = () => {
  return (
    <div className="filterbar">
      <div className="filterbar__menu">
        <div className="filterbar__item">
          <span className="filterbar__label menu-text-font">Location</span>
          <span className="filterbar__hint body-font-1">Look for options</span>
        </div>
        <div className="filterbar__item">
          <span className="filterbar__label menu-text-font">Purpose</span>
          <span className="filterbar__hint body-font-1">Visit goal</span>
        </div>
        <div className="filterbar__item">
          <span className="filterbar__label menu-text-font">Amenities</span>
          <span className="filterbar__hint body-font-1">Bonus comfort</span>
        </div>
        <div className="filterbar__item">
          <span className="filterbar__label menu-text-font">Style / Vibe</span>
          <span className="filterbar__hint body-font-1">Design feel</span>
        </div>
      </div>

      <button className="filterbar__button">
        <img
          src="./icons/search-white.svg"
          className="filterbar__icon"
          alt="search-button"
        />
        <span className="button-font">Search</span>
      </button>
    </div>
  );
};

