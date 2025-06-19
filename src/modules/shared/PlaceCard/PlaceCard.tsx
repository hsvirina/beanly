import React from 'react';
import './PlaceCard.scss';

interface Place {
  id: number;
  name: string;
  rating: number;
  reviewsCount: number;
  city: string;
  address: string;
  workSchedule: string;
  descriptionShort: string;
  descriptionFull: string;
  review: string;
  tags: string[];
}

export const PlaceCard: React.FC<{ place: Place }> = ({ place }) => {
  return (
    <div className="placeCard">
      <img src={`./img/1/1.jpg`} alt="Place Image" className="placeCard__image" />
      <div className="placeCard__info">
        <div className="placeCard__header">
          <h5 className="placeCard__title">{place.name}</h5>
          <div className="placeCard__rating">
            <span className="placeCard__rating-count">{place.rating}</span>
            <span className="placeCard__rating-star">⭐️</span>
          </div>
        </div>

        <span className="placeCard__description">
          {place.descriptionShort}
        </span>

        <div className="placeCard__divider"></div>

        <div className="placeCard__tags">
          {place.tags.map((tag, index) => (
            <span key={index} className="placeCard__tag">{tag}</span>
          ))}
        </div>

        <div className="placeCard__footer">
          <div className="placeCard__location">
            <span className="placeCard__location-icon">📍</span>
            <span className="placeCard__address">{place.address}</span>
          </div>
          <img src="./icons/arrow-down-right.svg" alt="Icon Arrow Down Right" className="placeCard__icon" />
        </div>        
      </div>
    </div>
  );
};
