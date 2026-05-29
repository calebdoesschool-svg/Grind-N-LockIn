import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export default function DisciplineWatchView({ onComplete }: { onComplete: () => void }) {
  const [disciplineActive, setDisciplineActive] = useState(false);
  const [morale, setMorale] = useState(100);
  const [health, setHealth] = useState(100);
  const [escapeCount, setEscapeCount] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(7200); // 2 hours
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  function formatTime(seconds: number) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return (
      String(hrs).padStart(2, "0") + ":" +
      String(mins).padStart(2, "0") + ":" +
      String(secs).padStart(2, "0")
    );
  }

  const startDisciplineWatch = async () => {
    setDisciplineActive(true);
    
    // Attempt fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  useEffect(() => {
    if (disciplineActive) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            completeDisciplineWatch();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [disciplineActive]);

  const completeDisciplineWatch = () => {
    alert("DISCIPLINE WATCH COMPLETE\n\n+35 XP\n+30 Coins");
    onComplete();
  };

  const triggerWarningEffects = () => {
    try {
      const boom = new Audio("/boom.mp3");
      boom.volume = 0.5;
      boom.play().catch(() => {});
    } catch (e) {
      console.log("Audio play failed");
    }

    document.body.classList.add("dangerFlash");
    setTimeout(() => {
      document.body.classList.remove("dangerFlash");
    }, 500);
  };

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && disciplineActive) {
        setEscapeCount((prev) => prev + 1);
        setMorale((prev) => Math.max(prev - 8, 0));
        setHealth((prev) => Math.max(prev - 5, 0));
        triggerWarningEffects();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [disciplineActive]);

  useEffect(() => {
    const prevent = (e: TouchEvent) => e.preventDefault();
    document.addEventListener("touchmove", prevent, { passive: false });
    return () => {
      document.removeEventListener("touchmove", prevent);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 w-full h-full bg-black z-[99999] flex flex-col justify-between p-6 font-serif select-none"
    >
      {/* Top action bar */}
      <div className="w-full flex justify-between items-center text-white border-b border-white/10 pb-4 z-10">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#f2be72] font-mono">Discipline Lock-in</span>
          <h2 className="text-lg uppercase">Phone Isolation Campaign</h2>
        </div>
        <div className="flex gap-2.5">
          {disciplineActive && (
            <button 
              onClick={() => {
                if (confirm("Instantly bypass the timer for demo and reward testing?")) {
                  completeDisciplineWatch();
                }
              }}
              className="px-2.5 py-1 text-[10px] uppercase font-mono bg-emerald-700/80 hover:bg-emerald-600 transition text-white border border-emerald-500 rounded"
            >
              Skip (Demo)
            </button>
          )}
          <button 
            onClick={onComplete}
            className="px-3 py-1 text-xs uppercase tracking-wider font-mono border border-white/40 hover:bg-white/10 transition text-white"
          >
            Leave
          </button>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/90 pointer-events-none" />

      {/* Center lock view */}
      <div className="flex-1 flex flex-col items-center justify-center text-center z-10 max-w-xl mx-auto space-y-6">
        {!disciplineActive ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-6"
          >
            <h1 className="text-3xl md:text-4xl text-white tracking-widest">DISCIPLINE WATCH</h1>
            <p className="text-sm opacity-75 max-w-sm text-[#dbe3f3] leading-relaxed">
              Seal yourself away from notifications or browsing. Focus completely on offline goals. Remaining on this screen earns you defense resources.
            </p>
            <button 
              onClick={startDisciplineWatch} 
              className="px-8 py-3.5 bg-red-950 hover:bg-red-900 border border-red-500 text-white font-bold tracking-widest text-sm transition shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            >
              START WATCH
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center space-y-6"
          >
            <div className="text-xl tracking-widest uppercase text-red-500 font-bold animate-pulse">ISOLATION SECURED</div>
            <p className="text-sm opacity-60 text-white leading-relaxed max-w-md">Do not navigate away or switch app windows, otherwise the defense boundary will fail.</p>
            <div className="text-6xl sm:text-8xl md:text-9xl font-mono font-bold text-[#f2be72] text-shadow-xl animate-pulse">
              {formatTime(secondsLeft)}
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom info section */}
      <div className="w-full text-center py-4 border-t border-white/10 z-10">
        <p className="text-xs uppercase tracking-widest text-slate-400">
          REWARD UPON COMPLETION: <span className="text-[#f2be72] font-mono font-bold">+35 XP • +30 COINS</span>
        </p>
      </div>
    </motion.div>
  );
}
