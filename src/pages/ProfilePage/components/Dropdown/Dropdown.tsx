import { useEffect, useRef, useState } from 'react';
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
  options,
  selected,
  onSelect,
  displayMap,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Функция для отображения текста с заглавной буквы, если displayMap не передан
  const displayText = (value: T) => {
    if (displayMap && displayMap[value]) {
      return displayMap[value];
    }
    return value[0].toUpperCase() + value.slice(1);
  };

  return (
    <div
      className="profileSettings__dropdown"
      ref={ref}
      onClick={() => setOpen(!open)}
    >
      <span className="profileSettings__dropdown-selected menu-text-font">
        {displayText(selected)}
      </span>
      <img
        src="./icons/chevron-down.svg"
        alt="Dropdown arrow"
        className={`profileSettings__dropdown-icon ${open ? 'rotated' : ''}`}
      />

      {open && (
        <div className="profileSettings__dropdown-menu">
          {options.map((option) => (
            <div
              key={option}
              className="profileSettings__dropdown-option"
              onClick={() => {
                onSelect(option);
                setOpen(false);
              }}
            >
              {displayText(option)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}