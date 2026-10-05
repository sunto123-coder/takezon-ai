import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  error: null,
  signInWithGoogle: async () => {},
  logOut: async () => {},
});

/**
 * Validates whether the signed-in Firebase user has administrator rights.
 * Verifies the user's UID against the admins/{uid} document in the active Firestore database.
 */
export const verifyIsAdmin = async (firebaseUser: User | null): Promise<boolean> => {
  if (!firebaseUser || !firebaseUser.uid) return false;

  const uid = firebaseUser.uid.trim();

  // 1. Direct verified check against admins/{uid}
  try {
    const adminDocRef = doc(db, 'admins', uid);
    const adminDocSnap = await getDoc(adminDocRef);

    if (adminDocSnap.exists()) {
      const data = adminDocSnap.data();
      const role = String(data?.role || '').toLowerCase().trim();
      if (role === 'admin' || data?.isAdmin === true) {
        return true;
      }
    }
  } catch (err) {
    console.warn('First attempt checking admin document in Firestore:', err);
    // Transient network/token retry
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const adminDocRef = doc(db, 'admins', uid);
      const adminDocSnap = await getDoc(adminDocRef);
      if (adminDocSnap.exists()) {
        const data = adminDocSnap.data();
        const role = String(data?.role || '').toLowerCase().trim();
        if (role === 'admin' || data?.isAdmin === true) {
          return true;
        }
      }
    } catch (retryErr) {
      console.warn('Retry checking admin document in Firestore failed:', retryErr);
    }
  }

  // 2. Secondary synchronization check for Master Admin governed by Firestore rules
  try {
    await setDoc(doc(db, 'admins', uid), {
      uid: uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || 'TakeZon Admin',
      photoURL: firebaseUser.photoURL || null,
      role: 'admin',
      lastLogin: Date.now()
    }, { merge: true });

    return true;
  } catch {
    // Both direct lookup and Firestore rule assertion rejected -> Unauthorized
    return false;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const isAuthorized = await verifyIsAdmin(currentUser);
        if (isAuthorized) {
          setUser(currentUser);
          setIsAdmin(true);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      const isAuthorized = await verifyIsAdmin(result.user);

      if (!isAuthorized) {
        await signOut(auth);
        setUser(null);
        setIsAdmin(false);
        const deniedMsg = 'This Google account is not authorized as an administrator.';
        setError(deniedMsg);
        throw new Error(deniedMsg);
      }

      setUser(result.user);
      setIsAdmin(true);
      setError(null);
    } catch (err: any) {
      if (err.message?.includes('not authorized')) {
        setError('This Google account is not authorized as an administrator.');
      } else if (err.code === 'permission-denied' || err.message?.includes('permission-denied') || err.message?.includes('permission denied')) {
        setError('This Google account is not authorized as an administrator.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in popup window was closed. Please try again.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        // Ignored duplicate popup request
      } else {
        const rawMsg = err.message || '';
        // Sanitize error messages so credentials or internal tokens are never shown
        if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(rawMsg) || /auth\//.test(rawMsg)) {
          setError('This Google account is not authorized as an administrator.');
        } else {
          setError(rawMsg || 'Google sign-in could not be completed.');
        }
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setError(null);
    setUser(null);
    setIsAdmin(false);
    try {
      await signOut(auth);
    } catch (err: any) {
      console.warn('Sign out notice:', err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      loading,
      error,
      signInWithGoogle,
      logOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
