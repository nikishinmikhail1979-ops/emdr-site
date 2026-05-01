import React from 'react';

interface Props {
  value: string;
  onChange: (color: string) => void;
}

const colors = [
  { id: 'black', value: '#111827', label: 'Черный' },
  { id: 'blue', value: '#2563EB', label: 'Синий' },
  { id: 'yellow', value: '#F59E0B', label: 'Желтый' },
  { id: 'red', value: '#EF4444', label: 'Красный' },
  { id: 'green', value: '#10B981', label: 'Зеленый' },
  { id: 'white', value: '#FFFFFF', label: 'Белый' },
];

const ColorPicker: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-[#374151] mb-2">Цвет стимула</label>
      <div className="flex flex-wrap gap-2">
        {colors.map((c) => (
          <button
            key={c.id}
            onClick={() => onChange(c.value)}
            className="w-9 h-9 rounded-full border-2 transition-all duration-150 hover:scale-110"
            style={{
              backgroundColor: c.value,
              borderColor: value === c.value ? '#2563EB' : '#D1D5DB',
              boxShadow: value === c.value ? '0 0 0 2px rgba(37,99,235,0.2)' : 'none',
            }}
            title={c.label}
            aria-label={c.label}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
