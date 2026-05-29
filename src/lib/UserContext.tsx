import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface UserData {
  coins: number;
  xp: number;
  streak: number;
  totalSessions: number;
  sessionHistory: { date: string; xp: number; type: string }[];
  purchasedItems: string[];
  username?: string;
  morale?: number;
  health?: number;
  infection?: number;
  shamblerHealth?: number;
  rgbomberHealth?: number;
  cuirascreenHealth?: number;
  enemiesKilled?: number;
  activeEnemyId?: string;
}

interface UserContextType {
  userData: UserData;
  loading: boolean;
  updateUserData: (updates: Partial<UserData>) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>({
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
    shamblerHealth: 100,
    rgbomberHealth: 100,
    cuirascreenHealth: 100,
    enemiesKilled: 0,
    activeEnemyId: 'shambler',
  });
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const fetchUserData = async (user: User) => {
    const userDocRef = doc(db, 'users', user.uid);
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
      // First sign in! Initialize clean, zero-baseline defaults in Firestore document
      const initialData = {
        coins: 0,
        xp: 0,
        streak: 0,
        totalSessions: 0,
        sessionHistory: [],
        purchasedItems: [],
        username: user.displayName || 'Operator',
        morale: 100,
        health: 100,
        infection: 0,
        shamblerHealth: 100,
        rgbomberHealth: 100,
        cuirascreenHealth: 100,
        enemiesKilled: 0,
        activeEnemyId: 'shambler',
      };
      await setDoc(userDocRef, initialData);
      setUserData(initialData);
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        fetchUserData(user);
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const refreshUserData = async () => {
    if (currentUser) {
        await fetchUserData(currentUser);
    }
  };

  const updateUserData = async (updates: Partial<UserData>) => {
    if (currentUser) {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, updates);
      setUserData((prev) => ({ ...prev, ...updates }));
    }
  };

  return (
    <UserContext.Provider value={{ userData, loading, updateUserData, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
