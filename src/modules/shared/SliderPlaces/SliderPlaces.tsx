import { useState } from 'react';
import './SliderPlaces.scss';
import { PlaceCard } from '../PlaceCard';
import type { Cafe } from '../../../types/Cafe';

type Props = {
  title: string;
  places: Cafe[];
};

export const SliderPlaces: React.FC<Props> = ({ places, title }) => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 4;

  const CARD_WIDTH = 315;
  const GAP = 20;
  const shift = startIndex * (CARD_WIDTH + GAP);

  const prev = () => setStartIndex((i) => Math.max(i - 1, 0));
  const next = () =>
    setStartIndex((i) => Math.min(i + 1, places.length - visibleCount));

  return (
    <div className="sliderPlaces">
      <div className="sliderPlaces__header">
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
        <h3 className="sliderPlaces__title">{title}</h3>
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

      <div className="sliderPlaces__sliders">
        <div
          className="sliderPlaces__sliderTrack"
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