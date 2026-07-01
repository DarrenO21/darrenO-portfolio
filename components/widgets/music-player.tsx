"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Music2,
  Pause,
  Play,
  SkipForward,
  Volume2,
  X,
} from "lucide-react";

const tracks = [
  {
    title: "Drum Practice",
    artist: "Darren Oommen",
    src: "/music/track-1.mp3",
  },
  {
    title: "Live Percussion",
    artist: "Darren Oommen",
    src: "/music/track-2.mp3",
  },
];

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [error, setError] = useState("");

  const activeTrack = tracks[activeIndex];

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    setIsPlaying(false);
    setError("");

    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.load();
  }, [activeIndex]);

  async function togglePlay() {
    if (!audioRef.current) return;

    setError("");

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
      setError("Audio file missing or blocked.");
    }
  }

  function nextTrack() {
    setActiveIndex((current) => (current + 1) % tracks.length);
  }

  return (
    <div className="relative z-[180]">
      <audio
        ref={audioRef}
        src={activeTrack.src}
        preload="metadata"
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false);
          setError("Audio file not found. Check public/music.");
        }}
      />

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-background/35 text-foreground shadow-xl backdrop-blur-2xl transition-all duration-300 hover:scale-105 hover:border-primary/70 hover:bg-primary/15"
        aria-label="Open music player"
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-emerald-400/10 to-transparent" />
        <Music2 className="relative h-5 w-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+1rem)] w-[330px] overflow-hidden rounded-3xl border border-primary/25 bg-background/45 p-4 shadow-2xl backdrop-blur-2xl">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/20 via-emerald-500/10 to-transparent" />

          <div className="relative z-10">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
                  {isPlaying ? "now playing" : "music"}
                </p>

                <h3 className="mt-1 text-xl font-serif italic text-foreground">
                  {activeTrack.title}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {activeTrack.artist}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background/40 transition hover:bg-secondary/30"
                aria-label="Close music player"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <label className="mb-4 flex items-center justify-between rounded-2xl border border-border/60 bg-background/40 px-4 py-3 text-sm text-foreground">
              <select
                value={activeIndex}
                onChange={(event) => setActiveIndex(Number(event.target.value))}
                className="w-full cursor-pointer appearance-none bg-transparent pr-3 outline-none"
              >
                {tracks.map((track, index) => (
                  <option key={track.src} value={index}>
                    {track.title}
                  </option>
                ))}
              </select>

              <ChevronDown className="h-4 w-4 shrink-0" />
            </label>

            <div className="mb-4 flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlay}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-primary/40 bg-foreground text-background transition hover:bg-background hover:text-foreground"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isPlaying ? "Pause" : "Play"}
              </button>

              <button
                type="button"
                onClick={nextTrack}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-background/40 transition hover:bg-secondary/30"
                aria-label="Next track"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-4 flex h-20 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-background/35 px-4">
              <div className="flex h-12 items-end justify-center gap-1 overflow-hidden">
                {[18, 32, 46, 28, 38, 22, 34, 16].map((height, index) => (
                  <span
                    key={index}
                    className={[
                      "w-1.5 rounded-full bg-primary transition-all",
                      isPlaying ? "animate-pulse opacity-100" : "opacity-35",
                    ].join(" ")}
                    style={{ height }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/35 px-4 py-3">
              <Volume2 className="h-4 w-4 text-muted-foreground" />

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                className="w-full accent-primary"
              />
            </div>

            {error && (
              <p className="mt-3 text-xs text-red-400">
                {error} Make sure your MP3s are named{" "}
                <code>track-1.mp3</code> and <code>track-2.mp3</code> inside{" "}
                <code>public/music</code>.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
