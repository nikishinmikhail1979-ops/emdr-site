import React, { useEffect, useCallback } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

interface Props {
  background: string;
  isStimulusVisible: boolean;
  onToggleVisibility: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onResize?: () => void;
}

const ClientView: React.FC<Props> = ({
  background,
  isStimulusVisible,
  onToggleVisibility,
  isFullscreen,
  onToggleFullscreen,
  canvasRef,
  containerRef,
  onResize,
}) => {
  // Resize canvas to fit container (CSS pixels for logical size, DPR for physical)
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef?.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Set physical pixel size for crisp rendering
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    // CSS size
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Trigger redraw via parent hook
    onResize?.();
  }, [canvasRef, containerRef, onResize]);

  useEffect(() => {
    resizeCanvas();
    const handleResize = () => resizeCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resizeCanvas]);

  // Also resize when fullscreen state changes (transition takes time)
  useEffect(() => {
    const timeout = setTimeout(() => resizeCanvas(), 350);
    return () => clearTimeout(timeout);
  }, [isFullscreen, resizeCanvas]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${isFullscreen ? 'fixed inset-0 z-[9999]' : 'rounded-xl'}`}
      style={{
        background: background,
        boxShadow: isFullscreen ? 'none' : '0 4px 12px rgba(0,0,0,0.08)',
        padding: isFullscreen ? '0' : '20px',
        aspectRatio: isFullscreen ? 'auto' : '4/3',
        height: isFullscreen ? '100vh' : 'auto',
        width: isFullscreen ? '100vw' : '100%',
      }}
    >
      {/* Header label — hidden in fullscreen */}
      {!isFullscreen && (
        <div className="absolute top-3 left-5 z-10">
          <span className="text-[13px] font-semibold text-[#6B7280] uppercase tracking-wider">
            Окно стимула
          </span>
        </div>
      )}

      {/* Fullscreen button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFullscreen();
        }}
        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        title={isFullscreen ? 'Выйти из полного экрана' : 'На весь экран'}
        aria-label={isFullscreen ? 'Выйти из полного экрана' : 'На весь экран'}
      >
        {isFullscreen ? (
          <Minimize2 size={18} color="#fff" />
        ) : (
          <Maximize2 size={18} color="#fff" />
        )}
      </button>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block rounded-lg"
        style={{ background: 'transparent' }}
      />

      {/* Hide/Show button */}
      <button
        onClick={onToggleVisibility}
        className="absolute bottom-3 left-3 z-10 px-3 py-1 rounded text-xs font-medium text-white transition-all duration-150 hover:scale-105"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        {isStimulusVisible ? 'Скрыть' : 'Показать'}
      </button>
    </div>
  );
};

export default ClientView;
