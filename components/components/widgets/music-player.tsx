"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Pause, Play, Volume2 } from "lucide-react";

const tracks = [
  {
    title: "practice room",
    artist: "darren oommen",
    src: "VibeDepot - lofi hiphop music.mp3",
  },
  {
    title: "drum set clip",
    artist: "darren oommen",
    src: "/music/track-2.mp3",
  },
];

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.45);

  const activeTrack = tracks[activeIndex];

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    setIsPlaying(false);

    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.load();
  }, [activeIndex]);

  async function togglePlay() {
    if (!audioRef.current) return;

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
    }
  }

  return (
    <aside className="fixed left-4 top-4 z-[90] hidden w-[430px] border border-border/70 bg-background/85 p-2 shadow-2xl backdrop-blur-xl xl:block">
      <audio
        ref={audioRef}
        src={activeTrack.src}
        preload="metadata"
        onEnded={() => setIsPlaying(false)}
      />

      <div className="grid grid-cols-[1.25fr_1fr] gap-2">
        <div className="flex items-center gap-3 border border-border/60 bg-foreground px-3 py-2 text-background">
          <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden bg-primary">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-emerald-700 to-background opacity-80" />
            <div className="relative h-3 w-3 rounded-full bg-background" />
          </div>

          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-background/70">
              {isPlaying ? "now playing" : "paused"}
            </p>

            <p className="truncate font-mono text-sm tracking-wide">
              {activeTrack.title} — {activeTrack.artist}
            </p>
          </div>
        </div>

        <label className="flex items-center justify-between border border-border/60 bg-background px-3 py-2 font-mono text-sm text-foreground">
          <select
            value={activeIndex}
            onChange={(event) => setActiveIndex(Number(event.target.value))}
            className="w-full cursor-pointer appearance-none bg-transparent pr-2 outline-none"
          >
            {tracks.map((track, index) => (
              <option key={track.src} value={index}>
                {track.title}
              </option>
            ))}
          </select>

          <ChevronDown className="h-4 w-4 shrink-0" />
        </label>
      </div>

      <div className="mt-2 grid grid-cols-[auto_auto_1fr] gap-2">
        <button
          type="button"
          onClick={togglePlay}
          className="flex h-11 items-center gap-2 border border-border/60 bg-background px-4 font-mono text-sm uppercase tracking-wide text-foreground transition hover:bg-secondary/30"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isPlaying ? "pause" : "play"}
        </button>

        <div className="flex h-11 items-end gap-1 border border-border/60 bg-background px-4 py-2">
          {[18, 28, 38, 24, 16].map((height, index) => (
            <span
              key={index}
              className={[
                "w-1.5 bg-primary transition-all",
                isPlaying ? "animate-pulse" : "opacity-40",
              ].join(" ")}
              style={{ height }}
            />
          ))}
        </div>

        <div className="flex h-11 items-center gap-3 border border-border/60 bg-background px-4">
          <Volume2 className="h-4 w-4 text-foreground" />

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
      </div>
    </aside>
  );
}
