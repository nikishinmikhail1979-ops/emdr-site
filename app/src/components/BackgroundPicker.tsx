import React from 'react';

interface Props {
  value: string;
  onChange: (bg: string) => void;
}

const backgrounds = [
  { id: 'light-gray', value: '#F1F5F9', label: 'Светло-серый' },
  { id: 'white', value: '#FFFFFF', label: 'Белый' },
  { id: 'dark', value: '#111827', label: 'Темный' },
  { id: 'mint', value: '#D1FAE5', label: 'Мятный' },
  { id: 'gray', value: '#9CA3AF', label: 'Серый' },
  { id: 'gradient', value: 'linear-gradient(135deg, #FF6B6B, #4ECDC4, #45B7D1, #96E6A1)', label: 'Градиент' },
];

const BackgroundPicker: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-[#374151] mb-2">Фон</label>
      <div className="flex flex-wrap gap-2">
        {backgrounds.map((bg) => (
          <button
            key={bg.id}
            onClick={() => onChange(bg.value)}
            className="w-9 h-9 rounded-lg border-2 transition-all duration-150 hover:scale-110"
            style={{
              background: bg.value,
              borderColor: value === bg.value ? '#2563EB' : 'transparent',
              boxShadow: value === bg.value ? '0 0 0 2px rgba(37,99,235,0.2)' : 'none',
            }}
            title={bg.label}
            aria-label={bg.label}
          />
        ))}
      </div>
    </div>
  );
};

export default BackgroundPicker;
