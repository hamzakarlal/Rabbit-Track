import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  signOut,
  updateProfile,
  signInAnonymously
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../services/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  farmId: string;
  isDemoMode: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (data: { email: string; pass: string; fullName: string; farmName: string; farmLocation: string; phone?: string }) => Promise<void>;
  loginDemoFarmer: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_LOCAL_KEY = 'rabbit_track_demo_farmer';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem(DEMO_LOCAL_KEY) === 'true';
  });

  // Load user profile when auth state changes
  useEffect(() => {
    // If demo mode was previously active and no real user is signed in
    if (isDemoMode && !auth.currentUser) {
      const demoProfile: UserProfile = {
        uid: 'demo_farmer_guest',
        email: 'demo@rabbit-track.app',
        fullName: 'Dr. Gregory Finch',
        phoneNumber: '+1 (555) 234-8901',
        farmId: 'demo_farm_default',
        farmName: 'Highland Crest Rabbitry & Stud',
        farmLocation: 'Cloverdale, Oregon',
        farmDescription: 'Premier commercial meat breeding lines & purebred show rabbit genetics.',
        createdAt: new Date().toISOString()
      };
      setProfile(demoProfile);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsDemoMode(false);
        localStorage.removeItem(DEMO_LOCAL_KEY);
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            setProfile(snap.data() as UserProfile);
          } else {
            // Default profile if newly created
            const defaultFarmId = `farm_${currentUser.uid.slice(0, 8)}`;
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || 'farmer@rabbit-track.com',
              fullName: currentUser.displayName || 'Head Rabbit Farmer',
              phoneNumber: '+1 555-0192',
              farmId: defaultFarmId,
              farmName: 'Meadow Brook Rabbitry',
              farmLocation: 'Green Valley County',
              farmDescription: 'Specializing in commercial New Zealand & Californian breeding stock and meat kits.',
              photoUrl: currentUser.photoURL || undefined,
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
          }
        } catch (err) {
          console.error('Error fetching user profile from Firestore:', err);
          // Fallback offline mock profile
          setProfile({
            uid: currentUser.uid,
            email: currentUser.email || 'farmer@rabbit-track.com',
            fullName: currentUser.displayName || 'Rabbit Farmer',
            farmId: `farm_${currentUser.uid.slice(0, 8)}`,
            farmName: 'Meadow Brook Rabbitry',
            farmLocation: 'County Line',
            createdAt: new Date().toISOString()
          });
        }
      } else if (!isDemoMode) {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isDemoMode]);

  const login = async (email: string, pass: string) => {
    setIsDemoMode(false);
    localStorage.removeItem(DEMO_LOCAL_KEY);
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const loginWithGoogle = async () => {
    setIsDemoMode(false);
    localStorage.removeItem(DEMO_LOCAL_KEY);
    const cred = await signInWithPopup(auth, googleProvider);
    if (cred.user) {
      const userDocRef = doc(db, 'users', cred.user.uid);
      const snap = await getDoc(userDocRef);
      if (!snap.exists()) {
        const defaultFarmId = `farm_${cred.user.uid.slice(0, 8)}`;
        const newProfile: UserProfile = {
          uid: cred.user.uid,
          email: cred.user.email || '',
          fullName: cred.user.displayName || 'Rabbit Farmer',
          phoneNumber: '',
          farmId: defaultFarmId,
          farmName: `${cred.user.displayName ? cred.user.displayName.split(' ')[0] : 'Meadow'}'s Rabbitry`,
          farmLocation: 'Local Region',
          photoUrl: cred.user.photoURL || undefined,
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, newProfile);
        setProfile(newProfile);
      }
    }
  };

  const register = async (data: { email: string; pass: string; fullName: string; farmName: string; farmLocation: string; phone?: string }) => {
    setIsDemoMode(false);
    localStorage.removeItem(DEMO_LOCAL_KEY);
    const cred = await createUserWithEmailAndPassword(auth, data.email, data.pass);
    await updateProfile(cred.user, { displayName: data.fullName });
    
    const farmId = `farm_${cred.user.uid.slice(0, 8)}`;
    const newProfile: UserProfile = {
      uid: cred.user.uid,
      email: data.email,
      fullName: data.fullName,
      phoneNumber: data.phone || '',
      farmId,
      farmName: data.farmName || 'Rabbit Farm',
      farmLocation: data.farmLocation || 'Default Location',
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', cred.user.uid), newProfile);
    setProfile(newProfile);
  };

  const loginDemoFarmer = async () => {
    // First try anonymous auth if enabled on project; if not allowed by project config, smoothly enter Demo Farmer mode
    try {
      const cred = await signInAnonymously(auth);
      const farmId = `demo_farm_${cred.user.uid.slice(0, 6)}`;
      const demoProfile: UserProfile = {
        uid: cred.user.uid,
        email: 'demo@rabbit-track.app',
        fullName: 'Dr. Gregory Finch',
        phoneNumber: '+1 (555) 234-8901',
        farmId: farmId,
        farmName: 'Highland Crest Rabbitry & Stud',
        farmLocation: 'Cloverdale, Oregon',
        farmDescription: 'Premier commercial meat breeding lines & purebred show rabbit genetics.',
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', cred.user.uid), demoProfile);
      setProfile(demoProfile);
    } catch (e) {
      console.warn('Firebase anonymous auth not permitted in current project, entering local demo session:', e);
      // Seamlessly fall back to pre-configured local demo mode so user is never blocked
      setIsDemoMode(true);
      localStorage.setItem(DEMO_LOCAL_KEY, 'true');
      const demoProfile: UserProfile = {
        uid: 'demo_farmer_guest',
        email: 'demo@rabbit-track.app',
        fullName: 'Dr. Gregory Finch',
        phoneNumber: '+1 (555) 234-8901',
        farmId: 'demo_farm_default',
        farmName: 'Highland Crest Rabbitry & Stud',
        farmLocation: 'Cloverdale, Oregon',
        farmDescription: 'Premier commercial meat breeding lines & purebred show rabbit genetics.',
        createdAt: new Date().toISOString()
      };
      setProfile(demoProfile);
    }
  };

  const logout = async () => {
    setIsDemoMode(false);
    localStorage.removeItem(DEMO_LOCAL_KEY);
    if (auth.currentUser) {
      await signOut(auth);
    }
    setProfile(null);
    setUser(null);
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!profile) return;
    const updated = { ...profile, ...data };
    if (user) {
      await setDoc(doc(db, 'users', user.uid), updated, { merge: true });
    }
    setProfile(updated);
  };

  const farmId = profile?.farmId || (user ? `farm_${user.uid.slice(0, 8)}` : 'demo_farm_default');

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      farmId,
      isDemoMode,
      login,
      loginWithGoogle,
      register,
      loginDemoFarmer,
      logout,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

