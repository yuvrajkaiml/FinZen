"use client";

import { motion } from 'framer-motion';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { SoftCard } from '@/components/shared/SoftCard';
import { AnimatedNumber } from '@/components/shared/AnimatedNumber';
import Link from 'next/link';

const MOCK_PORTFOLIOS = [
  { id: '1', name: 'Global Tech Arbitrage', currency: 'USD', value: 3450000, return: 14.5, holdings: 24, color: 'indigo' },
  { id: '2', name: 'Energy Transition Core', currency: 'EUR', value: 875000, return: -2.3, holdings: 12, color: 'teal' },
  { id: '3', name: 'Emerging Markets Yield', currency: 'USD', value: 1250000, return: 8.2, holdings: 18, color: 'amber' },
];

export default function PortfoliosPage() {
  const [portfolios, setPortfolios] = useState(MOCK_PORTFOLIOS);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCurrency, setNewCurrency] = useState('USD');
  const [newValue, setNewValue] = useState('');

  const handleCreatePortfolio = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = newName.trim();
    const parsedValue = Number(newValue);
    if (!trimmedName || Number.isNaN(parsedValue) || parsedValue < 0) {
      return;
    }

    const colorCycle = ['indigo', 'teal', 'amber'] as const;
    const nextIndex = portfolios.length % colorCycle.length;

    const newPortfolio = {
      id: String(Date.now()),
      name: trimmedName,
      currency: newCurrency,
      value: parsedValue,
      return: 0,
      holdings: 0,
      color: colorCycle[nextIndex],
    };

    setPortfolios((prev) => [newPortfolio, ...prev]);
    setNewName('');
    setNewCurrency('USD');
    setNewValue('');
    setShowCreateForm(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center justify-between pb-6 border-b border-border-light">
        <h1 className="font-display text-4xl text-text-primary">My Portfolios</h1>
        <Button
          className="font-sans shadow-xs bg-accent-indigo text-white hover:bg-accent-indigo-mid transition-all"
          onClick={() => setShowCreateForm(true)}
        >
          + New Portfolio
        </Button>
      </div>

      {showCreateForm && (
        <motion.form
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          onSubmit={handleCreatePortfolio}
          className="bg-surface border border-border-light rounded-2xl p-4 md:p-5 flex flex-col md:flex-row gap-3 md:items-end"
        >
          <div className="flex-1">
            <label htmlFor="portfolio-name" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
              Portfolio Name
            </label>
            <input
              id="portfolio-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Example: Macro Volatility Shield"
              className="w-full h-10 px-3 rounded-lg border border-border-light bg-elevated text-text-primary outline-none focus:ring-2 focus:ring-accent-indigo"
              autoFocus
            />
          </div>

          <div className="w-full md:w-32">
            <label htmlFor="portfolio-currency" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
              Currency
            </label>
            <select
              id="portfolio-currency"
              value={newCurrency}
              onChange={(e) => setNewCurrency(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border-light bg-elevated text-text-primary outline-none focus:ring-2 focus:ring-accent-indigo"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="INR">INR</option>
            </select>
          </div>

          <div className="w-full md:w-44">
            <label htmlFor="portfolio-value" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
              Initial Value
            </label>
            <input
              id="portfolio-value"
              type="number"
              min="0"
              step="0.01"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="e.g. 250000"
              className="w-full h-10 px-3 rounded-lg border border-border-light bg-elevated text-text-primary outline-none focus:ring-2 focus:ring-accent-indigo"
              required
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Button
              type="submit"
              className="bg-accent-indigo text-white hover:bg-accent-indigo-mid w-full md:w-auto"
              disabled={!newName.trim() || newValue === '' || Number(newValue) < 0}
            >
              Create
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full md:w-auto"
              onClick={() => {
                setShowCreateForm(false);
                setNewName('');
                setNewCurrency('USD');
                setNewValue('');
              }}
            >
              Cancel
            </Button>
          </div>
        </motion.form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {portfolios.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="h-full"
          >
            <SoftCard accentColor={p.color as any} className="flex flex-col h-full bg-surface shadow-xs hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-semibold text-text-primary text-lg font-sans mb-1">{p.name}</h3>
                  <div className="bg-elevated px-2 py-0.5 rounded text-xs font-mono font-bold text-text-secondary inline-block border border-border-light shadow-xs">{p.currency}</div>
                </div>
                <div className="w-16 h-16 rounded-full border-[6px] border-elevated flex items-center justify-center relative bg-surface shadow-inner">
                  <div className={`absolute inset-0 rounded-full border-[6px] border-accent-${p.color} border-l-transparent border-b-transparent transform rotate-45 opacity-80`} />
                </div>
              </div>

              <div className="mb-8">
                <span className="text-xs text-text-secondary uppercase tracking-widest font-semibold block mb-1">Total Value</span>
                <AnimatedNumber value={p.value} prefix={p.currency === 'USD' ? '$' : '€'} className="text-3xl font-mono font-bold text-text-primary drop-shadow-sm" />
              </div>

              <div className="flex justify-between items-center mb-8 border-t border-border-light pt-4 border-b pb-4">
                 <div className="flex flex-col">
                   <span className="text-xs text-text-secondary mb-1">Return</span>
                   <span className={`font-mono font-bold ${p.return >= 0 ? 'text-accent-sage' : 'text-accent-rose'}`}>{p.return >= 0 ? '+' : ''}{p.return}%</span>
                 </div>
                 <div className="w-px h-8 bg-border-light" />
                 <div className="flex flex-col items-end">
                   <span className="text-xs text-text-secondary mb-1">Holdings</span>
                   <span className="font-mono font-bold text-text-primary">{p.holdings}</span>
                 </div>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <Link href={`/dashboard/portfolio/${p.id}`}>
                  <Button variant="link" className="px-0 text-accent-indigo hover:text-accent-indigo-mid">View Details &rarr;</Button>
                </Link>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-xs text-text-secondary hover:text-text-primary px-3">Optimize</Button>
                  <Button variant="ghost" size="sm" className="text-xs text-text-secondary hover:text-accent-rose px-3">Delete</Button>
                </div>
              </div>
            </SoftCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
