import { FilterBar } from './components/FilterBar';
import { PopularPlaces } from './components/PopularPlaces';
import './HomePage.scss';

export const HomePage: React.FC = () => {
  return (
    <div className="homepage">
      <h1 className="homePage__title">Your next favorite café is just a click away</h1>
      <FilterBar />

      <PopularPlaces />
    </div>
  )
};
