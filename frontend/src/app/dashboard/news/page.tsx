"use client";

import { SoftCard } from '@/components/shared/SoftCard';

export default function NewsPage() {
  const mockNews = [
    { title: "Federal Reserve signals slower pace of rate cuts into 2027", source: "Reuters", time: "1h ago", flag: "🇺🇸", sentiment: "neutral", score: 94 },
    { title: "Taiwan semiconductor exports disrupted following maritime embargo drill", source: "Bloomberg", time: "3h ago", flag: "🇹🇼", sentiment: "negative", score: 88 },
    { title: "Unverified leaks suggest major defense contractor merge", source: "Global defense blog", time: "5h ago", flag: "🇬🇧", sentiment: "positive", score: 45 },
    { title: "Energy minister confirms long-term strategic reserve expansion", source: "Financial Times", time: "6h ago", flag: "US", sentiment: "positive", score: 96 },
    { title: "Cryptocurrency regulations tightening across EU member states", source: "CoinDesk", time: "8h ago", flag: "🇪🇺", sentiment: "negative", score: 71 },
    { title: "Central bank interventions steady emerging markets FX", source: "WSJ", time: "12h ago", flag: "🌐", sentiment: "positive", score: 91 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between pb-6 border-b border-border-light">
        <h1 className="font-display text-4xl text-text-primary">Intelligence Feed</h1>
        <div className="flex items-center gap-4">
           <div className="bg-surface border border-border-base rounded-lg h-10 px-4 flex items-center shadow-xs">
              <span className="text-xs font-semibold mr-4 text-text-secondary">Trust Minimum:</span>
              <input type="range" min="0" max="100" defaultValue="70" className="w-24 accent-accent-indigo" />
              <span className="font-mono font-bold text-accent-indigo ml-4 text-sm">70</span>
           </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {['All Regions', 'Americas', 'Europe', 'Asia', 'Middle East'].map(f => (
           <span key={f} className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${f === 'All Regions' ? 'bg-surface border-text-primary text-text-primary' : 'bg-root text-text-secondary border-border-light hover:border-border-strong'} cursor-pointer transition-colors shadow-xs`}>{f}</span>
        ))}
      </div>

      <div className="columns-1 md:columns-2 gap-6 space-y-6">
        {mockNews.map((n, i) => (
          <SoftCard key={i} className="break-inside-avoid bg-surface/90 backdrop-blur-sm border-border-base shadow-sm hover:shadow-md hover:border-border-strong relative min-h-[160px] flex flex-col justify-between p-6">
             <div className="absolute top-6 right-6">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-widest shadow-xs border ${n.score >= 80 ? 'bg-accent-sage-light text-accent-sage border-accent-sage/20' : n.score >= 60 ? 'bg-accent-amber-light text-accent-amber border-accent-amber/20' : 'bg-accent-rose-light text-accent-rose border-accent-rose/20'}`}>
                  {n.score >= 80 ? '✓ VERIFIED' : n.score >= 60 ? '~ RELIABLE' : '! UNVERIFIED'} {n.score}
                </span>
             </div>
             
             <div className="pr-24">
               <h3 className="text-lg font-bold text-text-primary leading-snug mb-4 font-sans hover:text-accent-indigo cursor-pointer transition-colors">
                 {n.title}
               </h3>
               <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed mb-6">Aggregate sentiment models predict elevated market reaction based on semantic processing of this event. Immediate portfolio exposure assessment recommended.</p>
             </div>

             <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border-light inline-flex w-full">
               <span className="text-lg drop-shadow-sm">{n.flag}</span>
               <span className="text-xs font-mono font-semibold text-text-secondary uppercase tracking-wide">{n.source}</span>
               <span className="w-1 h-1 rounded-full bg-border-strong" />
               <span className="text-xs text-text-dim font-mono">{n.time}</span>
               
               <span className={`ml-auto text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border shadow-xs ${n.sentiment === 'negative' ? 'bg-accent-rose-light text-accent-rose border-accent-rose/20' : n.sentiment === 'positive' ? 'bg-accent-sage-light text-accent-sage border-accent-sage/20' : 'bg-elevated text-text-secondary border-border-strong'}`}>
                 {n.sentiment}
               </span>
             </div>
          </SoftCard>
        ))}
      </div>
    </div>
  );
}
