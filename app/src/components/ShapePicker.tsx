import React from 'react';

interface Props {
  value: string;
  onChange: (shape: string) => void;
}

const shapes = [
  { id: 'circle', label: 'Круг' },
  { id: 'square', label: 'Квадрат' },
  { id: 'vertical-bar', label: 'Вертикальная полоса' },
  { id: 'horizontal-bar', label: 'Горизонтальная полоса' },
];

const ShapePicker: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-[#374151] mb-2">Форма стимула</label>
      <div className="flex flex-wrap gap-2">
        {shapes.map((s) => {
          const isActive = value === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onChange(s.id)}
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: isActive ? '#2563EB' : '#F3F4F6',
              }}
              title={s.label}
              aria-label={s.label}
            >
              <svg width="20" height="20" viewBox="0 0 20 20">
                {s.id === 'circle' && (
                  <circle cx="10" cy="10" r="8" fill={isActive ? '#fff' : '#374151'} />
                )}
                {s.id === 'square' && (
                  <rect x="3" y="3" width="14" height="14" rx="1" fill={isActive ? '#fff' : '#374151'} />
                )}
                {s.id === 'vertical-bar' && (
                  <rect x="8" y="2" width="4" height="16" rx="1" fill={isActive ? '#fff' : '#374151'} />
                )}
                {s.id === 'horizontal-bar' && (
                  <rect x="2" y="8" width="16" height="4" rx="1" fill={isActive ? '#fff' : '#374151'} />
                )}
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ShapePicker;
