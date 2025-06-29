import { useParams } from 'react-router-dom';
import './PlaceDetailsPage.scss';
import { Breadcrumbs } from './components/Breadcrumbs';
import { useState, useEffect, useRef } from 'react';
import { InfoSection } from './components/InfoSection';
import { AboutSection } from './components/AboutSection';
import { FeedbackSection } from './components/FeedbackSection/FeedbackSection';

export const PlaceDetailsPage: React.FC = () => {
  const { id } = useParams();
  const totalImages = 5;
  const animationDuration = 600;

  const [currentImageIndex, setCurrentImageIndex] = useState(1);
  const [prevImageIndex, setPrevImageIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const place = {
    id: id!, // Здесь лучше заменить на проверку, если нужно
    name: `Place 1`,
    rating: 4.6,
    reviewsCount: 330,
    city: 'Kyiv',
    address: '18/1, Prorizna Street, Kyiv',
    workSchedule: 'Mon–Sun 08:00–20:00',
    descriptionShort:
      'A cozy spot with big windows, specialty coffee, and homemade pastries — perfect for work sessions or slow mornings with a book.',
    descriptionFull:
      'Our café is a warm and welcoming space where quality coffee meets calm atmosphere...',
    reviews: [
      {
        userName: 'Maria',
        starCount: 5,
        text: `Very nice place.
First of all, the waiters are friendly, smiling, trying to help, just kind ♥️
No smell of the kitchen++ The sun is shining, it's warm, cozy and you enjoy it.
Fast service, delicious coffee, waffles, and tart🥰 One of the most delicious I've ever tried.`,
      },
      {
        userName: 'Maria',
        starCount: 5,
        text: `Very nice place.
First of all, the waiters are friendly, smiling, trying to help, just kind ♥️
No smell of the kitchen++ The sun is shining, it's warm, cozy and you enjoy it.
Fast service, delicious coffee, waffles, and tart🥰 One of the most delicious I've ever tried.`,
      },
    ],
    tags: ['Work-friendly', 'Specialty coffee', 'Cozy vibe', 'Brunch & snacks'],
  };

  // свайпы
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

  // автосмена
  useEffect(() => {
    const iv = setInterval(handleNext, 10000);
    return () => clearInterval(iv);
  }, [currentImageIndex]);

  // свайпы
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

  // URL для Google Maps с адресом
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
          <button onClick={handlePrev} className="placeDetails__btn">
            ←
          </button>

          <div className="placeDetails__image-wrapper">
            {isAnimating && prevImageIndex && (
              <img
                src={`./img/1/${prevImageIndex}.jpg`}
                alt=""
                className="placeDetails__image fade-out"
              />
            )}
            <img
              src={`./img/1/${currentImageIndex}.jpg`}
              alt=""
              className={`placeDetails__image ${isAnimating ? 'fade-in' : ''}`}
            />

            <div className="placeDetails__counter">
              {currentImageIndex} / {totalImages}
            </div>
          </div>

          <button onClick={handleNext} className="placeDetails__btn">
            →
          </button>
        </div>
      </div>

      <div className="placeDetails__header">
        <h3 className="placeDetails__title">{place.name}</h3>
        <div className="placeDetails__rating">
          <img
            src="./icons/star.png"
            alt="Star rating"
            className="placeDetails__icon-star"
          />
          <span className="placeDetails__rating-count body-font-1">{place.rating}</span>
          <span className="placeDetails__reviews-count body-font-1">
            {`(${place.reviewsCount})`}
          </span>
        </div>

        {/* Адрес — открывает Google Maps в новой вкладке */}
        <div className="placeDetails__location-wrapper">
          <img src="./icons/location.png" alt="Location icon" className="placeDetails__icon-location" />
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
            <img
              src="./icons/star.png"
              alt="Star rating"
              className="placeDetails__icon-star"
            />
            <span className="placeDetails__rating-count body-font-1">{place.rating}</span>
            <span className="placeDetails__reviews-count body-font-1">
              {`(${place.reviewsCount})`}
            </span>
          </div>
        </div>

        <div className="placeDetails__reviews-list">
          {place.reviews.map((review, index) => (
            <div key={index} className="placeDetails__review">
              <div className="placeDetails__review-header">
                <div className="placeDetails__review-username">{review.userName}</div>
                <div className="placeDetails__review-stars">
                  {Array.from({ length: review.starCount }, (_, i) => (
                    <span key={i}>
                      <img
                        src="./icons/star.png"
                        alt="Star rating"
                        className="placeDetails__icon-star"
                      />
                    </span>
                  ))}
                </div>
              </div>
              <span className="placeDetails__review-text body-font-1">{review.text}</span>
            </div>
          ))}
        </div>
      </div>

      <FeedbackSection />
    </div>
  );
};