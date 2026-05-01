import React from 'react';

interface Props {
  value: number;
  onChange: (speed: number) => void;
}

const SpeedSlider: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="emdr-card">
      <label className="emdr-heading block mb-4">СКОРОСТЬ ({value})</label>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(1, value - 1))}
          className="text-[#6B7280] hover:text-[#2563EB] transition-colors text-lg font-bold w-8 h-8 flex items-center justify-center rounded hover:bg-[#F3F4F6]"
          aria-label="Уменьшить скорость"
        >
          −
        </button>
        <input
          type="range"
          min={1}
          max={20}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1"
          aria-label="Скорость движения"
        />
        <button
          onClick={() => onChange(Math.min(20, value + 1))}
          className="text-[#6B7280] hover:text-[#2563EB] transition-colors text-lg font-bold w-8 h-8 flex items-center justify-center rounded hover:bg-[#F3F4F6]"
          aria-label="Увеличить скорость"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default SpeedSlider;
