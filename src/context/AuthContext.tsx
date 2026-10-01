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
 * Enforces database-level authorization check strictly governed by Firestore Security Rules.
 */
export const verifyIsAdmin = async (firebaseUser: User | null): Promise<boolean> => {
  if (!firebaseUser) return false;

  // 1. Check if user already has an active verified admin document in Firestore
  try {
    const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));
    if (adminDoc.exists() && adminDoc.data()?.role === 'admin') {
      return true;
    }
  } catch (err) {
    console.warn('Note on checking admin document in Firestore:', err);
  }

  // 2. Attempt to synchronize/assert admin profile in Firestore.
  // In firestore.rules, "allow write: if isMasterAdmin();" guarantees that
  // Firestore itself evaluates whether request.auth.token.email is the Master Admin.
  // If authorized by Firestore Rules, the write succeeds!
  // If unauthorized, Firestore Rules reject the write with permission-denied.
  try {
    await setDoc(doc(db, 'admins', firebaseUser.uid), {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || 'TakeZon Admin',
      photoURL: firebaseUser.photoURL || null,
      role: 'admin',
      lastLogin: Date.now()
    }, { merge: true });

    return true;
  } catch {
    // Firestore rules rejected the write -> Unauthorized user
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
        const deniedMsg = 'এই Google account অনুমোদিত নয়।';
        setError(deniedMsg);
        throw new Error(deniedMsg);
      }

      setUser(result.user);
      setIsAdmin(true);
    } catch (err: any) {
      if (err.message === 'এই Google account অনুমোদিত নয়।' || err.message?.includes('অনুমোদিত নয়')) {
        setError('এই Google account অনুমোদিত নয়।');
      } else if (err.code === 'permission-denied' || err.message?.includes('permission-denied') || err.message?.includes('permission denied')) {
        setError('এই Google account অনুমোদিত নয়।');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('গুগল লগইন পপআপ উইন্ডো বন্ধ করা হয়েছে। পুনরায় চেষ্টা করুন।');
      } else if (err.code === 'auth/cancelled-popup-request') {
        // Ignored duplicate
      } else {
        const rawMsg = err.message || '';
        // If the error message contains any email pattern or Firebase auth code, mask it securely
        if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(rawMsg) || /auth\//.test(rawMsg)) {
          setError('এই Google account অনুমোদিত নয়।');
        } else {
          setError(rawMsg || 'গুগল সাইন-ইন সম্পন্ন করা যায়নি।');
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
