import { useRef, useCallback, useEffect } from 'react';

export type SoundMode = 'off' | 'pop' | 'beep';

export function useAudioEngine() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const popBufferRef = useRef<AudioBuffer | null>(null);
  const beepBufferRef = useRef<AudioBuffer | null>(null);
  const pannerRef = useRef<StereoPannerNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const isInitializedRef = useRef(false);

  const initAudio = useCallback(async () => {
    if (isInitializedRef.current) return;
    
    try {
      const ctx = new AudioContext();
      audioContextRef.current = ctx;

      const panner = ctx.createStereoPanner();
      const gain = ctx.createGain();
      
      panner.connect(gain);
      gain.connect(ctx.destination);
      
      pannerRef.current = panner;
      gainRef.current = gain;

      // Load audio files
      const [popResponse, beepResponse] = await Promise.all([
        fetch('/audio/pop.mp3'),
        fetch('/audio/beep.mp3'),
      ]);

      const [popArrayBuffer, beepArrayBuffer] = await Promise.all([
        popResponse.arrayBuffer(),
        beepResponse.arrayBuffer(),
      ]);

      const [popBuffer, beepBuffer] = await Promise.all([
        ctx.decodeAudioData(popArrayBuffer),
        ctx.decodeAudioData(beepArrayBuffer),
      ]);

      popBufferRef.current = popBuffer;
      beepBufferRef.current = beepBuffer;
      isInitializedRef.current = true;
    } catch (err) {
      console.error('Failed to initialize audio:', err);
    }
  }, []);

  const playSound = useCallback((mode: SoundMode) => {
    if (mode === 'off' || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const buffer = mode === 'pop' ? popBufferRef.current : beepBufferRef.current;
    if (!buffer) return;

    // Resume context if suspended (browser policy)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Create a temporary panner for this sound if main one not available
    const panner = ctx.createStereoPanner();
    const gain = ctx.createGain();
    
    source.connect(panner);
    panner.connect(gain);
    gain.connect(ctx.destination);

    // Copy current pan value if available
    if (pannerRef.current) {
      panner.pan.value = pannerRef.current.pan.value;
    }

    source.start(0);
  }, []);

  const setPan = useCallback((normalizedX: number) => {
    // normalizedX: 0 = left, 1 = right
    // pan: -1 = left, 1 = right
    if (pannerRef.current) {
      const panValue = (normalizedX * 2) - 1;
      pannerRef.current.pan.value = Math.max(-1, Math.min(1, panValue));
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return { initAudio, playSound, setPan };
}
