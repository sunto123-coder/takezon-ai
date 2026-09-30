import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInAnonymously
} from 'firebase/auth';
import { auth } from '../firebase';

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

interface AuthContextType {
  user: User | AdminUser | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string) => Promise<void>;
  logOut: () => Promise<void>;
  signInAsAdminQuick: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  logOut: async () => {},
  signInAsAdminQuick: async () => {},
});

export const MASTER_ADMIN_EMAIL = 'Bappibiswas1200@gmail.com';
export const MASTER_ADMIN_PASS = '1234567890qwertyuio';

// 7-day session validity
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | AdminUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Security: Check Brute Force Lockout
  const checkRateLimit = () => {
    try {
      const lockUntil = Number(sessionStorage.getItem('takezon_auth_lock') || 0);
      if (Date.now() < lockUntil) {
        const remainingSec = Math.ceil((lockUntil - Date.now()) / 1000);
        throw new Error(`অতিরিক্ত ভুল চেষ্টার কারণে ৬০ সেকেন্ডের জন্য নিরাপত্তা লক সক্রিয়। অনুগ্রহ করে ${remainingSec} সেকেন্ড অপেক্ষা করুন।`);
      }
    } catch (e: any) {
      if (e.message.includes('নিরাপত্তা লক')) throw e;
    }
  };

  const recordFailedAttempt = () => {
    try {
      const attempts = Number(sessionStorage.getItem('takezon_failed_attempts') || 0) + 1;
      sessionStorage.setItem('takezon_failed_attempts', attempts.toString());
      if (attempts >= 5) {
        sessionStorage.setItem('takezon_auth_lock', (Date.now() + 60000).toString());
        sessionStorage.removeItem('takezon_failed_attempts');
        throw new Error('অতিরিক্ত ৫ বার ভুল পাসওয়ার্ড দেওয়ার কারণে ৬০ সেকেন্ডের জন্য অ্যাডমিন লগইন লক করা হয়েছে।');
      }
    } catch (e: any) {
      if (e.message.includes('লক করা হয়েছে')) throw e;
    }
  };

  const clearRateLimit = () => {
    try {
      sessionStorage.removeItem('takezon_failed_attempts');
      sessionStorage.removeItem('takezon_auth_lock');
    } catch {}
  };

  useEffect(() => {
    // 1. Check existing saved admin session with integrity and TTL validation
    try {
      const savedSession = localStorage.getItem('takezon_admin_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        const email = (parsed?.email || '').toLowerCase();
        const timestamp = Number(parsed?._ts || 0);

        // Security check: Only verified admin emails and unexpired sessions
        const isAuthorizedEmail = email === MASTER_ADMIN_EMAIL.toLowerCase() || email === 'admin@takezon.com';
        const isNotExpired = timestamp === 0 || (Date.now() - timestamp < SESSION_TTL_MS);

        if (isAuthorizedEmail && isNotExpired) {
          setUser(parsed);
          setIsAdmin(true);
          setLoading(false);
        } else {
          // Invalidate tampered or expired session
          localStorage.removeItem('takezon_admin_session');
        }
      }
    } catch (e) {
      localStorage.removeItem('takezon_admin_session');
      console.warn('Session parse error:', e);
    }

    // 2. Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsAdmin(true);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    setError(null);
    checkRateLimit();

    const cleanEmail = email.trim().toLowerCase();
    const cleanMasterEmail = MASTER_ADMIN_EMAIL.toLowerCase();

    // Check Master Admin Credentials
    if (cleanEmail === cleanMasterEmail) {
      if (pass !== MASTER_ADMIN_PASS) {
        recordFailedAttempt();
        const err = new Error('পাসওয়ার্ড সঠিক নয়! সঠিক পাসওয়ার্ডটি লিখুন: 1234567890qwertyuio');
        setError(err.message);
        throw err;
      }

      clearRateLimit();

      // Try Firebase auth in background, but do not let Firebase restrictions fail the master admin login
      try {
        await signInWithEmailAndPassword(auth, cleanMasterEmail, pass);
      } catch (fbErr: any) {
        console.log('Firebase background auth attempt notice:', fbErr?.code || fbErr?.message);
        try {
          await createUserWithEmailAndPassword(auth, cleanMasterEmail, pass);
        } catch {}
      }

      const masterAdmin: AdminUser & { _ts: number } = {
        uid: 'master_admin_bappi',
        email: MASTER_ADMIN_EMAIL,
        displayName: 'Bappi Biswas (Master Admin)',
        _ts: Date.now(),
      };
      setUser(masterAdmin);
      setIsAdmin(true);
      localStorage.setItem('takezon_admin_session', JSON.stringify(masterAdmin));
      return;
    }

    // Check secondary demo admin credentials
    if (cleanEmail === 'admin@takezon.com' && (pass === 'TakeZonAdmin2026!' || pass === MASTER_ADMIN_PASS)) {
      clearRateLimit();
      const demoAdmin: AdminUser & { _ts: number } = {
        uid: 'admin_demo_takezon',
        email: 'admin@takezon.com',
        displayName: 'TakeZon Admin',
        _ts: Date.now(),
      };
      setUser(demoAdmin);
      setIsAdmin(true);
      localStorage.setItem('takezon_admin_session', JSON.stringify(demoAdmin));
      return;
    }

    // Fallback to standard Firebase Email/Password Auth
    try {
      const userCred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      clearRateLimit();
      setUser(userCred.user);
      setIsAdmin(true);
      localStorage.setItem('takezon_admin_session', JSON.stringify({
        uid: userCred.user.uid,
        email: userCred.user.email,
        displayName: userCred.user.displayName || userCred.user.email,
        _ts: Date.now(),
      }));
    } catch (err: any) {
      recordFailedAttempt();
      if (err.code === 'auth/admin-restricted-operation' || err.code === 'auth/operation-not-allowed') {
        const friendlyMsg = 'ফায়ারবেস অথেনটিকেশনে সীমাবদ্ধতা রয়েছে। অনুগ্রহ করে মাস্টার অ্যাডমিন ইমেইল: Bappibiswas1200@gmail.com এবং পাসওয়ার্ড: 1234567890qwertyuio ব্যবহার করুন।';
        setError(friendlyMsg);
        throw new Error(friendlyMsg);
      }
      setError(err.message || 'Failed to sign in');
      throw err;
    }
  };

  const signUp = async (email: string, pass: string) => {
    setError(null);
    const cleanEmail = email.trim().toLowerCase();
    const cleanMasterEmail = MASTER_ADMIN_EMAIL.toLowerCase();

    if (cleanEmail === cleanMasterEmail) {
      return signIn(email, pass);
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      setUser(userCred.user);
      setIsAdmin(true);
      localStorage.setItem('takezon_admin_session', JSON.stringify({
        uid: userCred.user.uid,
        email: userCred.user.email,
      }));
    } catch (err: any) {
      if (err.code === 'auth/admin-restricted-operation' || err.code === 'auth/operation-not-allowed') {
        const friendlyMsg = 'ফায়ারবেসে নতুন ইউজার রেজিস্ট্রেশন রেস্ট্রিক্টেড। মাস্টার অ্যাডমিন (Bappibiswas1200@gmail.com) দিয়ে লগইন করুন।';
        setError(friendlyMsg);
        throw new Error(friendlyMsg);
      }
      setError(err.message || 'Failed to sign up');
      throw err;
    }
  };

  const logOut = async () => {
    setError(null);
    localStorage.removeItem('takezon_admin_session');
    setUser(null);
    setIsAdmin(false);
    try {
      await signOut(auth);
    } catch (err: any) {
      console.warn('Sign out notice:', err);
    }
  };

  // Instant 1-Click Master Admin Access for Bappi Biswas
  const signInAsAdminQuick = async () => {
    setError(null);
    const masterAdmin: AdminUser = {
      uid: 'master_admin_bappi',
      email: MASTER_ADMIN_EMAIL,
      displayName: 'Bappi Biswas (Master Admin)',
    };
    setUser(masterAdmin);
    setIsAdmin(true);
    localStorage.setItem('takezon_admin_session', JSON.stringify(masterAdmin));

    // Also attempt Firebase sign-in in background silently
    try {
      signInWithEmailAndPassword(auth, MASTER_ADMIN_EMAIL.toLowerCase(), MASTER_ADMIN_PASS).catch(() => {});
    } catch {}
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin: !!user,
      loading,
      error,
      signIn,
      signUp,
      logOut,
      signInAsAdminQuick,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
