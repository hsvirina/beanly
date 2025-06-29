import { ProfileSettings } from './components/ProfileSettings';
import './ProfilePage.scss';

const Theme = {
  Light: 'light',
  Dark: 'dark',
} as const;

const Language = {
  English: 'ENG',
  Ukrainian: 'UKR',
} as const;

const user = {
  userName: 'Sarah Johnson',
  location: 'Kyiv, Ukraine',
  status: 'Coffee enthusiast and digital nomad. Always on the hunt for the perfect espresso!',
  fullName: 'Sarah Johnson',
  email: 'sarah.johnson@email.com', // ОБЯЗАТЕЛЬНО ПОТОМ УДАЛИТЬ И ВЫТЯГИВАТЬ ЕМЕЙЛ ИЗ ТОКЕНА
  photoURL: './photos/profile-photo.jpg',
  settings: {
    theme: Theme.Light,
    language: Language.English,
    notifications: {
      email: false,
      push: true,
      review: true
    },
    privacy: {
      locationSharing: false
    }
  }
};

export const ProfilePage: React.FC = () => {
  return (
    <div className="profilePage">
      <div className="profilePage__personal">
        <div className="profilePage__personal-top">
          <div className="profilePage__personal-top-left">
            <img src={user.photoURL} alt="Photo Profile" className="profilePage__personal-image" />
            <div className="profilePage__personal-top-left-wrapper">
              <h3 className="profilePage__personal-name">{user.userName}</h3>
              <span className="profilePage__personal-location body-font-1">{user.location}</span>
              <span className="profilePage__personal-status body-font-1">{user.status}</span>
            </div>
          </div>
          <button className="profilePage__personal-button-edit button-font">Edit Profile</button>
        </div>
        <div className="profilePage__personal-bottom">
          <div className="profilePage__personal-block">
            <div className="profilePage__personal-wrapper-image">
              <img src="./icons/id-pass.png" alt="Full name profile icon" className="profilePage__personal-icon" />
            </div>
            <div className="profilePage__personal-wrapper">
              <span className="profilePage__personal-title body-font-1">Full Name</span>
              <span className="profilePage__personal-value menu-text-font">{user.fullName}</span>
            </div>
          </div>
          <div className="profilePage__personal-block">
            <div className="profilePage__personal-wrapper-image">
              <img src="./icons/location.png" alt="Location icon" className="profilePage__personal-icon" />
            </div>
            <div className="profilePage__personal-wrapper">
              <span className="profilePage__personal-title body-font-1">Location</span>
              <span className="profilePage__personal-value menu-text-font">{user.location}</span>
            </div>
          </div>
          <div className="profilePage__personal-block">
            <div className="profilePage__personal-wrapper-image">
              <img src="./icons/letter.png" alt="Email icon" className="profilePage__personal-icon" />
            </div>
            <div className="profilePage__personal-wrapper">
              <span className="profilePage__personal-title body-font-1">Email</span>
              <span className="profilePage__personal-value menu-text-font">{user.email}</span>
            </div>
          </div>
        </div>
      </div>


      <div className="profilePage__favorites">
        <h4>Favorite Cafés</h4>
      </div>
      <ProfileSettings user={user} />

      <button className="profilePage__button ">Save All Changes</button>
    </div>
  );
};