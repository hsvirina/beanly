import { useParams } from 'react-router-dom';
import './PlaceDetailsPage.scss';
import { Breadcrumbs } from './components/Breadcrumbs';
import { useState, useEffect, useRef, useContext } from 'react';
import { InfoSection } from './components/InfoSection';
import { AboutSection } from './components/AboutSection';
import { FeedbackSection } from './components/FeedbackSection/FeedbackSection';
import type { Cafe } from '../../types/Cafe';
import { GlobalContext } from '../../store/GlobalContext';

export const PlaceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { cafes, loading, error } = useContext(GlobalContext);

  const place: Cafe | undefined = cafes.find(c => c.id === Number(id));

  const totalImages = place?.photoUrls.length || 0;
  const animationDuration = 600;

  const [currentImageIndex, setCurrentImageIndex] = useState(1);
  const [prevImageIndex, setPrevImageIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const triggerChange = (next: number) => {
    setPrevImageIndex(currentImageIndex);
    setCurrentImageIndex(next);
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setPrevImageIndex(null);
    }, animationDuration);
  };

  const handlePrev = () => {
    const next = currentImageIndex === 1 ? totalImages : currentImageIndex - 1;
    triggerChange(next);
  };

  const handleNext = () => {
    const next = currentImageIndex === totalImages ? 1 : currentImageIndex + 1;
    triggerChange(next);
  };

  useEffect(() => {
    const iv = setInterval(handleNext, 10000);
    return () => clearInterval(iv);
  }, [currentImageIndex]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;
  if (!place) return <p>Кафе не найдено</p>;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    place.address + ', ' + place.city
  )}`;

  return (
    <div className="placeDetails">
      <div className="placeDetails__top-section">
        <div className="placeDetails__breadcrumbs">
          <Breadcrumbs />
        </div>

        <div
          className="placeDetails__carousel"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button onClick={handlePrev} className="placeDetails__btn">←</button>

          <div className="placeDetails__image-wrapper">
            {isAnimating && prevImageIndex && (
              <img
                src={place.photoUrls[prevImageIndex - 1]}
                alt=""
                className="placeDetails__image fade-out"
              />
            )}
            <img
              src={place.photoUrls[currentImageIndex - 1]}
              alt=""
              className={`placeDetails__image ${isAnimating ? 'fade-in' : ''}`}
            />
            <div className="placeDetails__counter">
              {currentImageIndex} / {totalImages}
            </div>
          </div>

          <button onClick={handleNext} className="placeDetails__btn">→</button>
        </div>
      </div>

      <div className="placeDetails__header">
        <h3 className="placeDetails__title">{place.name}</h3>
        <div className="placeDetails__rating">
          <img src="/icons/star.png" alt="Star" className="placeDetails__icon-star" />
          <span className="placeDetails__rating-count body-font-1">{place.rating}</span>
          <span className="placeDetails__reviews-count body-font-1">
            ({place.reviewCount})
          </span>
        </div>

        <div className="placeDetails__location-wrapper">
          <img src="/icons/location.png" alt="Location icon" className="placeDetails__icon-location" />
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="placeDetails__address body-font-1"
          >
            {place.address}
          </a>
        </div>
      </div>

      <InfoSection place={place} />
      <AboutSection place={place} />

      <div className="placeDetails__reviews">
        <div className="placeDetails__reviews-wrapper">
          <h5 className="placeDetails__name">Reviews</h5>
          <div className="placeDetails__rating">
            <img src="/icons/star.png" alt="Star" className="placeDetails__icon-star" />
            <span className="placeDetails__rating-count body-font-1">{place.rating}</span>
            <span className="placeDetails__reviews-count body-font-1">({place.reviewCount})</span>
          </div>
        </div>
      </div>

      <FeedbackSection />
    </div>
  );
};
