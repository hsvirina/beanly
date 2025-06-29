import { CustomDropdown } from '../Dropdown';
import { ToggleSwitch } from '../ToggleSwitch';
import './ProfileSettings.scss';
import { useState } from 'react';

export const Theme = {
  Light: 'light',
  Dark: 'dark',
} as const;

const Language = {
  English: 'ENG',
  Ukrainian: 'UKR',
} as const;

const LanguageDisplayMap: Record<Language, string> = {
  ENG: 'English',
  UKR: 'Ukrainian',
};

export type Language = typeof Language[keyof typeof Language];

export type Theme = typeof Theme[keyof typeof Theme];

type Settings = {
  theme: Theme;
};

type User = {
  userName: string;
  location: string;
  status: string;
  fullName: string;
  email: string;
  photoURL: string;
  settings: Settings;
};

type Props = {
  user: User;
};

export const ProfileSettings: React.FC<Props> = ({ user }) => {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(user.settings.theme);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('ENG');
  const [emailNotifications, setEmailNotifications] = useState<boolean>(false);
  const [pushNotifications, setPushNotifications] = useState<boolean>(true);
  const [reviewNotifications, setReviewNotifications] = useState<boolean>(true);
  const [locationSharing, setLocationSharing] = useState<boolean>(false);

  return (
    <div className="profileSettings">
      <h4 className="profileSettings__title">Settings</h4>
      <span className="profileSettings__description body-font-1">Manage your account preferences</span>

      <div className="profileSettings__block">
        <h5 className="profileSettings__block-title">Appearance</h5>
        <div className="profileSettings__block-wrapper">
          <div className="profileSettings__block-item">
            <div className="profileSettings__block-item-content">
              <h6 className="profileSettings__set-title">Theme</h6>
              <span className="profileSettings__set-description body-font-1">Choose your preferred color scheme</span>
            </div>

            <CustomDropdown
              label="Theme"
              description="Choose your preferred color scheme"
              options={Object.values(Theme)}
              selected={selectedTheme}
              onSelect={setSelectedTheme}
            />
          </div>
          <div className="profileSettings__block-item">
            <div className="profileSettings__block-item-content">
              <h6 className="profileSettings__set-title">Language</h6>
              <span className="profileSettings__set-description body-font-1">Select your preferred language</span>
            </div>

            <CustomDropdown
              label="Language"
              description="Select your preferred language"
              options={Object.values(Language)}
              selected={selectedLanguage}
              onSelect={setSelectedLanguage}
              displayMap={LanguageDisplayMap}
            />
          </div>
        </div>
      </div>

      <div className="profileSettings__block">
        <h5 className="profileSettings__block-title">Notifications</h5>
        <div className="profileSettings__block-wrapper">
          <div className="profileSettings__block-item">
            <div className="profileSettings__block-item-content">
              <h6 className="profileSettings__set-title">Email Notifications</h6>
              <span className="profileSettings__set-description body-font-1">
                Receive updates about new cafés and reviews
              </span>
            </div>

            <ToggleSwitch
              isOn={emailNotifications}
              onToggle={() => setEmailNotifications(!emailNotifications)}
            />
          </div>

          <div className="profileSettings__block-item">
            <div className="profileSettings__block-item-content">
              <h6 className="profileSettings__set-title">Push Notifications</h6>
              <span className="profileSettings__set-description body-font-1">
                Get notified about nearby café recommendations
              </span>
            </div>

            <ToggleSwitch
              isOn={pushNotifications}
              onToggle={() => setPushNotifications(!pushNotifications)}
            />
          </div>

          <div className="profileSettings__block-item">
            <div className="profileSettings__block-item-content">
              <h6 className="profileSettings__set-title">Review Notifications</h6>
              <span className="profileSettings__set-description body-font-1">
                Get notified when someone likes your reviews
              </span>
            </div>

            <ToggleSwitch
              isOn={reviewNotifications}
              onToggle={() => setReviewNotifications(!reviewNotifications)}
            />
          </div>
        </div>
      </div>

      <div className="profileSettings__block">
        <h5 className="profileSettings__block-title">Privacy</h5>
        <div className="profileSettings__block-wrapper">
          <div className="profileSettings__block-item">
            <div className="profileSettings__block-item-content">
              <h6 className="profileSettings__set-title">Location Sharing</h6>
              <span className="profileSettings__set-description body-font-1">
                Allow the app to access your location for recommendations
              </span>
            </div>

            <ToggleSwitch
              isOn={locationSharing}
              onToggle={() => setLocationSharing(!locationSharing)}
            />
          </div>
        </div>
      </div>

      <div className="profileSettings__block">
        <h5 className="profileSettings__block-title">Account</h5>
        <div className="profileSettings__block-buttons">
          <button className="profileSettings__button button-font">Export Data</button>
          <button className="profileSettings__button button-font">Delete Account</button>
        </div>
      </div>
    </div>
  );
};