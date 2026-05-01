import React from 'react';
import { VolumeX } from 'lucide-react';
import type { SoundMode } from '../hooks/useAudioEngine';

interface Props {
  value: SoundMode;
  onChange: (sound: SoundMode) => void;
}

const sounds: { id: SoundMode; label: string }[] = [
  { id: 'off', label: 'Выкл' },
  { id: 'pop', label: 'POP' },
  { id: 'beep', label: 'BEEP' },
];

const SoundPicker: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-[#374151] mb-2">Звук</label>
      <div className="flex flex-wrap gap-2">
        {sounds.map((s) => {
          const isActive = value === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onChange(s.id)}
              className="h-10 px-4 rounded-lg flex items-center justify-center gap-1.5 text-sm font-medium transition-all duration-150 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: isActive ? '#2563EB' : '#F3F4F6',
                color: isActive ? '#fff' : '#374151',
              }}
              aria-label={s.label}
            >
              {s.id === 'off' && <VolumeX size={16} />}
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SoundPicker;
