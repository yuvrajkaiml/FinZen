"use client";

import { useState } from 'react';
import { SoftCard } from '@/components/shared/SoftCard';
import { AnimatedNumber } from '@/components/shared/AnimatedNumber';
import { AreaChart } from '@/components/charts/AreaChart';
import { ArrowUpRight, ShieldAlert, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PortfolioDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Holdings', 'Performance', 'X-Ray', 'Optimize'];

  const mockHoldings = [
    { ticker: 'AAPL', name: 'Apple Inc.', qty: 150, price: 173.5, val: 26025, ret: 12.4 },
    { ticker: 'MSFT', name: 'Microsoft Corp.', qty: 200, price: 420.1, val: 84020, ret: 8.2 },
    { ticker: 'TSLA', name: 'Tesla Inc.', qty: 50, price: 175.2, val: 8760, ret: -15.4 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between pb-6 border-b border-border-light">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <h1 className="font-display text-3xl text-text-primary">Global Tech Arbitrage</h1>
             <span className="bg-elevated px-4 py-1 rounded text-xs font-mono font-bold text-text-secondary border border-border-light shadow-xs">USD</span>
           </div>
           <p className="text-sm text-text-secondary font-mono tracking-wide">ID: {params.id} · Created Mar 12, 2026</p>
        </div>
        <div className="text-right">
          <span className="block text-sm text-text-secondary font-semibold uppercase tracking-widest mb-1">Net Asset Value</span>
          <AnimatedNumber value={3450000} prefix="$" className="font-mono text-4xl font-bold text-text-primary drop-shadow-sm" />
        </div>
      </div>

      <div className="flex bg-elevated p-1 rounded-xl w-fit border border-border-base shadow-xs mb-8">
        {tabs.map(t => (
          <button 
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-xs ${activeTab === t ? 'bg-surface text-accent-indigo border border-border-light/50 shadow-sm' : 'text-text-secondary hover:text-text-primary hover:bg-border-light/30 border border-transparent'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="pt-2">
        {activeTab === 'Overview' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <SoftCard className="p-6 flex flex-col justify-center">
                 <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-widest block mb-2">Total Return</span>
                 <div className="flex items-center gap-2 mt-auto">
                   <AnimatedNumber value={425000} prefix="+$" className="font-mono text-[28px] leading-none font-bold text-accent-sage drop-shadow-sm block" />
                 </div>
              </SoftCard>
              <SoftCard className="p-6 flex flex-col justify-center">
                 <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-widest block mb-2">1Y CAGR</span>
                 <AnimatedNumber value={14.5} suffix="%" className="font-mono text-[28px] leading-none font-bold text-text-primary drop-shadow-sm mt-auto block" />
              </SoftCard>
              <SoftCard className="p-6 flex flex-col justify-center">
                 <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-widest block mb-2">Sharpe Ratio</span>
                 <AnimatedNumber value={1.82} decimals={2} className="font-mono text-[28px] leading-none font-bold text-text-primary drop-shadow-sm mt-auto block" />
              </SoftCard>
              <SoftCard className="p-6 flex flex-col justify-center">
                 <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-widest block mb-2">Beta vs SPX</span>
                 <AnimatedNumber value={1.15} decimals={2} className="font-mono text-[28px] leading-none font-bold text-text-primary drop-shadow-sm mt-auto block" />
              </SoftCard>
            </div>
            
            <SoftCard className="h-[450px]">
              <h3 className="text-lg font-semibold text-text-primary mb-8 font-sans border-b w-fit border-border-light pb-2">Historical Performance</h3>
              <div className="h-[320px] bg-root rounded border border-border-light p-2">
                 <AreaChart data={[
                    { date: 'Jan', value: 3100000 }, { date: 'Feb', value: 3250000 }, 
                    { date: 'Mar', value: 3150000 }, { date: 'Apr', value: 3450000 }
                 ]} />
              </div>
            </SoftCard>
          </div>
        )}

        {activeTab === 'Holdings' && (
          <SoftCard className="overflow-hidden p-0 animate-in fade-in">
             <div className="p-6 border-b border-border-light flex justify-between items-center bg-root/50">
               <h3 className="text-lg font-semibold text-text-primary">Current Holdings</h3>
               <Button size="sm" className="font-sans bg-surface text-text-primary border border-border-strong hover:bg-elevated shadow-xs text-xs px-4">Add Holding</Button>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-elevated/50 text-xs uppercase font-semibold text-text-secondary border-b border-border-light">
                   <tr>
                     <th className="px-6 py-4">Asset</th>
                     <th className="px-6 py-4 text-right">Quantity</th>
                     <th className="px-6 py-4 text-right">Price</th>
                     <th className="px-6 py-4 text-right">Total Value</th>
                     <th className="px-6 py-4 text-right">Return</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-border-light bg-surface">
                   {mockHoldings.map(h => (
                     <tr key={h.ticker} className="hover:bg-root transition-colors group">
                       <td className="px-6 py-5">
                         <div className="font-mono font-bold text-text-primary">{h.ticker}</div>
                         <div className="text-xs text-text-secondary font-sans mt-0.5 group-hover:text-text-primary transition-colors">{h.name}</div>
                       </td>
                       <td className="px-6 py-5 text-right font-mono text-sm">{h.qty}</td>
                       <td className="px-6 py-5 text-right font-mono text-sm">${h.price.toFixed(2)}</td>
                       <td className="px-6 py-5 text-right font-mono text-sm font-bold">${h.val.toLocaleString()}</td>
                       <td className={`px-6 py-5 text-right font-mono text-sm font-bold ${h.ret >= 0 ? 'text-accent-sage' : 'text-accent-rose'}`}>
                         <span className={`px-2 py-1 rounded bg-opacity-20 ${h.ret >= 0 ? 'bg-accent-sage-light border border-accent-sage/20' : 'bg-accent-rose-light border border-accent-rose/20'}`}>
                           {h.ret >= 0 ? '+' : ''}{h.ret}%
                         </span>
                       </td>
                     </tr>
                   ))}
                   {mockHoldings.length === 0 && (
                     <tr>
                       <td colSpan={5} className="px-6 py-12 text-center text-text-secondary">
                          No holdings reported in this portfolio via API sync.
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </SoftCard>
        )}

        {activeTab === 'X-Ray' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">
            <SoftCard accentColor="rose" className="col-span-1 lg:col-span-2 relative overflow-hidden bg-surface">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-accent-rose-light/50 to-transparent pointer-events-none" />
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-lg bg-accent-rose-light text-accent-rose shadow-sm border border-accent-rose/20">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary">Hidden Concentration Risk Detected</h3>
                  <p className="text-text-secondary text-sm mt-1 max-w-2xl leading-relaxed">Found high correlation between your Tech and Auto holdings due to Taiwan semiconductor reliance. Geopolitical flareups in this region would impact 42% of your total NAV.</p>
                </div>
              </div>
              <div className="bg-root rounded-xl border border-border-light p-6 mt-6 relative overflow-hidden z-10 shadow-inner">
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-amber" />
                 <h4 className="font-semibold text-text-primary mb-6 ml-2 font-sans tracking-wide">Causal Chain Matrix Execution Path</h4>
                 <div className="flex flex-col md:flex-row items-center gap-4 text-sm font-mono ml-2">
                   <span className="bg-elevated px-4 py-3 rounded-md border border-border-strong shadow-xs shrink-0 font-bold block w-full md:w-auto text-center">TSMC Yield Drop</span>
                   <span className="text-text-secondary text-lg rotate-90 md:rotate-0">&rarr;</span>
                   <span className="bg-surface px-4 py-3 rounded-md border border-border-strong shadow-xs shrink-0 flex flex-col items-center w-full md:w-auto">
                     <span className="font-semibold">Tech Sector</span>
                     <span className="text-[10px] text-accent-rose mt-1 font-bold bg-accent-rose-light px-2 py-0.5 rounded">-4.2% Drawdown</span>
                   </span>
                   <span className="text-text-secondary text-lg rotate-90 md:rotate-0">&rarr;</span>
                   <span className="bg-surface px-4 py-3 rounded-md border border-accent-rose text-accent-rose shadow-xs shrink-0 flex flex-col items-center w-full md:w-auto">
                     <span className="font-bold">AAPL (15% port)</span>
                     <span className="text-[10px] mt-1 text-text-secondary bg-elevated px-2 py-0.5 rounded font-mono">-6.5% Est Impact</span>
                   </span>
                 </div>
              </div>
            </SoftCard>
          </div>
        )}

        {activeTab === 'Optimize' && (
          <div className="space-y-6 animate-in fade-in">
             <div className="bg-root rounded-2xl p-10 border border-border-light text-center shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639322537231-2f206e06af84?q=80&w=2000&auto=format&fit=crop')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
                
                <div className="w-20 h-20 rounded-full bg-accent-indigo-light text-accent-indigo flex items-center justify-center mx-auto mb-8 shadow-sm border border-accent-indigo/10 relative z-10">
                  <Cpu className="w-10 h-10 animate-pulse" />
                </div>
                <h3 className="text-3xl font-display text-text-primary mb-4 relative z-10">AI-Driven Portfolio Optimization</h3>
                <p className="text-text-secondary max-w-xl mx-auto mb-12 text-balance leading-relaxed font-sans relative z-10">Run 10,000+ Monte Carlo simulations across multiple geopolitical and market scenarios to find the efficient frontier curve for your specific holdings.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-10 relative z-10">
                  {['Conservative', 'Moderate', 'Aggressive'].map((strategy, i) => (
                    <div key={strategy} className={`p-8 rounded-xl border cursor-pointer transition-all duration-300 hover:-translate-y-2 bg-surface text-left flex flex-col ${i === 1 ? 'border-accent-indigo ring-2 ring-accent-indigo/20 shadow-lg scale-105' : 'border-border-base hover:border-border-strong shadow-sm'}`}>
                      <h4 className="font-bold text-text-primary text-xl mb-3 font-sans">{strategy}</h4>
                      <p className="text-sm text-text-secondary mb-8 leading-relaxed">Optimize for {strategy.toLowerCase()} risk tolerance with automated rebalancing suggestions.</p>
                      
                      <div className="mt-auto">
                        <div className="flex justify-between text-xs font-mono mb-2 text-text-body">
                          <span>Risk Profile</span>
                          <span className="font-bold">{i===0?'Low':i===1?'Medium':'High'}</span>
                        </div>
                        <div className="h-2 w-full bg-elevated rounded-full overflow-hidden border border-border-light/50">
                          <div className={`h-full bg-accent-${i===0?'sage':i===1?'amber':'rose'}`} style={{ width: `${(i+1)*33}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button size="lg" className="font-sans px-12 text-lg h-14 shadow-indigo relative z-10 transition-all hover:scale-[1.02]">Run Multi-Agent Optimization Pipeline</Button>
             </div>
          </div>
        )}

        {(activeTab === 'Performance') && (
          <div className="flex flex-col items-center justify-center p-20 text-center animate-in fade-in">
             <div className="w-16 h-16 bg-elevated rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl opacity-50">📈</span>
             </div>
             <h3 className="text-xl font-semibold text-text-primary mb-2 font-display">Performance Metrics</h3>
             <p className="text-text-secondary max-w-md">Detailed benchmark comparisons and attribution modeling are loading from the time-series datastore.</p>
          </div>
        )}

      </div>
    </div>
  );
}
