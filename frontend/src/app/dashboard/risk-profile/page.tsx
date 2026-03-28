"use client";

import { SoftCard } from '@/components/shared/SoftCard';
import { AreaChart } from '@/components/charts/AreaChart';
import { AnimatedNumber } from '@/components/shared/AnimatedNumber';
import { motion } from 'framer-motion';

export default function RiskProfilePage() {
  const mockRiskData = [
    { label: "Market Volatility", val: 82, color: "var(--accent-rose)" },
    { label: "Geopolitical Tension", val: 68, color: "var(--accent-amber)" },
    { label: "Liquidity Constraint", val: 34, color: "var(--accent-sage)" },
    { label: "Interest Rate Sensitivity", val: 91, color: "var(--accent-rose)" },
    { label: "Credit Spreads", val: 45, color: "var(--accent-sage)" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between pb-6 border-b border-border-light">
        <div>
          <h1 className="font-display text-4xl text-text-primary mb-2">Composite Risk Profile</h1>
          <p className="font-sans text-sm text-text-secondary">Cross-asset correlation matrix and real-time distress indicators.</p>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-1">Global Systemic Risk</span>
           <span className="text-4xl font-mono font-bold text-accent-rose drop-shadow-sm border border-accent-rose/20 bg-accent-rose-light px-3 py-1 rounded shadow-xs">7.4</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-1 space-y-6">
            <SoftCard className="bg-surface shadow-xs pt-8">
               <h3 className="font-semibold text-text-primary text-xl mb-6 pb-2 border-b border-border-light/50 w-full inline-block font-display">Macro Factor Exposures</h3>
               <div className="space-y-6">
                 {mockRiskData.map((r, i) => (
                   <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: i*0.1 }} key={r.label} className="w-full">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-semibold text-text-primary tracking-wide shadow-[0_1px_2px_rgba(28,25,23,0.05)] bg-root px-2 py-1 rounded border border-border-base">{r.label}</span>
                        <span className="font-mono text-xs font-bold px-1" style={{ color: r.color }}>{r.val}</span>
                      </div>
                      <div className="h-2 w-full bg-elevated rounded-full overflow-hidden border border-border-base shadow-inner">
                         <motion.div 
                           initial={{ width: 0 }} 
                           animate={{ width: `${r.val}%` }} 
                           transition={{ duration: 1, delay: i*0.1 + 0.5 }}
                           className="h-full rounded-r-none relative" 
                           style={{ backgroundColor: r.color }} 
                         />
                      </div>
                   </motion.div>
                 ))}
               </div>
            </SoftCard>

            <SoftCard className="bg-gradient-to-br from-surface to-root border border-border-strong shadow-md py-8">
               <h3 className="font-semibold text-text-primary text-xl mb-6 font-display border-b border-border-light/50 pb-2">Value at Risk (VaR)</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-elevated p-5 rounded-xl border border-border-base text-center shadow-xs hover:shadow-sm transition-shadow">
                     <span className="text-[10px] uppercase font-bold text-text-secondary tracking-widest block mb-2 border-b border-border-light/50 pb-1">95% Daily VaR</span>
                     <AnimatedNumber value={245000} prefix="$" className="font-mono text-[22px] font-bold text-accent-rose drop-shadow-sm block" />
                  </div>
                  <div className="bg-elevated p-5 rounded-xl border border-border-base text-center shadow-xs hover:shadow-sm transition-shadow">
                     <span className="text-[10px] uppercase font-bold text-text-secondary tracking-widest block mb-2 border-b border-border-light/50 pb-1">Max Drawdown</span>
                     <AnimatedNumber value={18.4} suffix="%" className="font-mono text-[22px] font-bold text-accent-rose drop-shadow-sm block" />
                  </div>
               </div>
            </SoftCard>
         </div>

         <div className="lg:col-span-2 space-y-6">
            <SoftCard className="h-[460px] flex flex-col">
               <div className="flex justify-between items-center mb-6 border-b border-border-light pb-4">
                 <h3 className="font-semibold text-text-primary text-xl font-display">Stress Indicator Time-Series</h3>
                 <div className="flex gap-2 bg-root p-1 rounded-md border border-border-base shadow-xs">
                   <button className="px-4 py-1.5 bg-surface border border-accent-rose/30 text-accent-rose rounded shadow-sm text-xs font-bold tracking-wide">VIX Proxy</button>
                   <button className="px-4 py-1.5 border border-transparent hover:bg-surface/50 text-text-secondary hover:text-text-primary rounded text-xs font-semibold transition-colors">MOVE Proxy</button>
                 </div>
               </div>
               <div className="flex-1 border border-border-light rounded-xl overflow-hidden shadow-inner p-3 bg-root">
                 <AreaChart data={[
                    { date: 'Q1', value: 12 }, { date: 'Q2', value: 18 }, { date: 'Q3', value: 34 }, { date: 'Q4', value: 28 },
                    { date: 'Q1', value: 42 }, { date: 'Q2', value: 68 }, { date: 'Q3', value: 55 }, { date: 'Q4', value: 85 }
                 ]} />
               </div>
            </SoftCard>

            <SoftCard className="bg-surface relative overflow-hidden shadow-md">
               <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-accent-amber" />
               <div className="ml-6 py-2">
                 <h3 className="font-semibold text-text-primary text-xl mb-3 font-display">Tail Risk Alert</h3>
                 <p className="text-sm text-text-secondary mb-5 font-sans leading-relaxed border-l-2 border-border-light pl-4 font-serif italic text-[15px]">Structural break detected in US Treasury term premium. Historical analogues point to a 60% probability of a volatility regime shift within 21 days.</p>
                 <button className="font-sans font-semibold text-sm text-accent-indigo hover:text-accent-indigo-mid transition-colors flex items-center gap-2 bg-accent-indigo-light/30 border border-accent-indigo/20 px-4 py-2 rounded-md shadow-xs">
                   Generate Hedging Strategy <span className="opacity-70">&rarr;</span>
                 </button>
               </div>
            </SoftCard>
         </div>
      </div>
    </div>
  );
}
