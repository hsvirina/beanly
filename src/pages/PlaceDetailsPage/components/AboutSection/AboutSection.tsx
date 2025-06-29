import React from 'react';
import './AboutSection.scss';

export interface Review {
  userName: string;
  starCount: number;
  text: string;
}

export interface Place {
  id: string;
  name: string;
  rating: number;
  reviewsCount: number;
  city: string;
  address: string;
  workSchedule: string;
  descriptionShort: string;
  descriptionFull: string;
  reviews: Review[];
  tags: string[];
}

// Тип пропсов — у компонента ровно один проп `place`
interface Props {
  place: Place;
}

export const AboutSection: React.FC<Props> = ({ place }) => {
  return (
    <div className="AboutSection">
      <div className="placeDetails__about">
        <h5 className="placeDetails__name">About Cafe</h5>
        <span className="placeDetails__content body-font-1">
          Our café is a warm and welcoming space where quality coffee meets calm atmosphere. We serve freshly brewed drinks made from locally roasted beans, along with homemade treats. Whether you're here to work, relax, or catch up with friends — it’s a place to slow down and enjoy the moment.
        </span>
        <div className="placeDetails__content-tags">
          {place.tags.map((tag, index) => (
            <span key={index} className="placeDetails__tag body-font-1">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
