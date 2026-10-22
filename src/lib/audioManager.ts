// Global Singleton Audio Manager for PrimeNest Ambient Music
class AudioManager {
  private static instance: AudioManager;
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private isMuted = false;
  private volume = 0.28;
  private userManuallyPaused = false;
  private autoplayBlocked = false;
  private listeners: Set<() => void> = new Set();
  private hasInitialized = false;
  private hasAttemptedAutoStart = false;
  private interactionCleanup: (() => void) | null = null;

  private primaryAudioPath = '/assets/audio/primenest-ambient.mp3';
  private fallbackAudioPath = '/assets/aistudio/WhatsApp_Audio_2026-10-20_at_1.28.19_PM_24e2d863.mpeg';

  private constructor() {}

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public init() {
    if (this.hasInitialized || typeof window === 'undefined') return;

    this.audio = new Audio(this.primaryAudioPath);
    this.audio.setAttribute('playsinline', 'true');
    this.audio.setAttribute('webkit-playsinline', 'true');
    this.audio.loop = true;
    this.audio.volume = 0;
    this.audio.muted = true; // Start muted — browsers allow muted autoplay everywhere
    this.audio.preload = 'auto';

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.autoplayBlocked = false;
      this.notify();
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.notify();
    });

    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.notify();
    });

    this.audio.addEventListener('error', () => {
      if (this.audio && !this.audio.src.includes(this.fallbackAudioPath)) {
        console.warn('PrimeNest: Primary audio fallback triggered.');
        this.audio.src = this.fallbackAudioPath;
        this.audio.load();
        this.audio.play().catch(() => {});
      } else {
        this.isPlaying = false;
        this.notify();
      }
    });

    this.hasInitialized = true;
  }

  /**
   * Strategy:
   * 1. Play muted immediately — ALL browsers (including mobile) allow muted autoplay.
   * 2. As soon as any user gesture (touch / click / scroll / key) is detected,
   *    unmute and fade the volume in. The user never has to press anything manually.
   * 3. Only skip entirely if the user explicitly pressed the mute toggle this session.
   */
  public autoStart() {
    if (this.hasAttemptedAutoStart) return;
    this.hasAttemptedAutoStart = true;

    // Respect explicit in-session mute only
    if (this.userManuallyPaused) return;

    this.init();
    if (!this.audio) return;

    // Play muted — this works on every browser including iOS / Android
    this.audio.muted = true;
    this.audio.volume = 0;

    this.audio
      .play()
      .then(() => {
        this.isPlaying = true;
        this.autoplayBlocked = false;
        this.notify();

        // Now wait for the first user gesture to unmute
        this.setupUnmuteOnInteraction();
      })
      .catch(() => {
        // Extremely rare — even muted autoplay failed. Wait for interaction to start.
        this.isPlaying = false;
        this.autoplayBlocked = true;
        this.notify();
        this.setupPlayOnInteraction();
      });
  }

  /**
   * Audio is already playing muted.
   * On first user gesture, unmute + fade in volume.
   */
  private setupUnmuteOnInteraction() {
    if (this.interactionCleanup) return;

    const unmuteOnGesture = () => {
      this.cleanupInteractionListeners();
      if (this.userManuallyPaused) return;
      if (!this.audio) return;

      // Unmute directly in the event handler (synchronous — required for iOS)
      this.audio.muted = false;
      this.isMuted = false;
      this.audio.volume = 0.01;
      this.fadeIn(this.volume, 1500);
      this.notify();
    };

    // Use capture phase to catch events before they reach any element
    const events = ['touchstart', 'pointerdown', 'click', 'keydown', 'scroll'];
    events.forEach((evt) => {
      document.addEventListener(evt, unmuteOnGesture, {
        passive: true,
        once: true,
        capture: true,
      });
    });

    this.interactionCleanup = () => {
      events.forEach((evt) => {
        document.removeEventListener(evt, unmuteOnGesture, { capture: true });
      });
    };
  }

  /**
   * Fallback: muted autoplay also failed. On first gesture, start playing + unmute.
   */
  private setupPlayOnInteraction() {
    if (this.interactionCleanup) return;

    const playOnGesture = () => {
      this.cleanupInteractionListeners();
      if (this.userManuallyPaused || !this.audio) return;

      this.audio.muted = false;
      this.audio.volume = 0.01;
      this.audio
        .play()
        .then(() => {
          this.isPlaying = true;
          this.autoplayBlocked = false;
          this.fadeIn(this.volume, 1200);
          this.notify();
        })
        .catch(() => {});
    };

    const events = ['touchstart', 'pointerdown', 'click', 'keydown'];
    events.forEach((evt) => {
      document.addEventListener(evt, playOnGesture, {
        passive: true,
        once: true,
        capture: true,
      });
    });

    this.interactionCleanup = () => {
      events.forEach((evt) => {
        document.removeEventListener(evt, playOnGesture, { capture: true });
      });
    };
  }

  private cleanupInteractionListeners() {
    if (this.interactionCleanup) {
      this.interactionCleanup();
      this.interactionCleanup = null;
    }
  }

  public play(): Promise<void> {
    this.cleanupInteractionListeners();
    this.init();
    this.userManuallyPaused = false;
    this.autoplayBlocked = false;

    if (!this.audio) return Promise.resolve();

    this.isMuted = false;
    this.audio.muted = false;
    this.audio.volume = 0.01;

    return this.audio
      .play()
      .then(() => {
        this.isPlaying = true;
        this.autoplayBlocked = false;
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

  private fadeIn(targetVolume: number, durationMs = 1000) {
    if (!this.audio) return;
    const startVolume = this.audio.volume || 0.01;
    const startTime = Date.now();

    const step = () => {
      if (!this.audio || this.userManuallyPaused) return;
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      this.audio.volume = startVolume + progress * (targetVolume - startVolume);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        this.audio.volume = targetVolume;
      }
    };

    requestAnimationFrame(step);
  }
}

export const audioManager = AudioManager.getInstance();
