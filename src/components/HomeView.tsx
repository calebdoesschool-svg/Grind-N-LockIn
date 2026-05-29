import React, { useState, useEffect } from 'react';
import {ArrowRight, ChevronDown} from 'lucide-react';
import {motion} from 'motion/react';
import { useUser } from '../lib/UserContext';
import { ENEMIES } from './ArenaView';

const BIBLE_VERSES = [
  {
    reference: "Philippians 4:13",
    text: "“I can do all things through Christ who strengthens me.”"
  },
  {
    reference: "2 Timothy 1:7",
    text: "“For God gave us a spirit not of fear but of power and love and self-control.”"
  },
  {
    reference: "Galatians 6:9",
    text: "“Let us not grow weary of doing good, for in due season we will reap, if we do not give up.”"
  },
  {
    reference: "Ephesians 6:11",
    text: "“Put on the full armor of God, so that you can take your stand against the devil’s schemes.”"
  },
  {
    reference: "Psalm 27:1",
    text: "“The Lord is my light and my salvation—whom shall I fear?”"
  },
  {
    reference: "Joshua 1:9",
    text: "“Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.”"
  },
  {
    reference: "Romans 5:3–4",
    text: "“Suffering produces perseverance; perseverance, character; and character, hope.”"
  },
  {
    reference: "1 Corinthians 16:13",
    text: "“Be on your guard; stand firm in the faith; be courageous; be strong.”"
  },
  {
    reference: "Isaiah 40:31",
    text: "“Those who hope in the Lord will renew their strength.”"
  },
  {
    reference: "James 1:12",
    text: "“Blessed is the one who perseveres under trial.”"
  },
  {
    reference: "John 1:5",
    text: "“The light shines in the darkness, and the darkness has not overcome it.”"
  },
  {
    reference: "Psalm 23:4",
    text: "“Even though I walk through the valley of the shadow of death, I will fear no evil.”"
  },
  {
    reference: "Romans 12:21",
    text: "“Do not be overcome by evil, but overcome evil with good.”"
  }
];

export function getAvatarEvolution(xp: number) {
  if (xp <= 500) {
    return {
      level: 1,
      title: "Level 1: Scattered Rebel",
      clothing: "Oversized faded hoodie beneath a worn military-style coat, loose jeans, muddy boots, messy middle-part hair, tired eyes, slouched posture.",
      clutter: "Workspace cluttered with unfinished assignments, crumpled papers, and coffee stains.",
      item: "Glowing phone, small lantern, messy notebook, pencil, scattered study notes.",
      fx: "Weak lantern lighting, cold fog outside the window, drifting dust particles, faint screen static around the room."
    };
  } else if (xp <= 1000) {
    return {
      level: 2,
      title: "Level 2: Resolute Sentinel",
      clothing: "Cleaner layered outfit with rolled sleeves, scarf, fingerless gloves, neater hair, stronger posture.",
      clutter: "Desk becomes more organized with stacked books and pinned notes.",
      item: "Pocket watch, leather study planner, brighter desk lantern, satchel for assignments.",
      fx: "Lantern glow becomes warmer, fog slightly fades, subtle ember particles appear around the desk."
    };
  } else if (xp <= 2000) {
    return {
      level: 3,
      title: "Level 3: Strategic Commando",
      clothing: "Long military-inspired coat with layered modern student clothing, cleaner boots, calmer expression, confident upright posture.",
      clutter: "Workspace resembles a tactical study station.",
      item: "Headphones around neck, organized notebooks, wall maps, laptop stand, tactical pencil case, study timer.",
      fx: "Warm firelight mixes with cool moonlight, floating ash/ember particles, calmer room atmosphere, rain ambience outside windows."
    };
  } else if (xp <= 3500) {
    return {
      level: 4,
      title: "Level 4: Tactical Command Officer",
      clothing: "Refined dark-toned command outfit with fitted coat, polished boots, belts, gloves, and organized layered clothing.",
      clutter: "Workspace now resembles a command room with strategic maps and banners.",
      item: "Mechanical focus timer, upgraded lantern setup, advanced study station, decorated shelves, military-style journal, brass compass.",
      fx: "Fog retreats further into the background, cinematic shadows, stronger lantern glow, subtle orchestral ambience effect."
    };
  } else {
    return {
      level: 5,
      title: "Level 5: Supreme commander of Focus",
      clothing: "Fully composed commander appearance with elegant military-inspired fashion, layered coat, clean gloves, polished boots, relaxed but confident posture.",
      clutter: "Workspace becomes an elite late-night command center.",
      item: "Personalized productivity setup, custom lantern array, decorated command desk, medals, banners, premium study tools, elite room customization.",
      fx: "Golden lantern glow fills the room, cinematic dawn lighting, glowing ember particles, soft snowfall/rain ambience, complete disappearance of screen static and distraction effects."
    };
  }
}

