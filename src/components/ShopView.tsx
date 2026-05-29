import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useUser } from '../lib/UserContext';
import { ShoppingCart } from 'lucide-react';

const SHOP_ITEMS = [
  { id: 'lantern', name: 'Lantern Desk Set', cost: 40, description: 'Replaces normal desk lamps with warm lanterns, candles, and cinematic firelight ambience.' },
  { id: 'baguette', name: 'Baguette Rations', cost: 30, description: 'Improves health and morale during tough times.' },
  { id: 'shield', name: 'Focus Shield', cost: 100, description: 'Reinforced morale insignia that protects one habit streak from resetting if the player misses a single day.' },
  { id: 'bible', name: 'Bible', cost: 110, description: 'Reduces infection, when it is too high.' },
  { id: 'desk', name: 'Desk Setup Pack', cost: 45, description: 'Unlocks additional command-desk decorations.' },
  { id: 'cross', name: 'Cross Necklace', cost: 55, description: 'Small passive protection charm worn by the avatar. Reduces minor infection effects.' },
];

export default function ShopView() {
  const { userData, updateUserData } = useUser();
  const [notification, setNotification] = useState<string | null>(null);

  const handlePurchase = async (item: typeof SHOP_ITEMS[0]) => {
    if (userData.coins < item.cost) {
      setNotification('SORRY NOT ENOUGH COINS :(');
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    if (item.id === 'baguette') {
      // Consumable item: immediately restores morale and health and is not saved in purchasedItems
      await updateUserData({
        coins: userData.coins - item.cost,
        morale: 100,
        health: 100
      });
      alert(`Purchased ${item.name}! Your morale and health have been fully restored to 100%.`);
    } else {
      // One-time purchase items are saved in purchasedItems
      await updateUserData({
        coins: userData.coins - item.cost,
        purchasedItems: [...userData.purchasedItems, item.id]
      });
      alert(`Purchased ${item.name}!`);
    }
  };

  return (
    <div className="space-y-6">
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 w-full flex items-center justify-center z-[10000] pointer-events-none"
        >
          <div className="bg-red-700 text-white p-6 rounded-lg text-lg sm:text-2xl font-bold uppercase shadow-2xl">
            {notification}
          </div>
        </motion.div>
      )}
      <h2 className="font-display-lg text-2xl uppercase">Shop</h2>
      <div className="bg-surface-container-high p-4 border border-outline">
        <p className="font-label-md text-on-surface">Coins Balance: {userData.coins}</p>
      </div>
      <div className="space-y-4">
        {SHOP_ITEMS.map(item => (
          <div key={item.id} className="bg-surface-container p-4 border border-outline flex flex-col gap-2">
            <h3 className="font-bold uppercase text-primary">{item.name} ({item.cost} Coins)</h3>
            <p className="text-sm font-label-md">{item.description}</p>
            {userData.purchasedItems.includes(item.id) ? (
              <button disabled className="w-full py-2 bg-outline text-surface cursor-not-allowed">Purchased</button>
            ) : (
              <button 
                onClick={() => handlePurchase(item)}
                className="w-full py-2 bg-primary text-on-primary font-bold uppercase transition hover:brightness-110 active:scale-95"
              >
                Purchase
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
