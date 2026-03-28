"use client";

import { useState } from 'react';
import { SoftCard } from '@/components/shared/SoftCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function GeopoliticalPage() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const heatmapData = [
    { code: 'US', name: 'United States', risk: 'low', score: 2.1, color: 'var(--accent-sage-light)', border: 'var(--accent-sage)', w: 'col-span-3 row-span-2' },
    { code: 'CN', name: 'China', risk: 'high', score: 6.8, color: 'var(--accent-rose-light)', border: 'var(--accent-rose)', w: 'col-span-2 row-span-2' },
    { code: 'RU', name: 'Russia', risk: 'critical', score: 8.9, color: '#fecdd3', border: 'var(--accent-rose)', w: 'col-span-1 row-span-1' },
    { code: 'TW', name: 'Taiwan', risk: 'critical', score: 8.5, color: '#fecdd3', border: 'var(--accent-rose)', w: 'col-span-1 row-span-1' },
    { code: 'IN', name: 'India', risk: 'medium', score: 4.2, color: 'var(--accent-amber-light)', border: 'var(--accent-amber)', w: 'col-span-2 row-span-1' },
    { code: 'JP', name: 'Japan', risk: 'low', score: 1.5, color: 'var(--accent-sage-light)', border: 'var(--accent-sage)', w: 'col-span-1 row-span-1' },
    { code: 'GB', name: 'UK', risk: 'low', score: 2.8, color: 'var(--accent-sage-light)', border: 'var(--accent-sage)', w: 'col-span-1 row-span-1' },
    { code: 'DE', name: 'Germany', risk: 'medium', score: 3.5, color: 'var(--accent-amber-light)', border: 'var(--accent-amber)', w: 'col-span-1 row-span-1' },
  ];

  return (
    <div className="h-full flex flex-col relative animate-in fade-in duration-500 overflow-hidden min-h-[800px]">
      <div className="flex items-center justify-between pb-6 border-b border-border-light flex-shrink-0">
        <h1 className="font-display text-4xl text-text-primary">Geopolitical Risk Heatmap</h1>
        <div className="flex gap-2">
          {['Global', 'Asia', 'Europe', 'Americas'].map((f, i) => (
             <button key={f} className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${i === 0 ? 'bg-accent-indigo text-white border-accent-indigo shadow-xs' : 'bg-surface text-text-secondary border-border-base hover:border-border-strong tracking-wide shadow-xs'}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 mt-6 relative flex gap-6 pb-12">
        <div className={`flex-1 transition-all duration-300 ${selectedCountry ? 'mr-[400px]' : ''} h-full`}>
           <div className="grid grid-cols-5 grid-rows-3 gap-3 h-[600px]">
             {heatmapData.map((c) => (
                <div 
                  key={c.code} 
                  onClick={() => setSelectedCountry(c.code)}
                  className={`${c.w} rounded-xl p-6 flex flex-col cursor-pointer transition-all hover:scale-[1.01] shadow-xs hover:shadow-md relative group overflow-hidden border-2`}
                  style={{ backgroundColor: c.color, borderColor: c.border }}
                >
                  {c.risk === 'critical' && <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-accent-rose animate-pulse shadow-[0_0_10px_rgba(190,18,60,0.5)]" />}
                  <span className="text-4xl opacity-[0.85] mb-2 block drop-shadow-sm">{(c.code === 'US' ? '🇺🇸' : c.code === 'CN' ? '🇨🇳' : c.code === 'RU' ? '🇷🇺' : c.code === 'TW' ? '🇹🇼' : c.code === 'IN' ? '🇮🇳' : c.code === 'JP' ? '🇯🇵' : c.code === 'GB' ? '🇬🇧' : '🇩🇪')}</span>
                  <div className="flex justify-between items-end mt-auto w-full">
                    <span className="font-sans font-bold text-xl drop-shadow-sm" style={{ color: c.border }}>{c.name}</span>
                    <span className="font-mono text-3xl font-black tracking-tighter" style={{ color: c.border }}>{c.score}</span>
                  </div>
                </div>
             ))}
           </div>
        </div>

        <AnimatePresence>
          {selectedCountry && (
            <motion.div 
               initial={{ x: '100%', opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               exit={{ x: '100%', opacity: 0 }}
               transition={{ type: "spring", stiffness: 300, damping: 30 }}
               className="absolute right-0 top-0 bottom-12 w-[380px] bg-surface border border-border-strong shadow-[0_8px_32px_rgba(28,25,23,0.1)] rounded-xl p-8 z-20 flex flex-col"
            >
               <button onClick={() => setSelectedCountry(null)} className="absolute top-4 right-4 text-text-dim hover:text-text-primary transition-colors text-xl font-mono">✕</button>
               
               <div className="flex items-center gap-5 mb-8 mt-2 pb-6 border-b border-border-light">
                 <span className="text-5xl drop-shadow-md">{(selectedCountry === 'CN' ? '🇨🇳' : selectedCountry === 'TW' ? '🇹🇼' : selectedCountry === 'RU' ? '🇷🇺' : '🇺🇸')}</span>
                 <div>
                   <h2 className="text-2xl font-bold font-sans text-text-primary tracking-tight mb-1">{heatmapData.find(c => c.code === selectedCountry)?.name}</h2>
                   <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent-rose bg-accent-rose-light px-2.5 py-1 rounded-md border border-accent-rose/20 mt-1 inline-block shadow-xs">CRITICAL RISK · 8.5</span>
                 </div>
               </div>

               <div className="space-y-8 flex-1 overflow-y-auto pr-2">
                  <div className="space-y-5">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-text-secondary">Risk Dimensions</h4>
                    
                    <div className="space-y-4 bg-root p-5 rounded-xl border border-border-light/50 shadow-inner">
                      <div>
                        <div className="flex justify-between items-center text-sm font-semibold mb-2">
                           <span>Political Stability</span>
                           <span className="font-mono font-bold text-accent-amber">5.2</span>
                        </div>
                        <div className="w-full bg-elevated rounded-full h-2"><div className="bg-accent-amber h-full rounded-full" style={{width: '52%'}}/></div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-sm font-semibold mb-2">
                           <span>Military Conflict</span>
                           <span className="font-mono font-bold text-accent-rose">8.6</span>
                        </div>
                        <div className="w-full bg-elevated rounded-full h-2 shadow-inner"><div className="bg-accent-rose h-full rounded-full" style={{width: '86%'}}/></div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center text-sm font-semibold mb-2">
                           <span>Economic Exposure</span>
                           <span className="font-mono font-bold text-accent-sage">2.1</span>
                        </div>
                        <div className="w-full bg-elevated rounded-full h-2"><div className="bg-accent-sage h-full rounded-full" style={{width: '21%'}}/></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-text-secondary">Predicted Sector Impact</h4>
                    <div className="bg-surface border border-border-strong rounded-xl p-4 text-sm shadow-xs">
                       <div className="flex justify-between border-b border-border-light pb-3 mb-3 font-semibold">
                         <span>Semiconductors</span>
                         <span className="text-accent-rose bg-accent-rose-light px-2 py-0.5 rounded font-mono">-12.5%</span>
                       </div>
                       <div className="flex justify-between border-b border-border-light pb-3 mb-3 font-semibold">
                         <span>Consumer Tech</span>
                         <span className="text-accent-rose bg-accent-rose-light px-2 py-0.5 rounded font-mono">-8.2%</span>
                       </div>
                       <div className="flex justify-between font-semibold pt-1">
                         <span>Defense Contractors</span>
                         <span className="text-accent-sage bg-accent-sage-light px-2 py-0.5 rounded font-mono border border-accent-sage/20">+15.4%</span>
                       </div>
                    </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
