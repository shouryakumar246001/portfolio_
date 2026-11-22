// High-fidelity Web Audio API mechanical keyboard switch synthesizer
let sharedAudioCtx: AudioContext | null = null;

export function getAudioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!sharedAudioCtx) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      sharedAudioCtx = new AudioCtx();

      // Pre-unlock on first pointer or key event
      const unlock = () => {
        if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
          sharedAudioCtx.resume().catch(() => {});
        }
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
      };
      window.addEventListener('pointerdown', unlock, { passive: true });
      window.addEventListener('keydown', unlock, { passive: true });
    }
  }
  return sharedAudioCtx;
}

export function playKeyboardSound(pitchOffset = 0, isPress = false) {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;

    const play = () => {
      try {
        const now = ctx.currentTime;

        // 1. Mechanical switch tactile click (tonal impulse)
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        const baseFreq = isPress ? 220 : 640;
        const freq = Math.max(120, baseFreq + (pitchOffset % 8) * 35 + (Math.random() * 40 - 20));

        osc.type = isPress ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(
          Math.max(60, freq * 0.3),
          now + (isPress ? 0.09 : 0.05)
        );

        const vol = isPress ? 0.42 : 0.28;
        oscGain.gain.setValueAtTime(vol, now);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + (isPress ? 0.09 : 0.05));

        osc.connect(oscGain);
        oscGain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + (isPress ? 0.1 : 0.06));

        // 2. Crisp keycap plastic snap (high-frequency tactile noise)
        const bufferSize = Math.floor(ctx.sampleRate * (isPress ? 0.025 : 0.018));
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28));
        }

        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(isPress ? 2200 : 4400, now);
        noiseFilter.Q.setValueAtTime(2.2, now);

        const noiseGain = ctx.createGain();
        const noiseVol = isPress ? 0.4 : 0.3;
        noiseGain.gain.setValueAtTime(noiseVol, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + (isPress ? 0.024 : 0.017));

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        noise.start(now);
        noise.stop(now + (isPress ? 0.026 : 0.019));
      } catch {
        // Fallback
      }
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(play).catch(() => {});
    } else {
      play();
    }
  } catch {
    // Fallback
  }
}
