class AudioService {
  private ctx: AudioContext | null = null;

  initialize() {
    try {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) this.ctx = new AudioContextClass();
      }
    } catch (e) {
      console.warn("Audio Context init failed", e);
    }
  }

  check() {
    this.initialize();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return !!this.ctx;
  }

  playTone(freq: number, type: OscillatorType, duration: number) {
    if (!this.check() || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.frequency.value = freq;
      osc.type = type;
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.warn("Play tone failed", e);
    }
  }

  playTick(urgent: boolean) {
    this.playTone(urgent ? 800 : 400, 'square', 0.1);
  }

  playCorrect() {
    this.playTone(600, 'sine', 0.3);
  }

  playWrong() {
    this.playTone(150, 'sawtooth', 0.3);
  }
}

export const audioService = new AudioService();
