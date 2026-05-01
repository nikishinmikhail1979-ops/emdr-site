import { useRef, useCallback, useEffect, useState } from 'react';

export type Direction = 'horizontal' | 'vertical' | 'diagonal1' | 'diagonal2';

interface AnimationState {
  isRunning: boolean;
  speed: number;
  direction: Direction;
  stimulusColor: string;
  stimulusShape: string;
  isStimulusVisible: boolean;
}

export function useEMDRAnimation(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onPass: () => void,
  onPositionUpdate: (normalizedX: number) => void
) {
  const [passes, setPasses] = useState(0);
  const stateRef = useRef<AnimationState>({
    isRunning: false,
    speed: 8,
    direction: 'horizontal',
    stimulusColor: '#111827',
    stimulusShape: 'circle',
    isStimulusVisible: true,
  });
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const prevDirectionRef = useRef<number>(1);
  const passCountedRef = useRef(false);
  const hasStartedRef = useRef(false);

  const updateState = useCallback((newState: Partial<AnimationState>) => {
    stateRef.current = { ...stateRef.current, ...newState };
  }, []);

  // Get logical (CSS) size
  const getLogicalSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return { w: 0, h: 0, dpr: 1 };
    return {
      w: canvas.clientWidth,
      h: canvas.clientHeight,
      dpr: window.devicePixelRatio || 1,
    };
  }, [canvasRef]);

  const drawStatic = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = stateRef.current;
    const { w, h, dpr } = getLogicalSize();

    if (w === 0 || h === 0) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (state.isStimulusVisible) {
      ctx.save();
      ctx.scale(dpr, dpr);
      drawStimulus(ctx, w / 2, h / 2, state.stimulusShape, state.stimulusColor);
      ctx.restore();
    }
  }, [canvasRef, getLogicalSize]);

  const draw = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = stateRef.current;
    const { w, h, dpr } = getLogicalSize();

    if (w === 0 || h === 0) {
      animFrameRef.current = requestAnimationFrame(draw);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!state.isRunning) {
      if (state.isStimulusVisible) {
        ctx.save();
        ctx.scale(dpr, dpr);
        drawStimulus(ctx, w / 2, h / 2, state.stimulusShape, state.stimulusColor);
        ctx.restore();
      }
      return;
    }

    // Calculate elapsed time
    const elapsed = (timestamp - startTimeRef.current) / 1000;
    const baseFreq = 0.8;
    const freq = baseFreq * (state.speed / 8);

    // Sine wave: -1 to 1
    const sineValue = Math.sin(elapsed * freq * Math.PI * 2);

    // Detect direction change for pass counting
    const currentDirection = sineValue >= 0 ? 1 : -1;
    if (currentDirection !== prevDirectionRef.current) {
      if (!passCountedRef.current) {
        onPass();
        passCountedRef.current = true;
      }
      prevDirectionRef.current = currentDirection;
    } else {
      passCountedRef.current = false;
    }

    // Position calculations in CSS pixels
    let x: number, y: number;
    const margin = 40;
    const amplitudeX = (w / 2) - margin;
    const amplitudeY = (h / 2) - margin;

    switch (state.direction) {
      case 'horizontal':
        x = w / 2 + sineValue * amplitudeX;
        y = h / 2;
        break;
      case 'vertical':
        x = w / 2;
        y = h / 2 + sineValue * amplitudeY;
        break;
      case 'diagonal1':
        x = w / 2 + sineValue * amplitudeX;
        y = h / 2 - sineValue * amplitudeY;
        break;
      case 'diagonal2':
        x = w / 2 + sineValue * amplitudeX;
        y = h / 2 + sineValue * amplitudeY;
        break;
      default:
        x = w / 2;
        y = h / 2;
    }

    // Normalize X for audio panning (0 = left, 1 = right)
    const normalizedX = Math.max(0, Math.min(1, x / w));
    onPositionUpdate(normalizedX);

    // Draw stimulus
    ctx.save();
    ctx.scale(dpr, dpr);
    if (state.isStimulusVisible) {
      drawStimulus(ctx, x, y, state.stimulusShape, state.stimulusColor);
    }
    ctx.restore();

    animFrameRef.current = requestAnimationFrame(draw);
  }, [canvasRef, getLogicalSize, onPass, onPositionUpdate]);

  const start = useCallback(() => {
    const state = stateRef.current;
    state.isRunning = true;
    hasStartedRef.current = true;
    startTimeRef.current = performance.now();
    passCountedRef.current = false;
    prevDirectionRef.current = 1;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(draw);
  }, [draw]);

  const stop = useCallback(() => {
    stateRef.current.isRunning = false;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    drawStatic();
  }, [drawStatic]);

  const handleResize = useCallback(() => {
    if (!stateRef.current.isRunning) {
      drawStatic();
    }
  }, [drawStatic]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const resetPasses = useCallback(() => {
    setPasses(0);
  }, []);

  return { start, stop, updateState, handleResize, passes, setPasses, resetPasses, stateRef };
}

function drawStimulus(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  shape: string,
  color: string
) {
  const size = 30;
  ctx.fillStyle = color;

  switch (shape) {
    case 'circle':
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'square':
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
      break;
    case 'vertical-bar':
      ctx.fillRect(x - size / 6, y - size, size / 3, size * 2);
      break;
    case 'horizontal-bar':
      ctx.fillRect(x - size, y - size / 6, size * 2, size / 3);
      break;
    default:
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();
  }
}
