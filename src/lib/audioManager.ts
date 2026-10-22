// Global Singleton Audio Manager for PrimeNest Ambient Music
// Uses Web Audio API (AudioContext) as the primary unlock mechanism for mobile.
class AudioManager {
  private static instance: AudioManager;
  private audio: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private isMuted = false;
  private volume = 0.28;
  private userManuallyPaused = false;
  private autoplayBlocked = false;
  private listeners: Set<() => void> = new Set();
  private hasSetupListeners = false;
  private interactionCleanup: (() => void) | null = null;
  private audioUnlocked = false;

  private audioPath = '/assets/audio/primenest-ambient.mp3';

  private constructor() {}

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  /**
   * Called on app mount. Sets up listeners that will start audio on first user gesture.
   *
   * We intentionally do NOT create any Audio element or AudioContext here.
   * Mobile browsers (Android Chrome, iOS Safari) require that both the
   * AudioContext creation/resume AND audio.play() happen inside a user gesture.
   * Pre-creating elements outside a gesture "taints" them on many mobile browsers.
   */
  public autoStart() {
    if (this.hasSetupListeners) return;
    this.hasSetupListeners = true;
    if (this.userManuallyPaused) return;
    if (typeof window === 'undefined') return;

    this.setupGestureListeners();
  }

  /**
   * The core mobile unlock: on first gesture, create AudioContext + Audio element
   * + connect them + resume + play — all synchronously in the same handler.
   */
  private setupGestureListeners() {
    if (this.interactionCleanup) return;

    let fired = false;

    const unlockAndPlay = () => {
      if (fired) return;
      fired = true;
      this.cleanupInteractionListeners();

      if (this.userManuallyPaused) return;

      this.startPlayback();
    };

    // Multiple events for coverage. touchend is most reliable on iOS,
    // click covers Android + desktop, pointerdown is a secondary fallback.
    const events = ['touchend', 'click', 'pointerdown', 'keydown'];

    events.forEach((evt) => {
      document.addEventListener(evt, unlockAndPlay, {
        passive: true,
        capture: false, // Bubble phase — more natural, avoids capture-phase quirks on mobile
      });
    });

    this.interactionCleanup = () => {
      events.forEach((evt) => {
        document.removeEventListener(evt, unlockAndPlay, { capture: false });
      });
    };
  }

  /**
   * Creates AudioContext + HTMLAudioElement + connects them + plays.
   * MUST be called from within a user gesture handler.
   */
  private startPlayback() {
    try {
      // Step 1: Create AudioContext (inside gesture — required on mobile)
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!this.audioContext) {
        this.audioContext = new AudioCtx();
      }

      // Step 2: Resume the AudioContext (it starts 'suspended' on mobile)
      // This MUST happen inside a user gesture.
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      // Step 3: Create the HTML audio element (inside gesture — critical for Android)
      if (!this.audio) {
        const audio = new Audio();
        audio.crossOrigin = 'anonymous';
        audio.src = this.audioPath;
        audio.loop = true;
        audio.preload = 'auto';
        audio.setAttribute('playsinline', 'true');
        audio.setAttribute('webkit-playsinline', 'true');

        // Route it through the Web Audio API for reliable mobile output
        this.sourceNode = this.audioContext.createMediaElementSource(audio);
        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.value = 0.01; // Start quiet for fade-in
        this.sourceNode.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);

        // The HTML element's own volume is set to max — we control volume via GainNode
        audio.volume = 1.0;
        audio.muted = false;

        audio.addEventListener('ended', () => {
          // Loop is set, so this shouldn't fire, but just in case
          this.isPlaying = false;
          this.notify();
        });

        this.audio = audio;
      }

      // Step 4: Play (synchronously inside gesture handler)
      const playPromise = this.audio.play();

