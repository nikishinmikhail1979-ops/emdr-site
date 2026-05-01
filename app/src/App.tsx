import { useState, useRef, useCallback, useEffect } from 'react';
import InstructionPanel from './sections/InstructionPanel';
import ControlsPanel from './sections/ControlsPanel';
import ClientView from './sections/ClientView';
import StatusBar from './sections/StatusBar';
import { useEMDRAnimation } from './hooks/useEMDRAnimation';
import { useAudioEngine } from './hooks/useAudioEngine';
import { useTimer } from './hooks/useTimer';
import type { SoundMode } from './hooks/useAudioEngine';

const DEFAULTS = {
  background: '#F1F5F9',
  stimulusColor: '#111827',
  stimulusShape: 'circle',
  direction: 'horizontal',
  soundMode: 'off' as SoundMode,
  speed: 8,
};

export default function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(DEFAULTS.speed);
  const [direction, setDirection] = useState(DEFAULTS.direction);
  const [background, setBackground] = useState(DEFAULTS.background);
  const [stimulusColor, setStimulusColor] = useState(DEFAULTS.stimulusColor);
  const [stimulusShape, setStimulusShape] = useState(DEFAULTS.stimulusShape);
  const [soundMode, setSoundMode] = useState<SoundMode>(DEFAULTS.soundMode);
  const [isStimulusVisible, setIsStimulusVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(true);
  const [passes, setPasses] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPlayTimeRef = useRef(0);
  const prevEdgeRef = useRef<'left' | 'right' | null>(null);

  const timer = useTimer();
  const audio = useAudioEngine();

  const handlePass = useCallback(() => {
    setPasses((prev) => prev + 1);
  }, []);

  const handlePositionUpdate = useCallback((normalizedX: number) => {
    audio.setPan(normalizedX);

    const edgeThreshold = 0.15;
    let currentEdge: 'left' | 'right' | null = null;

    if (normalizedX < edgeThreshold) {
      currentEdge = 'left';
    } else if (normalizedX > 1 - edgeThreshold) {
      currentEdge = 'right';
    }

    if (currentEdge && currentEdge !== prevEdgeRef.current) {
      const now = Date.now();
      if (now - lastPlayTimeRef.current > 200) {
        audio.playSound(soundMode);
        lastPlayTimeRef.current = now;
      }
      prevEdgeRef.current = currentEdge;
    } else if (!currentEdge) {
      prevEdgeRef.current = null;
    }
  }, [audio, soundMode]);

  const emdr = useEMDRAnimation(canvasRef, handlePass, handlePositionUpdate);

  useEffect(() => {
    emdr.updateState({
      isRunning,
      speed,
      direction: direction as 'horizontal' | 'vertical' | 'diagonal1' | 'diagonal2',
      stimulusColor,
      stimulusShape,
      isStimulusVisible,
    });
  }, [isRunning, speed, direction, stimulusColor, stimulusShape, isStimulusVisible, emdr]);

  const handleStart = useCallback(async () => {
    await audio.initAudio();
    setIsRunning(true);
    emdr.start();
    timer.start();
  }, [audio, emdr, timer]);

  const handleStop = useCallback(() => {
    setIsRunning(false);
    emdr.stop();
    timer.stop();
  }, [emdr, timer]);

  const handleToggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        if (isRunning) {
          handleStop();
        } else {
          handleStart();
        }
      }
      if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setSpeed((prev) => Math.max(1, prev - 1));
      }
      if (e.code === 'ArrowRight') {
        e.preventDefault();
        setSpeed((prev) => Math.min(20, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, handleStart, handleStop]);

  const handleReset = useCallback(() => {
    setBackground(DEFAULTS.background);
    setStimulusColor(DEFAULTS.stimulusColor);
    setStimulusShape(DEFAULTS.stimulusShape);
    setDirection(DEFAULTS.direction);
    setSoundMode(DEFAULTS.soundMode);
    setSpeed(DEFAULTS.speed);
  }, []);

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: 'var(--bg-page)' }}>
      {/* Instruction Panel */}
      <div className="pt-6">
        <InstructionPanel
          isOpen={isInstructionsOpen}
          onToggle={() => setIsInstructionsOpen(!isInstructionsOpen)}
        />
      </div>

      {/* Main content */}
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Controls — hidden in fullscreen */}
          {!isFullscreen && (
            <ControlsPanel
              background={background}
              onBackgroundChange={setBackground}
              stimulusColor={stimulusColor}
              onStimulusColorChange={setStimulusColor}
              stimulusShape={stimulusShape}
              onStimulusShapeChange={setStimulusShape}
              direction={direction}
              onDirectionChange={setDirection}
              soundMode={soundMode}
              onSoundModeChange={setSoundMode}
              speed={speed}
              onSpeedChange={setSpeed}
              onReset={handleReset}
            />
          )}

          {/* Right: Client View */}
          <div className={isFullscreen ? 'fixed inset-0 z-[9999]' : ''}>
            <ClientView
              background={background}
              isStimulusVisible={isStimulusVisible}
              onToggleVisibility={() => setIsStimulusVisible(!isStimulusVisible)}
              isFullscreen={isFullscreen}
              onToggleFullscreen={handleToggleFullscreen}
              canvasRef={canvasRef}
              containerRef={containerRef}
              onResize={emdr.handleResize}
            />
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar
        time={timer.time}
        passes={passes}
        isRunning={isRunning}
        isFullscreen={isFullscreen}
        onStart={handleStart}
        onStop={handleStop}
        onToggleFullscreen={handleToggleFullscreen}
      />
    </div>
  );
}
