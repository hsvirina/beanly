import { PlaceCard } from '../../modules/shared/PlaceCard';
import './CatalogPage.scss';
import type { Cafe } from '../../types/Cafe';
import { useContext } from 'react';
import { GlobalContext } from '../../store/GlobalContext';


export const CatalogPage: React.FC = () => {
  const { cafes } = useContext(GlobalContext);

  return (
    <div className="catalogPage">
      <h2 className="catalogPage__title">Best Places to Sip & Chill</h2>

      <div className="catalogPage__filters">
        <div className="catalogPage__filters-top">
          <h5 className="catalogPage__filters-title">Filters</h5>
          <h6 className="catalogPage__filters-clear">Clear All</h6>
        </div>

        {/* Opening Hours */}
        <div className="catalogPage__filter">
          <h6 className="catalogPage__filter-title">🕒 Opening Hours</h6>
          <div className="catalogPage__filter-wrapper body-font-1">
            <label className="catalogPage__filter-option">
              <input type="checkbox" />
              <span className="catalogPage__checkbox-box"></span>
              Early Bird (Opens before 7am)
            </label>
            <label className="catalogPage__filter-option">
              <input type="checkbox" />
              <span className="catalogPage__checkbox-box"></span>
              Night Owl (Open past 10pm)
            </label>
            <label className="catalogPage__filter-option">
              <input type="checkbox" />
              <span className="catalogPage__checkbox-box"></span>
              Weekend Hours
            </label>
          </div>
        </div>

        <div className="catalogPage__filter-divider"></div>

        {/* Purpose */}
        <div className="catalogPage__filter">
          <h6 className="catalogPage__filter-title">🏷 Price range</h6>
          <div className="catalogPage__filter-wrapper body-font-1">
            <label className="catalogPage__filter-option">
              <input type="checkbox" />
              <span className="catalogPage__checkbox-box"></span>
              Free Wi-Fi
            </label>
            <label className="catalogPage__filter-option">
              <input type="checkbox" />
              <span className="catalogPage__checkbox-box"></span>
              Power Outlets
            </label>
            <label className="catalogPage__filter-option">
              <input type="checkbox" />
              <span className="catalogPage__checkbox-box"></span>
              Parking Available
            </label>
            <label className="catalogPage__filter-option">
              <input type="checkbox" />
              <span className="catalogPage__checkbox-box"></span>
              Wheelchair Accessible
            </label>
          </div>
        </div>

        <div className="catalogPage__filter-divider"></div>

        {/* Amenities */}
        <div className="catalogPage__filter">
          <h6 className="catalogPage__filter-title">⚡ Amenities</h6>
          <div className="catalogPage__filter-wrapper body-font-1">
            <label className="catalogPage__filter-option">
              <input type="checkbox" />
              <span className="catalogPage__checkbox-box"></span>
              Free Wi-Fi
            </label>
            <label className="catalogPage__filter-option">
              <input type="checkbox" />
              <span className="catalogPage__checkbox-box"></span>
              Power Outlets
            </label>
            <label className="catalogPage__filter-option">
              <input type="checkbox" />
              <span className="catalogPage__checkbox-box"></span>
              Parking Available
            </label>
            <label className="catalogPage__filter-option">
              <input type="checkbox" />
              <span className="catalogPage__checkbox-box"></span>
              Wheelchair Accessible
            </label>
          </div>
        </div>

        <div className="catalogPage__filter-divider"></div>

        {/* Vibe & Style */}
        <div className="catalogPage__filter">
          <h6 className="catalogPage__filter-title">✨ Vibe & Style</h6>
          <div className="catalogPage__filter-wrapper body-font-1">
            <label className="catalogPage__filter-option">
              <input type="checkbox" />
              <span className="catalogPage__checkbox-box"></span>
              Cozy & Intimate
            </label>
            <label className="catalogPage__filter-option">
              <input type="checkbox" />
              <span className="catalogPage__checkbox-box"></span>
              Modern & Minimalist
            </label>
            <label className="catalogPage__filter-option">
              <input type="checkbox" />
              <span className="catalogPage__checkbox-box"></span>
              Rustic & Vintage
            </label>
            <label className="catalogPage__filter-option">
              <input type="checkbox" />
              <span className="catalogPage__checkbox-box"></span>
              Artsy & Creative
            </label>
          </div>
        </div>

        <button className="catalogPage__apply-button button-font">Apply Filters</button>
      </div>

      <div className="catalogPage__places">
        {cafes.map((cafe: Cafe) => (
          <PlaceCard key={cafe.id} place={cafe} />
        ))}
      </div>
    </div>
  )
};
