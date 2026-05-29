import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ShieldAlert, ArrowDown, Sparkles } from 'lucide-react';

export default function StoryIntroView({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to show newly revealed content
  useEffect(() => {
    if (scrollContainerRef.current) {
      setTimeout(() => {
        scrollContainerRef.current?.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [step]);

  return (
    <div 
      ref={scrollContainerRef}
      className="fixed inset-0 z-[10000] w-full h-full overflow-y-auto bg-[#0a0705] text-[#ebdcb9] font-serif flex flex-col items-center justify-start py-12 px-6 select-none"
      style={{
        backgroundImage: `radial-gradient(circle at center, rgba(34, 18, 10, 0.45) 0%, rgba(5, 3, 2, 0.95) 100%)`
      }}
    >
      {/* Decorative corners to match 19th-century atmospheric documents */}
      <div className="fixed top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-[#8a6845]/40 pointer-events-none" />
      <div className="fixed top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-[#8a6845]/40 pointer-events-none" />
      <div className="fixed bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-[#8a6845]/40 pointer-events-none" />
      <div className="fixed bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-[#8a6845]/40 pointer-events-none" />

      <div className="w-full max-w-xl flex flex-col items-center space-y-12">
        {/* Emblem */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center space-y-3"
        >
          <div className="w-16 h-16 rounded-full border-2 border-[#f2be72]/60 flex items-center justify-center bg-black/60 shadow-[0_0_20px_rgba(242,190,114,0.1)]">
            <BookOpen className="text-[#f2be72] animate-pulse" size={28} />
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#f2be72]/70">PROLOGUE</span>
        </motion.div>

        {/* Section 1: The Dark Plague */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="w-full relative bg-amber-950/10 border border-amber-950/40 p-8 sm:p-10 rounded-lg shadow-2xl space-y-6"
          style={{
            boxShadow: 'inset 0 0 40px rgba(139,94,26,0.05), 0 15px 35px rgba(0,0,0,0.8)'
          }}
        >
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-amber-950/20 text-[#ebdcb9] font-mono text-[10px] tracking-[0.4em] px-3 py-1 rounded-full uppercase opacity-75 border border-[#8a6845]/20">
            YEAR 1805
          </div>
          
          <p className="text-lg sm:text-xl leading-relaxed text-center italic text-[#ebdcb9] pt-4 font-medium drop-shadow">
            "Amidst the Napoleonic wars (1802-1815), an unknown disease with an incredibly high mortality rate, its origins are currently unknown. That also brings back the undead back to life."
          </p>
          <p className="text-lg sm:text-xl leading-relaxed text-center italic text-[#ebdcb9] font-medium drop-shadow">
            "Sinners who have failed to accept Christ and repent for their sins, upon succumbing to the infection, re-animate."
          </p>

          <div className="h-[2px] bg-gradient-to-r from-transparent via-[#8a6845]/40 to-transparent w-full my-6" />

          {step === 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center pt-2"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(2)}
                className="group flex items-center gap-2 bg-[#8c6b45] hover:bg-[#a68257] active:bg-[#6e5131] text-[#0a0705] font-bold uppercase tracking-widest text-xs px-6 py-3 rounded shadow-lg transition duration-200"
              >
                <span>NEXT.</span>
                <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Section 2: The Player's Duty */}
        <AnimatePresence>
          {step >= 2 && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              className="w-full relative bg-amber-950/15 border border-amber-900/40 p-8 sm:p-10 rounded-lg shadow-2xl space-y-6"
              style={{
                boxShadow: 'inset 0 0 40px rgba(242,190,114,0.04), 0 15px 35px rgba(0,0,0,0.8)'
              }}
            >
              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-amber-950/20 text-[#f2be72] font-mono text-[10px] tracking-[0.4em] px-3 py-1 rounded-full uppercase opacity-75 border border-[#8a6845]/20">
                THE FRONT LINE
              </div>

              <p className="text-lg sm:text-xl leading-relaxed text-center text-[#ebdcb9] pt-4 font-semibold drop-shadow">
                "Now, the player will have to defeat the undead, one by one, through the use of focus and productivity."
              </p>

              <div className="h-[2px] bg-gradient-to-r from-transparent via-[#f2be72]/35 to-transparent w-full my-6" />

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col items-center space-y-3 pt-2"
              >
                <div className="flex gap-2 text-xs font-mono tracking-wider text-[#f2be72]/90 animate-pulse uppercase">
                  <ShieldAlert size={14} />
                  <span>PREPARE COMMANDER COGNITION</span>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(242,190,114,0.35)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onComplete}
                  className="w-full sm:w-auto bg-[#f2be72] text-[#0c141f] hover:bg-[#ffd18e] font-sans font-bold uppercase tracking-[0.2em] text-sm px-10 py-4.5 rounded shadow-[0_0_20px_rgba(242,190,114,0.15)] transition duration-300"
                >
                  START CAMPAIGN.
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-10" />
      </div>
    </div>
  );
}
