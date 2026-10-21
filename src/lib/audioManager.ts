// Global Singleton Audio Manager for PrimeNest Ambient Music
class AudioManager {
  private static instance: AudioManager;
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private isMuted = false;
  private volume = 0.28; // Elegant, comfortable ambient luxury level
  private userManuallyPaused = false;
  private autoplayBlocked = false;
  private listeners: Set<() => void> = new Set();
  private hasInitialized = false;
  private hasAttemptedAutoStart = false;

  private primaryAudioPath = '/assets/audio/primenest-ambient.mp3';
  private fallbackAudioPath = '/assets/aistudio/WhatsApp_Audio_2026-10-20_at_1.28.19_PM_24e2d863.mpeg';

  private constructor() {
    if (typeof window !== 'undefined') {
      const savedPref = localStorage.getItem('primenest_music_pref');
      if (savedPref === 'off') {
        this.userManuallyPaused = true;
      }
    }
  }

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
        if (this.isPlaying || (!this.userManuallyPaused && !this.autoplayBlocked)) {
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
   * Attempts to start ambient audio playback on site entry.
   * Respects explicit visitor preference stored in localStorage.
   * If browser autoplay restrictions reject immediate unmuted playback,
   * sets autoplayBlocked = true so the UI can display the subtle invitation.
   */
  public autoStart() {
    if (this.hasAttemptedAutoStart && this.isPlaying) return;
    this.hasAttemptedAutoStart = true;

    // Check user preference
    if (typeof window !== 'undefined') {
      const savedPref = localStorage.getItem('primenest_music_pref');
      if (savedPref === 'off') {
        this.userManuallyPaused = true;
        this.isPlaying = false;
        this.autoplayBlocked = false;
        this.notify();
        return;
      }
    }

    this.init();
    if (!this.audio) return;

    this.isMuted = false;
    this.audio.muted = false;
    this.audio.volume = Math.min(this.volume, 0.12);

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          this.autoplayBlocked = false;
          this.userManuallyPaused = false;
          if (typeof window !== 'undefined') {
            localStorage.setItem('primenest_music_pref', 'on');
          }
          this.fadeIn(this.volume, 1200);
          this.notify();
        })
        .catch(() => {
          // Browser autoplay restriction active
          this.isPlaying = false;
          this.autoplayBlocked = true;
          this.notify();

          // Also set up a gentle one-time interaction listener as a safety net
          const triggerOnInteraction = () => {
            if (!this.isPlaying && !this.userManuallyPaused) {
              const pref = typeof window !== 'undefined' ? localStorage.getItem('primenest_music_pref') : null;
              if (pref !== 'off') {
                this.play();
              }
            }
            cleanup();
          };

          const cleanup = () => {
            const events = ['pointerdown', 'touchstart', 'click', 'keydown'];
            events.forEach((evt) => {
              window.removeEventListener(evt, triggerOnInteraction);
              document.removeEventListener(evt, triggerOnInteraction);
            });
          };

          const events = ['pointerdown', 'touchstart', 'click', 'keydown'];
          events.forEach((evt) => {
            window.addEventListener(evt, triggerOnInteraction, { passive: true, once: true });
            document.addEventListener(evt, triggerOnInteraction, { passive: true, once: true });
          });
        });
    }
  }

  public play(): Promise<void> {
    this.init();
    this.userManuallyPaused = false;
    this.autoplayBlocked = false;

    if (typeof window !== 'undefined') {
      localStorage.setItem('primenest_music_pref', 'on');
    }

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
    if (typeof window !== 'undefined') {
      localStorage.setItem('primenest_music_pref', 'off');
    }
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
    const startVolume = 0.05;
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
