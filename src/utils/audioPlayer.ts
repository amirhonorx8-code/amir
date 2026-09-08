/**
 * Calm Piano Ambient Synthesizer using Web Audio API
 * Generates relaxing, organic piano notes for the 4 featured pieces:
 * 1. Max Richter - On the Nature of Daylight
 * 2. Yann Tiersen - Comptine d'un autre été
 * 3. Ludovico Einaudi - Nuvole Bianche
 * 4. Yiruma - River Flows in You
 */

export interface TrackInfo {
  id: number;
  title: string;
  composer: string;
  tempo: number; // BPM
  notes: Array<{ note: string; duration: number }>;
}

// Frequencies for piano notes
const NOTE_FREQS: Record<string, number> = {
  'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
  'C6': 1046.50,
  'REST': 0
};

export const PIANO_TRACKS: TrackInfo[] = [
  {
    id: 1,
    title: 'The Departure',
    composer: 'Max Richter',
    tempo: 68,
    notes: [
      { note: 'F3', duration: 1.5 }, { note: 'A3', duration: 1.5 }, { note: 'C4', duration: 1.5 }, { note: 'E4', duration: 3.0 },
      { note: 'D3', duration: 1.5 }, { note: 'F3', duration: 1.5 }, { note: 'A3', duration: 1.5 }, { note: 'C4', duration: 3.0 },
      { note: 'Bb2', duration: 1.5 }, { note: 'D3', duration: 1.5 }, { note: 'F3', duration: 1.5 }, { note: 'A3', duration: 3.0 },
      { note: 'C3', duration: 1.5 }, { note: 'E3', duration: 1.5 }, { note: 'G3', duration: 1.5 }, { note: 'C4', duration: 3.0 },
    ]
  },
  {
    id: 2,
    title: "Comptine d'un Autre Été",
    composer: 'Yann Tiersen',
    tempo: 100,
    notes: [
      { note: 'E4', duration: 0.5 }, { note: 'G4', duration: 0.5 }, { note: 'B4', duration: 0.5 }, { note: 'E5', duration: 0.5 },
      { note: 'D4', duration: 0.5 }, { note: 'F4', duration: 0.5 }, { note: 'A4', duration: 0.5 }, { note: 'D5', duration: 0.5 },
      { note: 'C4', duration: 0.5 }, { note: 'E4', duration: 0.5 }, { note: 'G4', duration: 0.5 }, { note: 'C5', duration: 0.5 },
      { note: 'B3', duration: 0.5 }, { note: 'D4', duration: 0.5 }, { note: 'F4', duration: 0.5 }, { note: 'B4', duration: 0.5 },
      { note: 'G4', duration: 1.0 }, { note: 'F4', duration: 1.0 }, { note: 'E4', duration: 2.0 },
    ]
  },
  {
    id: 3,
    title: 'If Only I Could Tell',
    composer: 'Fabrizio Paterlini',
    tempo: 78,
    notes: [
      { note: 'F4', duration: 0.8 }, { note: 'Ab4', duration: 0.8 }, { note: 'C5', duration: 1.6 },
      { note: 'Eb4', duration: 0.8 }, { note: 'G4', duration: 0.8 }, { note: 'Bb4', duration: 1.6 },
      { note: 'Db4', duration: 0.8 }, { note: 'F4', duration: 0.8 }, { note: 'Ab4', duration: 1.6 },
      { note: 'C4', duration: 0.8 }, { note: 'Eb4', duration: 0.8 }, { note: 'G4', duration: 1.6 },
      { note: 'C5', duration: 1.0 }, { note: 'Bb4', duration: 1.0 }, { note: 'Ab4', duration: 2.0 },
    ]
  },
  {
    id: 4,
    title: 'Matin dans Le Marais',
    composer: 'Jef Martens',
    tempo: 72,
    notes: [
      { note: 'A4', duration: 0.6 }, { note: 'G4', duration: 0.6 }, { note: 'A4', duration: 1.2 },
      { note: 'E4', duration: 0.6 }, { note: 'A4', duration: 0.6 }, { note: 'C5', duration: 1.2 },
      { note: 'B4', duration: 0.6 }, { note: 'A4', duration: 0.6 }, { note: 'G4', duration: 1.2 },
      { note: 'F4', duration: 0.6 }, { note: 'E4', duration: 0.6 }, { note: 'D4', duration: 1.8 },
      { note: 'A4', duration: 0.8 }, { note: 'B4', duration: 0.8 }, { note: 'C5', duration: 2.0 },
    ]
  }
];

class PianoAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTrackIdx: number = 0;
  private timer: number | null = null;
  private noteIdx: number = 0;
  private listeners: Array<(state: { isPlaying: boolean; track: TrackInfo }) => void> = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public subscribe(cb: (state: { isPlaying: boolean; track: TrackInfo }) => void) {
    this.listeners.push(cb);
    cb({ isPlaying: this.isPlaying, track: PIANO_TRACKS[this.currentTrackIdx] });
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify() {
    const state = { isPlaying: this.isPlaying, track: PIANO_TRACKS[this.currentTrackIdx] };
    this.listeners.forEach(cb => cb(state));
  }

  private playPianoNote(freq: number, duration: number) {
    if (!this.ctx || freq <= 0) return;

    const now = this.ctx.currentTime;
    
    // Create fundamental oscillator
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Secondary harmonic oscillator for warm rich acoustic piano overtone
    const overtone = this.ctx.createOscillator();
    const overtoneGain = this.ctx.createGain();

    // Triangle / Sine mix gives a soft upright piano feel
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2, now);

    // Warm envelope
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.5);

    overtoneGain.gain.setValueAtTime(0.001, now);
    overtoneGain.gain.exponentialRampToValueAtTime(0.05, now + 0.03);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + (duration * 0.7) + 0.2);

    osc.connect(gain);
    overtone.connect(overtoneGain);

    gain.connect(this.ctx.destination);
    overtoneGain.connect(this.ctx.destination);

    osc.start(now);
    overtone.start(now);

    osc.stop(now + duration + 0.6);
    overtone.stop(now + duration + 0.6);
  }

  private step() {
    if (!this.isPlaying) return;

    const track = PIANO_TRACKS[this.currentTrackIdx];
    const item = track.notes[this.noteIdx];
    
    const freq = NOTE_FREQS[item.note] || 261.63;
    const dur = item.duration;

    this.playPianoNote(freq, dur);

    this.noteIdx = (this.noteIdx + 1) % track.notes.length;

    const intervalMs = dur * 1000;
    this.timer = window.setTimeout(() => {
      this.step();
    }, intervalMs);
  }

  public play() {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.step();
    this.notify();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.notify();
  }

  public toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public nextTrack() {
    this.pause();
    this.currentTrackIdx = (this.currentTrackIdx + 1) % PIANO_TRACKS.length;
    this.noteIdx = 0;
    this.play();
  }

  public prevTrack() {
    this.pause();
    this.currentTrackIdx = (this.currentTrackIdx - 1 + PIANO_TRACKS.length) % PIANO_TRACKS.length;
    this.noteIdx = 0;
    this.play();
  }

  public selectTrack(id: number) {
    const idx = PIANO_TRACKS.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.pause();
      this.currentTrackIdx = idx;
      this.noteIdx = 0;
      this.play();
    }
  }

  public getCurrentState() {
    return {
      isPlaying: this.isPlaying,
      track: PIANO_TRACKS[this.currentTrackIdx],
    };
  }
}

export const pianoEngine = new PianoAudioEngine();
