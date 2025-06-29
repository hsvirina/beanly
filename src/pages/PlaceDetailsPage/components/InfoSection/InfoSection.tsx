import './InfoSection.scss';

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


export const InfoSection: React.FC<Props> = ({ place }) => {
  return (
    <div className="infoSection">
      <h5 className="infoSection__name">Information</h5>
      <div className="infoSection-container">
        <div className="infoSection-block">
          <img src="./icons/clock.png" alt="Clock icon" className="infoSection-icon" />
          <div className="infoSection-wrapper">
            <span className="infoSection-name menu-text-font">Opening Hours</span>
            <span className="infoSection-value body-font-1">{place.workSchedule}</span>
          </div>
        </div>
        <div className="infoSection-block">
          <img src="./icons/laptop.png" alt="Laptop icon" className="infoSection-icon" />
          <div className="infoSection-wrapper">
            <span className="infoSection-name menu-text-font">Wi-Fi</span>
            <span className="infoSection-value body-font-1">{place.workSchedule}</span>
          </div>
        </div>
        <div className="infoSection-block">
          <img src="./icons/pet.png" alt="Pet icon" className="infoSection-icon" />
          <div className="infoSection-wrapper">
            <span className="infoSection-name menu-text-font">Pet-friendly</span>
            <span className="infoSection-value body-font-1">{place.workSchedule}</span>
          </div>
        </div>
        <div className="infoSection-block">
          <img src="./icons/accessibility.png" alt="Accessibility icon" className="infoSection-icon" />
          <div className="infoSection-wrapper">
            <span className="infoSection-name menu-text-font">Accessibility</span>
            <span className="infoSection-value body-font-1">{place.workSchedule}</span>
          </div>
        </div>
      </div>

    </div>

  );
};