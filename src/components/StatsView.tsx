import React from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import { useUser } from '../lib/UserContext';

export default function StatsView() {
  const { userData, loading } = useUser();

  if (loading) return <div className="text-white text-center p-10 font-serif">Loading Stats...</div>;

  return (
    <div className="p-5 font-serif text-white">
       <h2 className="text-3xl font-bold uppercase mb-8 tracking-widest text-center">Achievements</h2>
       
       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mx-auto mb-12">
         <div className="text-center p-6 bg-surface-container-high border border-outline rounded shadow-md">
           <div className="text-4xl font-bold text-primary">{userData.streak || 0}</div>
           <div className="text-xs uppercase tracking-widest opacity-70 mt-2 font-mono">Current Streak</div>
         </div>
         <div className="text-center p-6 bg-surface-container-high border border-outline rounded shadow-md">
           <div className="text-4xl font-bold text-primary">{userData.totalSessions || 0}</div>
           <div className="text-xs uppercase tracking-widest opacity-70 mt-2 font-mono">Sessions</div>
         </div>
         <div className="text-center p-6 bg-[#1f1212] border border-red-500/30 rounded shadow-[0_0_15px_rgba(239,68,68,0.05)]">
           <div className="text-4xl font-bold text-red-500">{userData.enemiesKilled !== undefined ? userData.enemiesKilled : 0}</div>
           <div className="text-xs uppercase tracking-widest text-red-400 font-bold font-mono mt-2">Enemies Killed</div>
         </div>
       </div>

       <div className="bg-surface-container-high border border-outline p-6 mb-12 w-full max-w-2xl mx-auto h-64 rounded shadow-md">
           <h3 className="text-xl font-bold mb-4 uppercase">XP History</h3>
           <ResponsiveContainer width="100%" height="100%">
               <LineChart data={userData.sessionHistory}>
                   <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                   <XAxis dataKey="date" stroke="#ebdcb9" />
                   <YAxis stroke="#ebdcb9" />
                   <Tooltip contentStyle={{ backgroundColor: '#1a120b', borderColor: '#8a6845', color: '#ebdcb9' }} />
                   <Line type="monotone" dataKey="xp" stroke="#e0a96d" strokeWidth={2} activeDot={{ r: 8 }} />
               </LineChart>
           </ResponsiveContainer>
       </div>

       <div className="bg-surface-container-high border border-outline p-6 w-full max-w-2xl mx-auto rounded shadow-md">
           <h3 className="text-xl font-bold mb-4 uppercase">Session History</h3>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
                 <thead>
                     <tr className="border-b border-outline opacity-70 font-mono text-xs text-amber-100">
                         <th className="p-2">Date</th>
                         <th className="p-2">Type</th>
                         <th className="p-2">XP</th>
                     </tr>
                 </thead>
                 <tbody>
                     {userData.sessionHistory && userData.sessionHistory.length > 0 ? (
                         userData.sessionHistory.map((s, i) => (
                             <tr key={i} className="border-b border-outline/50 hover:bg-white/5 transition">
                                 <td className="p-2">{s.date}</td>
                                 <td className="p-2">
                                   <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary-container text-on-primary-container uppercase font-bold">
                                     {s.type}
                                   </span>
                                 </td>
                                 <td className="p-2 text-primary font-bold">{s.xp}</td>
                             </tr>
                         ))
                     ) : (
                         <tr>
                             <td colSpan={3} className="p-8 text-center text-on-surface-variant italic opacity-60">No focus sessions completed yet.</td>
                         </tr>
                     )}
                 </tbody>
             </table>
           </div>
       </div>
    </div>
  );
}
