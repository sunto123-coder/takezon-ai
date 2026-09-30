import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const { addToast } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      addToast('Please provide a valid email address.', 'warning');
      return;
    }

    setSubscribed(true);
    addToast('Welcome to TakeZon VIP! You will receive weekly hand-picked US deals.', 'success');
  };

  return (
    <section className="bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-b border-slate-800">
      <div className="max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-slate-950 shadow-md">
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span>TakeZon VIP Insider Deal Digest</span>
        </div>

        <h2 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
          Never Miss a Secret Price Drop or Flash Rebate
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          Join over 65,000 smart shoppers across the United States. We curate the week’s most dramatic price reductions on gadgets, camera gear, and home essentials.
        </p>

        {subscribed ? (
          <div className="inline-flex items-center gap-2 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>You are subscribed to TakeZon VIP Deal Alerts! Check your inbox for your welcome guide.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
            </div>

            <button
              type="submit"
              className="py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer shrink-0"
            >
              Get Free Alerts
            </button>
          </form>
        )}

        <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-2">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Zero Spam Policy
          </span>
          <span>•</span>
          <span>Unsubscribe Anytime with 1 Click</span>
        </div>
      </div>
    </section>
  );
};
