import React, { useState } from 'react';
import { useAuth, MASTER_ADMIN_EMAIL, MASTER_ADMIN_PASS } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { 
  Lock, 
  ShieldCheck, 
  Mail, 
  KeyRound, 
  ArrowRight, 
  UserCheck, 
  Sparkles, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Copy, 
  CheckCheck,
  Crown
} from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { signIn, signUp, signInAsAdminQuick, error: authError } = useAuth();
  const { navigateTo, addToast } = useStore();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('Bappibiswas1200@gmail.com');
  const [password, setPassword] = useState('1234567890qwertyuio');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast(`কপি করা হয়েছে: ${text}`, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFillCredentials = () => {
    setEmail(MASTER_ADMIN_EMAIL);
    setPassword(MASTER_ADMIN_PASS);
    addToast('মাস্টার ক্রেডেনশিয়াল ফিল করা হয়েছে!', 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (isRegistering) {
        await signUp(email, password);
        addToast('Admin account created successfully!', 'success');
      } else {
        await signIn(email, password);
        addToast('TakeZon এডমিন ড্যাশবোর্ডে স্বাগতম!', 'success');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickMasterAdmin = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await signInAsAdminQuick();
      addToast('মাস্টার এডমিন হিসেবে সফলভাবে লগইন হয়েছে!', 'success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background ambient mesh */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top back button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="group flex items-center gap-2 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer h-10 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 active:bg-slate-950 border border-slate-700/80 hover:border-amber-400/50 shadow-md active:scale-95"
          title="Return to Storefront (মেইন স্টোরে ফিরে যান)"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 transition-transform group-hover:-translate-x-1" />
          <span>Return to Storefront (ফিরে যান)</span>
        </button>
      </div>

      <div className="w-full max-w-md relative z-10 my-8">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white shadow-xl shadow-amber-500/20 mb-3 ring-4 ring-amber-500/20">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
            TakeZon Admin Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            USA Product Discovery & Full Control Dashboard
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/95 border border-slate-800 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Master Admin Verified Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-950/40 to-slate-900/80 border border-amber-500/40 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                <Crown className="w-4 h-4 text-amber-400" />
                মাস্টার এডমিন অ্যাক্সেস (Master Admin)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 shadow-xs">
                FULL ACCESS
              </span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Admin Email:</span>
                <div className="flex items-center gap-1.5 font-mono text-amber-300 font-semibold">
                  <span>{MASTER_ADMIN_EMAIL}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(MASTER_ADMIN_EMAIL, 'email')}
                    className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
                    title="Copy Email"
                  >
                    {copiedKey === 'email' ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Password:</span>
                <div className="flex items-center gap-1.5 font-mono text-amber-300 font-semibold">
                  <span>{MASTER_ADMIN_PASS}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(MASTER_ADMIN_PASS, 'pass')}
                    className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
                    title="Copy Password"
                  >
                    {copiedKey === 'pass' ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleQuickMasterAdmin}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4" />
              <span>১-ক্লিকে মাস্টার এডমিনে প্রবেশ করুন (1-Click Login)</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] text-slate-500 font-bold uppercase tracking-wider shrink-0">
              অথবা ইমেইল ও পাসওয়ার্ড দিয়ে লগইন
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {(errorMsg || authError) && (
              <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs font-medium leading-relaxed">
                {errorMsg || authError}
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Admin Email (এডমিন ইমেইল)
                </label>
                <button
                  type="button"
                  onClick={handleFillCredentials}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-medium"
                >
                  Auto-Fill Master
                </button>
              </div>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Bappibiswas1200@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-sm focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password (পাসওয়ার্ড)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="1234567890qwertyuio"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-sm focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              <span>{isRegistering ? 'নতুন একাউন্ট তৈরি করুন' : 'Authenticate to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle login vs register */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
            >
              {isRegistering 
                ? 'ইতিমধ্যে এডমিন ক্রেডেনশিয়াল আছে? লগইন করুন' 
                : 'Need to register a custom account? Click here'}
            </button>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mt-6">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Protected by Firebase Firestore & Master Admin Verification</span>
        </div>
      </div>
    </div>
  );
};

