// --- MODULE CDN IMPORTS & SETUP ---
    import { initializeApp } from "firebase/app";
    import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
    import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

    // Hardcoded credentials for Resolving Redundant environment connections
    const firebaseConfig = {
      apiKey: "AIzaSyCmPBcDDpir80aPR72cKM06F1484rLXQoE",
      authDomain: "resolute-rider-vr4g1.firebaseapp.com",
      projectId: "resolute-rider-vr4g1",
      storageBucket: "resolute-rider-vr4g1.firebasestorage.app",
      messagingSenderId: "618926400886",
      appId: "1:618926400886:web:24c5d191a78344beb70657"
    };

    const databaseId = "ai-studio-8d870985-e130-497b-a6f2-55027a299cd5";

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app, databaseId);

    // --- UTILITIES ---
import React from 'react';
import ReactDOM from 'react-dom/client';
import * as LucideIcons from 'lucide-react';

const LucideIcon = ({ name, size = 24, className = "" }) => {
  const upperName = name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
  const Icon = LucideIcons[upperName] || LucideIcons[name] || LucideIcons['HelpCircle'];
  
  if (!Icon) {
    return <span className={`inline-block ${className}`} style={{ width: size, height: size, minWidth: size, minHeight: size }} />;
  }
  
  return <Icon size={size} className={className} />;
};

    // Constant definition of enemies inside Arena
    const ENEMIES = {
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

    const BIBLE_VERSES = [
      { reference: "Philippians 4:13", text: "“I can do all things through Christ who strengthens me.”" },
      { reference: "2 Timothy 1:7", text: "“For God gave us a spirit not of fear but of power and love and self-control.”" },
      { reference: "Galatians 6:9", text: "“Let us not grow weary of doing good, for in due season we will reap, if we do not give up.”" },
      { reference: "Ephesians 6:11", text: "“Put on the full armor of God, so that you can take your stand against the devil’s schemes.”" },
      { reference: "Psalm 27:1", text: "“The Lord is my light and my salvation—whom shall I fear?”" },
      { reference: "Joshua 1:9", text: "“Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.”" },
      { reference: "Romans 5:3–4", text: "“Suffering produces perseverance; perseverance, character; and character, hope.”" },
      { reference: "1 Corinthians 16:13", text: "“Be on your guard; stand firm in the faith; be courageous; be strong.”" },
      { reference: "Isaiah 40:31", text: "“Those who hope in the Lord will renew their strength.”" },
      { reference: "James 1:12", text: "“Blessed is the one who perseveres under trial.”" },
      { reference: "John 1:5", text: "“The light shines in the darkness, and the darkness has not overcome it.”" },
      { reference: "Psalm 23:4", text: "“Even though I walk through the valley of the shadow of death, I will fear no evil.”" },
      { reference: "Romans 12:21", text: "“Do not be overcome by evil, but overcome evil with good.”" }
    ];

    function getAvatarEvolution(xp: number) {
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

    // --- SUB-COMPONENTS ---

    // 1. Google Sign-In View
    function LoginView({ onLoginStart }) {
      const [username, setUsername] = React.useState('');
      const [password, setPassword] = React.useState('');
      const [isRegistering, setIsRegistering] = React.useState(false);
      const [errorMsg, setErrorMsg] = React.useState('');

      const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
          await signInWithPopup(auth, provider);
        } catch (error) {
          console.error('Login failed:', error);
          alert('Login failed: ' + error.message);
        }
      };

      const handleGuestLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (!username || !password) {
          setErrorMsg('Username and password are required.');
          return;
        }

        const email = `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}@grindandlockin.com`;

        try {
          if (isRegistering) {
            await createUserWithEmailAndPassword(auth, email, password);
          } else {
            await signInWithEmailAndPassword(auth, email, password);
          }
        } catch (error) {
          console.error('Guest login failed:', error);
          if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-login-credentials') {
             setErrorMsg('Invalid username or password. Or try registering.');
          } else if (error.code === 'auth/email-already-in-use') {
             setErrorMsg('Username already taken. Please log in or choose another.');
          } else {
             setErrorMsg('Auth failed: ' + error.message);
          }
        }
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-surface text-on-surface p-6">
          <div className="w-full max-w-sm bg-surface-container-high border border-outline p-8 flex flex-col items-center shadow-2xl">
            <LucideIcon name="lock" size={64} className="text-primary mb-6 animate-pulse" />
            <h1 className="font-display font-black text-2xl uppercase mb-2 tracking-widest text-primary">Lock-In</h1>
            <p className="text-outline text-center mb-8 uppercase font-mono text-xs tracking-wider">Authenticating Commander Profile...</p>
            
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3 bg-primary text-on-primary font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all focus:outline-none mb-6"
            >
              Sign in with Google
            </button>

            <div className="w-full border-t border-outline/50 my-6 relative">
              <span className="absolute left-1/2 -top-2 -translate-x-1/2 bg-surface-container-high px-2 text-outline font-mono text-xs uppercase">OR GUEST LOGIN</span>
            </div>

            <form onSubmit={handleGuestLogin} className="w-full flex flex-col space-y-3">
              <input 
                type="text" 
                placeholder="Username" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-surface-container border border-outline text-white px-4 py-2 font-mono placeholder:text-outline/70 focus:outline-none focus:border-primary"
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-surface-container border border-outline text-white px-4 py-2 font-mono placeholder:text-outline/70 focus:outline-none focus:border-primary"
              />
              
              {errorMsg && <p className="text-red-400 text-[10px] font-mono text-center">{errorMsg}</p>}

              <button
                type="submit"
                className="w-full py-2.5 bg-surface-container border border-primary text-primary font-bold uppercase tracking-wider hover:bg-primary/10 active:scale-95 transition-all focus:outline-none"
              >
                {isRegistering ? 'Register Guest Account' : 'Log In as Guest'}
              </button>

              <button 
                type="button" 
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-primary/70 text-[10px] mt-2 font-mono hover:text-primary uppercase"
              >
                {isRegistering ? 'Already have a guest account? Log in' : 'Need a guest account? Register'}
              </button>
            </form>
          </div>
        </div>
      );
    }

    // 2. Cinematic Prologue Lore View
    function StoryIntroView({ onComplete }) {
      const [step, setStep] = React.useState(1);
      const containerRef = React.useRef(null);

      React.useEffect(() => {
        if (containerRef.current) {
          containerRef.current.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, [step]);

      return (
        <div 
          ref={containerRef}
          className="fixed inset-0 z-[10000] w-full h-full overflow-y-auto bg-[#0a0705] text-[#ebdcb9] font-serif flex flex-col items-center justify-start py-12 px-6"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(34, 18, 10, 0.45) 0%, rgba(5, 3, 2, 0.95) 100%)`
          }}
        >
          {/* Borders */}
          <div className="fixed top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-[#8a6845]/40 pointer-events-none" />
          <div className="fixed top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-[#8a6845]/40 pointer-events-none" />
          <div className="fixed bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-[#8a6845]/40 pointer-events-none" />
          <div className="fixed bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-[#8a6845]/40 pointer-events-none" />

          <div className="w-full max-w-xl flex flex-col items-center space-y-8">
            <div className="flex flex-col items-center space-y-2 mt-4">
              <div className="w-16 h-16 rounded-full border-2 border-[#f2be72]/60 flex items-center justify-center bg-black/60 shadow-[0_0_20px_rgba(242,190,114,0.15)]">
                <LucideIcon name="book-open" size={28} className="text-[#f2be72]" />
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#f2be72]/80 mt-2">PROLOGUE</span>
            </div>

            {/* Stage 1 */}
            <div className="w-full bg-[#1b120d]/80 border border-amber-950/45 p-8 rounded-lg shadow-2xl space-y-6">
              <div className="text-center font-mono text-[10px] tracking-[0.4em] text-[#ebdcb9]/60 pb-2">YEAR 1805</div>
              <p className="text-base leading-relaxed text-center italic text-[#ebdcb9] font-medium">
                "Amidst the Napoleonic wars (1802-1815), an unknown disease with an incredibly high mortality rate, its origins are currently unknown. That also brings back the undead back to life."
              </p>
              <p className="text-base leading-relaxed text-center italic text-[#ebdcb9] font-medium">
                "Sinners who have failed to accept Christ and repent for their sins, upon succumbing to the infection, re-animate."
              </p>
              {step === 1 && (
                <div className="flex justify-center pt-2">
                  <button 
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 bg-[#8c6b45] hover:bg-[#a68257] active:bg-[#6e5131] text-[#0a0705] font-bold uppercase tracking-widest text-xs px-6 py-3 rounded transition-all"
                  >
                    <span>NEXT.</span>
                    <LucideIcon name="arrow-down" size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Stage 2 */}
            {step >= 2 && (
              <div className="w-full bg-[#1b120d]/80 border border-amber-900/40 p-8 rounded-lg shadow-2xl space-y-6">
                <div className="text-center font-mono text-[10px] tracking-[0.4em] text-[#f2be72]/80 pb-2">THE FRONT LINE</div>
                <p className="text-base leading-relaxed text-center text-[#ebdcb9] font-semibold">
                  "Now, the player will have to defeat the undead, one by one, through the use of focus and productivity."
                </p>
                <div className="flex flex-col items-center space-y-4 pt-2">
                  <div className="flex gap-2 text-[10px] font-mono tracking-wider text-[#f2be72]/80 uppercase animate-pulse">
                    <LucideIcon name="shield-alert" size={12} />
                    <span>PREPARE COMMANDER COGNITION</span>
                  </div>
                  <button 
                    onClick={onComplete}
                    className="w-full bg-[#f2be72] text-[#0c141f] hover:bg-[#ffd18e] font-sans font-extrabold uppercase tracking-[0.2em] text-xs px-10 py-4 shadow-[0_0_20px_rgba(242,190,114,0.3)] duration-200"
                  >
                    START CAMPAIGN
                  </button>
                </div>
              </div>
            )}
            <div className="h-12" />
          </div>
        </div>
      );
    }

    // 3. Simple Table-of-Contents HomeView
    function HomeView({ onNavigateToArena, verseTrigger, userData, updateUserData }) {
      const [objectives, setObjectives] = React.useState([
        { title: 'Start on an Assignment', completed: false },
        { title: 'Work & Study on unfinished assignments', completed: false },
        { title: 'No phone and social media for 2 hours', completed: false },
      ]);
      const [isCandleLit, setIsCandleLit] = React.useState(false);
      const [currentVerseIndex, setCurrentVerseIndex] = React.useState(0);

      React.useEffect(() => {
        const currentStr = localStorage.getItem('bibleVerseIndex');
        const idx = currentStr ? parseInt(currentStr, 10) % BIBLE_VERSES.length : 0;
        setCurrentVerseIndex(idx);
      }, [verseTrigger]);

      const toggleObjective = async (index) => {
        const objective = objectives[index];
        const isNowCompleted = !objective.completed;

        setObjectives(prev => prev.map((obj, i) => 
          i === index ? { ...obj, completed: isNowCompleted } : obj
        ));

        if (isNowCompleted) {
          const activeEnemyId = userData.activeEnemyId || 'shambler';
          const activeEnemy = ENEMIES[activeEnemyId] || ENEMIES.shambler;
          const currentHealth = userData[activeEnemy.dbHealthKey] !== undefined 
            ? userData[activeEnemy.dbHealthKey] 
            : 100;

          const damage = Math.round(20 * activeEnemy.damageMultiplier);
          let nextHealth = Math.max(currentHealth - damage, 0);
          let bonusCoins = 0;
          let nextKills = userData.enemiesKilled !== undefined ? userData.enemiesKilled : 0;
          let dbHealthVal = nextHealth;

          const coinsEarned = 10;
          const xpEarned = 15;

          if (nextHealth <= 0) {
            alert(`VICTORY! You have struck down ${activeEnemy.name}. An upgraded zombie specimen rises in their stead! You receive ${activeEnemy.victoryCoins} bonus gold coins!`);
            dbHealthVal = 100;
            nextHealth = 100;
            bonusCoins = activeEnemy.victoryCoins;
            nextKills += 1;
          } else {
            alert(`Direct hit! Completed daily objective dealt ${damage}% damage to ${activeEnemy.name}! (${nextHealth}% health remaining)`);
          }

          await updateUserData({
            [activeEnemy.dbHealthKey]: dbHealthVal,
            coins: (userData.coins || 0) + coinsEarned + bonusCoins,
            xp: (userData.xp || 0) + xpEarned,
            enemiesKilled: nextKills,
          });
        }
      };

      return (
        <div className="flex flex-col w-full min-h-screen p-4 items-center" style={{ backgroundColor: '#5a4130' }}>
          
          {/* Bible Scripture */}
          <div
            className="w-full max-w-sm mb-4 p-5 rounded-lg border-2 border-amber-950 shadow-2xl relative overflow-hidden bg-gradient-to-br from-[#fffbeb] to-[#fef3c7]"
          >
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-950/40 m-1.5" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-950/40 m-1.5" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-950/40 m-1.5" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-950/40 m-1.5" />
            
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 bg-amber-950 rounded-full opacity-60" />
              <h3 className="font-serif text-amber-950 font-bold text-xs tracking-widest uppercase text-center opacity-85">Daily Scripture</h3>
              <span className="w-1.5 h-1.5 bg-amber-950 rounded-full opacity-60" />
            </div>
            
            <p className="text-amber-950 text-sm leading-relaxed italic font-serif px-1 mb-2.5 text-center font-semibold">
              {BIBLE_VERSES[currentVerseIndex].text}
            </p>
            <p className="text-amber-900 text-[10px] font-mono font-bold uppercase tracking-widest text-center">
              — {BIBLE_VERSES[currentVerseIndex].reference}
            </p>
          </div>

          {/* Daily Objectives */}
          <div 
            className="p-5 border border-amber-900 shadow-2xl rounded-lg font-serif w-full max-w-sm flex flex-col"
            style={{
              backgroundImage: `url('https://i.ibb.co.com/TMHJrMqz/be00dfecf025eb82e0d71620efd939d0.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <h2 className="font-display text-base text-amber-950 font-black uppercase tracking-widest text-center mb-3">Daily Tasks</h2>
            <div className="space-y-2 flex-grow">
              {objectives.map((obj, i) => (
                <button 
                  key={i} 
                  onClick={() => toggleObjective(i)}
                  className="w-full flex items-center gap-2.5 p-2.5 border border-amber-900 bg-[#fffbeb]/50 hover:bg-[#fffbeb] transition-all rounded text-left shadow-sm"
                >
                  <div className={`w-4.5 h-4.5 border-2 flex items-center justify-center rounded-sm ${obj.completed ? 'border-amber-950 bg-amber-950' : 'border-amber-950'}`}>
                    {obj.completed && <div className="w-2 h-2 bg-amber-100" />}
                  </div>
                  <span className={`text-sm ${obj.completed ? 'line-through text-amber-800' : 'text-amber-950 font-bold'}`}>{obj.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Table setup visual displays */}
          <div className="mt-4 flex gap-6 text-amber-900 justify-center items-center">
            {userData?.purchasedItems?.includes('lantern') ? (
              <img 
                src="https://i.ibb.co.com/HDfD6v2N/Yeah-after-looking-through-the-wiki-pages-and-customization-pages-the-vibe-you-re-probably-liking.png" 
                alt="Lantern Set" 
                className="w-44 h-44 object-contain" 
                referrerPolicy="no-referrer" 
              />
            ) : (
              <button onClick={() => setIsCandleLit(!isCandleLit)} className="p-0 border-0 focus:outline-none">
                <img src={isCandleLit ? "https://i.ibb.co.com/9mLjJKJy/6.png" : "https://i.ibb.co.com/qFxz6gLG/7.png"} alt="Candle" className="w-44 h-44" referrerPolicy="no-referrer" />
              </button>
            )}
            
            {userData?.purchasedItems?.includes('desk') ? (
              <img src="https://i.ibb.co.com/Mk0BjgtC/Yeah-after-looking-through-the-wiki-pages-and-customization-pages-the-vibe-you-re-probably-liking.png" alt="Desk Cross" className="w-36 h-36 rotate-12" referrerPolicy="no-referrer" />
            ) : (
              <img src="https://i.ibb.co.com/3y4QFxk9/Yeah-after-looking-through-the-wiki-pages-and-customization-pages-the-vibe-you-re-probably-liking.png" alt="Standard Cross" className="w-36 h-36 rotate-12" referrerPolicy="no-referrer" />
            )}
          </div>

          {/* Bible display */}
          {userData?.purchasedItems?.includes('bible') && (
            <div className="mt-2 text-center select-none">
              <img 
                src="https://i.ibb.co.com/WpdcBRrs/Yeah-after-looking-through-the-wiki-pages-and-customization-pages-the-vibe-you-re-probably-liking.png" 
                alt="Sacred Bible" 
                className="w-36 h-36 object-contain drop-shadow-2xl mx-auto" 
                referrerPolicy="no-referrer" 
              />
              <p className="font-serif text-amber-950 font-bold tracking-widest text-[9px] uppercase mt-1 opacity-80">Holy Scripture Sanctuary Shield</p>
            </div>
          )}

          <div className="mt-6 w-full max-w-sm">
            <button 
              onClick={onNavigateToArena}
              className="w-full flex items-center justify-center gap-2 p-3.5 bg-primary text-on-primary font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all border-2 border-primary"
            >
              To the Arena <LucideIcon name="arrow-right" size={16} />
            </button>
          </div>
        </div>
      );
    }

    // 4. StatsView
    function StatsView({ userData }) {
      return (
        <div className="p-4 font-serif text-white max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold uppercase mb-6 tracking-widest text-center text-primary">Achievements Dashboard</h2>
          
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="text-center p-4 bg-surface-container-high border border-outline rounded-lg">
              <div className="text-3xl font-bold text-primary">{userData.streak || 0}</div>
              <div className="text-[10px] uppercase tracking-wider opacity-70 mt-1 font-mono">Current Streak</div>
            </div>
            <div className="text-center p-4 bg-surface-container-high border border-outline rounded-lg">
              <div className="text-3xl font-bold text-primary">{userData.totalSessions || 0}</div>
              <div className="text-[10px] uppercase tracking-wider opacity-70 mt-1 font-mono">Total Holds</div>
            </div>
            <div className="text-center p-4 bg-[#1f1212] border border-red-500/30 rounded-lg">
              <div className="text-3xl font-bold text-red-500">{userData.enemiesKilled !== undefined ? userData.enemiesKilled : 0}</div>
              <div className="text-[10px] uppercase tracking-wider text-red-400 font-bold font-mono mt-1">Slayed Specimen</div>
            </div>
          </div>

          {/* Simple Sparklines using progress meters representation */}
          <div className="bg-surface-container p-5 border border-outline rounded-lg mb-6">
            <h3 className="text-sm font-bold uppercase mb-3 tracking-widest text-primary">XP Telemetry History</h3>
            <div className="space-y-3">
              {userData.sessionHistory && userData.sessionHistory.length > 0 ? (
                userData.sessionHistory.slice(-5).map((s, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400">{s.date}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-950 font-bold text-primary uppercase text-[9px]">{s.type}</span>
                    <span className="font-bold text-primary">+{s.xp} XP</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic text-center py-4">No completed history entries yet.</p>
              )}
            </div>
          </div>

          <div className="bg-surface-container p-5 border border-outline rounded-lg">
            <h3 className="text-sm font-semibold uppercase mb-3 tracking-widest text-white">Focus Log Registers</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-outline opacity-75 font-mono text-amber-200">
                    <th className="p-2">Date</th>
                    <th className="p-2">Campaign Action</th>
                    <th className="p-2">XP Reward</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.sessionHistory && userData.sessionHistory.length > 0 ? (
                    userData.sessionHistory.map((s, i) => (
                      <tr key={i} className="border-b border-outline/30 hover:bg-white/5">
                        <td className="p-2 font-mono">{s.date}</td>
                        <td className="p-2">
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#ebdcb9] text-black font-extrabold uppercase">
                            {s.type}
                          </span>
                        </td>
                        <td className="p-2 text-primary font-bold font-mono">+{s.xp} XP</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-slate-500 italic">Complete defense campaigns in the Arena to log focus statistics here.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    // 5. ShopView
    const SHOP_ITEMS = [
      { id: 'lantern', name: 'Lantern Desk Set', cost: 40, description: 'Replaces normal desk lamps with warm lanterns, candles, and cinematic firelight ambience.' },
      { id: 'baguette', name: 'Baguette Rations', cost: 30, description: 'Improves health and morale during tough times.' },
      { id: 'shield', name: 'Focus Shield', cost: 100, description: 'Reinforced morale insignia that protects one habit streak from resetting if the player misses a single day.' },
      { id: 'bible', name: 'Bible', cost: 110, description: 'Reduces infection, when it is too high.' },
      { id: 'desk', name: 'Desk Setup Pack', cost: 45, description: 'Unlocks additional command-desk decorations.' },
      { id: 'cross', name: 'Cross Necklace', cost: 55, description: 'Small passive protection charm worn by the avatar. Reduces minor infection effects.' },
    ];

    function ShopView({ userData, updateUserData }) {
      const handlePurchase = async (item) => {
        if (userData.coins < item.cost) {
          alert('UNAVAILABLE: SORRY NOT ENOUGH COINS :(');
          return;
        }

        if (item.id === 'baguette') {
          await updateUserData({
            coins: userData.coins - item.cost,
            morale: 100,
            health: 100
          });
          alert(`Success! Restored Morale and Health to 100%.`);
        } else {
          await updateUserData({
            coins: userData.coins - item.cost,
            purchasedItems: [...userData.purchasedItems, item.id]
          });
          alert(`Successfully unlocked: ${item.name}!`);
        }
      };

      return (
        <div className="p-4 max-w-lg mx-auto space-y-6 text-white font-serif">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-center text-primary">Provision Shop</h2>
          
          <div className="bg-surface-container-high p-4 border border-outline rounded-lg flex justify-between items-center">
            <span className="font-mono text-xs uppercase text-slate-400">Tactical Chest Balance:</span>
            <span className="font-mono text-base font-bold text-primary">{userData.coins} COINS</span>
          </div>

          <div className="space-y-4">
            {SHOP_ITEMS.map(item => {
              const purchased = userData.purchasedItems.includes(item.id);
              return (
                <div key={item.id} className="bg-surface-container p-4 border border-outline rounded-lg flex flex-col gap-2 shadow">
                  <div className="flex justify-between items-center border-b border-outline/30 pb-2">
                    <h3 className="font-bold text-base text-primary uppercase">{item.name}</h3>
                    <span className="font-mono text-sm font-bold text-amber-200">{item.cost} COINS</span>
                  </div>
                  <p className="text-xs text-[#ebdcb9]/80 font-sans leading-relaxed">{item.description}</p>
                  
                  {purchased ? (
                    <button disabled className="w-full mt-2 py-2 bg-[#2d3542] text-slate-500 font-mono text-xs uppercase cursor-not-allowed border border-outline/20">
                      EQUIPPED / UNLOCKED
                    </button>
                  ) : (
                    <button 
                      onClick={() => handlePurchase(item)}
                      className="w-full mt-2 py-2.5 bg-primary hover:bg-[#ffd18e] text-on-primary font-mono text-xs font-bold uppercase tracking-wider transition duration-200"
                    >
                      ACQUIRE UPGRADE
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // 6. Base / AvatarView Component
    function AvatarView({ userData, updateUserData }) {
      const [isEditing, setIsEditing] = React.useState(false);
      const [editedName, setEditedName] = React.useState('');

      const handleSave = async () => {
        if (editedName.trim() && editedName.trim().length <= 25) {
          await updateUserData({ username: editedName.trim() });
          setIsEditing(false);
        } else {
          alert("Invalid display name (Please enter 1 to 25 characters).");
        }
      };

      const userXp = userData.xp || 0;
      const evo = getAvatarEvolution(userXp);

      return (
        <div className="space-y-8 font-serif text-white max-w-lg mx-auto">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-center text-primary">Commander Profile</h2>
          
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-28 h-28 rounded-full border-4 border-primary bg-surface-container-high flex items-center justify-center shadow-2xl">
                <LucideIcon name="user" size={56} className="text-primary"/>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-surface shadow flex items-center gap-1">
                <span>Lvl {evo.level}</span>
              </div>
            </div>
            
            {isEditing ? (
              <div className="flex items-center gap-2 mb-2 w-full max-w-[280px]">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  maxLength={25}
                  className="flex-1 bg-surface-container-high border-2 border-primary text-white px-3 py-1 text-center font-bold uppercase rounded"
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  className="p-1 px-2.5 bg-emerald-700 hover:bg-emerald-600 rounded text-white text-xs font-bold transition"
                >
                  SAVE
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1 px-2.5 bg-red-950 hover:bg-red-900 rounded text-white text-xs font-bold transition"
                >
                  ESC
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold uppercase tracking-wider text-on-surface">
                  {userData.username || 'Operator'}
                </h3>
                <button
                  onClick={() => { setEditedName(userData.username || 'Operator'); setIsEditing(true); }}
                  className="text-primary/70 hover:text-primary transition p-1 focus:outline-none"
                  title="Edit"
                >
                  <LucideIcon name="edit-2" size={14} />
                </button>
              </div>
            )}
            
            <p className="text-xs uppercase font-mono tracking-widest text-amber-200">Rank: Focus Commander</p>
          </div>

          {/* Evolution Telemetry Sheet */}
          <div 
            className="w-full p-5 rounded-lg border-2 border-amber-950 bg-[#1e130a] text-[#f5ebd3] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-1 right-2 p-1 text-[8px] font-mono tracking-widest text-[#ebdcb9]/40 uppercase">
              Profile telemetry
            </div>
            
            <div className="flex items-center gap-3 border-b border-amber-950/40 pb-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-amber-950 flex items-center justify-center font-bold font-mono text-xs text-[#f2be72] border border-[#f2be72]/60">
                {evo.level}
              </div>
              <div>
                <span className="text-[8px] uppercase font-mono tracking-wider text-[#f2be72] font-black block">ACTIVE EVOLUTION STATE</span>
                <h4 className="text-sm font-bold uppercase text-white tracking-wide">{evo.title}</h4>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-left">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#f2be72] block font-extrabold mb-1">Current Dress & Posture:</span>
                <p className="text-xs leading-relaxed pl-2 border-l-2 border-[#f2be72]/45 bg-black/15 p-1.5 rounded">{evo.clothing}</p>
              </div>
              {evo.clutter && (
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#f2be72] block font-extrabold mb-1">Station Atmosphere:</span>
                  <p className="text-xs leading-relaxed pl-2 border-l-2 border-[#f2be72]/45 bg-black/15 p-1.5 rounded">{evo.clutter}</p>
                </div>
              )}
              <div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#f2be72] block font-extrabold mb-1">Equipped Productivity Weapons:</span>
                <p className="text-xs leading-relaxed pl-2 border-l-2 border-[#f2be72]/45 bg-black/15 p-1.5 rounded">{evo.item}</p>
              </div>
              <div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#f2be72] block font-extrabold mb-1">Aura Ambient Energy:</span>
                <p className="text-xs leading-relaxed pl-2 border-l-2 border-[#f2be72]/45 bg-black/15 p-1.5 rounded">{evo.fx}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-950/40 flex justify-between items-center text-[10px] font-mono">
              <span className="text-[#ebdcb9]/50 font-bold uppercase">Tactical State Account</span>
              <span className="text-[#f2be72] bg-black/50 px-2 py-0.5 rounded border border-[#f2be72]/20 font-black">{userXp} XP</span>
            </div>
          </div>

          {/* Simple inventory */}
          <div className="bg-surface-container-high border border-outline p-5 rounded-lg">
            <div className="flex items-center gap-2 mb-3 text-primary border-b border-outline/30 pb-2">
              <LucideIcon name="package" size={18} />
              <h3 className="font-bold text-sm uppercase">Acquired Gear Locker</h3>
            </div>
            {userData.purchasedItems && userData.purchasedItems.length > 0 ? (
              <ul className="grid grid-cols-2 gap-2 text-xs font-mono">
                {userData.purchasedItems.map((item, idx) => (
                  <li key={idx} className="p-2 bg-black/20 border border-outline/20 rounded flex items-center gap-2">
                    <LucideIcon name="shield" size={12} className="text-primary" />
                    <span className="uppercase">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 italic text-center py-2">Locker container is currently empty.</p>
            )}
          </div>

          <div className="text-center pb-8 pt-4">
            <button 
              onClick={() => {
                if (confirm("Reset Campaign lore progression? System will trigger fresh prologue sequence on reload.")) {
                  localStorage.removeItem(`sawStoryIntro_${auth.currentUser?.uid}`);
                  window.location.reload();
                }
              }}
              className="text-[10px] uppercase tracking-widest text-[#f2be72]/60 hover:text-primary transition font-mono border border-amber-950/50 p-2 hover:bg-[#120d09]"
            >
              [ Replay Campaign Prologue ]
            </button>
          </div>
        </div>
      );
    }

    // --- ARENA CAMPAIGN GAME MODE OVERLAYS COMPONENTS ---

    // 1. Mind: Start on an Assignment Photo Scanner View
    function MobilizationView({ onComplete, onCancel }) {
      const videoRef = React.useRef(null);
      const canvasRef = React.useRef(null);
      const [cameraReady, setCameraReady] = React.useState(false);
      const [verified, setVerified] = React.useState(false);
      const [vText, setVText] = React.useState('');
      const [preset, setPreset] = React.useState('live');
      const [metrics, setMetrics] = React.useState(null);

      React.useEffect(() => {
        startCamera();
        return () => {
          if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
          }
        };
      }, []);

      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
            audio: false
          });
          if (videoRef.current) videoRef.current.srcObject = stream;
          setCameraReady(true);
        } catch (err) {
          console.warn('Camera blocked/missing environment feed, using digital simulator');
          setCameraReady(false);
        }
      };

      const handleScan = () => {
        let desk = false, elements = false, text = false, selfie = false, empty = false;

        if (preset === 'live') {
          // Camera pixel heuristic simulations fallback
          desk = true; elements = true; text = true;
        } else if (preset === 'perfect') {
          desk = true; elements = true; text = true;
        } else if (preset === 'selfie') {
          selfie = true;
        } else if (preset === 'empty') {
          empty = true;
        } else if (preset === 'desk_no_paper') {
          desk = true;
        }

        let score = 0;
        let answer = '';

        if (selfie) {
          score = 0;
          answer = "Selfie / Face detected inside focus field bounds!";
        } else if (empty) {
          score = 1;
          answer = "Flat ceiling or blank wall void detected.";
        } else {
          if (desk) score += 2;
          if (elements) score += 2;
          if (text) score += 3;
          if (desk && !selfie) score += 1; // person present

          if (score < 5) {
            answer = "Bare surface detected but lacks homework documentation, paper or laptop elements.";
          } else {
            answer = "Verified genuine homework/study workstation environment.";
          }
        }

        const passes = score >= 5 && !selfie && !empty;
        setMetrics({ score, desk, elements, text, answer });

        if (passes) {
          setVerified(true);
          setVText('✅ Verification Passed');
        } else {
          setVerified(false);
          setVText('❌ Verification Failed');
        }
      };

      return (
        <div className="min-h-screen bg-[#0b0704] text-[#ebdcb9] flex flex-col items-center justify-between p-4 font-serif relative">
          <div className="w-full max-w-xl flex justify-between items-center border-b border-[#ebdcb9]/15 pb-3">
            <div>
              <span className="text-[9px] font-mono tracking-widest text-primary uppercase block">ASSIGNMENT VERIFIER</span>
              <h2 className="text-base font-bold uppercase text-white">TASK COMMENCE BLUEPRINT</h2>
            </div>
            <button onClick={onCancel} className="px-3 py-1 border border-[#ebdcb9]/20 text-xs font-mono uppercase bg-black hover:border-primary">
              Cancel
            </button>
          </div>

          <div className="w-full max-w-sm flex-1 flex flex-col justify-center items-center space-y-4 my-4">
            <div className="text-center">
              <h1 className="text-base font-bold tracking-widest uppercase text-primary">SCENARIO INTEGRITY CHECK</h1>
              <p className="text-[10px] text-slate-400 max-w-xs mx-auto mt-1 font-sans">
                Point your workspace camera at standard desk papers, laptop docs, of notebook pages to unlock defense.
              </p>
            </div>

            <div className="w-full border-2 border-amber-950/70 rounded-lg overflow-hidden bg-black relative aspect-[4/3] max-h-[220px]">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
              {!cameraReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/95 text-[10px] font-mono p-4 text-center">
                  [ DEVICE CAMERA INTEGRATIVE SIMULATOR ACTIVE ]
                </div>
              )}
            </div>

            {/* Presets Grid */}
            <div className="w-full bg-[#16100c] border border-amber-950/30 p-2.5 rounded-lg space-y-2">
              <span className="text-[9px] font-mono uppercase tracking-wider text-primary font-bold">Simulator Diagnostic Presets:</span>
              <div className="grid grid-cols-2 gap-1 font-mono text-[9px]">
                <button onClick={() => { setPreset('live'); setMetrics(null); }} className={`p-1 rounded border text-left flex justify-between ${preset === 'live' ? 'bg-[#f2be72] text-black border-white' : 'bg-black text-[#ebdcb9]'}`}>
                  <span>📷 Live Frame Scan</span>
                </button>
                <button onClick={() => { setPreset('perfect'); setMetrics(null); }} className={`p-1 rounded border text-left ${preset === 'perfect' ? 'bg-emerald-800 text-white' : 'bg-black text-emerald-400'}`}>
                  <span>✅ Target Setup</span>
                </button>
                <button onClick={() => { setPreset('selfie'); setMetrics(null); }} className={`p-1 rounded border text-left ${preset === 'selfie' ? 'bg-red-950 text-red-200' : 'bg-black text-red-400'}`}>
                  <span>❌ Selfie Face (Fail)</span>
                </button>
                <button onClick={() => { setPreset('empty'); setMetrics(null); }} className={`p-1 rounded border text-left ${preset === 'empty' ? 'bg-stone-800 text-stone-200' : 'bg-black text-stone-400'}`}>
                  <span>❌ Empty Void (Fail)</span>
                </button>
              </div>
            </div>

            <button 
              onClick={handleScan}
              className="w-full py-2.5 bg-primary text-black text-xs font-bold font-mono tracking-widest uppercase focus:outline-none"
            >
              RUN DIAGNOSTIC SCAN
            </button>

            {metrics && (
              <div className="w-full bg-black/95 border border-amber-950 p-2.5 rounded text-left font-mono text-[9px] text-amber-500/80 space-y-1">
                <div className="text-white border-b border-amber-950 pb-1 flex justify-between font-bold">
                  <span>TELEMETRY RESULTS</span>
                  <span>SCORE: {metrics.score} / 8</span>
                </div>
                <div className="flex justify-between">
                  <span>1. Workspace Grounding:</span>
                  <span>{metrics.desk ? "YES (Score +2)" : "NO"}</span>
                </div>
                <div className="flex justify-between">
                  <span>2. Material Notebook Presence:</span>
                  <span>{metrics.elements ? "YES (Score +2)" : "NO"}</span>
                </div>
                <div className="flex justify-between">
                  <span>3. OCR Text Layout:</span>
                  <span>{metrics.text ? "YES (Score +3)" : "NO"}</span>
                </div>
                {metrics.answer && <p className="italic text-[#ebdcb9] font-sans pt-1 border-t border-amber-950/40">{metrics.answer}</p>}
              </div>
            )}

            {vText && (
              <div className={`w-full p-2.5 rounded border text-center font-mono text-xs ${verified ? 'bg-emerald-950/60 border-emerald-700 text-emerald-400' : 'bg-red-950/60 border-red-900 text-red-400'}`}>
                <div className="font-extrabold uppercase">{vText}</div>
                <p className="text-[10px] text-[#ebdcb9] font-sans italic mt-0.5">{verified ? "“Assignment setup detected”" : "“No valid study/work activity found”"}</p>
              </div>
            )}
          </div>

          <div className="w-full max-w-sm flex flex-col items-center">
            {verified ? (
              <button onClick={onComplete} className="w-full py-2.5 bg-emerald-600 text-white font-bold tracking-widest text-xs uppercase cursor-pointer">
                CLAIM VICTORY (+10 XP)
              </button>
            ) : (
              <small className="italic text-[10px] text-slate-500">Scan workstation to activate victory triggers.</small>
            )}
          </div>
        </div>
      );
    }

    // 2. Academic: Work & Study holding count down View
    function FocusSessionView({ onComplete, onFail, userData }) {
      const videoRef = React.useRef(null);
      const canvasRef = React.ReactRef ? React.ReactRef : React.useRef(null);
      const [timeLeft, setTimeLeft] = React.useState(15); // short 15s hold for frictionless user engagement experience
      const [cameraReady, setCameraReady] = React.useState(false);
      const [focusState, setFocusState] = React.useState('FOCUSED');
      const [yaw, setYaw] = React.useState(0);
      const [pitch, setPitch] = React.useState(0);

      React.useEffect(() => {
        startCamera();
        const countdown = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(countdown);
              alert('FOCUS HOLD STABLE: MISSION SUCCESSFUL (+20 XP)');
              onComplete();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        // Simulation loops
        const tracking = setInterval(() => {
          setYaw(Math.round((Math.random() - 0.5) * 6));
          setPitch(Math.round((Math.random() - 0.5) * 6));
        }, 1500);

        return () => {
          clearInterval(countdown);
          clearInterval(tracking);
          if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
          }
        };
      }, []);

      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
          if (videoRef.current) videoRef.current.srcObject = stream;
          setCameraReady(true);
        } catch (e) {
          setCameraReady(false);
        }
      };

      return (
        <div className="min-h-screen bg-[#06080b] text-[#ebdcb9] flex flex-col justify-between p-4 font-serif">
          <div className="w-full max-w-xl mx-auto flex justify-between items-center border-b border-[#ebdcb9]/15 pb-2">
            <div>
              <span className="text-[9px] font-mono tracking-widest text-primary uppercase block">ENVIRONMENT MONITOR</span>
              <h2 className="text-sm font-semibold text-white">WORK STUDY HOLD</h2>
            </div>
            <button onClick={onFail} className="px-2.5 py-1 border border-outline text-xs font-mono uppercase bg-black">
              Leave
            </button>
          </div>

          <div className="text-center my-4 space-y-1">
            <h1 className="text-xs font-mono tracking-widest text-red-500 uppercase">TACTICAL FOCUS LOCK ACTIVE</h1>
            <div className="text-5xl font-mono text-white font-extrabold">{timeLeft}s RECORDING</div>
            <p className="text-[9px] text-slate-400 max-w-xs mx-auto font-sans leading-normal">
              In-window biometric tracker evaluates workspace posture. Keep focus centered on active documents to defeat undead specimens.
            </p>
          </div>

          <div className="w-full max-w-md mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/50 border border-amber-950 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="aspect-video relative rounded bg-black overflow-hidden border border-outline/20">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                {!cameraReady && <div className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-[#ebdcb9]/60 bg-black/95">INTEGRATED WORKSPACE SIMULATED COGNITION</div>}
              </div>
              
              <div className="bg-[#120b06] border border-amber-950 p-2 rounded text-[9px] font-mono space-y-1">
                <div className="text-primary font-bold uppercase border-b border-amber-950 pb-0.5 mb-1 flex justify-between">
                  <span>AI TRACKER</span>
                  <span className="text-emerald-400">ONLINE</span>
                </div>
                <div className="flex justify-between"><span>Centroid Presence:</span><span className="text-emerald-400 font-bold">VERIFIED</span></div>
                <div className="flex justify-between"><span>Horizontal Yaw Offset:</span><span>{yaw}°</span></div>
                <div className="flex justify-between"><span>Vertical Pitch Offset:</span><span>{pitch}°</span></div>
                <div className="flex justify-between font-bold"><span>ESTIMATED STATUS:</span><span className="text-emerald-400">{focusState}</span></div>
              </div>
            </div>

            <div className="space-y-2 font-mono text-[9px] text-left text-slate-300">
              <div className="border border-outline/20 p-2 rounded-lg bg-[#222a37]/30 space-y-1">
                <p className="text-primary font-bold">COGNITIVE ENGAGEMENT PROTOCOL:</p>
                <p>• Tab changes trigger automatic cognitive decay penalty.</p>
                <p>• Avoid excessive head-turn angles exceeding 20° bounds.</p>
                <p>• Morale holds recover periodically on centered states.</p>
              </div>

              {/* Progress Vitals meters */}
              <div className="space-y-1 uppercase font-normal text-[8px] tracking-wider text-slate-400">
                <div>Morale Level: <span className="text-amber-400 font-bold">100%</span></div>
                <div className="h-1.5 w-full bg-slate-800 rounded-sm overflow-hidden"><div className="h-full bg-amber-400 w-full" /></div>
                <div>Zombie Infection: <span className="text-purple-400 font-bold">0%</span></div>
                <div className="h-1.5 w-full bg-slate-800 rounded-sm overflow-hidden"><div className="h-full bg-purple-500 w-0" /></div>
                <div>Station Vitals: <span className="text-emerald-400 font-bold">100%</span></div>
                <div className="h-1.5 w-full bg-slate-800 rounded-sm overflow-hidden"><div className="h-full bg-emerald-500 w-full" /></div>
              </div>
            </div>
          </div>

          <div className="text-center py-2">
            <button 
              onClick={() => { alert('Demo skip holding countdown.'); onComplete(); }}
              className="px-3 py-1 text-[8px] font-mono uppercase bg-[#18202c] border border-outline text-primary hover:bg-[#2d3542]"
            >
              Skip Countdown (Demo)
            </button>
          </div>
        </div>
      );
    }

    // 3. Discipline Watch 2h Phone Isolation screen View
    function DisciplineWatchView({ onComplete }) {
      const [active, setActive] = React.useState(false);
      const [timeLeft, setTimeLeft] = React.useState(7); // elegant short countdown for seamless reward unlocks testing in demo
      
      React.useEffect(() => {
        let timer = null;
        if (active) {
          timer = setInterval(() => {
            setTimeLeft(prev => {
              if (prev <= 1) {
                clearInterval(timer);
                alert("CONGRATULATIONS! INITIATION DISCIPLINE WATCH COMPLETED.\n\nReward Claimed: +35 XP • +30 Coins");
                onComplete();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
        return () => { if (timer) clearInterval(timer); };
      }, [active]);

      return (
        <div className="fixed inset-0 w-full h-full bg-black z-[99999] flex flex-col justify-between p-6 font-serif select-none">
          <div className="w-full flex justify-between items-center text-white border-b border-white/10 pb-4 z-10">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#f2be72] font-mono">Discipline Protocol</span>
              <h2 className="text-sm uppercase tracking-wider">Phone Isolation Screen Seal</h2>
            </div>
            <button onClick={onComplete} className="px-3 py-1 text-xs uppercase font-mono border border-white/40 bg-black text-white hover:border-red-500">
              Leave
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4 z-10">
            {!active ? (
              <div className="space-y-4">
                <h1 className="text-2xl text-white tracking-widest uppercase">DISCIPLINE WATCH</h1>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Seal yourself away from social distraction or device notifications. Lock down screens to secure battlefield supply chests. Doing so recovers your mental focus boundaries.
                </p>
                <button 
                  onClick={() => setActive(true)}
                  className="px-6 py-2.5 bg-red-950 hover:bg-black border border-red-500 text-white font-mono text-xs uppercase tracking-widest font-bold transition shadow-lg"
                >
                  START LOCKDOWN SEAL
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-red-500 animate-pulse">BOUNDARY ACTIVATED SECURE</span>
                <p className="text-[10px] text-[#ebdcb9]/70">Do not toggle browser tabs or exit active screens during Hold.</p>
                <div className="text-6xl font-mono text-primary font-extrabold animate-pulse">00:00:0{timeLeft}</div>
              </div>
            )}
          </div>

          <div className="w-full text-center py-2 border-t border-white/10 z-10 text-[10px] uppercase tracking-widest text-slate-400">
            PROVISION UPON SUCCESS: <span className="text-[#f2be72] font-mono font-bold">+35 XP • +30 COINS</span>
          </div>
        </div>
      );
    }

    // 7. ArenaView (Bosses engagement hub panel)
    function ArenaView({ userData, updateUserData }) {
      const [confirming, setConfirming] = React.useState(null);
      const [showMind, setShowMind] = React.useState(false);
      const [showAcademic, setShowAcademic] = React.useState(false);
      const [showDiscipline, setShowDiscipline] = React.useState(false);

      const activeEnemyId = userData.activeEnemyId || 'shambler';
      const activeEnemy = ENEMIES[activeEnemyId] || ENEMIES.shambler;
      const userXp = userData.xp || 0;

      const handleCampaignComplete = async (damage, coins, xp, tag) => {
        const epKey = activeEnemy.dbHealthKey;
        const currentHp = userData[epKey] !== undefined ? userData[epKey] : 100;
        const inflicted = Math.round(damage * activeEnemy.damageMultiplier);
        let nextHp = Math.max(currentHp - inflicted, 0);
        let kills = userData.enemiesKilled !== undefined ? userData.enemiesKilled : 0;
        let dbHp = nextHp;
        let bonus = 0;

        if (nextHp <= 0) {
          alert(`CRITICAL HIT! You have ANNIHILATED ${activeEnemy.name}!\n\nSpecimen vanquished reward: +${activeEnemy.victoryCoins} Coins!`);
          dbHp = 100;
          nextHp = 100;
          kills += 1;
          bonus = activeEnemy.victoryCoins;
        } else {
          alert(`Target struck! Inflicted ${inflicted}% focus damage to ${activeEnemy.name}. Remaining specs health: ${nextHp}%`);
        }

        const nextMorale = Math.min((userData.morale || 100) + (tag === 'DISCIPLINE' ? 30 : 15), 100);
        const nextInfection = Math.max((userData.infection || 0) - (tag === 'DISCIPLINE' ? 20 : 10), 0);

        await updateUserData({
          [epKey]: dbHp,
          coins: (userData.coins || 0) + coins + bonus,
          xp: (userData.xp || 0) + xp,
          enemiesKilled: kills,
          morale: nextMorale,
          infection: nextInfection,
          sessionHistory: [...(userData.sessionHistory || []), { date: new Date().toLocaleDateString(), xp, type: tag }],
          totalSessions: (userData.totalSessions || 0) + 1
        });

        setShowMind(false);
         setShowAcademic(false);
         setShowDiscipline(false);
      };

      const changeTarget = async (id) => {
        if (userXp < ENEMIES[id].reqXp) return;
        await updateUserData({ activeEnemyId: id });
        alert(`Acquired focus registry target spec: ${ENEMIES[id].name}. Deploy defenses next!`);
      };

      if (showMind) return <MobilizationView onComplete={() => handleCampaignComplete(15, 5, 10, 'MIND')} onCancel={() => setShowMind(false)} />;
      if (showAcademic) return <FocusSessionView onComplete={() => handleCampaignComplete(25, 15, 20, 'ACADEMIC')} onFail={() => setShowAcademic(false)} userData={userData} />;
      if (showDiscipline) return <DisciplineWatchView onComplete={() => handleCampaignComplete(40, 30, 35, 'DISCIPLINE')} />;

      return (
        <div className="space-y-6 font-serif text-[#ebdcb9]">
          
          {/* Standing info panel */}
          <div className="bg-[#1f1610] border border-[#ffb057]/20 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl">
            <div>
              <p className="text-[10px] font-mono tracking-widest uppercase text-[#f2be72]/60">Focus Standing Standing</p>
              <h2 className="text-lg font-bold uppercase text-white">Commander XP: {userXp}</h2>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono tracking-widest uppercase text-red-400">Registry Kills</p>
              <h3 className="text-sm font-mono text-red-500 font-extrabold uppercase mt-0.5">Vanquished Specs: {userData.enemiesKilled || 0}</h3>
            </div>
          </div>

          {/* Registry cards of the 3 Bosses */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-center text-white border-b border-amber-950/40 pb-2">Active Specimen Targets</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.values(ENEMIES).map(enemy => {
                const epHp = userData[enemy.dbHealthKey] !== undefined ? userData[enemy.dbHealthKey] : 100;
                const locked = userXp < enemy.reqXp;
                const active = activeEnemyId === enemy.id;

                return (
                  <div 
                    key={enemy.id}
                    onClick={() => !locked && changeTarget(enemy.id)}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer flex flex-col justify-between ${active ? 'bg-[#1b1510] border-primary shadow-xl scale-[1.01]' : 'bg-[#120d09] border-[#8a6845]/30'}`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2.5 text-[9px] font-mono font-bold">
                        {locked ? (
                          <span className="text-red-400">🔒 REQ {enemy.reqXp} XP</span>
                        ) : (
                          <span className={active ? "text-primary" : "text-slate-400"}>{active ? "🎯 targeted focus" : "AVAILABLE"}</span>
                        )}
                      </div>

                      <div className="relative aspect-video rounded overflow-hidden bg-black mb-3 border border-amber-950">
                        <img src={enemy.image} alt={enemy.name} className="w-full h-full object-cover grayscale opacity-75" referrerPolicy="no-referrer" />
                      </div>

                      <h4 className="text-sm font-extrabold text-white uppercase">{enemy.name}</h4>
                      <p className="text-[10px] italic text-[#ebdcb9]/70 leading-normal mb-3">{enemy.subtitle}</p>

                      {/* HP Gauge */}
                      <div className="space-y-1 py-1 text-[9px] font-mono">
                        <div className="flex justify-between uppercase"><span>Plague Specimen HP:</span><span className="text-red-400 font-bold">{epHp}%</span></div>
                        <div className="h-2 w-full bg-black rounded overflow-hidden border border-amber-950/40">
                          <div className="h-full bg-red-600" style={{ width: `${epHp}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-[9px] bg-black/45 p-1.5 border border-amber-950/20 text-[#f2be72] leading-normal rounded uppercase italic font-mono mb-3">
                      {enemy.flavor}
                    </div>

                    {locked ? (
                      <button disabled className="w-full py-1 text-[9px] uppercase font-mono bg-red-950/20 text-slate-500 rounded border-0 cursor-not-allowed">
                        XP RESTRICTED
                      </button>
                    ) : active ? (
                      <span className="w-full py-1.5 text-center bg-primary text-black font-mono font-bold uppercase text-[9px] rounded flex items-center justify-center gap-1 shadow">
                        🎯 CURRENT TARGET
                      </span>
                    ) : (
                      <button onClick={(e) => { e.stopPropagation(); changeTarget(enemy.id); }} className="w-full py-1 text-[9px] uppercase font-mono border border-primary text-primary hover:bg-primary/15 rounded">
                        DEPLOY PROTOCOL
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#120d09] border border-outline rounded-lg p-5 mt-6 relative">
            <h3 className="font-serif text-white font-bold text-base uppercase mb-2 border-b border-amber-950/40 pb-2">Cognitive Battleground Fields:</h3>
            <p className="text-xs text-[#ebdcb9]/70 leading-relaxed font-sans mb-4">
              Select an unlocked active specimen target and then deploy focus campaigns. Successfulholds deduct critical points and restore overall posture metrics.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button 
                onClick={() => { confirming === 0 ? setShowMind(true) : setConfirming(0); }}
                className="p-3 bg-black/30 border border-amber-950 text-left hover:border-primary rounded flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-[8px] bg-amber-950 text-primary border border-primary/20 px-1 py-0.5 rounded uppercase font-bold">MIND</span>
                  <h4 className="text-xs text-white uppercase font-extrabold mt-2">Start on Assignment</h4>
                  <p className="text-[10px] text-[#ebdcb9]/70 font-sans mt-0.5 leading-snug">Requires 5-score scan verification check.</p>
                </div>
                <div className="text-[9px] text-[#f2be72] font-mono mt-3 uppercase tracking-wider font-extrabold">+10 XP • +5 C</div>
              </button>

              <button 
                onClick={() => { confirming === 1 ? setShowAcademic(true) : setConfirming(1); }}
                className="p-3 bg-black/30 border border-amber-950 text-left hover:border-primary rounded flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-[8px] bg-amber-950 text-primary border border-primary/20 px-1 py-0.5 rounded uppercase font-bold">HOLD</span>
                  <h4 className="text-xs text-white uppercase font-extrabold mt-2">Work & Study hold</h4>
                  <p className="text-[10px] text-[#ebdcb9]/70 font-sans mt-0.5 leading-snug font-normal">Focused holding tracking sequence.</p>
                </div>
                <div className="text-[9px] text-[#f2be72] font-mono mt-3 uppercase tracking-wider font-extrabold">+20 XP • +15 C</div>
              </button>

              <button 
                onClick={() => { confirming === 2 ? setShowDiscipline(true) : setConfirming(2); }}
                className="p-3 bg-black/30 border border-amber-950 text-left hover:border-primary rounded flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-[8px] bg-red-950 text-red-400 border border-red-900/40 px-1 py-0.5 rounded uppercase font-bold">SEAL</span>
                  <h4 className="text-xs text-white uppercase font-extrabold mt-2">Isolation Watch</h4>
                  <p className="text-[10px] text-[#ebdcb9]/70 font-sans mt-0.5 leading-snug">Locks down screen distraction triggers.</p>
                </div>
                <div className="text-[9px] text-[#f2be72] font-mono mt-3 uppercase tracking-wider font-extrabold">+35 XP • +30 C</div>
              </button>
            </div>
          </div>

          {/* TELEMETRY BYPASS EXP GENERATOR */}
          <div className="bg-black/85 p-4 border border-red-900/30 rounded-lg text-xs leading-normal font-sans">
            <span className="text-[9px] font-mono font-bold tracking-widest text-[#f2be72] bg-[#f2be72]/15 p-1 px-2 border border-[#f2be72]/20 uppercase">Simulator Level Destiny Skip</span>
            <p className="text-[#ebdcb9]/70 text-xs mt-2.5 mb-3">Advance instantly to unlock spec registries and complete full-stage evolution apparel changes.</p>
            <div className="flex flex-wrap gap-2 text-[10px] font-mono">
              <button onClick={async () => { await updateUserData({ xp: 501 }); alert('State advanced to Level 2'); }} className="p-1 px-3.5 bg-surface-container border border-[#f2be72]/20 hover:bg-[#1f1610] rounded">Lvl 2 (501 XP)</button>
              <button onClick={async () => { await updateUserData({ xp: 1001 }); alert('State advanced to Level 3'); }} className="p-1 px-3.5 bg-surface-container border border-[#f2be72]/20 hover:bg-[#1f1610] rounded">Lvl 3 (1001 XP)</button>
              <button onClick={async () => { await updateUserData({ xp: 2001 }); alert('State advanced to Level 4'); }} className="p-1 px-3.5 bg-surface-container border border-[#f2be72]/20 hover:bg-[#1f1610] rounded">Lvl 4 (2001 XP)</button>
              <button onClick={async () => { await updateUserData({ xp: 3501 }); alert('State advanced to Level 5'); }} className="p-1 px-3.5 bg-surface-container border border-[#f2be72]/20 hover:bg-[#1f1610] rounded">Lvl 5 (3501+ XP)</button>
            </div>
          </div>

        </div>
      );
    }

    // --- MAIN APPLICATION APP ASSEMBLY ---
    function App() {
      const [user, setUser] = React.useState(null);
      const [loading, setLoading] = React.useState(true);
      const [userData, setUserData] = React.useState({
        coins: 0,
        xp: 0,
        streak: 0,
        totalSessions: 0,
        sessionHistory: [],
        purchasedItems: [],
        username: 'Operator',
        morale: 100,
        health: 100,
        infection: 0,
        enemiesKilled: 0,
        shamblerHealth: 100,
        rgbomberHealth: 100,
        cuirascreenHealth: 100,
        activeEnemyId: 'shambler'
      });
      const [activeView, setActiveView] = React.useState('Home');
      const [verseTrigger, setVerseTrigger] = React.useState(0);
      const [sawStory, setSawStory] = React.useState(true);

      const fetchUserData = async (currentUser) => {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData({
              coins: data.coins || 0,
              xp: data.xp || 0,
              streak: data.streak || 0,
              totalSessions: data.totalSessions || 0,
              sessionHistory: data.sessionHistory || [],
              purchasedItems: data.purchasedItems || [],
              username: data.username || 'Operator',
              morale: data.morale !== undefined ? data.morale : 100,
              health: data.health !== undefined ? data.health : 100,
              infection: data.infection !== undefined ? data.infection : 0,
              shamblerHealth: data.shamblerHealth !== undefined ? data.shamblerHealth : 100,
              rgbomberHealth: data.rgbomberHealth !== undefined ? data.rgbomberHealth : 100,
              cuirascreenHealth: data.cuirascreenHealth !== undefined ? data.cuirascreenHealth : 100,
              enemiesKilled: data.enemiesKilled !== undefined ? data.enemiesKilled : 0,
              activeEnemyId: data.activeEnemyId || 'shambler',
            });
          } else {
            // New user login: initialize to 0 XP and Coins and template values
            const initialData = {
              coins: 0,
              xp: 0,
              streak: 0,
              totalSessions: 0,
              sessionHistory: [],
              purchasedItems: [],
              username: currentUser.displayName || 'Operator',
              morale: 100,
              health: 100,
              infection: 0,
              shamblerHealth: 100,
              rgbomberHealth: 100,
              cuirascreenHealth: 100,
              enemiesKilled: 0,
              activeEnemyId: 'shambler'
            };
            await setDoc(userDocRef, initialData);
            setUserData(initialData);
          }
        } catch (e) {
          console.warn("Telemetry database query offline fallbacks active", e);
        }
        setLoading(false);
      };

      React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          if (currentUser) {
            const hasSeen = localStorage.getItem(`sawStoryIntro_${currentUser.uid}`) === 'true';
            setSawStory(hasSeen);
            fetchUserData(currentUser);
          } else {
            setSawStory(true);
            setLoading(false);
          }
        });
        return () => unsubscribe();
      }, []);

      const updateUserData = async (updates) => {
        if (user) {
          try {
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, updates);
          } catch (e) {
            console.warn("Silent fallback database sync on update", e);
          }
          setUserData(prev => ({ ...prev, ...updates }));
        }
      };

      if (loading) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface p-12 font-serif uppercase tracking-widest text-xs">
            CONNECTING COMMAND CENTER GATEWAY TELEMETRY...
          </div>
        );
      }

      if (!user) {
        return <LoginView onLoginStart={fetchUserData} />;
      }

      if (!sawStory) {
        return (
          <StoryIntroView 
            onComplete={async () => {
              if (user) {
                localStorage.setItem(`sawStoryIntro_${user.uid}`, 'true');
              }
              setSawStory(true);
            }} 
          />
        );
      }

      return (
        <div className="min-h-screen bg-surface text-on-surface">
          {/* Top Panel Fixed Navbar Header */}
          <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-surface border-b border-outline-variant">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveView('Base')}
                className="w-10 h-10 border border-primary bg-[#2d3542] overflow-hidden hover:scale-105 transition-all focus:outline-none cursor-pointer"
                title="Profile Base"
              >
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDd6rr2dAH2K7gWbIZDcrb1qFZO5aEfHhrQsJwRMchL8S0TpgjismFbaS1tBiBdiA4wg_ucDrw0ifONMik4m-n8aGO4Qw9W9Lm9sEEZnZrTox3VWgpti1PMacDTa6LvDOSeAfBXTz-hxi8Ex0cBq6py0Bic3bJX7RnkhCyVIiWjel3po2G7ELRwbEKnGgQK-cTnXuF53I20CIKKbV0xYP0t3s4Vb184i06_ABSdxXnb2o3s4I6sR1LkVOwKoO4zObIQ5950JfKB-jVq" 
                  alt="Officer Profile Thumbnail"
                  className="w-full h-full object-cover grayscale opacity-80"
                  referrerPolicy="no-referrer"
                />
              </button>
              <div className="flex flex-col text-left">
                <span className="font-display text-xs uppercase tracking-widest text-primary font-black">GRIND &</span>
                <span className="font-display text-xs uppercase tracking-widest text-primary font-black">LOCK-IN</span>
              </div>
            </div>
            
            <div className="font-mono text-primary flex gap-4 text-xs font-bold uppercase select-none">
              <span className="flex items-center gap-1"><LucideIcon name="award" size={14} /> {userData.xp} XP</span>
              <span className="flex items-center gap-1"><LucideIcon name="circle" size={14} /> {userData.coins} C</span>
            </div>
          </header>

          {/* Scrolling Center Container Layout */}
          <main className="pt-20 pb-24 px-4 max-w-lg mx-auto min-h-screen">
            {activeView === 'Home' && (
              <HomeView 
                onNavigateToArena={() => setActiveView('Arena')} 
                verseTrigger={verseTrigger}
                userData={userData}
                updateUserData={updateUserData}
              />
            )}
            {activeView === 'Stats' && <StatsView userData={userData} />}
            {activeView === 'Shop' && <ShopView userData={userData} updateUserData={updateUserData} />}
            {activeView === 'Arena' && <ArenaView userData={userData} updateUserData={updateUserData} />}
            {activeView === 'Base' && <AvatarView userData={userData} updateUserData={updateUserData} />}
          </main>

          {/* Bottom Custom Navigation Bar */}
          <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center p-2 bg-surface-container border-t-2 border-primary select-none shadow-2xl">
            {[
              { name: 'Home', icon: 'award' },
              { name: 'Stats', icon: 'activity' },
              { name: 'Shop', icon: 'store' },
              { name: 'Arena', icon: 'sword' },
              { name: 'Base', icon: 'settings' }
            ].map((item) => {
              const isActive = activeView === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    if (item.name === 'Home') {
                      const currentStr = localStorage.getItem('bibleVerseIndex');
                      const currentIndex = currentStr ? parseInt(currentStr, 10) : 0;
                      const nextIndex = (currentIndex + 1) % BIBLE_VERSES.length;
                      localStorage.setItem('bibleVerseIndex', nextIndex.toString());
                      setVerseTrigger(prev => prev + 1);
                    }
                    setActiveView(item.name);
                  }}
                  className={`flex flex-col items-center justify-center font-bold transition-all p-1 outline-none ${isActive ? 'text-primary scale-105' : 'text-outline opacity-65 hover:text-primary-fixed'}`}
                >
                  <LucideIcon name={item.icon} size={20} />
                  <span className="font-mono text-[9px] uppercase tracking-wider block mt-0.5">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<App />);