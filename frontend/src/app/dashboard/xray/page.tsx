"use client";

import { SoftCard } from '@/components/shared/SoftCard';

export default function XRayPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 w-full h-full flex flex-col font-sans">
      <div className="flex items-center justify-between pb-6 border-b border-border-light flex-shrink-0">
         <div>
           <h1 className="font-display text-4xl text-text-primary mb-2">Portfolio X-Ray</h1>
           <p className="font-sans text-sm text-text-secondary leading-relaxed">Decompose hidden risk factors, style drift, and macro sensitivities.</p>
         </div>
         <div className="flex flex-col items-end">
           <span className="text-xs font-semibold text-text-dim uppercase tracking-widest mb-2 outline-none border-none">Active Analysis Context</span>
           <span className="font-mono font-bold text-text-primary bg-surface px-4 py-1.5 border-2 border-border-strong rounded-lg shadow-sm">Global Tech Arbitrage (USD)</span>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SoftCard className="min-h-[480px] flex flex-col items-center justify-center p-12 bg-surface text-center border-border-strong shadow-lg overflow-hidden relative">
           <div className="absolute top-0 right-0 w-48 h-48 bg-accent-indigo-light/20 blur-[80px] rounded-full mix-blend-multiply pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-teal-light/20 blur-[80px] rounded-full mix-blend-multiply pointer-events-none" />

           <div className="w-28 h-28 rounded-[2rem] bg-root border-[6px] border-surface flex items-center justify-center mb-10 shadow-md relative overflow-hidden group hover:scale-105 transition-transform">
             <div className="absolute inset-0 border-[4px] border-accent-indigo border-b-transparent border-t-transparent rounded-[2rem] transform rotate-[30deg] opacity-20 group-hover:rotate-[210deg] transition-transform duration-1000" />
             <span className="text-5xl opacity-80 drop-shadow-sm pb-1">🔍</span>
           </div>
           
           <h3 className="font-display text-3xl font-semibold text-text-primary mb-4 drop-shadow-sm leading-tight border-b border-border-light pb-4 w-full">Deep Factor Decomposition</h3>
           <p className="text-text-secondary max-w-sm mb-12 leading-relaxed font-sans text-sm outline-none border-none">Our quantitative engine has analyzed your holdings across 85 distinct macroeconomic and fundamental risk factors.</p>

           <div className="w-full space-y-6 px-4 relative z-10">
             <div className="bg-root p-4 rounded-xl shadow-inner border border-border-light">
               <div className="flex justify-between items-center text-sm font-bold mb-3 font-sans">
                 <span className="tracking-wide">Momentum Bias</span>
                 <span className="font-mono text-accent-rose text-base">84%</span>
               </div>
               <div className="w-full h-2 bg-elevated rounded-full overflow-hidden shadow-inner"><div className="h-full rounded-full bg-accent-rose shadow-md border-t border-accent-rose/50 relative" style={{width: '84%'}} /></div>
             </div>
             
             <div className="bg-root p-4 rounded-xl shadow-inner border border-border-light">
               <div className="flex justify-between items-center text-sm font-bold mb-3 font-sans">
                 <span className="tracking-wide">Value/Growth Tilt</span>
                 <span className="font-mono text-accent-indigo text-base">Growth Bias (92%)</span>
               </div>
               <div className="w-full h-2 bg-elevated rounded-full overflow-hidden shadow-inner"><div className="h-full rounded-full bg-accent-indigo shadow-md border-t border-accent-indigo/50 relative" style={{width: '92%'}} /></div>
             </div>
             
             <div className="bg-root p-4 rounded-xl shadow-inner border border-border-light">
               <div className="flex justify-between items-center text-sm font-bold mb-3 font-sans">
                 <span className="tracking-wide text-left">Rate Sensitivity (Duration)</span>
                 <span className="font-mono text-accent-amber text-base">55%</span>
               </div>
               <div className="w-full h-2 bg-elevated rounded-full overflow-hidden shadow-inner"><div className="h-full rounded-full bg-accent-amber shadow-md border-t border-accent-amber/50 relative" style={{width: '55%'}} /></div>
             </div>
           </div>
        </SoftCard>

        <SoftCard className="min-h-[480px] flex flex-col bg-surface shadow-lg border-border-strong p-10 relative overflow-hidden">
           <div className="flex items-center gap-4 mb-4 font-display text-3xl text-text-primary font-semibold drop-shadow-sm w-full"><span className="text-4xl">🌍</span> Look-Through Exposure</div>
           <p className="text-sm font-sans text-text-secondary mb-10 border-b border-border-light pb-6 leading-relaxed">Entity revenue geographic sourcing parsed from filings beyond mere corporate domicile status.</p>
           
           <div className="space-y-5 flex-1 overflow-y-auto pr-4 font-sans">
             
             <div className="bg-root p-6 rounded-2xl border border-border-light shadow-inner flex flex-col justify-center transition-all hover:border-border-strong group">
                <div className="flex justify-between items-center flex-wrap gap-4">
                   <div className="flex items-center gap-5">
                     <span className="text-4xl drop-shadow-md group-hover:scale-110 transition-transform">🇺🇸</span>
                     <div>
                       <span className="font-bold text-text-primary block text-lg mb-1 tracking-tight">North America</span>
                       <span className="text-xs text-text-secondary font-mono tracking-wide">Expected 80% • Actual <strong className="text-text-primary">45%</strong></span>
                     </div>
                   </div>
                   <span className="font-mono font-black text-3xl text-text-primary bg-surface py-2 px-4 rounded-xl border-2 border-border-strong shadow-md tracking-tighter">45%</span>
                </div>
             </div>
             
             <div className="bg-root p-6 rounded-2xl border border-border-light shadow-inner flex flex-col justify-center transition-all hover:border-accent-rose group relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-accent-rose" />
                <div className="flex justify-between items-center flex-wrap gap-4 pl-2">
                   <div className="flex items-center gap-5">
                     <span className="text-4xl drop-shadow-md group-hover:scale-110 transition-transform">🇨🇳</span>
                     <div>
                       <div className="flex items-center gap-3 mb-1">
                         <span className="font-bold text-text-primary block text-lg tracking-tight">China / APAC</span>
                         <span className="bg-accent-rose-light text-accent-rose text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border border-accent-rose/30 uppercase tracking-widest">Elevated Risk</span>
                       </div>
                       <span className="text-xs text-text-secondary font-mono tracking-wide">Expected 10% • Actual <strong className="text-text-primary">38%</strong></span>
                     </div>
                   </div>
                   <span className="font-mono font-black text-3xl text-accent-rose bg-surface py-2 px-4 rounded-xl border-2 border-accent-rose/40 shadow-md tracking-tighter">38%</span>
                </div>
             </div>
             
             <div className="bg-root p-6 rounded-2xl border border-border-light shadow-inner flex flex-col justify-center transition-all hover:border-border-strong group">
                <div className="flex justify-between items-center flex-wrap gap-4">
                   <div className="flex items-center gap-5">
                     <span className="text-4xl drop-shadow-md group-hover:scale-110 transition-transform">🇪🇺</span>
                     <div>
                       <span className="font-bold text-text-primary block text-lg mb-1 tracking-tight">Europe (EMEA)</span>
                       <span className="text-xs text-text-secondary font-mono tracking-wide">Expected 10% • Actual <strong className="text-text-primary">17%</strong></span>
                     </div>
                   </div>
                   <span className="font-mono font-black text-3xl text-text-primary bg-surface py-2 px-4 rounded-xl border-2 border-border-strong shadow-md tracking-tighter">17%</span>
                </div>
             </div>
             
           </div>
        </SoftCard>
      </div>
    </div>
  );
}
