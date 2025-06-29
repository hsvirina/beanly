import { SliderPlaces } from '../../modules/shared/SliderPlaces/SliderPlaces';
import { FilterBar } from './components/FilterBar';
import { WelcomeBlock } from './components/WelcomeBlock';
import './HomePage.scss';

export const HomePage: React.FC = () => {
  return (
    <div className="homepage">
      <h1 className="homePage__title">
        Your next favorite café is just a <span className="homePage__highlight">click</span> away
      </h1>
      <FilterBar />

      <SliderPlaces title='Coffee Places You’ll Love' />

      <WelcomeBlock />

      <SliderPlaces title='Most Popular' />
    </div>
  )
};
