import React from 'react';
import { ArrowLeftRight, ArrowUpDown, ArrowUpLeft, ArrowDownRight } from 'lucide-react';

interface Props {
  value: string;
  onChange: (direction: string) => void;
}

const directions = [
  { id: 'horizontal', label: 'Горизонтально', Icon: ArrowLeftRight },
  { id: 'vertical', label: 'Вертикально', Icon: ArrowUpDown },
  { id: 'diagonal1', label: 'Диагональ ↖↘', Icon: ArrowUpLeft },
  { id: 'diagonal2', label: 'Диагональ ↙↗', Icon: ArrowDownRight },
];

const DirectionPicker: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-[#374151] mb-2">Направление</label>
      <div className="flex flex-wrap gap-2">
        {directions.map((d) => {
          const isActive = value === d.id;
          const Icon = d.Icon;
          return (
            <button
              key={d.id}
              onClick={() => onChange(d.id)}
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: isActive ? '#2563EB' : '#F3F4F6',
              }}
              title={d.label}
              aria-label={d.label}
            >
              <Icon size={18} color={isActive ? '#fff' : '#374151'} strokeWidth={2} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DirectionPicker;
