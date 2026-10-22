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
    this.audio.volume = this.volume;
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
        console.warn('PrimeNest: Primary audio format fallback, attempting secondary source...');
        this.audio.src = this.fallbackAudioPath;
        this.audio.load();
        if (this.isPlaying || !this.userManuallyPaused) {
          this.audio.play().catch(() => {});
        }
      } else {
        this.isPlaying = false;
        this.notify();
      }
    });

    this.hasInitialized = true;
  }

  /**
   * Always attempts to start music on site entry.
   * - On desktop: plays immediately (browsers allow this).
   * - On mobile: browsers block autoplay; we silently wait for the
   *   first user interaction (tap / scroll / keydown) and then play.
   * Only skips if the user explicitly muted via the toggle button THIS session.
   */
  public autoStart() {
    if (this.hasAttemptedAutoStart && this.isPlaying) return;
    this.hasAttemptedAutoStart = true;

    // Only respect an explicit in-session mute — never block based on localStorage
    if (this.userManuallyPaused) return;

    this.init();
    if (!this.audio) return;

    this.isMuted = false;
    this.audio.muted = false;
    this.audio.volume = 0.01; // start near-silent; fadeIn will ramp up

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          this.autoplayBlocked = false;
          this.userManuallyPaused = false;
          this.fadeIn(this.volume, 1500);
          this.notify();
          // Clean up any pending interaction listeners
          this.cleanupInteractionListeners();
        })
        .catch(() => {
          // Browser blocked autoplay (common on mobile) — wait for first interaction
          this.isPlaying = false;
          this.autoplayBlocked = true;
          this.notify();
          this.setupInteractionListeners();
        });
    }
  }

  /** Attach one-shot interaction listeners that trigger music on first user gesture */
  private setupInteractionListeners() {
    if (this.interactionCleanup) return; // already set up

    const triggerOnInteraction = () => {
      this.cleanupInteractionListeners();
      if (!this.isPlaying && !this.userManuallyPaused) {
        this.playInternal();
      }
    };

    const events = ['pointerdown', 'touchstart', 'touchend', 'click', 'scroll', 'keydown'];
    events.forEach((evt) => {
      document.addEventListener(evt, triggerOnInteraction, { passive: true, once: true });
    });

    this.interactionCleanup = () => {
      events.forEach((evt) => {
        document.removeEventListener(evt, triggerOnInteraction);
      });
    };
  }

  private cleanupInteractionListeners() {
    if (this.interactionCleanup) {
      this.interactionCleanup();
      this.interactionCleanup = null;
    }
  }

  /** Internal play that doesn't write localStorage (used for auto-trigger) */
  private playInternal(): Promise<void> {
    this.init();
    if (!this.audio) return Promise.resolve();

    this.isMuted = false;
    this.audio.muted = false;
    this.audio.volume = 0.01;

    return this.audio
      .play()
      .then(() => {
        this.isPlaying = true;
        this.autoplayBlocked = false;
        this.fadeIn(this.volume, 1200);
        this.notify();
      })
      .catch(() => {
        // Still blocked — give up silently
        this.isPlaying = false;
        this.notify();
      });
  }

  public play(): Promise<void> {
    this.cleanupInteractionListeners();
    this.init();
    this.userManuallyPaused = false;
    this.autoplayBlocked = false;

    if (!this.audio) return Promise.resolve();

    this.isMuted = false;
    this.audio.muted = false;
    this.audio.volume = this.volume > 0 ? this.volume : 0.28;

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
      this.notify();
    }
  }

  public togglePlay() {
    if (this.isPlaying) {
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
    const startVolume = 0.01;
    this.audio.volume = startVolume;
    const startTime = Date.now();

    const step = () => {
      if (!this.audio || !this.isPlaying || this.isMuted) return;
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
