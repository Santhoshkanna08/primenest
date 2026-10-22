// Global Singleton Audio Manager for PrimeNest Ambient Music
// Robust, standards-compliant HTML5 Audio implementation with mobile autoplay handling

export type MusicPreference = 'enabled' | 'disabled' | 'unset';

export interface AudioState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  autoplayBlocked: boolean;
  preference: MusicPreference;
}

class AudioManager {
  private static instance: AudioManager;
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private isMuted = false;
  private volume = 0.28;
  private autoplayBlocked = false;
  private preference: MusicPreference = 'unset';
  private listeners: Set<() => void> = new Set();
  private hasInitialized = false;
  private interactionCleanup: (() => void) | null = null;
  private fadeInterval: number | null = null;

  private readonly audioPath = '/assets/audio/primenest-ambient.mp3';
  private readonly STORAGE_KEY = 'primenest_music_preference';

  private constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved === 'enabled' || saved === 'disabled') {
          this.preference = saved;
        }
      } catch {
        // localStorage not accessible
      }
    }
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  /**
   * Lazily creates the single HTMLAudioElement instance.
   */
  private getOrCreateAudio(): HTMLAudioElement {
    if (!this.audio) {
      const audio = new Audio();
      audio.src = this.audioPath;
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = this.volume;
      audio.setAttribute('playsinline', 'true');
      audio.setAttribute('webkit-playsinline', 'true');

      audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.autoplayBlocked = false;
        this.notify();
      });

      audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notify();
      });

      audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.notify();
      });

      audio.addEventListener('error', (e) => {
        console.warn('PrimeNest: Audio load or playback error:', e);
        this.isPlaying = false;
        this.notify();
      });

      this.audio = audio;
    }
    return this.audio;
  }

  /**
   * Called on initial app mount.
   * Attempts immediate autoplay if allowed and user hasn't explicitly disabled music.
   * If blocked by mobile browser autoplay restrictions, sets up first-gesture retry.
   */
  public autoStart() {
    if (this.hasInitialized) return;
    this.hasInitialized = true;
    if (typeof window === 'undefined') return;

    // If user explicitly turned off music previously, respect their preference
    if (this.preference === 'disabled') {
      return;
    }

    const audio = this.getOrCreateAudio();

    // Attempt playback directly
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(() => {
          this.isPlaying = true;
          this.autoplayBlocked = false;
          this.fadeIn(this.volume, 1500);
          this.notify();
        })
        .catch(() => {
          // Browser blocked audible autoplay (normal on iOS & Android Chrome)
          this.isPlaying = false;
          this.autoplayBlocked = true;
          this.notify();

          // Set up listener for first genuine user interaction
          this.setupGestureListeners();
        });
    }
  }

  /**
   * Sets up one-time gesture listeners to resume music upon first real user tap/touch.
   */
  private setupGestureListeners() {
    if (this.interactionCleanup || typeof window === 'undefined') return;

    let fired = false;

    const handleFirstGesture = () => {
      if (fired) return;
      fired = true;
      this.cleanupInteractionListeners();

      // If user explicitly disabled music in the meantime, do nothing
      if (this.preference === 'disabled') return;

      const audio = this.getOrCreateAudio();
      audio
        .play()
        .then(() => {
          this.isPlaying = true;
          this.autoplayBlocked = false;
          this.fadeIn(this.volume, 1200);
          this.notify();
        })
        .catch(() => {
          // If still blocked, keep prompt visible for manual tap
          this.isPlaying = false;
          this.autoplayBlocked = true;
          this.notify();
        });
    };

    // Use passive event listeners for mobile gesture detection
    const events = ['touchend', 'click', 'keydown'];
    events.forEach((evt) => {
      document.addEventListener(evt, handleFirstGesture, { passive: true });
    });

    this.interactionCleanup = () => {
      events.forEach((evt) => {
        document.removeEventListener(evt, handleFirstGesture);
      });
    };
  }

  /**
   * Manual play triggered by user tapping the music toggle or enable prompt.
   */
  public play(): Promise<void> {
    this.cleanupInteractionListeners();
    this.autoplayBlocked = false;
    this.savePreference('enabled');

    const audio = this.getOrCreateAudio();
    audio.muted = false;
    this.isMuted = false;

    const promise = audio.play();
    if (promise && typeof promise.then === 'function') {
      return promise
        .then(() => {
          this.isPlaying = true;
          this.autoplayBlocked = false;
          this.fadeIn(this.volume, 800);
          this.notify();
        })
        .catch((err) => {
          console.warn('PrimeNest: Audio play prevented:', err);
          this.isPlaying = false;
          this.autoplayBlocked = true;
          this.notify();
        });
    }

    return Promise.resolve();
  }

  /**
   * Manual pause triggered by user.
   * Persists explicit 'disabled' preference so music does not automatically restart.
   */
  public pause() {
    this.cleanupInteractionListeners();
    this.autoplayBlocked = false;
    this.savePreference('disabled');

    if (this.fadeInterval) {
      window.clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
      this.notify();
    }
  }

  /**
   * Toggle playback state.
   */
  public togglePlay() {
    if (this.isPlaying && !this.isMuted) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Dismiss the autoplay invitation prompt without enabling audio.
   */
  public dismissAutoplayInvitation() {
    this.autoplayBlocked = false;
    this.savePreference('disabled');
    this.cleanupInteractionListeners();
    this.notify();
  }

  /**
   * Persists user preference to localStorage.
   */
  private savePreference(pref: MusicPreference) {
    this.preference = pref;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_KEY, pref);
      } catch {
        // localStorage not available
      }
    }
  }

  /**
   * Returns current audio state snapshot.
   */
  public getState(): AudioState {
    return {
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      volume: this.volume,
      autoplayBlocked: this.autoplayBlocked,
      preference: this.preference,
    };
  }

  /**
   * Subscribe to state changes.
   */
  public subscribe(listener: () => void): () => void {
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

  /**
   * Smooth volume fade-in
   */
  private fadeIn(targetVolume: number, durationMs = 1000) {
    if (!this.audio) return;
    if (this.fadeInterval) {
      window.clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    const startVolume = 0.02;
    this.audio.volume = startVolume;
    const startTime = Date.now();

    this.fadeInterval = window.setInterval(() => {
      if (!this.audio) {
        if (this.fadeInterval) window.clearInterval(this.fadeInterval);
        return;
      }
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      this.audio.volume = startVolume + progress * (targetVolume - startVolume);

      if (progress >= 1) {
        if (this.fadeInterval) {
          window.clearInterval(this.fadeInterval);
          this.fadeInterval = null;
        }
      }
    }, 40);
  }
}

export const audioManager = AudioManager.getInstance();
