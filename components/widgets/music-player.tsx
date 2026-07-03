"use client";

import { AnimatePresence, motion } from "framer-motion";
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
    title: "Lofi Music",
    artist: "Darren Oommen",
    src: "/music/track-1.mp3",
  },
  {
    title: "Drum Reps",
    artist: "Darren Oommen",
    src: "/music/track-2.mp3",
  },
];

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.45);
  const [error, setError] = useState("");
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const activeTrack = tracks[activeIndex];

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;

    setError("");
    setAutoplayBlocked(false);
    setIsPlaying(false);

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.load();
  }, [activeIndex]);

  useEffect(() => {
    const tryAutoplay = async () => {
      if (!audioRef.current) return;

      try {
        audioRef.current.volume = volume;
        await audioRef.current.play();
        setIsPlaying(true);
        setAutoplayBlocked(false);
      } catch {
        setIsPlaying(false);
        setAutoplayBlocked(true);
      }
    };

    const timer = window.setTimeout(() => {
      void tryAutoplay();
    }, 600);

    return () => window.clearTimeout(timer);
    // only run once on first page load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function togglePlay() {
    if (!audioRef.current) return;

    setError("");
    setAutoplayBlocked(false);

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
        preload="auto"
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false);
          setError("Audio file not found. Check public/music.");
        }}
      />

      <motion.button
        type="button"
        onClick={() => setOpen((value) => !value)}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.04 }}
        className={[
          "relative flex h-14 w-14 items-center justify-center rounded-full",
          "border border-primary/25 bg-background/35 text-foreground",
          "shadow-xl backdrop-blur-2xl transition-all duration-300",
          "hover:border-primary/70 hover:bg-primary/15",
          open ? "border-primary/70 bg-primary/15" : "",
        ].join(" ")}
        aria-label="Open music player"
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/25 via-emerald-400/10 to-transparent" />

        {isPlaying && (
          <span className="absolute inset-[-6px] rounded-full border border-primary/30 animate-ping" />
        )}

        <Music2 className="relative h-5 w-5" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* mobile dim layer */}
            <motion.button
              type="button"
              aria-label="Close music player overlay"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[170] bg-background/40 backdrop-blur-sm md:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={[
                "fixed inset-x-4 bottom-5 z-[190]",
                "md:absolute md:inset-auto md:right-0 md:top-[calc(100%+1rem)] md:w-[340px]",
                "overflow-hidden rounded-3xl border border-primary/25",
                "bg-background/55 p-4 shadow-2xl backdrop-blur-2xl",
              ].join(" ")}
            >
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
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background/40 transition hover:bg-secondary/30"
                    aria-label="Close music player"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <label className="mb-4 flex items-center justify-between rounded-2xl border border-border/60 bg-background/40 px-4 py-3 text-sm text-foreground">
                  <select
                    value={activeIndex}
                    onChange={(event) =>
                      setActiveIndex(Number(event.target.value))
                    }
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
                    {[18, 32, 46, 28, 38, 22, 34, 16].map(
                      (height, index) => (
                        <motion.span
                          key={index}
                          animate={
                            isPlaying
                              ? {
                                  height: [
                                    height,
                                    Math.max(12, height - 14),
                                    height + 8,
                                    height,
                                  ],
                                }
                              : { height }
                          }
                          transition={{
                            duration: 0.8,
                            repeat: isPlaying ? Infinity : 0,
                            delay: index * 0.06,
                          }}
                          className={[
                            "w-1.5 rounded-full bg-primary transition-opacity",
                            isPlaying ? "opacity-100" : "opacity-35",
                          ].join(" ")}
                        />
                      )
                    )}
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

                {autoplayBlocked && !isPlaying && !error && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Tap play once to enable audio.
                  </p>
                )}

                {error && (
                  <p className="mt-3 text-xs text-red-400">
                    {error} Make sure your MP3s are named{" "}
                    <code>track-1.mp3</code> and <code>track-2.mp3</code> inside{" "}
                    <code>public/music</code>.
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
