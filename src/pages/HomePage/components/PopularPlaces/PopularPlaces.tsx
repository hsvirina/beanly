import { useState } from 'react';
import { PlaceCard } from '../../../../modules/shared/PlaceCard';
import './PopularPlaces.scss';

const places = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Place ${i + 1}`,
  rating: 4.6,
  reviewsCount: 330,
  city: 'Kyiv',
  address: '18/1, Prorizna Street, Kyiv',
  workSchedule: 'Mon–Sun 08:00–20:00',
  descriptionShort: 'A cozy spot with big windows, specialty coffee, and homemade pastries — perfect for work sessions or slow mornings with a book.',
  descriptionFull: 'Our café is a warm and welcoming space where quality coffee meets calm atmosphere...',
  review: 'Very nice place...',
  tags: ['Work-friendly', 'Specialty coffee', 'Cozy vibe', 'Brunch & snacks'],
}));

export const PopularPlaces: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 4;

  const CARD_WIDTH = 315;  // например, 270px
  const GAP = 20;
  const shift = startIndex * (CARD_WIDTH + GAP);

  const prev = () => setStartIndex((i) => Math.max(i - 1, 0));
  const next = () =>
    setStartIndex((i) => Math.min(i + 1, places.length - visibleCount));

  return (
    <div className="popularPlaces">
      <div className="popularPlaces__header">
        <img
          src="./icons/arrow-left.svg"
          alt="Icon Arrow Left"
          className="placeCard__icon"
          onClick={prev}
          style={{
            cursor: startIndex === 0 ? 'not-allowed' : 'pointer',
            opacity: startIndex === 0 ? 0.5 : 1,
          }}
        />
        <h3 className="popularPlaces__title">Popular Places</h3>
        <img
          src="./icons/arrow-right.svg"
          alt="Icon Arrow Right"
          className="placeCard__icon"
          onClick={next}
          style={{
            cursor:
              startIndex >= places.length - visibleCount
                ? 'not-allowed'
                : 'pointer',
            opacity:
              startIndex >= places.length - visibleCount ? 0.5 : 1,
          }}
        />
      </div>

      <div className="popularPlaces__sliders">
        <div
          className="popularPlaces__sliderTrack"
          style={{
            transform: `translateX(-${shift}px)`
          }}
        >
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </div>
    </div>
  );
};