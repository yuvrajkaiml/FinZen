"use client";

import { useState } from 'react';
import { SoftCard } from '@/components/shared/SoftCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<{role: 'user'|'ai', content: string, sources?: []}[]>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if(!input) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    setTimeout(() => {
       setMessages(prev => [...prev, { role: 'ai', content: 'Based on your portfolio correlation matrix, a 2% rate hike would disproportionately impact your tech holdings. I have cross-referenced this with today\'s verified FOMC minutes.', sources: [] }]);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex animate-in fade-in duration-500 overflow-hidden bg-root -m-8 mr-[-2rem] mb-[-2rem]">
      <div className="w-72 bg-surface/50 border-r border-border-light p-6 flex flex-col h-full shadow-[2px_0_16px_rgba(28,25,23,0.02)]">
        <Button className="w-full bg-surface text-accent-indigo border border-accent-indigo hover:bg-accent-indigo-light shadow-xs justify-start h-11 px-4 mb-8">+ New Context Chat</Button>
        <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-4 block">Recent Synthesis</span>
        <div className="space-y-2 flex-1 overflow-y-auto">
          <div className="bg-accent-indigo-light border border-accent-indigo/20 px-4 py-3 rounded-lg text-sm text-accent-indigo font-medium cursor-pointer shadow-xs truncate">Rate Hike Exposure</div>
          <div className="hover:bg-elevated px-4 py-3 rounded-lg text-sm text-text-secondary cursor-pointer transition-colors truncate">Taiwan Conflict Scenario Analysis</div>
          <div className="hover:bg-elevated px-4 py-3 rounded-lg text-sm text-text-secondary cursor-pointer transition-colors truncate">NVDA Q3 Earnings Deep Dive</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative h-full">
        <div className="flex-1 overflow-y-auto p-12 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center -mt-10">
               <h2 className="font-display text-4xl text-text-primary mb-3">Intelligence Assistant</h2>
               <p className="text-text-secondary mb-12 max-w-lg text-center leading-relaxed font-sans">Leverage the FinZen RAG engine. Query market history, live news, and your portfolio's hidden correlations.</p>
               <div className="grid grid-cols-2 gap-4 max-w-2xl w-full">
                  <SoftCard className="cursor-pointer hover:border-accent-indigo bg-surface p-5 border-l-[3px] border-accent-indigo">
                    <p className="text-sm font-semibold text-text-primary">Stress test my portfolio against a 20% oil spike.</p>
                  </SoftCard>
                  <SoftCard className="cursor-pointer hover:border-accent-indigo bg-surface p-5 border-l-[3px] border-accent-teal">
                    <p className="text-sm font-semibold text-text-primary">Trace causal impact of US sanctions on TSMC.</p>
                  </SoftCard>
                  <SoftCard className="cursor-pointer hover:border-accent-indigo bg-surface p-5 border-l-[3px] border-accent-amber">
                    <p className="text-sm font-semibold text-text-primary">Summarize today's trusted news on AI regulations.</p>
                  </SoftCard>
                  <SoftCard className="cursor-pointer hover:border-accent-indigo bg-surface p-5 border-l-[3px] border-accent-rose">
                    <p className="text-sm font-semibold text-text-primary">Identify hidden concentration risks in my tech holdings.</p>
                  </SoftCard>
               </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-8 pb-32">
              {messages.map((m, i) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'ai' && (
                    <div className="w-8 h-8 rounded bg-accent-indigo flex items-center justify-center text-white font-serif italic text-sm shadow-sm mt-1 mr-4 shrink-0">AI</div>
                  )}
                  <div className={`p-5 rounded-2xl max-w-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-accent-indigo text-white shadow-md rounded-tr-sm' : 'bg-surface border border-border-base text-text-body shadow-sm rounded-tl-sm'}`}>
                    {m.content}
                    {m.role === 'ai' && i === Object.keys(messages).length - 1 && <span className="animate-pulse ml-1 opacity-50">_</span>}
                    {m.role === 'ai' && (
                      <div className="mt-4 pt-4 border-t border-border-light/50 flex items-center gap-2">
                         <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary font-bold">Sources cited:</span>
                         <span className="text-[10px] bg-elevated border border-border-strong px-2 py-0.5 rounded text-text-primary shadow-xs">US Fed Reserve XML Data</span>
                         <span className="text-[10px] bg-accent-teal-light text-accent-teal border border-accent-teal/20 px-2 py-0.5 rounded shadow-xs font-bold tracking-wide">✓ RAG-Grounded</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-root via-root to-transparent pb-10">
          <div className="max-w-4xl mx-auto relative bg-surface p-2 rounded-2xl shadow-lg border border-border-base flex items-end ring-2 ring-accent-indigo/10">
            <textarea 
               value={input}
               onChange={e => setInput(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
               placeholder="Synthesize intelligence..." 
               className="w-full bg-transparent resize-none h-14 p-4 focus:outline-none text-text-body font-sans placeholder-text-dim text-base leading-relaxed" 
            />
            <Button onClick={handleSend} className="m-2 rounded-xl h-10 w-10 p-0 shadow-sm shrink-0 bg-accent-indigo">&uarr;</Button>
          </div>
          <div className="max-w-4xl mx-auto flex gap-4 mt-3">
             <label className="flex items-center gap-2 text-xs font-semibold text-text-secondary cursor-pointer">
               <input type="checkbox" className="accent-accent-indigo w-3.5 h-3.5" defaultChecked />
               Include Portfolio Context
             </label>
             <label className="flex items-center gap-2 text-xs font-semibold text-text-secondary cursor-pointer">
               <input type="checkbox" className="accent-accent-indigo w-3.5 h-3.5" defaultChecked />
               Include Real-Time Web
             </label>
          </div>
        </div>
      </div>
    </div>
  );
}
