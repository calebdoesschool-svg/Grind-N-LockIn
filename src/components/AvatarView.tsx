import React, { useState } from 'react';
import { useUser } from '../lib/UserContext';
import { User, Shield, Package, Edit2, Check, X, Award } from 'lucide-react';
import { auth } from '../lib/firebase';
import { motion } from 'motion/react';
import { getAvatarEvolution } from './HomeView';

export default function AvatarView() {
  const { userData, updateUserData } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');

  const handleStartEdit = () => {
    setEditedName(userData.username || 'Operator');
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editedName.trim() && editedName.trim().length <= 25) {
      await updateUserData({ username: editedName.trim() });
      setIsEditing(false);
    } else {
      alert("Please enter a valid username (1 to 25 characters).");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const userXp = userData.xp || 0;
  const evo = getAvatarEvolution(userXp);

  return (
    <div className="space-y-8 font-serif text-white">
      <h2 className="text-3xl font-bold uppercase mb-8 tracking-widest text-center">Commander Base</h2>
      
      {/* Avatar Container */}
      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          <div className="w-32 h-32 rounded-full border-4 border-primary bg-surface-container-high flex items-center justify-center shadow-[0_0_20px_rgba(242,190,114,0.15)]">
              <User size={64} className="text-primary"/>
          </div>
          {/* Level float badge */}
          <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary text-xs font-mono font-bold px-2.5 py-1 rounded-full border border-surface shadow flex items-center gap-1">
            <Award size={12} />
            <span>Lvl {evo.level}</span>
          </div>
        </div>
        
        {isEditing ? (
          <div className="flex items-center gap-2 mb-2 w-full max-w-[280px]">
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={25}
              className="flex-1 bg-surface-container-high border-2 border-primary text-white px-3 py-1.5 text-center text-lg font-bold uppercase rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="p-1.5 bg-emerald-700/80 hover:bg-emerald-600 border border-emerald-500 rounded text-white transition active:scale-95"
              title="Save Username"
            >
              <Check size={18} />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="p-1.5 bg-red-950/80 hover:bg-red-900 border border-red-500 rounded text-white transition active:scale-95"
              title="Cancel"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-2 group">
            <h3 className="text-xl font-bold uppercase tracking-wider text-on-surface">
              {userData.username || 'Operator'}
            </h3>
            <button
              onClick={handleStartEdit}
              className="opacity-60 hover:opacity-100 hover:text-primary transition p-1 rounded-full hover:bg-surface-container-highest cursor-pointer focus:outline-none"
              title="Edit Username"
            >
              <Edit2 size={16} />
            </button>
          </div>
        )}
        
        <p className="text-outline text-sm uppercase font-mono tracking-widest text-[#f2be72]">Rank: Commander (Level {evo.level})</p>
      </div>

      {/* Dynamic Evolution Detail Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg mx-auto p-5 rounded-lg border-2 border-amber-950 bg-[#1e140e] text-[#f5ebd3] shadow-2xl relative overflow-hidden"
        style={{ 
          boxShadow: '0 12px 30px -5px rgba(0,0,0,0.65), inset 0 0 40px rgba(139,94,26,0.18)'
        }}
      >
        <div className="absolute top-0 right-0 p-2 text-[8px] font-mono tracking-widest text-[#ebdcb9]/40 uppercase font-bold">
          Avatar telemetry profile
        </div>
        
        <div className="flex items-center gap-3 border-b border-amber-950/40 pb-3 mb-4">
          <div className="h-9 w-9 rounded-full bg-amber-950 flex items-center justify-center font-bold font-mono text-sm text-[#f2be72] border-2 border-[#f2be72]/60 shadow-lg">
            {evo.level}
          </div>
          <div>
            <span className="text-[9px] uppercase font-mono tracking-widest text-[#f2be72] font-black">ACTIVE EVOLUTION PATH</span>
            <h4 className="text-base font-bold uppercase text-white font-serif tracking-wide">{evo.title}</h4>
          </div>
        </div>

        <div className="space-y-4 text-xs font-sans text-left">
          <div>
            <strong className="font-mono text-[9px] uppercase tracking-wider text-[#f2be72] block mb-1">Apparel & Build Pose:</strong>
            <p className="text-[#ebdcb9]/90 leading-relaxed pl-3 border-l-2 border-[#f2be72]/40 bg-black/15 p-2 rounded-r">{evo.clothing}</p>
          </div>
          {evo.clutter && (
            <div>
              <strong className="font-mono text-[9px] uppercase tracking-wider text-[#f2be72] block mb-1">Strategic Workspace Atmosphere:</strong>
              <p className="text-[#ebdcb9]/90 leading-relaxed pl-3 border-l-2 border-[#f2be72]/40 bg-black/15 p-2 rounded-r">{evo.clutter}</p>
            </div>
          )}
          <div>
            <strong className="font-mono text-[9px] uppercase tracking-wider text-[#f2be72] block mb-1">Equipped Focus Weapon / Tool:</strong>
            <p className="text-[#ebdcb9]/90 leading-relaxed pl-3 border-l-2 border-[#f2be72]/40 bg-black/15 p-2 rounded-r">{evo.item}</p>
          </div>
          <div>
            <strong className="font-mono text-[9px] uppercase tracking-wider text-[#f2be72] block mb-1">Aura & Metaphysical FX:</strong>
            <p className="text-[#ebdcb9]/90 leading-relaxed pl-3 border-l-2 border-[#f2be72]/40 bg-black/15 p-2 rounded-r">{evo.fx}</p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-amber-950/40 flex justify-between items-center text-[10px] font-mono">
          <span className="text-[#ebdcb9]/50 font-bold uppercase tracking-wider">Tactical station profile</span>
          <span className="text-[#f2be72] bg-black/50 px-2.5 py-1 rounded font-black border border-[#f2be72]/20">{userXp} XP</span>
        </div>
      </motion.div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm mx-auto">
        <div className="text-center p-4 bg-surface-container-high border border-outline">
          <div className="text-2xl font-bold text-primary">{userData.streak}</div>
          <div className="text-xs uppercase tracking-widest opacity-70 mt-1">Streak</div>
        </div>
        <div className="text-center p-4 bg-surface-container-high border border-outline">
          <div className="text-2xl font-bold text-primary">{userData.purchasedItems.length}</div>
          <div className="text-xs uppercase tracking-widest opacity-70 mt-1">Gear</div>
        </div>
      </div>

      {/* Inventory */}
      <div className="bg-surface-container-high border border-outline p-6 w-full max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-4">
            <Package className="text-primary" />
            <h3 className="text-xl font-bold uppercase">Gear & Locker</h3>
        </div>
        {userData.purchasedItems.length > 0 ? (
            <ul className="space-y-2">
                {userData.purchasedItems.map((item, i) => (
                    <li key={i} className="p-2 border-b border-outline flex items-center gap-2">
                        <Shield className="text-primary" size={16}/>
                        {item}
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-outline text-sm italic">No gear acquired yet.</p>
        )}
      </div>

      {/* Replay Cinematic Lore */}
      <div className="text-center pt-4 pb-8">
        <button 
          onClick={() => {
            if (confirm("Would you like to replay the campaign's prologue lore?")) {
              const uid = auth.currentUser?.uid;
              if (uid) {
                localStorage.removeItem(`sawStoryIntro_${uid}`);
              } else {
                localStorage.removeItem('sawStoryIntro');
              }
              window.location.reload();
            }
          }}
          className="text-xs uppercase tracking-widest text-primary/60 hover:text-primary hover:underline transition font-mono cursor-pointer"
        >
          [ Replay Campaign Prologue ]
        </button>
      </div>
    </div>
  );
}
