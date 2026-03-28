"use client";

import { SoftCard } from '@/components/shared/SoftCard';
import { motion } from 'framer-motion';

export default function KnowledgeGraphPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 w-full h-full flex flex-col min-h-[800px]">
      <div className="flex items-center justify-between pb-6 border-b border-border-light flex-shrink-0">
         <div>
           <h1 className="font-display text-4xl text-text-primary mb-2">Knowledge Graph</h1>
           <p className="font-sans text-sm text-text-secondary">Explore n-tier relationships between entities, sectors, and geopolitics.</p>
         </div>
         <div className="flex bg-surface p-1.5 pl-5 rounded-full border border-border-base shadow-sm items-center gap-5">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-widest outline-none border-none">Filter Nodes</span>
            <div className="flex gap-1.5">
              {['Companies', 'Sectors', 'Countries', 'Events'].map((t, i) => (
                <button key={t} className={`px-5 py-2 rounded-full text-xs font-bold transition-all shadow-sm tracking-wide ${i === 0 ? 'bg-root text-text-primary border-2 border-border-strong shadow-inner' : 'bg-transparent text-text-secondary hover:bg-root hover:text-text-primary border-2 border-transparent'}`}>{t}</button>
              ))}
            </div>
         </div>
      </div>

      <div className="flex-1 min-h-[600px] border border-border-light rounded-[2rem] bg-surface relative overflow-hidden shadow-inner">
         <div className="absolute inset-0 z-0 opacity-70">
            <svg className="w-full h-full pointer-events-none">
               <line x1="50%" y1="50%" x2="30%" y2="30%" stroke="var(--border-strong)" strokeWidth="2" strokeDasharray="6 6" className="opacity-60" />
               <line x1="50%" y1="50%" x2="70%" y2="25%" stroke="var(--border-strong)" strokeWidth="3" />
               <line x1="50%" y1="50%" x2="65%" y2="70%" stroke="var(--border-strong)" strokeWidth="3" />
               <line x1="50%" y1="50%" x2="25%" y2="65%" stroke="var(--border-strong)" strokeWidth="2" />
               <line x1="70%" y1="25%" x2="85%" y2="35%" stroke="var(--border-strong)" strokeWidth="1" className="opacity-50" />
               <line x1="30%" y1="30%" x2="15%" y2="20%" stroke="var(--border-strong)" strokeWidth="1" className="opacity-50" />
               
               {/* Pulsing rings around center */}
               <circle cx="50%" cy="50%" r="8%" fill="none" stroke="var(--accent-indigo)" strokeWidth="1" opacity="0.3" className="animate-ping" style={{ animationDuration: '3s' }}/>
            </svg>
         </div>
         
         <div className="absolute inset-0 z-10 font-sans">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full bg-accent-indigo-light/20 flex items-center justify-center border-[3px] border-accent-indigo shadow-[0_0_40px_rgba(67,56,202,0.2)] backdrop-blur-md cursor-pointer hover:bg-accent-indigo-light/40 transition-colors z-20">
               <div className="text-center">
                 <span className="font-mono font-black text-accent-indigo block text-2xl mb-2 drop-shadow-sm">TSMC</span>
                 <span className="text-[10px] uppercase font-bold text-accent-indigo tracking-widest bg-surface px-2.5 py-1 rounded-md border border-accent-indigo/20 shadow-xs block mx-auto w-fit">Supplier</span>
               </div>
            </motion.div>

            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} className="absolute top-[25%] left-[70%] -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-surface flex items-center justify-center border-2 border-border-strong shadow-md cursor-pointer hover:border-accent-indigo transition-colors hover:scale-105 z-10">
               <div className="text-center">
                 <span className="font-mono font-black text-text-primary block text-xl mb-1.5 drop-shadow-sm">AAPL</span>
                 <span className="text-[10px] uppercase font-bold text-text-secondary tracking-widest bg-root px-2 py-0.5 rounded shadow-xs border border-border-light block mx-auto w-fit">Tech</span>
               </div>
            </motion.div>

            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="absolute top-[30%] left-[30%] -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-accent-rose-light/10 flex items-center justify-center border-[3px] border-accent-rose shadow-[0_0_20px_rgba(190,18,60,0.15)] backdrop-blur-md cursor-pointer hover:bg-accent-rose-light/30 transition-colors hover:scale-105 z-10">
               <div className="text-center">
                 <span className="font-mono font-black text-accent-rose block text-[17px] mb-2 leading-tight">Taiwan<br/>Conflict</span>
                 <span className="text-[10px] uppercase font-bold text-accent-rose tracking-widest bg-surface px-2 py-0.5 rounded shadow-xs border border-accent-rose/20 block mx-auto w-fit">Event Risk</span>
               </div>
            </motion.div>

            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="absolute top-[70%] left-[65%] -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-surface flex items-center justify-center border-2 border-border-strong shadow-md cursor-pointer hover:border-accent-indigo transition-colors hover:scale-105 z-10">
               <div className="text-center">
                 <span className="font-mono font-black text-text-primary block text-lg mb-1.5 drop-shadow-sm">NVDA</span>
                 <span className="text-[10px] uppercase font-bold text-text-secondary tracking-widest bg-root px-1.5 py-0.5 rounded shadow-xs border border-border-light block mx-auto w-fit">Tech</span>
               </div>
            </motion.div>

            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }} className="absolute top-[65%] left-[25%] -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-surface flex items-center justify-center border-2 border-border-strong shadow-md cursor-pointer hover:border-accent-indigo transition-colors hover:scale-105 z-10">
               <div className="text-center">
                 <span className="font-mono font-black text-text-primary block text-xl mb-1.5 drop-shadow-sm">ASML</span>
                 <span className="text-[10px] uppercase font-bold text-text-secondary tracking-widest bg-root px-2 py-0.5 rounded shadow-xs border border-border-light block mx-auto w-fit">Equip</span>
               </div>
            </motion.div>
         </div>

         {/* Overlay Panel */}
         <div className="absolute top-8 left-8 w-96 bg-surface/95 backdrop-blur-xl border-2 border-border-strong rounded-[2rem] shadow-2xl p-8 z-30 font-sans">
            <h3 className="font-display font-semibold text-2xl text-text-primary mb-6 border-b border-border-light pb-4">Entity Inspector</h3>
            <div className="bg-root p-5 rounded-2xl border border-border-light shadow-inner mb-8">
               <div className="flex items-center justify-between mb-4">
                 <span className="font-mono font-black text-4xl text-accent-indigo drop-shadow-md tracking-tighter">TSMC</span>
                 <span className="text-[10px] bg-accent-indigo border border-accent-indigo px-3 py-1 rounded border shadow-sm font-bold text-white tracking-widest uppercase">CENTRAL NODE</span>
               </div>
               <p className="text-sm font-sans text-text-secondary leading-relaxed tracking-wide">Taiwan Semiconductor Manufacturing Co. The critical foundry node for 85% of global high-performance silicon, spanning defense to consumer tech.</p>
            </div>
            
            <div className="space-y-5 border-b border-border-light pb-8">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-text-secondary font-semibold">1st Degree Connections</span>
                 <span className="font-mono font-black text-text-primary text-base">42</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-text-secondary font-semibold">Portfolio Exposure</span>
                 <span className="font-mono font-black text-text-primary text-base">28.4%</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-text-secondary font-semibold">Max Downside Event</span>
                 <span className="font-mono font-black text-accent-rose bg-accent-rose-light border border-accent-rose/20 px-2 rounded uppercase text-sm">-14.2%</span>
               </div>
            </div>

            <div className="pt-8">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-widest block mb-4 border-none outline-none">Identified Dependency Paths</span>
              <div className="space-y-4 font-mono text-sm">
                <div className="flex items-center gap-3 overflow-hidden w-full bg-elevated px-3 py-2.5 rounded-lg border border-border-base cursor-pointer hover:border-border-strong hover:shadow-md transition-all shadow-xs group">
                   <span className="font-bold shrink-0 text-text-primary">TSMC</span> 
                   <span className="text-text-dim shrink-0 group-hover:text-accent-rose transition-colors">&rarr;</span> 
                   <span className="text-accent-rose shrink-0 font-bold bg-accent-rose-light px-1.5 rounded">-40%</span> 
                   <span className="text-text-dim shrink-0 group-hover:text-accent-rose transition-colors">&rarr;</span> 
                   <span className="font-bold shrink-0 text-text-primary">AAPL (-12%)</span>
                </div>
                <div className="flex items-center gap-3 overflow-hidden w-full bg-elevated px-3 py-2.5 rounded-lg border border-border-base cursor-pointer hover:border-border-strong hover:shadow-md transition-all shadow-xs group">
                   <span className="font-bold shrink-0 text-text-primary">TSMC</span> 
                   <span className="text-text-dim shrink-0 group-hover:text-accent-rose transition-colors">&rarr;</span> 
                   <span className="text-accent-rose shrink-0 font-bold bg-accent-rose-light px-1.5 rounded">-40%</span> 
                   <span className="text-text-dim shrink-0 group-hover:text-accent-rose transition-colors">&rarr;</span> 
                   <span className="font-bold shrink-0 text-text-primary">NVDA (-28%)</span>
                </div>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}
