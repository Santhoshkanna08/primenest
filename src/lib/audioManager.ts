// Global Singleton Audio Manager for PrimeNest Ambient Music
// Mobile-first approach: audio is ONLY started inside a real user gesture handler.
class AudioManager {
  private static instance: AudioManager;
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private isMuted = false;
  private volume = 0.28;
  private userManuallyPaused = false;
  private autoplayBlocked = false;
  private listeners: Set<() => void> = new Set();
  private hasSetupListeners = false;
  private interactionCleanup: (() => void) | null = null;

  private primaryAudioPath = '/assets/audio/primenest-ambient.mp3';
  private fallbackAudioPath = '/assets/audio/primenest-ambient.mpeg';

  private constructor() {}

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  /**
   * Create the audio element and append it to the DOM.
   * On mobile, a DOM-attached <audio> element is more reliable than `new Audio()`.
   * This can be called outside a gesture — we just can't play() outside one.
   */
  private createAudioElement(): HTMLAudioElement {
    // Remove any previously created element
    if (this.audio) {
      this.audio.pause();
      this.audio.removeAttribute('src');
      this.audio.load();
      this.audio.remove();
      this.audio = null;
    }

    const audio = document.createElement('audio');
    audio.id = 'primenest-ambient-audio';
    audio.setAttribute('playsinline', 'true');
    audio.setAttribute('webkit-playsinline', 'true');
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.01;
    audio.muted = false; // We will NEVER use muted autoplay — go unmuted from the start

    // Use <source> elements for format fallback (browser picks first supported)
    const sourceMp3 = document.createElement('source');
    sourceMp3.src = this.primaryAudioPath;
    sourceMp3.type = 'audio/mpeg';
    audio.appendChild(sourceMp3);

    const sourceMpeg = document.createElement('source');
    sourceMpeg.src = this.fallbackAudioPath;
    sourceMpeg.type = 'audio/mpeg';
    audio.appendChild(sourceMpeg);

    // Hidden but in the DOM
    audio.style.display = 'none';
    document.body.appendChild(audio);

    audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.autoplayBlocked = false;
      this.notify();
    });

    audio.addEventListener('pause', () => {
      if (!this.userManuallyPaused) return; // Ignore transient pauses during seek etc.
      this.isPlaying = false;
      this.notify();
    });

    audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.notify();
    });

    this.audio = audio;
    return audio;
  }

  /**
   * Called on app mount. Does NOT attempt to play audio.
   * Instead, sets up listeners that will start audio on the first real user gesture.
   *
   * Mobile browsers (iOS Safari, Android Chrome) require that audio.play()
   * is called synchronously inside a user-initiated event handler.
   * No amount of muted-autoplay tricks reliably circumvents this.
   */
  public autoStart() {
    if (this.hasSetupListeners) return;
    this.hasSetupListeners = true;

    if (this.userManuallyPaused) return;
    if (typeof window === 'undefined') return;

    // Pre-create the element so it starts loading the audio data.
    // We just don't call play() until a gesture fires.
    this.createAudioElement();

    this.setupPlayOnInteraction();
  }

  /**
   * On the very first user gesture, create (if needed) and play the audio.
   * Everything — especially the play() call — happens synchronously inside
   * the gesture handler, which is what mobile browsers require.
   */
  private setupPlayOnInteraction() {
    if (this.interactionCleanup) return;

    let fired = false;

    const startAudio = () => {
      if (fired) return;
      fired = true;
      this.cleanupInteractionListeners();

      if (this.userManuallyPaused) return;

      // Ensure we have an audio element
      const audio = this.audio || this.createAudioElement();

      // CRITICAL: set unmuted + low volume SYNCHRONOUSLY before calling play()
      audio.muted = false;
      audio.volume = 0.01;
      this.isMuted = false;

      // play() MUST be called synchronously inside this gesture handler
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
            // First attempt failed. Try creating a completely fresh audio element
            // inside this same call stack (still within the user gesture window).
            this.retryWithFreshElement();
          });
      }
    };

    // Listen on ALL gesture events. touchend is the most reliable on iOS;
    // pointerdown is most reliable on Android Chrome; click is desktop fallback.
    const events = ['touchend', 'touchstart', 'pointerdown', 'click', 'keydown'];
    events.forEach((evt) => {
      document.addEventListener(evt, startAudio, {
        passive: true,
        capture: true,
      });
    });

    this.interactionCleanup = () => {
      events.forEach((evt) => {
        document.removeEventListener(evt, startAudio, { capture: true });
      });
    };
  }

  /**
   * If the pre-created element failed to play, destroy it and try a brand-new
   * element. Some mobile browsers are stricter about reusing audio elements
   * that were created outside a gesture context.
   */
  private retryWithFreshElement() {
    const audio = this.createAudioElement();
    audio.muted = false;
    audio.volume = 0.01;

    audio
      .play()
      .then(() => {
        this.isPlaying = true;
        this.autoplayBlocked = false;
        this.fadeIn(this.volume, 1500);
        this.notify();
      })
      .catch(() => {
        // Still failed — audio is truly blocked. Show the icon as "off"
        // so the user knows to tap the music button manually.
        this.isPlaying = false;
        this.autoplayBlocked = true;
        this.notify();
      });
  }

  private cleanupInteractionListeners() {
    if (this.interactionCleanup) {
      this.interactionCleanup();
      this.interactionCleanup = null;
    }
  }

  public play(): Promise<void> {
    this.cleanupInteractionListeners();
    this.userManuallyPaused = false;
    this.autoplayBlocked = false;

    const audio = this.audio || this.createAudioElement();

    this.isMuted = false;
    audio.muted = false;
    audio.volume = 0.01;

    return audio
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
