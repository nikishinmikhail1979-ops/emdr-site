import React from 'react';
import BackgroundPicker from '../components/BackgroundPicker';
import ColorPicker from '../components/ColorPicker';
import ShapePicker from '../components/ShapePicker';
import DirectionPicker from '../components/DirectionPicker';
import SoundPicker from '../components/SoundPicker';
import SpeedSlider from '../components/SpeedSlider';
import type { SoundMode } from '../hooks/useAudioEngine';

interface Props {
  background: string;
  onBackgroundChange: (bg: string) => void;
  stimulusColor: string;
  onStimulusColorChange: (color: string) => void;
  stimulusShape: string;
  onStimulusShapeChange: (shape: string) => void;
  direction: string;
  onDirectionChange: (direction: string) => void;
  soundMode: SoundMode;
  onSoundModeChange: (sound: SoundMode) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
}

const ControlsPanel: React.FC<Props> = ({
  background,
  onBackgroundChange,
  stimulusColor,
  onStimulusColorChange,
  stimulusShape,
  onStimulusShapeChange,
  direction,
  onDirectionChange,
  soundMode,
  onSoundModeChange,
  speed,
  onSpeedChange,
  onReset,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Top grid: Visual + Audio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Visual controls */}
        <div className="emdr-card space-y-5">
          <h3 className="emdr-heading">ВИЗУАЛ</h3>
          <BackgroundPicker value={background} onChange={onBackgroundChange} />
          <ColorPicker value={stimulusColor} onChange={onStimulusColorChange} />
          <ShapePicker value={stimulusShape} onChange={onStimulusShapeChange} />
          <DirectionPicker value={direction} onChange={onDirectionChange} />
        </div>

        {/* Audio controls */}
        <div className="emdr-card space-y-5">
          <h3 className="emdr-heading">АУДИО</h3>
          <SoundPicker value={soundMode} onChange={onSoundModeChange} />
          <button
            onClick={onReset}
            className="text-[13px] font-medium text-[#2563EB] hover:underline transition-all"
          >
            Сбросить настройки
          </button>
        </div>
      </div>

      {/* Speed slider */}
      <SpeedSlider value={speed} onChange={onSpeedChange} />
    </div>
  );
};

export default ControlsPanel;
