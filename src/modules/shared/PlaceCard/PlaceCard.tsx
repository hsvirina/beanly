import React from 'react';
import './PlaceCard.scss';
import { Link } from 'react-router-dom';

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
    <Link to={`/catalog/${place.id}`} className="placeCard">
      <img src={`./img/1/1.jpg`} alt="Place Image" className="placeCard__image" />
      <div className="placeCard__info">
        <div className="placeCard__header">
          <h5 className="placeCard__title">{place.name}</h5>
          <div className="placeCard__rating">
            <span className="placeCard__rating-count body-font-1">{place.rating}</span>
            <img src="./icons/star.png" alt="Star rating" className="placeCard__rating-star" />
          </div>
        </div>

        <span className="placeCard__description body-font-1">
          {place.descriptionShort}
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
          {/* <img src="https://i.postimg.cc/3wXN5JDw/5341732430870084417.jpg" alt="Icon Arrow Down Right" className="placeCard__icon" /> */}
        </div>
      </div>
    </Link>
  );
};
