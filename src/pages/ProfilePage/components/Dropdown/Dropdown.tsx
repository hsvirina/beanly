import { useState, useRef, useEffect } from 'react';
import './Dropdown.scss';

type Props<T extends string> = {
  label: string;
  description: string;
  options: readonly T[];
  selected: T;
  onSelect: (value: T) => void;
  displayMap?: Record<T, string>;
};

export function CustomDropdown<T extends string>({
  label,
  description,
  options,
  selected,
  onSelect,
  displayMap,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Закрываем дропдаун при клике вне его области
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Отобразить текст из displayMap или с заглавной буквы
  const displayText = (value: T) => {
    if (displayMap && displayMap[value]) {
      return displayMap[value];
    }
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <div className="profileSettings__dropdown-wrapper" ref={ref}>
      <label className="profileSettings__dropdown-label">{label}</label>
      <span className="profileSettings__dropdown-description">{description}</span>

      <div
        className={`profileSettings__dropdown ${open ? 'open' : ''}`}
        onClick={() => setOpen(!open)}
        tabIndex={0}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="profileSettings__dropdown-selected menu-text-font">
          {displayText(selected)}
        </span>
        <img
          src="./icons/chevron-down.svg"
          alt="Toggle dropdown"
          className={`profileSettings__dropdown-icon ${open ? 'rotated' : ''}`}
          aria-hidden="true"
        />

        {open && (
          <ul className="profileSettings__dropdown-menu" role="listbox">
            {options.map((option) => (
              <li
                key={option}
                className={`profileSettings__dropdown-option ${
                  option === selected ? 'selected' : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(option);
                  setOpen(false);
                }}
                role="option"
                aria-selected={option === selected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(option);
                    setOpen(false);
                  }
                }}
              >
                {displayText(option)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}