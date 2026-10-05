import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  AlertCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { signInWithGoogle, error: authError } = useAuth();
  const { navigateTo, addToast } = useStore();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    setIsSigningIn(true);

    try {
      await signInWithGoogle();
      addToast('Welcome to TakeZon Admin Dashboard!', 'success');
    } catch (err: any) {
      if (err.message?.includes('not authorized')) {
        setLocalError('This Google account is not authorized as an administrator.');
      } else if (err.code === 'permission-denied' || err.message?.includes('permission-denied')) {
        setLocalError('This Google account is not authorized as an administrator.');
      } else if (err.message && (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(err.message) || /auth\//.test(err.message))) {
        setLocalError('This Google account is not authorized as an administrator.');
      } else {
        setLocalError(err.message || 'Google sign-in could not be completed.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const displayedError = localError || authError;

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
          title="Return to Storefront"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 transition-transform group-hover:-translate-x-1" />
          <span>Return to Storefront</span>
        </button>
      </div>

      <div className="w-full max-w-md relative z-10 my-8">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-indigo-600 text-white shadow-xl shadow-amber-500/20 mb-4 ring-4 ring-amber-500/20">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
            TakeZon Admin Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto">
            Secure Store Management & Product Control Center
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/95 border border-slate-800 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Firebase OAuth 2.0 Security</span>
            </div>
            <h2 className="text-lg font-bold text-white">Administrator Authentication</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sign in with your authorized Google administrator credentials to securely manage TakeZon products, advertisements, navigation, and store settings.
            </p>
          </div>

          {/* Error Message Display */}
          {displayedError && (
            <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs font-medium leading-relaxed flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{displayedError}</span>
            </div>
          )}

          {/* Google Sign-In Action Button */}
          <div className="space-y-4 pt-2">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 font-bold text-sm shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group active:scale-[0.98]"
            >
              {isSigningIn ? (
                <>
                  <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                  <span className="text-slate-800">Verifying administrator authentication...</span>
                </>
              ) : (
                <>
                  {/* Google SVG Icon */}
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span className="text-slate-900 group-hover:text-black">
                    Continue with Google
                  </span>
                </>
              )}
            </button>

            {/* Security checklist note */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Secure Google SSO OAuth 2.0 Admin Authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Data encrypted and secured by Google Cloud Firestore rules</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Restricted to verified TakeZon store administrators only</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mt-6">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Protected by Firebase Authentication & Firestore ABAC Rules</span>
        </div>
      </div>
    </div>
  );
};
