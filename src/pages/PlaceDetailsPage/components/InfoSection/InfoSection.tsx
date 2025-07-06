import type { Cafe } from '../../../../types/Cafe';
import './InfoSection.scss';

interface Props {
  place: Cafe;
}


export const InfoSection: React.FC<Props> = ({ place }) => {
  return (
    <div className="infoSection">
      <h5 className="infoSection__name">Information</h5>
      <div className="infoSection-container">
        <div className="infoSection-block">
          <img src="./icons/clock.png" alt="Clock icon" className="infoSection-icon" />
          <div className="infoSection-wrapper">
            <span className="infoSection-name menu-text-font">Opening Hours</span>
            <span className="infoSection-value body-font-1">{place.workingHours}</span>
          </div>
        </div>
        <div className="infoSection-block">
          <img src="./icons/laptop.png" alt="Laptop icon" className="infoSection-icon" />
          <div className="infoSection-wrapper">
            <span className="infoSection-name menu-text-font">Wi-Fi</span>
            <span className="infoSection-value body-font-1">{place.workingHours}</span>
          </div>
        </div>
        <div className="infoSection-block">
          <img src="./icons/pet.png" alt="Pet icon" className="infoSection-icon" />
          <div className="infoSection-wrapper">
            <span className="infoSection-name menu-text-font">Pet-friendly</span>
            <span className="infoSection-value body-font-1">{place.workingHours}</span>
          </div>
        </div>
        <div className="infoSection-block">
          <img src="./icons/accessibility.png" alt="Accessibility icon" className="infoSection-icon" />
          <div className="infoSection-wrapper">
            <span className="infoSection-name menu-text-font">Accessibility</span>
            <span className="infoSection-value body-font-1">{place.workingHours}</span>
          </div>
        </div>
      </div>

    </div>

  );
};