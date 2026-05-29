import React, { useState, useEffect } from 'react';
import { AlertTriangle, Lock, ShieldCheck, Target, Zap, Skull } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import MobilizationView from './MobilizationView';
import DisciplineWatchView from './DisciplineWatchView';
import FocusSessionView from './FocusSessionView';
import { useUser } from '../lib/UserContext';

// Definition of the three enemy levels
export const ENEMIES = {
  shambler: {
    id: 'shambler',
    name: 'The Shambler',
    subtitle: 'A quiet phantom of the frozen retreat...',
    image: 'https://i.ibb.co.com/KPCwx3X/2.png',
    reqXp: 0,
    dbHealthKey: 'shamblerHealth',
    damageMultiplier: 1.0,
    strikeDamage: 20,
    victoryCoins: 50,
    flavor: 'Takes normal damage. Deals 20% cognitive fatigue on interruption.'
  },
  rgbomber: {
    id: 'rgbomber',
    name: 'RGBomber',
    subtitle: 'A screen-glitching herald of visual static...',
    image: 'https://i.ibb.co.com/CKDRHQRM/3.png',
    reqXp: 500,
    dbHealthKey: 'rgbomberHealth',
    damageMultiplier: 0.7,
    strikeDamage: 30,
    victoryCoins: 120,
    flavor: 'Takes 30% reduced damage. Deals 30% cognitive fatigue on interruption.'
  },
  cuirascreen: {
    id: 'cuirascreen',
    name: 'Cuirascreen',
    subtitle: 'An ironclad glass monolith shielding toxic server code...',
    image: 'https://i.ibb.co.com/v4wYQG8K/1.png',
    reqXp: 1500,
    dbHealthKey: 'cuirascreenHealth',
    damageMultiplier: 0.45,
    strikeDamage: 45,
    victoryCoins: 250,
    flavor: 'Takes 55% reduced damage. Inflicts devastating 45% cognitive fatigue.'
  }
};

const ProgressBar = ({ label, value, colorClass, alarm = false }: { label: string, value: number, colorClass: string, alarm?: boolean }) => (
  <div className="w-full mb-1">
    <div className="flex justify-between items-end mb-1">
      <span className={`font-mono text-[10px] uppercase tracking-widest font-bold ${alarm ? 'text-red-500' : colorClass}`}>{label}</span>
      <span className={`font-mono text-xs ${alarm ? 'text-red-500 font-bold animate-pulse' : colorClass}`}>{Math.round(value)}%</span>
    </div>
    <div className="h-2.5 w-full bg-black/50 border border-[#8a6845]/30 overflow-hidden p-[1px] rounded">
      <motion.div 
        animate={{width: `${value}%`}}
        className={`h-full ${alarm ? 'bg-red-500 animate-pulse' : colorClass} rounded-sm`} 
        transition={{ duration: 0.4 }}
      />
    </div>
  </div>
);

