// Global Singleton Audio Manager for PrimeNest Ambient Music
class AudioManager {
  private static instance: AudioManager;
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private isMuted = false;
  private volume = 0.35; // Elegant, comfortable ambient level
  private userManuallyPaused = false;
  private listeners: Set<() => void> = new Set();
  private hasInitialized = false;
  private hasStartedAutoPlay = false;

  private constructor() {
    // Default to unmuted on site entry so music can play as requested
    this.isMuted = false;
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public init() {
    if (this.hasInitialized || typeof window === 'undefined') return;

    // Use the uploaded audio asset directly with graceful fallback
    this.audio = new Audio('/assets/aistudio/WhatsApp_Audio_2026-10-20_at_1.28.19_PM_24e2d863.mpeg');
    this.audio.setAttribute('playsinline', 'true');
    this.audio.setAttribute('webkit-playsinline', 'true');
    this.audio.loop = true;
    this.audio.volume = this.volume;
    this.audio.preload = 'auto';

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
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
      console.warn('Primary audio failed or not supported, attempting fallback audio/mpeg...');
      if (this.audio && !this.audio.src.includes('primenest-ambient.mp3')) {
        this.audio.src = '/assets/audio/primenest-ambient.mp3';
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
   * Automatically starts playing ambient music whenever the user enters the website.
   * If browser autoplay policy prevents immediate unmuted audio, it hooks into the
   * very first user interaction (touch, tap, click, key, or scroll) anywhere on the page
   * to start playing immediately.
   */
  public autoStart() {
    if (this.hasStartedAutoPlay && this.isPlaying) return;
    this.hasStartedAutoPlay = true;
    this.userManuallyPaused = false;
    this.init();
    if (!this.audio) return;

    this.isMuted = false;
    this.audio.muted = false;
    this.audio.volume = Math.min(this.volume, 0.15);

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          this.fadeIn(this.volume, 1200);
          this.notify();
        })
        .catch((err) => {
          // Modern browsers block autoplay until first user gesture
          console.info('PrimeNest: Autoplay awaiting first user gesture:', err?.name || err);
          this.isPlaying = false;
          this.notify();

          const triggerOnInteraction = () => {
            if (!this.isPlaying && !this.userManuallyPaused) {
              this.play();
            }
            cleanup();
          };

          const cleanup = () => {
            const events = ['pointerdown', 'touchstart', 'click', 'keydown', 'scroll', 'wheel'];
            events.forEach((evt) => {
              window.removeEventListener(evt, triggerOnInteraction);
              document.removeEventListener(evt, triggerOnInteraction);
            });
          };

          const events = ['pointerdown', 'touchstart', 'click', 'keydown', 'scroll', 'wheel'];
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
    if (!this.audio) return Promise.resolve();

    this.isMuted = false;
    this.audio.muted = false;
    this.audio.volume = this.volume > 0 ? this.volume : 0.35;

    return this.audio.play().then(() => {
      this.isPlaying = true;
      this.fadeIn(this.volume, 800);
      this.notify();
    }).catch(err => {
      console.warn('Playback prevented by browser policy or error:', err);
      this.isPlaying = false;
      this.notify();
    });
  }

  public pause() {
    this.userManuallyPaused = true;
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

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.audio) {
      this.audio.muted = muted;
      this.audio.volume = muted ? 0 : this.volume;
    }
    this.notify();
  }

  public toggleMute() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audio && !this.isMuted) {
      this.audio.volume = this.volume;
    }
    this.notify();
  }

  public getState() {
    return {
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      volume: this.volume,
      userManuallyPaused: this.userManuallyPaused
    };
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
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
