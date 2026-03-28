"use client";

import { SoftCard } from '@/components/shared/SoftCard';
import { Button } from '@/components/ui/button';

export default function ScenarioSimulatorPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between pb-6 border-b border-border-light">
         <div>
           <h1 className="font-display text-4xl text-text-primary mb-2">Scenario Sandbox</h1>
           <p className="font-sans text-sm text-text-secondary">Stochastic shock modeling and historical event replays.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <SoftCard className="lg:col-span-1 border border-border-strong shadow-lg relative overflow-hidden bg-surface py-10 px-8">
           <div className="absolute right-[-20%] top-[-10%] opacity-20 blur-3xl w-64 h-64 bg-accent-indigo-light rounded-full pointer-events-none mix-blend-multiply" />
           <h3 className="font-display text-3xl font-semibold text-text-primary mb-8 border-b border-border-light pb-4">Simulation Engine</h3>
           
           <div className="space-y-8 relative z-10">
              <div className="bg-root p-5 rounded-xl border border-border-light shadow-inner">
                <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-3">Select Shock Vector</label>
                <select className="w-full bg-surface border border-border-strong rounded-lg p-3.5 text-sm font-semibold text-text-primary focus:ring-2 focus:ring-accent-indigo outline-none shadow-xs text-balance transition-shadow">
                  <option>US Treasury Yield Spike (+150bps)</option>
                  <option>Taiwan Straits Blockade</option>
                  <option>1987 Black Monday Replay</option>
                  <option>Global Oil Supply Shock ($150/bbl)</option>
                  <option>Generative AI Bubble Burst</option>
                </select>
              </div>

              <div className="bg-root p-5 rounded-xl border border-border-light shadow-inner">
                <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-3">Severity Multiplier (x)</label>
                <div className="flex items-center gap-5 border border-border-base bg-surface rounded-lg p-4 shadow-xs">
                  <input type="range" min="1" max="5" defaultValue="1" className="flex-1 accent-accent-rose h-2 bg-border-light rounded-lg appearance-none cursor-pointer" />
                  <span className="font-mono font-black text-accent-rose text-2xl truncate border-l border-border-light pl-4 w-20 text-right">2.5x</span>
                </div>
              </div>

              <div className="bg-root p-5 rounded-xl border border-border-light shadow-inner">
                <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-3">Target Portfolios</label>
                <div className="space-y-3 max-h-48 overflow-y-auto bg-surface p-3 rounded-lg border border-border-base shadow-xs pr-2">
                   <label className="flex items-center gap-4 p-3 hover:bg-root rounded-md border border-transparent hover:border-border-strong transition-colors cursor-pointer group">
                     <div className="relative flex items-center">
                       <input type="checkbox" defaultChecked className="accent-accent-indigo w-5 h-5 cursor-pointer peer" />
                     </div>
                     <span className="text-[15px] font-semibold text-text-primary font-sans group-hover:text-accent-indigo transition-colors truncate">Global Tech Arbitrage</span>
                   </label>
                   <label className="flex items-center gap-4 p-3 hover:bg-root rounded-md border border-transparent hover:border-border-strong transition-colors cursor-pointer group">
                     <div className="relative flex items-center">
                       <input type="checkbox" className="accent-accent-indigo w-5 h-5 cursor-pointer peer" />
                     </div>
                     <span className="text-[15px] font-semibold text-text-primary font-sans group-hover:text-accent-indigo transition-colors truncate">Emerging Markets Yield</span>
                   </label>
                </div>
              </div>

              <Button className="w-full font-sans text-lg font-bold h-14 shadow-indigo mt-10 group relative overflow-hidden rounded-xl tracking-wide">
                <span className="relative z-10 flex border-b border-transparent items-center gap-2">Execute Simulation <span className="text-accent-indigo-light opacity-80 font-mono text-xs font-normal border border-accent-indigo-light/30 px-1.5 py-0.5 rounded ml-2">⌘E</span></span>
                <div className="absolute inset-0 bg-accent-indigo-mid transform translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300" />
              </Button>
           </div>
        </SoftCard>

        <div className="lg:col-span-2 flex flex-col items-center justify-center p-12 bg-surface/50 border border-border-light rounded-[2rem] shadow-inner text-center relative overflow-hidden min-h-[600px]">
           
           <div className="w-28 h-28 mb-8 rounded-[2rem] bg-root border-[6px] border-surface flex items-center justify-center shadow-md relative overflow-hidden group hover:scale-105 transition-transform duration-500">
             <div className="absolute inset-0 border-[4px] border-accent-indigo border-t-transparent border-l-transparent rounded-[2rem] transform rotate-45 opacity-30 group-hover:rotate-180 transition-transform duration-1000" />
             <span className="text-5xl opacity-80 drop-shadow-md pb-1">⚡️</span>
           </div>
           
           <h2 className="font-display text-4xl text-text-primary mb-6 drop-shadow-sm leading-tight">Ready for computation.</h2>
           <p className="text-text-secondary max-w-lg mb-12 leading-relaxed font-sans text-base">Select parameters to run the Monte Carlo simulation. The engine will evaluate non-linear derivative exposures and cross-asset contagion risks.</p>
           
           <div className="w-full max-w-md border-t border-border-light pt-10">
              <span className="text-xs font-semibold uppercase tracking-widest text-text-dim block mb-6 outline-none border-none">Quick Presets</span>
              <div className="grid grid-cols-2 gap-5">
                <SoftCard className="p-5 bg-surface cursor-pointer hover:border-accent-indigo border border-border-light shadow-xs hover:shadow-md transition-all">
                   <span className="text-[10px] font-mono font-bold text-accent-indigo bg-accent-indigo-light px-2 py-0.5 border border-accent-indigo/20 rounded block mb-3 w-fit tracking-widest shadow-xs">PRESET</span>
                   <span className="text-sm font-bold text-text-primary font-sans leading-snug truncate block text-left">2008 Financial Crisis</span>
                </SoftCard>
                <SoftCard className="p-5 bg-surface cursor-pointer hover:border-accent-rose border border-border-light shadow-xs hover:shadow-md transition-all">
                   <span className="text-[10px] font-mono font-bold text-accent-rose bg-accent-rose-light px-2 py-0.5 border border-accent-rose/20 rounded block mb-3 w-fit tracking-widest shadow-xs">PRESET</span>
                   <span className="text-sm font-bold text-text-primary font-sans leading-snug truncate block text-left">Stagflation 1970s</span>
                </SoftCard>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