export default function ArenaView() {
  const [userMorale, setUserMorale] = useState(100);
  const [userInfection, setUserInfection] = useState(0);
  const [userHealth, setUserHealth] = useState(100);
  const [confirmingIndex, setConfirmingIndex] = useState<number | null>(null);
  const [activeSession, setActiveSession] = useState<{tag: string, end: number} | null>(null);
  const { userData, updateUserData } = useUser();
  const [showMobilization, setShowMobilization] = useState(false);
  const [showFocusSession, setShowFocusSession] = useState(false);
  const [showDiscipline, setShowDiscipline] = useState(false);
  const [selectedEnemyId, setSelectedEnemyId] = useState<string | null>(null);

  const userXp = userData.xp || 0;
  const activeEnemyId = userData.activeEnemyId || 'shambler';
  const activeEnemy = ENEMIES[activeEnemyId as keyof typeof ENEMIES] || ENEMIES.shambler;

  // Synchronize local vitals states with global userData
  useEffect(() => {
    if (userData) {
      if (userData.morale !== undefined) setUserMorale(userData.morale);
      if (userData.infection !== undefined) setUserInfection(userData.infection);
      if (userData.health !== undefined) setUserHealth(userData.health);
    }
  }, [userData.morale, userData.infection, userData.health]);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserMorale(data.morale !== undefined ? data.morale : 100);
          setUserInfection(data.infection !== undefined ? data.infection : 0);
          setUserHealth(data.health !== undefined ? data.health : 100);
        } else {
          await setDoc(userDocRef, {
            morale: 100, infection: 0, health: 100,
            shamblerHealth: 100, rgbomberHealth: 100, cuirascreenHealth: 100,
            coins: 0, xp: 0, streak: 0, totalSessions: 0, sessionHistory: [], purchasedItems: [],
            enemiesKilled: 0, activeEnemyId: 'shambler'
          });
        }
      }
    };
    fetchData();
  }, []);

  const takeDamage = async () => {
    const damageDealt = activeEnemy.strikeDamage;
    const newMorale = Math.max(userMorale - damageDealt, 0);
    const newInfection = Math.min(userInfection + damageDealt, 100);
    const newHealth = Math.max(userHealth - damageDealt, 0);

    setUserMorale(newMorale);
    setUserInfection(newInfection);
    setUserHealth(newHealth);
    setActiveSession(null);

    await updateUserData({
      morale: newMorale,
      infection: newInfection,
      health: newHealth
    });
    alert(`Session interrupted! ${activeEnemy.name} strikes! You suffer -${damageDealt}% Health and Morale.`);
  };

  const handleCampaignComplete = async (baseDmg: number, rewardCoins: number, rewardXp: number, sessionTag: string) => {
    // Read the latest health of the active enemy from userData
    const currentHealth = userData[activeEnemy.dbHealthKey as keyof typeof userData] !== undefined 
      ? (userData[activeEnemy.dbHealthKey as keyof typeof userData] as number) 
      : 100;

    const damageDealt = Math.round(baseDmg * activeEnemy.damageMultiplier);
    let nextHealth = Math.max(currentHealth - damageDealt, 0);
    let bonusCoins = 0;
    let nextKills = userData.enemiesKilled !== undefined ? userData.enemiesKilled : 0;
    let dbHealthVal = nextHealth;

    if (nextHealth <= 0) {
      alert(`RESOLVE CRUSHED THE UNDEAD!\n\nYou have SLAIN ${activeEnemy.name}! A new level specimen of the same ranks re-animates to take its place.\n\nVictory Reward Awarded: +${activeEnemy.victoryCoins} Coins & XP!`);
      dbHealthVal = 100; // auto-regenerates back to full
      nextHealth = 100;
      bonusCoins = activeEnemy.victoryCoins;
      nextKills += 1; // register kill
    } else {
      alert(`DIRECT HIT! Your absolute discipline dealt ${damageDealt}% damage to ${activeEnemy.name}. Remaining health: ${nextHealth}%.`);
    }

    const nextMorale = Math.min(userMorale + (sessionTag === 'DISCIPLINE' ? 35 : sessionTag === 'ACADEMIC' ? 20 : 10), 100);
    const nextInfection = Math.max(userInfection - (sessionTag === 'DISCIPLINE' ? 30 : sessionTag === 'ACADEMIC' ? 20 : 15), 0);

    await updateUserData({
      coins: (userData.coins || 0) + rewardCoins + bonusCoins,
      xp: (userData.xp || 0) + rewardXp,
      streak: (userData.streak || 0) + 1,
      totalSessions: (userData.totalSessions || 0) + 1,
      sessionHistory: [...(userData.sessionHistory || []), {date: new Date().toLocaleDateString(), xp: rewardXp, type: sessionTag}],
      morale: nextMorale,
      infection: nextInfection,
      [activeEnemy.dbHealthKey]: dbHealthVal,
      enemiesKilled: nextKills
    });

    setUserMorale(nextMorale);
    setUserInfection(nextInfection);

    setShowMobilization(false);
    setShowFocusSession(false);
    setShowDiscipline(false);
  };

  const startCampaign = async (index: number) => {
    setConfirmingIndex(null);
    const action = actions[index];

    if (action.tag === 'DISCIPLINE') {
      setShowDiscipline(true);
    } else if (action.tag === 'ACADEMIC') {
      setShowFocusSession(true);
    } else if (action.tag === 'MIND') {
      setShowMobilization(true);
    }
  };

  const actions = [
    {tag: 'MIND', title: 'Start on an Assignment', xp: 10, g: 5, label: '+10 XP & +5 C'},
    {tag: 'ACADEMIC', title: 'Work & Study', xp: 20, g: 15, label: '+20 XP & +15 C'},
    {tag: 'DISCIPLINE', title: 'No Phone (2h)', xp: 35, g: 30, label: '+35 XP & +30 C'},
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (activeSession && Date.now() > activeSession.end) {
        alert(`${activeSession.tag === 'DISCIPLINE' ? 'Discipline' : 'Work'} session completed!`);
        setUserMorale(prev => Math.min(prev + (activeSession.tag === 'DISCIPLINE' ? 30 : 15), 100));
        
        const action = actions.find(a => a.tag === activeSession.tag);
        if (action) {
            updateUserData({
                coins: userData.coins + action.g,
                xp: userData.xp + action.xp,
                streak: userData.streak + 1,
                totalSessions: userData.totalSessions + 1,
                sessionHistory: [...userData.sessionHistory, {date: new Date().toLocaleDateString(), xp: action.xp, type: activeSession.tag}]
            });
        }
        
        setActiveSession(null);
      }
    }, 1000);
    const handleUnload = () => { if (activeSession) takeDamage(); };
    window.addEventListener('beforeunload', handleUnload);
    return () => { clearInterval(timer); window.removeEventListener('beforeunload', handleUnload); };
  }, [activeSession, userData.coins, userData.xp, userData.streak, userData.totalSessions, userData.sessionHistory]);

  const selectEnemy = async (enemyId: string) => {
    const enemy = ENEMIES[enemyId as keyof typeof ENEMIES];
    if (userXp < enemy.reqXp) return; // Locked

    await updateUserData({
      activeEnemyId: enemyId
    });
    setSelectedEnemyId(enemyId);
    alert(`Target acquired: ${enemy.name}. Prepare for focus engagement!`);
  };

  return (
    <>
      {showMobilization ? (
        <MobilizationView 
          onComplete={async () => {
            await handleCampaignComplete(15, 5, 10, 'MIND');
          }} 
          onCancel={() => setShowMobilization(false)}
        />
      ) : showFocusSession ? (
        <FocusSessionView 
          onComplete={async () => {
            await handleCampaignComplete(25, 15, 20, 'ACADEMIC');
          }} 
          onFail={() => setShowFocusSession(false)} 
        />
      ) : showDiscipline ? (
        <DisciplineWatchView 
          onComplete={async () => {
            await handleCampaignComplete(40, 30, 35, 'DISCIPLINE');
          }} 
        />
      ) : (
        <div className="space-y-8 font-serif text-[#ebdcb9]">
          
          {/* Back to selection option (if fighting) */}
          {selectedEnemyId ? (
            <motion.button 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setSelectedEnemyId(null)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#f2be72]/40 bg-[#120d09] text-xs font-mono tracking-widest text-[#f2be72] hover:bg-[#f2be72]/10 rounded uppercase font-bold transition duration-200"
            >
              ← Back to Specimen Registry
            </motion.button>
          ) : null}

          {/* Rank/XP Status Header */}
          <div className="bg-[#1f1610] border border-[#ffb057]/20 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl">
            <div>
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#f2be72]/60">Commander Standing</p>
              <h2 className="text-xl font-bold uppercase tracking-wider text-white">XP: {userXp}</h2>
            </div>
            <div className="flex gap-4 items-center">
              <div className="text-right">
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#ff8080]/60">Campaign Statistics</p>
                <div className="flex items-center justify-end gap-1.5 font-mono text-sm uppercase text-red-400 font-bold">
                  <Skull size={14} className="text-red-500 animate-pulse" />
                  <span>Enemies Killed: {userData.enemiesKilled !== undefined ? userData.enemiesKilled : 0}</span>
                </div>
              </div>
            </div>
          </div>

          {!selectedEnemyId ? (
            /* SELECTION OVERVIEW SCREEN: Display 3 Options Only */
            <motion.section 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-white uppercase tracking-widest">Undead Specimen Engagement Registry</h3>
                <p className="text-xs text-[#ebdcb9]/70 font-sans max-w-lg mx-auto">
                  Select a rogue server threat to lock-in focus. Harder specimens possess defensive shields and high cognitive counter-attack protocols.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {Object.values(ENEMIES).map((enemy) => {
                  const epHealth = userData[enemy.dbHealthKey as keyof typeof userData] !== undefined 
                    ? (userData[enemy.dbHealthKey as keyof typeof userData] as number) 
                    : 100;
                    
                  const isLocked = userXp < enemy.reqXp;
                  const isSelected = activeEnemyId === enemy.id;

                  return (
                    <div 
                      key={enemy.id}
                      onClick={() => !isLocked && selectEnemy(enemy.id)}
                      className={`relative flex flex-col justify-between p-5 rounded-lg border-2 transition duration-300 cursor-pointer ${
                        isLocked 
                          ? 'bg-black/40 border-[#8a6845]/10 opacity-50 select-none cursor-not-allowed' 
                          : isSelected
                            ? 'bg-[#1b1510] border-[#f2be72] shadow-[0_0_20px_rgba(242,190,114,0.2)] hover:scale-[1.02]'
                            : 'bg-[#120d09] border-[#8a6845]/30 hover:border-[#ebdcb9]/50 hover:scale-[1.02]'
                      }`}
                    >
                      {/* Top indicator: lock or status */}
                      <div className="mb-3 flex justify-between items-center">
                        {isLocked ? (
                          <span className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider text-red-400 font-semibold">
                            <Lock size={12} />
                            <span>Requires {enemy.reqXp} XP</span>
                          </span>
                        ) : (
                          <span className={`text-[10px] uppercase font-mono tracking-wider font-semibold ${isSelected ? 'text-[#f2be72]' : 'text-gray-400'}`}>
                            {isSelected ? '🎯 Currently Targeted' : 'Available specimen'}
                          </span>
                        )}
                        
                        {!isLocked && (
                          <span className="text-[10px] font-mono opacity-60">Level {enemy.reqXp === 0 ? '1' : enemy.reqXp === 500 ? '2' : '3'}</span>
                        )}
                      </div>

                      {/* Enemy Thumbnail Artwork */}
                      <div className="relative w-full aspect-video rounded overflow-hidden mb-4 border border-[#8a6845]/20 bg-black">
                        <img 
                          src={enemy.image} 
                          alt={enemy.name} 
                          className="w-full h-full object-cover filter grayscale contrast-125 saturate-50 hover:grayscale-0 transition duration-300" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
                      </div>

                      {/* Enemy Info */}
                      <div className="mb-4">
                        <h4 className="text-lg font-bold text-white uppercase tracking-wide">{enemy.name}</h4>
                        <p className="text-xs text-[#ebdcb9]/70 italic mt-0.5 line-clamp-2">{enemy.subtitle}</p>
                      </div>

                      {/* Live SPECIMEN HP Bar */}
                      <div className="w-full bg-[#0a0705] p-2.5 rounded border border-[#8a6845]/10 mb-4">
                        <ProgressBar 
                          label="Plague HP" 
                          value={epHealth} 
                          colorClass={isLocked ? 'bg-gray-700' : isSelected ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-[#e0a96d]'} 
                        />
                      </div>

                      {/* Resistance rules info */}
                      <div className="text-[10px] font-mono text-[#f2be72]/70 italic mb-4 leading-relaxed bg-black/30 p-2 border border-[#8a6845]/10 rounded">
                        {enemy.flavor}
                      </div>

                      {/* Selector button */}
                      <div className="mt-auto">
                        {isLocked ? (
                          <button 
                            disabled 
                            className="w-full text-center py-2 text-xs uppercase font-mono tracking-widest text-red-900 border border-red-950/20 bg-red-950/10 cursor-not-allowed"
                          >
                            🔒 Rank Restricted
                          </button>
                        ) : isSelected ? (
                          <div className="w-full py-2.5 text-center text-xs uppercase font-mono tracking-widest font-bold bg-[#f2be72] text-[#0a0705] rounded flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(242,190,114,0.2)]">
                            <Target size={14} className="animate-spin" />
                            <span>🎯 Targeted SPECIMEN</span>
                          </div>
                        ) : (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              selectEnemy(enemy.id);
                            }}
                            className="w-full py-2.5 text-center text-xs uppercase font-mono tracking-widest font-semibold border border-[#f2be72]/50 hover:bg-[#f2be72]/10 transition rounded text-[#f2be72] font-semibold"
                          >
                            Select as Target
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          ) : (
            /* DETAILED ENEMY VIEW: Selected Enemy Battleground */
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="border border-outline bg-[#0f0a07] p-6 rounded-lg shadow-2xl relative overflow-hidden"
            >
              
              {/* Top decorative banner */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8a6845]/0 via-red-500/50 to-[#8a6845]/0" />

              <div className="flex flex-col lg:flex-row gap-8 items-center">
                
                {/* Dynamic Target Artwork */}
                <div className="w-full lg:w-2/5 flex flex-col items-center">
                  <div className="relative w-full aspect-[4/3] rounded overflow-hidden border border-red-950/40 shadow-xl bg-black">
                    <img 
                      src={activeEnemy.image}
                      alt={activeEnemy.name}
                      className="w-full h-full object-cover opacity-75 grayscale contrast-125 saturate-50 hover:scale-105 transition duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    
                    {/* Overlay branding */}
                    <div className="absolute bottom-4 left-4 right-4 text-center">
                      <span className="px-2 py-0.5 text-[8apx] font-mono tracking-widest font-bold uppercase bg-red-500 text-black border border-red-600 rounded">
                        🎯 ACTIVE TARGET
                      </span>
                      <h3 className="font-display text-2xl text-white uppercase tracking-wider mt-1">{activeEnemy.name}</h3>
                    </div>
                  </div>

                  {/* Battle HP Bar of specific enemy */}
                  <div className="w-full mt-4 bg-black/60 p-3 border border-[#f2be72]/20 rounded">
                    <ProgressBar 
                      label={`${activeEnemy.name} HP`} 
                      value={
                        userData[activeEnemy.dbHealthKey as keyof typeof userData] !== undefined 
                          ? (userData[activeEnemy.dbHealthKey as keyof typeof userData] as number) 
                          : 100
                      } 
                      colorClass="bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" 
                      alarm={true}
                    />
                  </div>

                  {/* Resilience Rule description */}
                  <div className="w-full mt-3 text-center bg-black/40 p-2.5 border border-[#8a6845]/20 rounded font-mono text-[10px] uppercase tracking-wider text-red-300">
                    ⚠️ Caution: {activeEnemy.strikeDamage}% Damage penalty if focus lapses. {activeEnemy.flavor}
                  </div>
                </div>

                {/* Cognitive vitals and actions */}
                <div className="w-full lg:w-3/5 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-wider border-b border-[#8a6845]/20 pb-2 mb-4 text-[#ebdcb9]">Commander Health & Vitals</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-black/30 p-2.5 rounded border border-[#8a6845]/10">
                        <ProgressBar label="MORALE" value={userMorale} colorClass="bg-amber-400" />
                      </div>
                      <div className="bg-black/30 p-2.5 rounded border border-[#8a6845]/10">
                        <ProgressBar label="INFECTION" value={userInfection} colorClass="bg-red-500" alarm={userInfection > 75} />
                      </div>
                      <div className="bg-black/30 p-2.5 rounded border border-[#8a6845]/10">
                        <ProgressBar label="VITALS" value={userHealth} colorClass="bg-green-600" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-mono uppercase tracking-[0.2em] mb-3 text-[#f2be72]/80">Mobilize Defense Campaigns</h3>
                    <p className="text-xs text-[#ebdcb9]/60 leading-relaxed mb-4 font-sans">
                      Complete campaigns below. Successful camera workspace checks, focus holdouts, or locked phone sessions deal critical damage to {activeEnemy.name} scaled by their special defenses.
                    </p>

                    {/* Campaign selectors */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {actions.map((action, i) => (
                        confirmingIndex === i ? (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={i} 
                            className="flex flex-col items-center justify-center bg-[#1c110b] border-2 border-[#f2be72] p-4 shadow-2xl min-h-[140px] rounded"
                          >
                            <h4 className="text-[10px] font-mono text-[#f2be72] mb-3 uppercase font-bold tracking-widest text-center">Mobilize?</h4>
                            <div className="flex gap-2 w-full justify-center">
                              <button 
                                  onClick={() => startCampaign(i)}
                                  className="px-4 py-1.5 bg-[#f2be72] text-[#0a0705] text-xs font-bold uppercase transition hover:brightness-110 active:scale-95"
                              >DEPLOY</button>
                              <button 
                                  onClick={() => setConfirmingIndex(null)}
                                  className="px-4 py-1.5 bg-black/50 text-[#ebdcb9] text-xs font-bold uppercase transition hover:bg-[#8a6845]/20 active:scale-95"
                              >BACK</button>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            key={i} 
                            onClick={() => setConfirmingIndex(i)} 
                            className="flex flex-col text-left bg-[#15110d] border border-[#8a6845]/30 p-4 hover:border-[#f2be72] transition duration-300 rounded shadow-md h-full justify-between"
                          >
                            <div>
                              <span className="font-mono text-[9px] bg-red-950/40 text-red-400 border border-red-950/60 px-1.5 py-0.5 uppercase font-bold tracking-wider rounded">
                                [{action.tag}]
                              </span>
                              <h4 className="text-xs text-white uppercase font-bold tracking-wide mt-2">{action.title}</h4>
                            </div>
                            <div className="pt-2 border-t border-[#8a6845]/10 mt-3 flex items-center gap-1 text-[#f2be72] font-mono text-[9px] uppercase font-bold text-left">
                              <Zap size={10} />
                              <span>{action.label}</span>
                            </div>
                          </motion.button>
                        )
                      ))}
                    </div>
                  </div>

                </div>
              </div>
              
            </motion.div>
          )}

          {/* SECURE DESTINY CONTROL: LEVEL SKIP & XP GENERATOR */}
          <section className="bg-black/60 border border-amber-900/40 p-6 rounded-lg relative overflow-hidden mt-8">
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#f2be72] m-1" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#f2be72] m-1" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#f2be72] m-1" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#f2be72] m-1" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#f2be72]/80 bg-[#f2be72]/10 border border-[#f2be72]/20 px-2 py-0.5 rounded">
                  Command Telemetry bypass
                </span>
                <h3 className="text-base font-bold text-white uppercase tracking-wider mt-1.5 font-serif">Avatar Level & Destiny Skips</h3>
                <p className="text-xs text-[#ebdcb9]/60 font-sans mt-1">
                  Activating bypass allows you to gain instant XP to unlock high-tier specimen targets and advance through all 5 customized Avatar evolution levels instantly.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 md:pt-0">
                <button 
                  onClick={async () => {
                    const nextXpMap = [
                      { limit: 500, next: 501 },
                      { limit: 1000, next: 1001 },
                      { limit: 2000, next: 2001 },
                      { limit: 3500, next: 3501 }
                    ];
                    let matched = false;
                    for (const map of nextXpMap) {
                      if (userXp <= map.limit) {
                        await updateUserData({ xp: map.next });
                        alert(`Destiny bypassed! Character advanced to next stage bounds at ${map.next} XP.`);
                        matched = true;
                        break;
                      }
                    }
                    if (!matched) {
                      await updateUserData({ xp: userXp + 1000 });
                      alert(`Already Max Level (Level 5)! Skipping adds +1,000 XP booster!`);
                    }
                  }}
                  className="px-4 py-2 border border-[#f2be72]/60 hover:bg-[#f2be72]/20 text-[#f2be72] hover:text-white font-mono tracking-widest text-[10px] uppercase font-bold transition rounded cursor-pointer"
                >
                  Skip To Next Level
                </button>
                
                <button 
                  onClick={async () => {
                    await updateUserData({ xp: 501 });
                    alert("Destiny bypass: Skip to Level 2 (501 XP). RGBomber (500 XP) unlocked!");
                  }}
                  className={`px-3 py-1.5 border border-[#ebdcb9]/25 text-xs rounded font-mono ${userXp >= 501 && userXp <= 1000 ? 'bg-[#f2be72]/20 border-[#f2be72] text-[#f2be72]' : 'hover:border-[#ebdcb9]/60 bg-[#120d09]'}`}
                >
                  Lvl 2 (501 XP)
                </button>

                <button 
                  onClick={async () => {
                    await updateUserData({ xp: 1001 });
                    alert("Destiny bypass: Skip to Level 3 (1001 XP).");
                  }}
                  className={`px-3 py-1.5 border border-[#ebdcb9]/25 text-xs rounded font-mono ${userXp >= 1001 && userXp <= 2000 ? 'bg-[#f2be72]/20 border-[#f2be72] text-[#f2be72]' : 'hover:border-[#ebdcb9]/60 bg-[#120d09]'}`}
                >
                  Lvl 3 (1001 XP)
                </button>

                <button 
                  onClick={async () => {
                    await updateUserData({ xp: 2001 });
                    alert("Destiny bypass: Skip to Level 4 (2001 XP). Cuirascreen (1500 XP) unlocked!");
                  }}
                  className={`px-3 py-1.5 border border-[#ebdcb9]/25 text-xs rounded font-mono ${userXp >= 2001 && userXp <= 3500 ? 'bg-[#f2be72]/20 border-[#f2be72] text-[#f2be72]' : 'hover:border-[#ebdcb9]/60 bg-[#120d09]'}`}
                >
                  Lvl 4 (2001 XP)
                </button>

                <button 
                  onClick={async () => {
                    await updateUserData({ xp: 3501 });
                    alert("Destiny bypass: Skip to Level 5 (3501 XP). Max character state acquired!");
                  }}
                  className={`px-3 py-1.5 border border-[#ebdcb9]/25 text-xs rounded font-mono ${userXp >= 3501 ? 'bg-[#f2be72]/20 border-[#f2be72] text-[#f2be72]' : 'hover:border-[#ebdcb9]/60 bg-[#120d09]'}`}
                >
                  Lvl 5 (3501+ XP)
                </button>
              </div>
            </div>
          </section>

          {/* Active Session Timer Info */}
          {activeSession && (
            <div className="bg-red-950/20 border border-red-950/60 text-red-300 p-4 rounded-lg text-center font-mono text-xs uppercase tracking-widest animate-pulse font-bold">
              ⚠️ ACTIVE PLAGUE INTERACTION ENERGETIC: {activeSession.tag} SESSION ENGAGED... {Math.round((activeSession.end - Date.now()) / 1000)}s remaining.
            </div>
          )}

        </div>
      )}
    </>
  );
}
