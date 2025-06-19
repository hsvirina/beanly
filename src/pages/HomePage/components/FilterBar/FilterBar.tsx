import './FilterBar.scss';

export const FilterBar: React.FC = () => {
  return (
    <div className="filterbar">
      <div className="filterbar__menu">
        <div className="filterbar__item">
          <span className="filterbar__label">Location</span>
          <span className="filterbar__hint">Look for options</span>
        </div>
        <div className="filterbar__item">
          <span className="filterbar__label">Purpose</span>
          <span className="filterbar__hint">Visit goal</span>
        </div>
        <div className="filterbar__item">
          <span className="filterbar__label">Amenities</span>
          <span className="filterbar__hint">Bonus comfort</span>
        </div>
        <div className="filterbar__item">
          <span className="filterbar__label">Style / Vibe</span>
          <span className="filterbar__hint">Design feel</span>
        </div>
      </div>

      <button className="filterbar__button">
        <img
          src="./icons/search.svg"
          className="filterbar__icon"
          alt="search-button"
        />
        <span>Search</span>
      </button>
    </div>
  );
};

