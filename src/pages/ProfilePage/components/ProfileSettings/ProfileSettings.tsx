import React from 'react';
import { CustomDropdown } from '../Dropdown';
import { ToggleSwitch } from '../ToggleSwitch';
import './ProfileSettings.scss';
import type { Settings } from '../../../../types/Settings';
import { Language } from '../../../../types/Language';
import { Theme } from '../../../../types/Theme';

type Props = {
  settings: Settings;
  onChange: (settings: Settings) => void;
};

const ProfileSettings: React.FC<Props> = ({ settings, onChange }) => {
  // Хелпер для обновления вложенных полей
  const update = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    onChange({ ...settings, [key]: value });
  };

  const updateNotif = (field: keyof Settings['notifications'], value: boolean) => {
    onChange({
      ...settings,
      notifications: { ...settings.notifications, [field]: value },
    });
  };

  const updatePrivacy = (field: keyof Settings['privacy'], value: boolean) => {
    onChange({
      ...settings,
      privacy: { ...settings.privacy, [field]: value },
    });
  };

  return (
    <div className="profileSettings">
      <h4 className="profileSettings__title">Settings</h4>
      <span className="profileSettings__description body-font-1">
        Manage your account preferences
      </span>

      {/* Appearance */}
      <div className="profileSettings__block">
        <h5 className="profileSettings__block-title">Appearance</h5>
        <div className="profileSettings__block-wrapper">
          <div className="profileSettings__block-item">
            <div className="profileSettings__block-item-content">
              <h6 className="profileSettings__set-title">Theme</h6>
              <span className="profileSettings__set-description body-font-1">
                Choose your preferred color scheme
              </span>
            </div>
            <CustomDropdown
              label="Language"
              description="Select your preferred language"
              options={Object.values(Language)}
              selected={settings.language}
              onSelect={lang => update('language', lang)}
            />
          </div>
          <div className="profileSettings__block-item">
            <div className="profileSettings__block-item-content">
              <h6 className="profileSettings__set-title">Language</h6>
              <span className="profileSettings__set-description body-font-1">
                Select your preferred language
              </span>
            </div>
            <CustomDropdown
              label="Theme"
              description="Choose your preferred color scheme"
              options={Object.values(Theme)}
              selected={settings.theme}
              onSelect={theme => update('theme', theme)}
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="profileSettings__block">
        <h5 className="profileSettings__block-title">Notifications</h5>
        <div className="profileSettings__block-wrapper">
          {(['email', 'push', 'review'] as const).map((field) => (
            <div className="profileSettings__block-item" key={field}>
              <div className="profileSettings__block-item-content">
                <h6 className="profileSettings__set-title">
                  {field.charAt(0).toUpperCase() + field.slice(1)} Notifications
                </h6>
                <span className="profileSettings__set-description body-font-1">
                  {field === 'email'
                    ? 'Receive updates about new cafés and reviews'
                    : field === 'push'
                      ? 'Get notified about nearby café recommendations'
                      : 'Get notified when someone likes your reviews'}
                </span>
              </div>
              <ToggleSwitch
                isOn={settings.notifications[field]}
                onToggle={() =>
                  updateNotif(field, !settings.notifications[field])
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="profileSettings__block">
        <h5 className="profileSettings__block-title">Privacy</h5>
        <div className="profileSettings__block-wrapper">
          <div className="profileSettings__block-item">
            <div className="profileSettings__block-item-content">
              <h6 className="profileSettings__set-title">
                Location Sharing
              </h6>
              <span className="profileSettings__set-description body-font-1">
                Allow the app to access your location for recommendations
              </span>
            </div>
            <ToggleSwitch
              isOn={settings.privacy.locationSharing}
              onToggle={() =>
                updatePrivacy('locationSharing', !settings.privacy.locationSharing)
              }
            />
          </div>
        </div>
      </div>

      {/* Account */}
      <div className="profileSettings__block">
        <h5 className="profileSettings__block-title">Account</h5>
        <div className="profileSettings__block-buttons">
          <button className="profileSettings__button button-font">
            Export Data
          </button>
          <button className="profileSettings__button button-font">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;