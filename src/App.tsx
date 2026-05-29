/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, {useState} from 'react';
import {Sword, Activity, Store, Award, Settings, Circle} from 'lucide-react';
import {onAuthStateChanged, User} from 'firebase/auth';
import {auth} from './lib/firebase';
import {useUser} from './lib/UserContext';
import ArenaView from './components/ArenaView';
import HomeView from './components/HomeView';
import LoginView from './components/LoginView';
import StatsView from './components/StatsView';
import AvatarView from './components/AvatarView';
import ShopView from './components/ShopView';
import StoryIntroView from './components/StoryIntroView';

export default function App() {
  const [activeView, setActiveView] = useState('Home');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [verseTrigger, setVerseTrigger] = useState(0);
  const [sawStory, setSawStory] = useState(true);
  const {userData, loading: userLoading} = useUser();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        const hasSeen = localStorage.getItem(`sawStoryIntro_${user.uid}`) === 'true';
        setSawStory(hasSeen);
      } else {
        setSawStory(true);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading || userLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface">Loading Command Center...</div>;
  }

  if (!user) {
    return <LoginView />;
  }

  if (!sawStory) {
    return (
      <StoryIntroView 
        onComplete={() => {
          if (user) {
            localStorage.setItem(`sawStoryIntro_${user.uid}`, 'true');
          }
          setSawStory(true);
        }} 
      />
    );
  }

  const navItems = [
    {name: 'Home', icon: Award},
    {name: 'Stats', icon: Activity},
    {name: 'Shop', icon: Store},
    {name: 'Arena', icon: Sword},
    {name: 'Base', icon: Settings},
  ];

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-surface border-b border-outline-variant">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setActiveView('Base');
            }}
            className="w-10 h-10 border border-primary hover:border-primary-fixed hover:scale-105 bg-surface-container-highest overflow-hidden transition-all duration-200 cursor-pointer focus:outline-none rounded-none"
            title="Go to Commander Base"
          >
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDd6rr2dAH2K7gWbIZDcrb1qFZO5aEfHhrQsJwRMchL8S0TpgjismFbaS1tBiBdiA4wg_ucDrw0ifONMik4m-n8aGO4Qw9W9Lm9sEEZnZrTox3VWgpti1PMacDTa6LvDOSeAfBXTz-hxi8Ex0cBq6py0Bic3bJX7RnkhCyVIiWjel3po2G7ELRwbEKnGgQK-cTnXuF53I20CIKKbV0xYP0t3s4Vb184i06_ABSdxXnb2o3s4I6sR1LkVOwKoO4zObIQ5950JfKB-jVq" 
              alt="Officer" 
              className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 transition-all duration-200"
              referrerPolicy="no-referrer"
            />
          </button>
          <div className="flex flex-col">
            <span className="font-display-lg text-sm uppercase tracking-widest text-primary">GRIND &</span>
            <span className="font-display-lg text-sm uppercase tracking-widest text-primary">LOCK-IN</span>
          </div>
        </div>
        <div className="font-label-md text-primary flex gap-4">
          <span className="flex items-center gap-1"><Award size={16} /> {userData.xp} XP</span>
          <span className="flex items-center gap-1"><Circle size={16} /> {userData.coins} C</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-28 px-4 max-w-4xl mx-auto">
        {activeView === 'Home' && (
          <HomeView 
            onNavigateToArena={() => setActiveView('Arena')} 
            verseTrigger={verseTrigger} 
          />
        )}
        {activeView === 'Stats' && <StatsView />}
        {activeView === 'Shop' && <ShopView />}
        {activeView === 'Arena' && <ArenaView />}
        {activeView === 'Base' && <AvatarView />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center p-2 bg-surface-container border-t-2 border-primary">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.name;
          return (
            <button
              key={item.name}
              onClick={() => {
                if (item.name === 'Home') {
                  const currentStr = localStorage.getItem('bibleVerseIndex');
                  const currentIndex = currentStr ? parseInt(currentStr, 10) : 0;
                  const nextIndex = (currentIndex + 1) % 13;
                  localStorage.setItem('bibleVerseIndex', nextIndex.toString());
                  setVerseTrigger(prev => prev + 1);
                }
                setActiveView(item.name);
              }}
              className={`flex flex-col items-center justify-center font-bold transition-all ${
                isActive ? 'text-primary scale-110' : 'text-outline opacity-70 hover:text-primary-fixed'
              }`}
            >
              <Icon size={24} />
              <span className="font-label-sm text-label-sm uppercase mt-1">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
