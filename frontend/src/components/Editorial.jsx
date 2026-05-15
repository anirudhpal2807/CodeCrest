import { useState, useRef, useEffect, useCallback } from 'react';
import { Pause, Play, Maximize2, Minimize2 } from 'lucide-react';

const PLAYER_SIZES = [
  { key: 'compact', label: 'S', cls: 'max-w-md' },
  { key: 'medium', label: 'M', cls: 'max-w-2xl' },
  { key: 'large', label: 'L', cls: 'max-w-5xl' },
  { key: 'full', label: '100%', cls: 'max-w-full' },
];

const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [durationSec, setDurationSec] = useState(duration ?? 0);
  const [isHovering, setIsHovering] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [playerSizeKey, setPlayerSizeKey] = useState('medium');

  const formatTime = (seconds) => {
    const s = Number(seconds) || 0;
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    const onFsChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const syncDuration = () => {
      const d = v.duration;
      if (d != null && Number.isFinite(d) && d > 0) setDurationSec(d);
    };
    v.addEventListener('loadedmetadata', syncDuration);
    syncDuration();
    return () => v.removeEventListener('loadedmetadata', syncDuration);
  }, [secureUrl]);

  useEffect(() => {
    if (duration != null && duration > 0) setDurationSec((d) => (d > 0 ? d : duration));
  }, [duration]);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => video && setCurrentTime(video.currentTime);
    const onEnded = () => setIsPlaying(false);

    if (video) {
      video.addEventListener('timeupdate', onTimeUpdate);
      video.addEventListener('play', onPlay);
      video.addEventListener('pause', onPause);
      video.addEventListener('ended', onEnded);
      return () => {
        video.removeEventListener('timeupdate', onTimeUpdate);
        video.removeEventListener('play', onPlay);
        video.removeEventListener('pause', onPause);
        video.removeEventListener('ended', onEnded);
      };
    }
  }, [secureUrl]);

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;
    try {
      const docFs = document.fullscreenElement;
      if (!docFs) {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      } else {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
      }
    } catch {
      /* fullscreen may be denied */
    }
  }, []);

  if (!secureUrl) {
    return (
      <div className="flex flex-col items-center justify-center py-12 rounded-xl" style={{ background: 'var(--cc-bg-card)', border: '1px solid var(--cc-border)' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="var(--cc-text-dimmed)" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
        <p className="mt-3 text-sm" style={{ color: 'var(--cc-text-muted)' }}>No video editorial available yet</p>
      </div>
    );
  }

  const scrubMax = durationSec > 0 ? durationSec : 1;
  const sizeCls = PLAYER_SIZES.find((p) => p.key === playerSizeKey)?.cls ?? 'max-w-2xl';

  return (
    <div className="flex flex-col gap-3 w-full">
      <div
        className="flex flex-wrap items-center justify-between gap-2"
        aria-label="Video controls"
      >
        <span className="text-xs font-medium" style={{ color: 'var(--cc-text-muted)' }}>
          Video size
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="inline-flex rounded-lg p-0.5 gap-0.5"
            style={{
              background: 'var(--cc-bg-secondary)',
              border: '1px solid var(--cc-border)',
            }}
          >
            {PLAYER_SIZES.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                disabled={fullscreen}
                onClick={() => setPlayerSizeKey(key)}
                title={
                  fullscreen
                    ? 'Exit fullscreen to change size'
                    : `${label} layout`
                }
                className="rounded-md px-2.5 py-1 text-xs font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none"
                style={{
                  background:
                    playerSizeKey === key ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                  color:
                    playerSizeKey === key
                      ? 'var(--cc-primary-light)'
                      : 'var(--cc-text-muted)',
                  border:
                    playerSizeKey === key
                      ? '1px solid rgba(99, 102, 241, 0.45)'
                      : '1px solid transparent',
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            className="cc-btn-ghost !px-3 !py-2 !rounded-lg inline-flex items-center gap-2 text-xs font-semibold"
          >
            {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            {fullscreen ? 'Exit' : 'Fullscreen'}
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className={`relative w-full mx-auto overflow-hidden transition-[max-width] duration-300 ease-out ${
          fullscreen ? '!max-w-none rounded-none aspect-auto min-h-0 flex flex-col bg-black' : `${sizeCls} aspect-video`
        }`}
        style={
          fullscreen
            ? { borderRadius: 0, border: 'none', width: '100%', height: '100%', maxHeight: '100vh', flex: 1 }
            : { borderRadius: 'var(--cc-radius-lg)', border: '1px solid var(--cc-border)' }
        }
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <video
          ref={videoRef}
          src={secureUrl}
          poster={thumbnailUrl}
          playsInline
          className={`cursor-pointer bg-black ${
            fullscreen
              ? 'w-full flex-1 min-h-0 shrink object-contain'
              : 'absolute inset-0 h-full w-full object-contain'
          }`}
          onClick={togglePlayPause}
        />

        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 p-4 transition-opacity duration-300 ${
            isHovering || !isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82), transparent)' }}
        >
          <div className="pointer-events-auto flex items-center">
            <button
              type="button"
              onClick={togglePlayPause}
              className="cc-btn-primary !p-2.5 !rounded-full mr-3 shrink-0"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
          </div>

          <div className="pointer-events-auto flex items-center mt-3 gap-3">
            <span className="text-xs font-mono shrink-0" style={{ color: 'rgba(248,250,252,0.92)' }}>
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={scrubMax}
              step="any"
              value={Math.min(currentTime, scrubMax)}
              onChange={(e) => {
                if (!videoRef.current) return;
                const t = Number(e.target.value);
                videoRef.current.currentTime = t;
                setCurrentTime(t);
              }}
              className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer min-w-0"
              style={{
                background: `linear-gradient(to right, var(--cc-primary) ${
                  (currentTime / scrubMax) * 100
                }%, rgba(148,163,184,0.35) ${(currentTime / scrubMax) * 100}%)`,
                accentColor: 'var(--cc-primary)',
              }}
            />
            <span className="text-xs font-mono shrink-0" style={{ color: 'rgba(248,250,252,0.92)' }}>
              {formatTime(durationSec)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editorial;
