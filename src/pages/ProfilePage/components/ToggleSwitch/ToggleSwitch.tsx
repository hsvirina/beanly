import React from 'react';
import './ToggleSwitch.scss';

type Props = {
  isOn: boolean;
  onToggle: () => void;
};

export const ToggleSwitch: React.FC<Props> = ({ isOn, onToggle }) => {
  return (
    <div
      className={`toggleSwitch ${isOn ? 'toggleSwitch--on' : 'toggleSwitch--off'}`}
      onClick={onToggle}
      role="switch"
      aria-checked={isOn}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <div className="toggleSwitch__handle" />
    </div>
  );
};