import React from 'react';
import './PlaceCard.scss';
import { Link } from 'react-router-dom';
import type { Cafe } from '../../../types/Cafe';

type Props = {
  place: Cafe,
}

export const PlaceCard: React.FC<Props> = ({ place }) => {
  return (
    <Link to={`/catalog/${place.id}`} className="placeCard">
      <img src={place.photoUrls[0]} alt="Place Image" className="placeCard__image" />
      <div className="placeCard__info">
        <div className="placeCard__header">
          <h5 className="placeCard__title">{place.name}</h5>
          <div className="placeCard__rating">
            <span className="placeCard__rating-count body-font-1">{place.rating}</span>
            <img src="./icons/star.png" alt="Star rating" className="placeCard__rating-star" />
          </div>
        </div>

        <span className="placeCard__description body-font-1">
          {place.shortDescription}
        </span>

        <div className="placeCard__divider"></div>

        <div className="placeCard__tags">
          {place.tags.map((tag, index) => (
            <span key={index} className="placeCard__tag body-font-2">{tag}</span>
          ))}
        </div>

        <div className="placeCard__footer">
          <div className="placeCard__location">
            <img
              src={`./icons/location.png`}
              alt="Location Icon"
              className="placeCard__location-icon"
            />
            <span className="placeCard__address body-font-1">{place.address}</span>
          </div>
          <img src="./icons/arrow-down-right.svg" alt="Icon Arrow Down Right" className="placeCard__icon" />
        </div>
      </div>
    </Link>
  );
};