export default function HomeView({onNavigateToArena, verseTrigger = 0}: {onNavigateToArena: () => void, verseTrigger?: number}) {
  const { userData, updateUserData } = useUser();
  const [objectives, setObjectives] = useState([
    { title: 'Start on an Assignment', completed: false },
    { title: 'Work & Study on unfinished assignments', completed: false },
    { title: 'No phone and social media for 2 hours', completed: false },
  ]);
  const [isCandleLit, setIsCandleLit] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(() => {
    const currentStr = localStorage.getItem('bibleVerseIndex');
    return currentStr ? parseInt(currentStr, 10) % BIBLE_VERSES.length : 0;
  });

  useEffect(() => {
    const currentStr = localStorage.getItem('bibleVerseIndex');
    const idx = currentStr ? parseInt(currentStr, 10) % BIBLE_VERSES.length : 0;
    setCurrentVerseIndex(idx);
  }, [verseTrigger]);

  const toggleObjective = async (index: number) => {
    const objective = objectives[index];
    const isNowCompleted = !objective.completed;

    setObjectives(prev => prev.map((obj, i) => 
      i === index ? { ...obj, completed: isNowCompleted } : obj
    ));

    if (isNowCompleted) {
      const activeEnemyId = userData.activeEnemyId || 'shambler';
      const activeEnemy = ENEMIES[activeEnemyId as keyof typeof ENEMIES] || ENEMIES.shambler;
      const currentHealth = userData[activeEnemy.dbHealthKey as keyof typeof userData] !== undefined 
        ? (userData[activeEnemy.dbHealthKey as keyof typeof userData] as number) 
        : 100;

      const damage = Math.round(20 * activeEnemy.damageMultiplier);
      let nextHealth = Math.max(currentHealth - damage, 0);
      let bonusCoins = 0;
      let nextKills = userData.enemiesKilled !== undefined ? userData.enemiesKilled : 0;
      let dbHealthVal = nextHealth;

      const coinsEarned = 10;
      const xpEarned = 15;

      if (nextHealth <= 0) {
        alert(`VICTORY! You have struck down ${activeEnemy.name}. An upgraded undead rises in their stead! You receive ${activeEnemy.victoryCoins} bonus coins!`);
        dbHealthVal = 100; // regenerates back to full
        nextHealth = 100;
        bonusCoins = activeEnemy.victoryCoins;
        nextKills += 1;
      } else {
        alert(`Direct hit! You completed an assignment objective and dealt ${damage}% damage to ${activeEnemy.name}! (${nextHealth}% health remaining)`);
      }

      await updateUserData({
        [activeEnemy.dbHealthKey]: dbHealthVal,
        coins: (userData.coins || 0) + coinsEarned + bonusCoins,
        xp: (userData.xp || 0) + xpEarned,
        enemiesKilled: nextKills,
      });
    }
  };
  
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <div className="flex flex-col w-full min-h-screen p-4 items-center" style={{ backgroundColor: '#5a4130' }}>
      {/* Bible Verse Box (Premium Scripture Scroll Style) */}
      <motion.div
        key={currentVerseIndex}
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm mb-4 p-5 rounded-lg border-2 border-amber-950 shadow-2xl relative overflow-hidden"
        style={{ 
          backgroundImage: 'radial-gradient(#fffbeb 40%, #fef3c7)',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.4), inset 0 0 40px rgba(139,94,26,0.1)'
        }}
      >
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-950/45 m-1.5" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-950/45 m-1.5" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-950/45 m-1.5" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-950/45 m-1.5" />
        
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <span className="w-1.5 h-1.5 bg-amber-950 rounded-full opacity-60" />
          <h3 className="font-serif text-amber-950 font-bold text-xs tracking-widest uppercase text-center opacity-85">Daily Scripture</h3>
          <span className="w-1.5 h-1.5 bg-amber-950 rounded-full opacity-60" />
        </div>
        
        <p className="text-amber-950 text-base leading-relaxed italic font-serif px-1 mb-2.5 text-center font-semibold">
          {BIBLE_VERSES[currentVerseIndex].text}
        </p>
        <p className="text-amber-900 text-[11px] font-mono font-bold uppercase tracking-widest text-center">
          — {BIBLE_VERSES[currentVerseIndex].reference}
        </p>
      </motion.div>

      <div 
        className="bg-[url('https://i.ibb.co.com/TMHJrMqz/be00dfecf025eb82e0d71620efd939d0.jpg')] bg-cover bg-center p-4 border border-amber-900 shadow-2xl rounded-lg font-serif w-full max-w-sm h-1/3 flex flex-col"
      >
        <h2 className="font-display-lg text-lg text-amber-950 uppercase tracking-widest text-center mb-1">Daily Objectives</h2>
        
        <div className="space-y-1 flex-grow">
          {objectives.map((obj, i) => (
            <button 
              key={i} 
              onClick={() => toggleObjective(i)}
              className="w-full flex items-center gap-1 p-1 border border-amber-900 bg-amber-100/50 hover:bg-amber-100 transition-all cursor-pointer rounded"
            >
              <div className={`w-3 h-3 border flex items-center justify-center ${obj.completed ? 'border-amber-950 bg-amber-950' : 'border-amber-950'}`}>
                  {obj.completed && <div className="w-1.5 h-1.5 bg-amber-100" />}
              </div>
              <span className={`font-body-sm text-left text-base ${obj.completed ? 'line-through text-amber-800' : 'text-amber-950'}`}>{obj.title}</span>
            </button>
          ))}
        </div>
      </div>



      <div className="mt-4 flex gap-6 text-amber-900 -ml-16">
        {userData?.purchasedItems?.includes('lantern') ? (
          <img 
            src="https://i.ibb.co.com/HDfD6v2N/Yeah-after-looking-through-the-wiki-pages-and-customization-pages-the-vibe-you-re-probably-liking.png" 
            alt="Lantern" 
            className="w-56 h-56 -mt-8 object-contain" 
            referrerPolicy="no-referrer" 
          />
        ) : (
          <button onClick={() => setIsCandleLit(!isCandleLit)} className="p-0">
            <img src={isCandleLit ? "https://i.ibb.co.com/9mLjJKJy/6.png" : "https://i.ibb.co.com/qFxz6gLG/7.png"} alt="Candle" className="w-56 h-56 -mt-8" referrerPolicy="no-referrer" />
          </button>
        )}
        {userData?.purchasedItems?.includes('desk') ? (
          <img src="https://i.ibb.co.com/Mk0BjgtC/Yeah-after-looking-through-the-wiki-pages-and-customization-pages-the-vibe-you-re-probably-liking.png" alt="Custom Cross" className="w-40 h-40 rotate-12 -ml-8" referrerPolicy="no-referrer" />
        ) : (
          <img src="https://i.ibb.co.com/3y4QFxk9/Yeah-after-looking-through-the-wiki-pages-and-customization-pages-the-vibe-you-re-probably-liking.png" alt="Cross" className="w-40 h-40 rotate-12 -ml-8" referrerPolicy="no-referrer" />
        )}
      </div>

      {/* Purchased Bible display below candle & cross */}
      {userData?.purchasedItems?.includes('bible') && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-2 text-center select-none"
        >
          <img 
            src="https://i.ibb.co.com/WpdcBRrs/Yeah-after-looking-through-the-wiki-pages-and-customization-pages-the-vibe-you-re-probably-liking.png" 
            alt="Sacred Bible" 
            className="w-44 h-44 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] mx-auto object-contain transition-transform hover:scale-105" 
            referrerPolicy="no-referrer" 
          />
          <p className="font-serif text-amber-950 font-bold tracking-widest text-[10px] uppercase mt-1 opacity-75">Holy Scripture Sanctuary Securing</p>
        </motion.div>
      )}

      <button onClick={scrollToBottom} className="my-4 text-amber-900 animate-bounce">
        <ChevronDown size={32} />
      </button>

      <div className="mt-auto w-full max-w-sm">
        <button 
          onClick={onNavigateToArena}
          className="w-full flex items-center justify-center gap-2 p-4 bg-primary text-on-primary font-bold uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 border-2 border-primary"
        >
          To the Arena <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
