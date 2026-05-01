import React from 'react';
import { Play, Square, Maximize2, Minimize2 } from 'lucide-react';

interface Props {
  time: string;
  passes: number;
  isRunning: boolean;
  isFullscreen: boolean;
  onStart: () => void;
  onStop: () => void;
  onToggleFullscreen: () => void;
}

const StatusBar: React.FC<Props> = ({
  time,
  passes,
  isRunning,
  isFullscreen,
  onStart,
  onStop,
  onToggleFullscreen,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4 md:px-6 py-4 z-50">
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
        {/* Timer */}
        <div className="text-center md:text-left">
          <div className="text-[13px] font-semibold text-[#6B7280]">Таймер</div>
          <div className="text-[32px] md:text-[36px] font-bold text-[#1E3A5F] emdr-mono leading-tight">
            {time}
          </div>
        </div>

        {/* Passes */}
        <div className="text-center md:text-left">
          <div className="text-[13px] font-semibold text-[#6B7280]">Проходы</div>
          <div className="text-[32px] md:text-[36px] font-bold text-[#1E3A5F] emdr-mono leading-tight">
            {passes}
          </div>
        </div>

        {/* Shortcuts */}
        <div className="hidden md:block text-center">
          <div className="text-[13px] font-semibold text-[#6B7280] mb-1">Горячие клавиши</div>
          <div className="text-[13px] text-[#6B7280] emdr-mono leading-relaxed">
            Пробел = Старт/Стоп<br />
            ← → = Скорость
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center md:justify-end gap-3">
          {/* Start/Stop button */}
          <button
            onClick={isRunning ? onStop : onStart}
            className="flex items-center gap-2 px-6 md:px-8 py-3 rounded-lg text-white font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
            style={{
              backgroundColor: isRunning ? '#EF4444' : '#10B981',
            }}
          >
            {isRunning ? (
              <>
                <Square size={16} fill="white" />
                СТОП
              </>
            ) : (
              <>
                <Play size={16} fill="white" />
                СТАРТ
              </>
            )}
          </button>

          {/* Fullscreen button */}
          <button
            onClick={onToggleFullscreen}
            className="w-11 h-11 rounded-lg bg-[#F3F4F6] flex items-center justify-center transition-all duration-150 hover:bg-[#E5E7EB] hover:scale-105 active:scale-95"
            title={isFullscreen ? 'Выйти из полного экрана' : 'На весь экран'}
            aria-label={isFullscreen ? 'Выйти из полного экрана' : 'На весь экран'}
          >
            {isFullscreen ? (
              <Minimize2 size={20} color="#374151" />
            ) : (
              <Maximize2 size={20} color="#374151" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
