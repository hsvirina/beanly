import { useContext } from 'react';
import { SliderPlaces } from '../../modules/shared/SliderPlaces/SliderPlaces';
import { FilterBar } from './components/FilterBar';
import { WelcomeBlock } from './components/WelcomeBlock';
import './HomePage.scss';
import { GlobalContext } from '../../store/GlobalContext';

export const HomePage: React.FC = () => {
  const { cafes } = useContext(GlobalContext);

  const popularCafes = [...cafes].sort((a, b) => b.rating - a.rating);

  return (
    <div className="homepage">
      <h1 className="homePage__title">
        Your next favorite café is just a <span className="homePage__highlight">click</span> away
      </h1>
      <FilterBar />

      <SliderPlaces places={cafes} title='Coffee Places You’ll Love' />

      <WelcomeBlock />

      <SliderPlaces places={popularCafes} title="Most Popular" />
    </div>
  )
};