      if (playPromise && typeof playPromise.then === 'function') {
        playPromise
          .then(() => {
            this.audioUnlocked = true;
            this.isPlaying = true;
            this.autoplayBlocked = false;
            this.isMuted = false;
            this.fadeIn(this.volume, 2000);
            this.notify();
          })
          .catch(() => {
            // Web Audio API approach failed. Try the plain HTML audio fallback
            // (disconnected from AudioContext).
            this.tryPlainHtmlAudio();
          });
      }
    } catch {
      // AudioContext not supported or other error — fall back to plain HTML audio
      this.tryPlainHtmlAudio();
    }
  }

  /**
   * Fallback: if the Web Audio API path fails, try a plain HTML audio element.
   * This is called from within the same promise chain as the gesture handler.
   */
  private tryPlainHtmlAudio() {
    try {
      // Clean up the Web Audio API element since it failed
      if (this.sourceNode) {
        try { this.sourceNode.disconnect(); } catch { /* ignore */ }
        this.sourceNode = null;
      }
      if (this.gainNode) {
        try { this.gainNode.disconnect(); } catch { /* ignore */ }
        this.gainNode = null;
      }

      // Create a fresh, plain HTML audio element
      const audio = new Audio(this.audioPath);
      audio.loop = true;
      audio.volume = 0.01;
      audio.muted = false;
      audio.setAttribute('playsinline', 'true');

      this.audio = audio;

      audio
        .play()
        .then(() => {
          this.audioUnlocked = true;
          this.isPlaying = true;
          this.autoplayBlocked = false;
          this.isMuted = false;
          this.fadeIn(this.volume, 2000);
          this.notify();
        })
        .catch(() => {
          // Truly blocked. User will need to tap the music button manually.
          this.isPlaying = false;
          this.autoplayBlocked = true;
          this.notify();
        });
    } catch {
      this.isPlaying = false;
      this.autoplayBlocked = true;
      this.notify();
    }
  }

  /**
   * Manual play — called when user taps the music button.
   * This is always inside a click handler, so gesture requirement is satisfied.
   */
  public play(): Promise<void> {
    this.cleanupInteractionListeners();
    this.userManuallyPaused = false;
    this.autoplayBlocked = false;

    // If we've never unlocked audio, do the full unlock sequence
    if (!this.audioUnlocked || !this.audio) {
      this.startPlayback();
      return Promise.resolve();
    }

    // Already unlocked — just resume playback
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    this.isMuted = false;
    this.audio.muted = false;

    return this.audio
      .play()
      .then(() => {
        this.isPlaying = true;
        this.autoplayBlocked = false;
        if (this.gainNode) {
          this.gainNode.gain.value = 0.01;
        } else {
          this.audio!.volume = 0.01;
        }
        this.fadeIn(this.volume, 800);
        this.notify();
      })
      .catch((err) => {
        console.warn('PrimeNest: Audio playback prevented:', err);
        this.isPlaying = false;
        this.autoplayBlocked = true;
        this.notify();
      });
  }

  public pause() {
    this.userManuallyPaused = true;
    this.autoplayBlocked = false;
    this.cleanupInteractionListeners();
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
      this.isMuted = false;
      this.notify();
    }
  }

  public togglePlay() {
    if (this.isPlaying && !this.isMuted) {
      this.pause();
    } else {
      this.play();
    }
  }

  public dismissAutoplayInvitation() {
    this.autoplayBlocked = false;
    this.notify();
  }

  public getState() {
    return {
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      volume: this.volume,
      userManuallyPaused: this.userManuallyPaused,
      autoplayBlocked: this.autoplayBlocked,
    };
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  private cleanupInteractionListeners() {
    if (this.interactionCleanup) {
      this.interactionCleanup();
      this.interactionCleanup = null;
    }
  }

  private fadeIn(targetVolume: number, durationMs = 1000) {
    const startTime = Date.now();
    const startGain = 0.01;

    const step = () => {
      if (this.userManuallyPaused) return;
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const currentVolume = startGain + progress * (targetVolume - startGain);

      if (this.gainNode) {
        // Web Audio API path — control via GainNode
        this.gainNode.gain.value = currentVolume;
      } else if (this.audio) {
        // Plain HTML audio path
        this.audio.volume = currentVolume;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }
}

export const audioManager = AudioManager.getInstance();
