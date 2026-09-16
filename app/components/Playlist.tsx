"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { PLAYLIST, type Track } from "./playlist-data";

function Eq({ active }: { active: boolean }) {
  return (
    <span className="flex items-end gap-[2px] h-4 w-5 shrink-0">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`w-[3px] rounded-full bg-current ${active ? "eq-bar" : ""}`}
          style={{
            height: "100%",
            animationDelay: `${i * 0.18}s`,
            transform: active ? undefined : "scaleY(0.3)",
          }}
        />
      ))}
    </span>
  );
}

function Row({
  t,
  i,
  playing,
  onPlay,
  progress,
}: {
  t: Track;
  i: number;
  playing: boolean;
  onPlay: () => void;
  progress: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(i * 0.04, 0.3), ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={`group flex items-center gap-4 border-2 border-black rounded-2xl px-4 py-3 transition-colors duration-300 min-w-0 ${
          playing ? "bg-ink text-cream" : "bg-white hover:bg-cream"
        }`}
        data-cursor={playing ? "PAUSE" : "PLAY"}
        role="button"
        tabIndex={0}
        aria-label={playing ? `暂停 ${t.track}` : `播放 ${t.track}`}
        onClick={onPlay}
        onKeyDown={
          (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onPlay();
            }
          }
        }
      >
        <span className={`font-bold text-[13px] w-6 shrink-0 tabular-nums ${playing ? "text-paperee" : "opacity-40"}`} style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
          {String(i + 1).padStart(2, "0")}
        </span>

        <div className="relative w-11 h-11 shrink-0 rounded-xl border-2 border-black overflow-hidden bg-gradient-to-br from-paperee to-sulin">
          {t.art ? (
            <Image
              src={t.art}
              alt={t.track}
              width={88}
              height={88}
              unoptimized
              className={`w-full h-full object-cover transition-transform duration-500 ${playing ? "scale-110" : ""}`}
            />
          ) : (
            <span className="absolute inset-0 grid place-items-center text-[18px] font-black">♪</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <button
            className="block text-left font-bold text-[15px] sm:text-[16px] leading-tight truncate hover:underline underline-offset-4 w-full max-w-full"
            title="点击播放 / 暂停"
          >
            {t.track}
          </button>
          <p className={`text-[12px] mt-0.5 truncate ${playing ? "opacity-70" : "text-[#8A8280]"}`}>
            {playing ? (
              <span className="inline-flex items-center gap-2">
                试听中{" "}
                <span className="opacity-80 tabular-nums">
                  {Math.floor(progress / 60)}:{String(Math.floor(progress % 60)).padStart(2, "0")} / 0:30
                </span>
              </span>
            ) : (
              t.artist
            )}
          </p>
        </div>

        <button
            aria-label={playing ? "暂停" : "播放"}


            className={`grid place-items-center w-10 h-10 rounded-full border-2 transition-all shrink-0 ${
              playing
                ? "bg-cream text-ink border-cream"
                : "border-black bg-white hover:bg-ink hover:text-cream"
            }`}
          >
            {playing ? <Pause size={15} className="fill-current" /> : <Play size={15} className="ml-0.5 fill-current" />}
          </button>
          {playing && <Eq active />}
      </div>
    </motion.div>
  );
}

export default function Playlist() {
  const [idx, setIdx] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setIdx(null);
    setProgress(0);
  };

  const toggle = (i: number) => {
    if (idx === i) return stop();

    audioRef.current?.pause();
    const a = new Audio(PLAYLIST[i].preview);
    audioRef.current = a;
    a.play()
      .then(() => {
        setIdx(i);
        setProgress(0);
      })
      .catch(() => stop());
  };

  useEffect(() => {
    const a = audioRef.current;
    if (!a || idx === null) return;
    const tick = () => setProgress(a.currentTime);
    a.addEventListener("timeupdate", tick);
    a.addEventListener("ended", () => stop());
    return () => {
      a.removeEventListener("timeupdate", tick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  return (
    <div>
      <div className="grid lg:grid-cols-2 gap-3">
        {PLAYLIST.map((t, i) => (
          <Row
            key={t.q}
            t={t}
            i={i}
            playing={idx === i}
            progress={progress}
            onPlay={() => toggle(i)}
          />
        ))}
      </div>
      <p className="mt-5 text-[12px] text-[#8A8280] text-center">
        共 {PLAYLIST.length} 首 · 音源为 iTunes 官方 30 秒试听 ·
        <a
          className="u-grow font-bold text-ink ml-1"
          href={idx !== null ? `https://music.163.com/#/search/m/?s=${encodeURIComponent(PLAYLIST[idx].q)}` : "https://music.163.com"}
          target="_blank"
          rel="noreferrer"
        >
          完整版
        </a>
      </p>
    </div>
  );
}
