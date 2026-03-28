"use client";

import { AnimatedNumber } from '@/components/shared/AnimatedNumber';
import { SoftCard } from '@/components/shared/SoftCard';
import { ArrowUpRight, ArrowDownRight, Globe } from 'lucide-react';
import { AreaChart } from '@/components/charts/AreaChart';
import { PieChart } from '@/components/charts/PieChart';

const mockPerformance = [
  { date: 'Jan', value: 1200000 },
  { date: 'Feb', value: 1220000 },
  { date: 'Mar', value: 1215000 },
  { date: 'Apr', value: 1245000 },
  { date: 'May', value: 1280000 },
  { date: 'Jun', value: 1245000 },
];

const mockAllocation = [
  { name: 'Technology', value: 35 },
  { name: 'Healthcare', value: 20 },
  { name: 'Energy', value: 15 },
  { name: 'Finance', value: 30 },
];

const mockKPIs = [
  { label: 'Total Value', value: 1245000, type: 'currency', change: 1.2 },
  { label: 'Day\'s P&L', value: 14500, type: 'currency', change: 1.2 },
  { label: 'Risk Score', value: 42, type: 'score', change: -2 },
  { label: 'Geo Exposure', value: 3.8, type: 'geo', change: 0 },
];

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {mockKPIs.map((kpi, i) => (
          <SoftCard key={i} className="flex flex-col justify-between hover:-translate-y-1 transition-transform border border-border-light shadow-xs hover:shadow-sm h-[140px] p-5 bg-gradient-to-br from-surface to-surface">
             <div className="space-y-1">
               <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary w-full truncate">{kpi.label}</h3>
               <AnimatedNumber 
                 value={kpi.value} 
                 prefix={kpi.type === 'currency' ? '$' : ''} 
                 className="text-[28px] font-bold font-mono text-text-primary tracking-tight block drop-shadow-sm"
               />
             </div>
             
             <div className="flex items-center justify-between w-full mt-auto pt-3 border-t border-border-light/50">
               <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shadow-xs ${kpi.change >= 0 ? 'bg-accent-sage-light text-accent-sage border border-accent-sage/20' : 'bg-accent-rose-light text-accent-rose border border-accent-rose/20'}`}>
                 {kpi.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                 {Math.abs(kpi.change)}{kpi.type === 'currency' ? '%' : ''}
               </span>
               <div className="w-16 h-6 bg-root rounded border border-border-light overflow-hidden flex items-end opacity-70">
                 {/* CSS Mock Mini-sparkline */}
                 <div className="w-1/4 h-1/3 bg-border-strong rounded-t-sm" />
                 <div className="w-1/4 h-2/3 bg-border-strong rounded-t-sm ml-px" />
                 <div className="w-1/4 h-1/2 bg-border-strong rounded-t-sm ml-px" />
                 <div className="w-1/4 h-full bg-accent-indigo rounded-t-sm ml-px" />
               </div>
             </div>
          </SoftCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SoftCard className="h-full min-h-[400px]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-semibold text-text-primary font-sans shadow-sm inline-block rounded border border-transparent">Portfolio Performance</h3>
              <div className="flex bg-elevated rounded-md p-1 border border-border-base shadow-xs">
                {['1W', '1M', '3M', '1Y'].map(t => (
                  <button key={t} className={`px-4 py-1.5 text-xs font-semibold rounded transition-all ${t === '1Y' ? 'bg-surface shadow-xs text-accent-indigo border border-border-base' : 'text-text-secondary hover:text-text-primary hover:bg-border-light/50'}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="w-full h-[300px]">
              <AreaChart data={mockPerformance} />
            </div>
          </SoftCard>
        </div>
        
        <div>
          <SoftCard className="h-full min-h-[400px] flex flex-col">
             <h3 className="text-lg font-semibold text-text-primary font-sans mb-8">Sector Allocation</h3>
             <div className="w-full h-[220px] mb-8 relative">
                <PieChart data={mockAllocation} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                   <span className="text-2xl font-bold text-text-primary font-mono drop-shadow-sm border-b border-border-light/30">4</span>
                   <span className="text-xs font-semibold text-text-secondary uppercase tracking-widest mt-1">Sectors</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm w-full mx-auto mt-auto border-t border-border-light pt-6">
              {mockAllocation.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shadow-xs border border-border-light" style={{ backgroundColor: ['#4338ca', '#0f766e', '#d97706', '#be123c', '#7c3aed', '#15803d'][i] }}/> 
                  <span className="text-text-secondary font-medium tracking-wide">{item.name}</span>
                </div>
              ))}
            </div>
          </SoftCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SoftCard className="h-full min-h-[300px]">
          <h3 className="text-lg font-semibold text-text-primary font-sans mb-6">Intelligence Feed</h3>
          <div className="space-y-4">
             <div className="border border-border-light rounded-xl p-4 group cursor-pointer hover:shadow-md transition-all hover:border-border-strong bg-root relative overflow-hidden">
               <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent-sage" />
               <div className="flex items-center justify-between mb-3 border-b border-border-light pb-2 ml-2">
                 <span className="bg-accent-sage-light text-accent-sage px-2 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider shadow-xs border border-accent-sage/20">✓ VERIFIED 94</span>
                 <span className="text-xs text-text-secondary font-mono tracking-tight">Reuters · 2h ago</span>
               </div>
               <h4 className="font-semibold text-text-primary group-hover:text-accent-indigo transition-colors mb-2 text-balance leading-snug ml-2">Federal Reserve hints at rate cuts in Q3</h4>
               <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed ml-2">Officials signaled a willingness to adjust policy rates in the coming months, citing normalized inflation metrics.</p>
             </div>
             <div className="border border-border-light rounded-xl p-4 group cursor-pointer hover:shadow-md transition-all hover:border-border-strong bg-root relative overflow-hidden">
               <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent-amber" />
               <div className="flex items-center justify-between mb-3 border-b border-border-light pb-2 ml-2">
                 <span className="bg-accent-amber-light text-accent-amber px-2 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider shadow-xs border border-accent-amber/20">~ RELIABLE 72</span>
                 <span className="text-xs text-text-secondary font-mono tracking-tight">Bloomberg · 4h ago</span>
               </div>
               <h4 className="font-semibold text-text-primary group-hover:text-accent-indigo transition-colors mb-2 text-balance leading-snug ml-2">Energy sector volatility spikes amid Middle East tensions</h4>
               <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed ml-2">Crude futures surged 3% following infrastructure threats in key transit chokepoints, impacting global logistics routes.</p>
             </div>
          </div>
        </SoftCard>
        <SoftCard className="h-full min-h-[300px]">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-semibold text-text-primary font-sans">Geopolitical Hotspots</h3>
             <div className="w-10 h-10 rounded-full bg-accent-teal-light flex items-center justify-center border border-accent-teal/10 shadow-xs">
                <Globe className="w-5 h-5 text-accent-teal" />
             </div>
          </div>
          <div className="space-y-4 px-1">
             <div className="flex items-center justify-between p-4 border border-border-light rounded-xl bg-root shadow-xs hover:shadow-sm transition-shadow relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-rose" />
                <div className="flex items-center gap-4 ml-2">
                  <span className="text-3xl drop-shadow-md">🇹🇼</span>
                  <span className="font-semibold text-text-primary text-sm tracking-wide">Taiwan Strait</span>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="font-mono text-text-primary font-bold text-sm">8.5 <span className="text-[10px] text-text-secondary">/10</span></span>
                  <div className="w-24 h-1.5 bg-surface rounded-full overflow-hidden border border-border-light shadow-inner"><div className="h-full w-[85%] bg-accent-rose relative" /></div>
                </div>
             </div>
             <div className="flex items-center justify-between p-4 border border-border-light rounded-xl bg-root shadow-xs hover:shadow-sm transition-shadow relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-amber" />
                <div className="flex items-center gap-4 ml-2">
                  <span className="text-3xl drop-shadow-md">🇺🇦</span>
                  <span className="font-semibold text-text-primary text-sm tracking-wide">Eastern Europe</span>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="font-mono text-text-primary font-bold text-sm">7.0 <span className="text-[10px] text-text-secondary">/10</span></span>
                  <div className="w-24 h-1.5 bg-surface rounded-full overflow-hidden border border-border-light shadow-inner"><div className="h-full w-[70%] bg-accent-amber relative" /></div>
                </div>
             </div>
          </div>
        </SoftCard>
      </div>

    </div>
  );
}
