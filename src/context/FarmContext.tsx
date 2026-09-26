import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  writeBatch
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';
import { 
  Rabbit, 
  BreedingRecord, 
  KindlingRecord, 
  HealthRecord, 
  VaccinationRecord, 
  FeedingRecord, 
  ExpenseRecord, 
  InventoryItem, 
  SaleRecord, 
  FarmNotification 
} from '../types';
import { 
  getSampleRabbits, 
  getSampleBreeding, 
  getSampleKindling, 
  getSampleHealth, 
  getSampleVaccinations, 
  getSampleFeeding, 
  getSampleExpenses, 
  getSampleInventory, 
  getSampleSales, 
  getSampleNotifications 
} from '../utils/seedData';

interface FarmContextType {
  // Collections
  rabbits: Rabbit[];
  breedingRecords: BreedingRecord[];
  kindlingRecords: KindlingRecord[];
  healthRecords: HealthRecord[];
  vaccinations: VaccinationRecord[];
  feedingRecords: FeedingRecord[];
  expenses: ExpenseRecord[];
  inventory: InventoryItem[];
  sales: SaleRecord[];
  notifications: FarmNotification[];
  isLoading: boolean;

  // Rabbit CRUD
  addRabbit: (rabbit: Omit<Rabbit, 'id' | 'farmId' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateRabbit: (id: string, updates: Partial<Rabbit>) => Promise<void>;
  deleteRabbit: (id: string) => Promise<void>;

  // Breeding CRUD
  addBreedingRecord: (record: Omit<BreedingRecord, 'id' | 'farmId' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateBreedingRecord: (id: string, updates: Partial<BreedingRecord>) => Promise<void>;
  deleteBreedingRecord: (id: string) => Promise<void>;

  // Kindling CRUD
  addKindlingRecord: (record: Omit<KindlingRecord, 'id' | 'farmId' | 'createdAt'>) => Promise<string>;
  deleteKindlingRecord: (id: string) => Promise<void>;

  // Health CRUD
  addHealthRecord: (record: Omit<HealthRecord, 'id' | 'farmId' | 'createdAt'>) => Promise<string>;
  updateHealthRecord: (id: string, updates: Partial<HealthRecord>) => Promise<void>;
  deleteHealthRecord: (id: string) => Promise<void>;

  // Vaccination CRUD
  addVaccination: (record: Omit<VaccinationRecord, 'id' | 'farmId' | 'createdAt'>) => Promise<string>;
  deleteVaccination: (id: string) => Promise<void>;

  // Feeding CRUD
  addFeedingRecord: (record: Omit<FeedingRecord, 'id' | 'farmId' | 'createdAt'>) => Promise<string>;
  deleteFeedingRecord: (id: string) => Promise<void>;

  // Expense CRUD
  addExpense: (record: Omit<ExpenseRecord, 'id' | 'farmId' | 'createdAt'>) => Promise<string>;
  deleteExpense: (id: string) => Promise<void>;

  // Inventory CRUD
  addInventoryItem: (record: Omit<InventoryItem, 'id' | 'farmId' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => Promise<void>;
  deleteInventoryItem: (id: string) => Promise<void>;

  // Sale CRUD
  addSale: (record: Omit<SaleRecord, 'id' | 'farmId' | 'createdAt'>) => Promise<string>;
  deleteSale: (id: string) => Promise<void>;

  // Notifications
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;

  // Seed Data Trigger
  seedFarmData: () => Promise<void>;

  // Aggregated Stats
  stats: {
    totalRabbits: number;
    bucks: number;
    does: number;
    kits: number;
    pregnantDoes: number;
    sickRabbits: number;
    soldRabbits: number;
    activePregnancies: number;
    totalSales: number;
    totalExpenses: number;
    netProfit: number;
    feedExpense: number;
    medicineExpense: number;
    lowStockCount: number;
    upcomingVaccinationsCount: number;
    overdueVaccinationsCount: number;
  };
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { farmId, user, isDemoMode } = useAuth();

  const [rabbits, setRabbits] = useState<Rabbit[]>([]);
  const [breedingRecords, setBreedingRecords] = useState<BreedingRecord[]>([]);
  const [kindlingRecords, setKindlingRecords] = useState<KindlingRecord[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([]);
  const [feedingRecords, setFeedingRecords] = useState<FeedingRecord[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [notifications, setNotifications] = useState<FarmNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Firestore real-time listeners keyed to user's isolated farm: farms/{farmId}/*
  useEffect(() => {
    // If running in guest demo mode without cloud authentication, populate sample farm records directly in state
    if (isDemoMode && !user) {
      const demoFarmId = farmId || 'demo_farm_default';
      const rList = getSampleRabbits(demoFarmId).map((r, idx) => ({ id: `demo_r_${idx}`, ...r }));
      const bList = getSampleBreeding(demoFarmId).map((b, idx) => ({ id: `demo_b_${idx}`, ...b }));
      const kList = getSampleKindling(demoFarmId).map((k, idx) => ({ id: `demo_k_${idx}`, ...k }));
      const hList = getSampleHealth(demoFarmId).map((h, idx) => ({ id: `demo_h_${idx}`, ...h }));
      const vList = getSampleVaccinations(demoFarmId).map((v, idx) => ({ id: `demo_v_${idx}`, ...v }));
      const fList = getSampleFeeding(demoFarmId).map((f, idx) => ({ id: `demo_f_${idx}`, ...f }));
      const eList = getSampleExpenses(demoFarmId).map((e, idx) => ({ id: `demo_e_${idx}`, ...e }));
      const iList = getSampleInventory(demoFarmId).map((i, idx) => ({ id: `demo_i_${idx}`, ...i }));
      const sList = getSampleSales(demoFarmId).map((s, idx) => ({ id: `demo_s_${idx}`, ...s }));
      const nList = getSampleNotifications(demoFarmId).map((n, idx) => ({ id: `demo_n_${idx}`, ...n }));

      setRabbits(rList);
      setBreedingRecords(bList);
      setKindlingRecords(kList);
      setHealthRecords(hList);
      setVaccinations(vList);
      setFeedingRecords(fList);
      setExpenses(eList);
      setInventory(iList);
      setSales(sList);
      setNotifications(nList);
      setIsLoading(false);
      return;
    }

    if (!farmId || !user) {
      setRabbits([]);
      setBreedingRecords([]);
      setKindlingRecords([]);
      setHealthRecords([]);
      setVaccinations([]);
      setFeedingRecords([]);
      setExpenses([]);
      setInventory([]);
      setSales([]);
      setNotifications([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const unsubRabbits = onSnapshot(collection(db, 'farms', farmId, 'rabbits'), (snapshot) => {
      const items: Rabbit[] = [];
      snapshot.forEach((doc) => items.push({ id: doc.id, ...(doc.data() as any) }));
      setRabbits(items);
      setIsLoading(false);
    }, (err) => {
      console.warn('Rabbits snapshot listener notice:', err.message);
      setIsLoading(false);
    });

    const unsubBreeding = onSnapshot(collection(db, 'farms', farmId, 'breeding'), (snapshot) => {
      const items: BreedingRecord[] = [];
      snapshot.forEach((doc) => items.push({ id: doc.id, ...(doc.data() as any) }));
      setBreedingRecords(items);
    }, (err) => console.warn('Breeding error:', err.message));

    const unsubKindling = onSnapshot(collection(db, 'farms', farmId, 'kindlings'), (snapshot) => {
      const items: KindlingRecord[] = [];
      snapshot.forEach((doc) => items.push({ id: doc.id, ...(doc.data() as any) }));
      setKindlingRecords(items);
    }, (err) => console.warn('Kindling error:', err.message));

    const unsubHealth = onSnapshot(collection(db, 'farms', farmId, 'healthRecords'), (snapshot) => {
      const items: HealthRecord[] = [];
      snapshot.forEach((doc) => items.push({ id: doc.id, ...(doc.data() as any) }));
      setHealthRecords(items);
    }, (err) => console.warn('Health error:', err.message));

    const unsubVacc = onSnapshot(collection(db, 'farms', farmId, 'vaccinations'), (snapshot) => {
      const items: VaccinationRecord[] = [];
      snapshot.forEach((doc) => items.push({ id: doc.id, ...(doc.data() as any) }));
      setVaccinations(items);
    }, (err) => console.warn('Vaccinations error:', err.message));

    const unsubFeed = onSnapshot(collection(db, 'farms', farmId, 'feeding'), (snapshot) => {
      const items: FeedingRecord[] = [];
      snapshot.forEach((doc) => items.push({ id: doc.id, ...(doc.data() as any) }));
      setFeedingRecords(items);
    }, (err) => console.warn('Feeding error:', err.message));

    const unsubExp = onSnapshot(collection(db, 'farms', farmId, 'expenses'), (snapshot) => {
      const items: ExpenseRecord[] = [];
      snapshot.forEach((doc) => items.push({ id: doc.id, ...(doc.data() as any) }));
      setExpenses(items);
    }, (err) => console.warn('Expenses error:', err.message));

    const unsubInv = onSnapshot(collection(db, 'farms', farmId, 'inventory'), (snapshot) => {
      const items: InventoryItem[] = [];
      snapshot.forEach((doc) => items.push({ id: doc.id, ...(doc.data() as any) }));
      setInventory(items);
    }, (err) => console.warn('Inventory error:', err.message));

    const unsubSales = onSnapshot(collection(db, 'farms', farmId, 'sales'), (snapshot) => {
      const items: SaleRecord[] = [];
      snapshot.forEach((doc) => items.push({ id: doc.id, ...(doc.data() as any) }));
      setSales(items);
    }, (err) => console.warn('Sales error:', err.message));

    const unsubNotif = onSnapshot(collection(db, 'farms', farmId, 'notifications'), (snapshot) => {
      const items: FarmNotification[] = [];
      snapshot.forEach((doc) => items.push({ id: doc.id, ...(doc.data() as any) }));
      // Sort newest first
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setNotifications(items);
    }, (err) => console.warn('Notifications error:', err.message));

    return () => {
      unsubRabbits();
      unsubBreeding();
      unsubKindling();
      unsubHealth();
      unsubVacc();
      unsubFeed();
      unsubExp();
      unsubInv();
      unsubSales();
      unsubNotif();
    };
  }, [farmId, user]);

  // Seed sample data into Firestore if user initiates or brand new farm
  const seedFarmData = async () => {
    if (!farmId) return;
    try {
      const batch = writeBatch(db);
      
      const sampleRabbits = getSampleRabbits(farmId);
      for (const r of sampleRabbits) {
        const ref = doc(collection(db, 'farms', farmId, 'rabbits'));
        batch.set(ref, r);
      }

      const sampleBreedings = getSampleBreeding(farmId);
      for (const b of sampleBreedings) {
        const ref = doc(collection(db, 'farms', farmId, 'breeding'));
        batch.set(ref, b);
      }

      const sampleKindlings = getSampleKindling(farmId);
      for (const k of sampleKindlings) {
        const ref = doc(collection(db, 'farms', farmId, 'kindlings'));
        batch.set(ref, k);
      }

      const sampleHealths = getSampleHealth(farmId);
      for (const h of sampleHealths) {
        const ref = doc(collection(db, 'farms', farmId, 'healthRecords'));
        batch.set(ref, h);
      }

      const sampleVaccs = getSampleVaccinations(farmId);
      for (const v of sampleVaccs) {
        const ref = doc(collection(db, 'farms', farmId, 'vaccinations'));
        batch.set(ref, v);
      }

      const sampleFeeds = getSampleFeeding(farmId);
      for (const f of sampleFeeds) {
        const ref = doc(collection(db, 'farms', farmId, 'feeding'));
        batch.set(ref, f);
      }

      const sampleExps = getSampleExpenses(farmId);
      for (const e of sampleExps) {
        const ref = doc(collection(db, 'farms', farmId, 'expenses'));
        batch.set(ref, e);
      }

      const sampleInvs = getSampleInventory(farmId);
      for (const i of sampleInvs) {
        const ref = doc(collection(db, 'farms', farmId, 'inventory'));
        batch.set(ref, i);
      }

      const sampleSalesList = getSampleSales(farmId);
      for (const s of sampleSalesList) {
        const ref = doc(collection(db, 'farms', farmId, 'sales'));
        batch.set(ref, s);
      }

      const sampleNotifs = getSampleNotifications(farmId);
      for (const n of sampleNotifs) {
        const ref = doc(collection(db, 'farms', farmId, 'notifications'));
        batch.set(ref, n);
      }

      await batch.commit();
    } catch (err) {
      console.error('Error seeding demo data to Firestore:', err);
      throw err;
    }
  };

  // CRUD Operations
  const addRabbit = async (rabbit: Omit<Rabbit, 'id' | 'farmId' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    if (!user && isDemoMode) {
      const newId = `demo_r_${Date.now()}`;
      const item: Rabbit = { ...rabbit, id: newId, farmId, createdAt: now, updatedAt: now };
      setRabbits(prev => [item, ...prev]);
      return newId;
    }
    const docRef = await addDoc(collection(db, 'farms', farmId, 'rabbits'), {
      ...rabbit,
      farmId,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  };

  const updateRabbit = async (id: string, updates: Partial<Rabbit>) => {
    if (!user && isDemoMode) {
      setRabbits(prev => prev.map(r => r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r));
      return;
    }
    const docRef = doc(db, 'farms', farmId, 'rabbits', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  };

  const deleteRabbit = async (id: string) => {
    if (!user && isDemoMode) {
      setRabbits(prev => prev.filter(r => r.id !== id));
      return;
    }
    await deleteDoc(doc(db, 'farms', farmId, 'rabbits', id));
  };

  // Breeding CRUD
  const addBreedingRecord = async (record: Omit<BreedingRecord, 'id' | 'farmId' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    if (!user && isDemoMode) {
      const newId = `demo_b_${Date.now()}`;
      const item: BreedingRecord = { ...record, id: newId, farmId, createdAt: now, updatedAt: now };
      setBreedingRecords(prev => [item, ...prev]);
      if (record.doeId) {
        const doe = rabbits.find(r => r.rabbitId === record.doeId || r.id === record.doeId);
        if (doe) updateRabbit(doe.id, { status: 'Pregnant' });
      }
      return newId;
    }
    const docRef = await addDoc(collection(db, 'farms', farmId, 'breeding'), {
      ...record,
      farmId,
      createdAt: now,
      updatedAt: now,
    });

    // Automatically update the doe's status to Pregnant if successful attempt
    if (record.doeId) {
      const doe = rabbits.find(r => r.rabbitId === record.doeId || r.id === record.doeId);
      if (doe) {
        await updateRabbit(doe.id, { status: 'Pregnant' });
      }
    }

    // Auto-create a kindling notification reminder
    await addDoc(collection(db, 'farms', farmId, 'notifications'), {
      farmId,
      title: `Expected Kindling: ${record.doeName}`,
      message: `Doe ${record.doeName} (${record.doeId}) is expected to kindle on ${record.expectedKindlingDate}. Prepare nest box 3 days before.`,
      category: 'Kindling',
      targetType: 'rabbit',
      targetId: record.doeId,
      date: record.expectedKindlingDate,
      isRead: false,
      priority: 'high',
      createdAt: now,
    });

    return docRef.id;
  };

  const updateBreedingRecord = async (id: string, updates: Partial<BreedingRecord>) => {
    if (!user && isDemoMode) {
      setBreedingRecords(prev => prev.map(b => b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b));
      return;
    }
    const docRef = doc(db, 'farms', farmId, 'breeding', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  };

  const deleteBreedingRecord = async (id: string) => {
    if (!user && isDemoMode) {
      setBreedingRecords(prev => prev.filter(b => b.id !== id));
      return;
    }
    await deleteDoc(doc(db, 'farms', farmId, 'breeding', id));
  };

  // Kindling CRUD
  const addKindlingRecord = async (record: Omit<KindlingRecord, 'id' | 'farmId' | 'createdAt'>) => {
    const now = new Date().toISOString();
    if (!user && isDemoMode) {
      const newId = `demo_k_${Date.now()}`;
      const item: KindlingRecord = { ...record, id: newId, farmId, createdAt: now };
      setKindlingRecords(prev => [item, ...prev]);
      const doe = rabbits.find(r => r.rabbitId === record.doeId || r.id === record.doeId);
      if (doe) updateRabbit(doe.id, { status: 'Active' });
      return newId;
    }
    const docRef = await addDoc(collection(db, 'farms', farmId, 'kindlings'), {
      ...record,
      farmId,
      createdAt: now,
    });

    // If mother was marked pregnant, transition back to Active or Breeding
    const doe = rabbits.find(r => r.rabbitId === record.doeId || r.id === record.doeId);
    if (doe) {
      await updateRabbit(doe.id, { status: 'Active' });
    }

    // If linked breeding record exists, mark as Kindled
    if (record.breedingId) {
      const bRec = breedingRecords.find(b => b.id === record.breedingId);
      if (bRec) {
        await updateBreedingRecord(bRec.id, { 
          status: 'Kindled',
          actualKindlingDate: record.kindlingDate 
        });
      }
    }

    return docRef.id;
  };

  const deleteKindlingRecord = async (id: string) => {
    if (!user && isDemoMode) {
      setKindlingRecords(prev => prev.filter(k => k.id !== id));
      return;
    }
    await deleteDoc(doc(db, 'farms', farmId, 'kindlings', id));
  };

  // Health CRUD
  const addHealthRecord = async (record: Omit<HealthRecord, 'id' | 'farmId' | 'createdAt'>) => {
    const now = new Date().toISOString();
    if (!user && isDemoMode) {
      const newId = `demo_h_${Date.now()}`;
      const item: HealthRecord = { ...record, id: newId, farmId, createdAt: now };
      setHealthRecords(prev => [item, ...prev]);
      const rabbit = rabbits.find(r => r.rabbitId === record.rabbitId || r.id === record.rabbitId);
      if (rabbit && record.status === 'Sick') updateRabbit(rabbit.id, { status: 'Sick' });
      return newId;
    }
    const docRef = await addDoc(collection(db, 'farms', farmId, 'healthRecords'), {
      ...record,
      farmId,
      createdAt: now,
    });

    // Update rabbit status if sick
    const rabbit = rabbits.find(r => r.rabbitId === record.rabbitId || r.id === record.rabbitId);
    if (rabbit && record.status === 'Sick') {
      await updateRabbit(rabbit.id, { status: 'Sick' });
    } else if (rabbit && record.status === 'Recovered') {
      await updateRabbit(rabbit.id, { status: 'Active' });
    }

    // Also record medical expense if cost > 0
    if (record.cost > 0) {
      await addDoc(collection(db, 'farms', farmId, 'expenses'), {
        farmId,
        date: record.date,
        category: 'Medicine',
        description: `Treatment for ${record.rabbitName} (${record.medicine})`,
        amount: record.cost,
        paymentMethod: 'Cash',
        notes: `Prescribed by ${record.veterinarian || 'Veterinarian'}`,
        createdAt: now,
      });
    }

    return docRef.id;
  };

  const updateHealthRecord = async (id: string, updates: Partial<HealthRecord>) => {
    if (!user && isDemoMode) {
      setHealthRecords(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
      return;
    }
    const docRef = doc(db, 'farms', farmId, 'healthRecords', id);
    await updateDoc(docRef, updates);
  };

  const deleteHealthRecord = async (id: string) => {
    if (!user && isDemoMode) {
      setHealthRecords(prev => prev.filter(h => h.id !== id));
      return;
    }
    await deleteDoc(doc(db, 'farms', farmId, 'healthRecords', id));
  };

  // Vaccination CRUD
  const addVaccination = async (record: Omit<VaccinationRecord, 'id' | 'farmId' | 'createdAt'>) => {
    const now = new Date().toISOString();
    if (!user && isDemoMode) {
      const newId = `demo_v_${Date.now()}`;
      const item: VaccinationRecord = { ...record, id: newId, farmId, createdAt: now };
      setVaccinations(prev => [item, ...prev]);
      return newId;
    }
    const docRef = await addDoc(collection(db, 'farms', farmId, 'vaccinations'), {
      ...record,
      farmId,
      createdAt: now,
    });

    if (record.cost > 0) {
      await addDoc(collection(db, 'farms', farmId, 'expenses'), {
        farmId,
        date: record.dateAdministered,
        category: 'Vaccination',
        description: `Vaccine: ${record.vaccineName} for ${record.rabbitName}`,
        amount: record.cost,
        paymentMethod: 'Cash',
        createdAt: now,
      });
    }

    return docRef.id;
  };

  const deleteVaccination = async (id: string) => {
    if (!user && isDemoMode) {
      setVaccinations(prev => prev.filter(v => v.id !== id));
      return;
    }
    await deleteDoc(doc(db, 'farms', farmId, 'vaccinations', id));
  };

  // Feeding CRUD
  const addFeedingRecord = async (record: Omit<FeedingRecord, 'id' | 'farmId' | 'createdAt'>) => {
    const now = new Date().toISOString();
    if (!user && isDemoMode) {
      const newId = `demo_f_${Date.now()}`;
      const item: FeedingRecord = { ...record, id: newId, farmId, createdAt: now };
      setFeedingRecords(prev => [item, ...prev]);
      return newId;
    }
    const docRef = await addDoc(collection(db, 'farms', farmId, 'feeding'), {
      ...record,
      farmId,
      createdAt: now,
    });
    return docRef.id;
  };

  const deleteFeedingRecord = async (id: string) => {
    if (!user && isDemoMode) {
      setFeedingRecords(prev => prev.filter(f => f.id !== id));
      return;
    }
    await deleteDoc(doc(db, 'farms', farmId, 'feeding', id));
  };

  // Expenses CRUD
  const addExpense = async (record: Omit<ExpenseRecord, 'id' | 'farmId' | 'createdAt'>) => {
    const now = new Date().toISOString();
    if (!user && isDemoMode) {
      const newId = `demo_e_${Date.now()}`;
      const item: ExpenseRecord = { ...record, id: newId, farmId, createdAt: now };
      setExpenses(prev => [item, ...prev]);
      return newId;
    }
    const docRef = await addDoc(collection(db, 'farms', farmId, 'expenses'), {
      ...record,
      farmId,
      createdAt: now,
    });
    return docRef.id;
  };

  const deleteExpense = async (id: string) => {
    if (!user && isDemoMode) {
      setExpenses(prev => prev.filter(e => e.id !== id));
      return;
    }
    await deleteDoc(doc(db, 'farms', farmId, 'expenses', id));
  };

  // Inventory CRUD
  const addInventoryItem = async (record: Omit<InventoryItem, 'id' | 'farmId' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    if (!user && isDemoMode) {
      const newId = `demo_i_${Date.now()}`;
      const item: InventoryItem = { ...record, id: newId, farmId, createdAt: now, updatedAt: now };
      setInventory(prev => [item, ...prev]);
      return newId;
    }
    const docRef = await addDoc(collection(db, 'farms', farmId, 'inventory'), {
      ...record,
      farmId,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  };

  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
    if (!user && isDemoMode) {
      setInventory(prev => prev.map(i => i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i));
      return;
    }
    const docRef = doc(db, 'farms', farmId, 'inventory', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  };

  const deleteInventoryItem = async (id: string) => {
    if (!user && isDemoMode) {
      setInventory(prev => prev.filter(i => i.id !== id));
      return;
    }
    await deleteDoc(doc(db, 'farms', farmId, 'inventory', id));
  };

  // Sales CRUD
  const addSale = async (record: Omit<SaleRecord, 'id' | 'farmId' | 'createdAt'>) => {
    const now = new Date().toISOString();
    if (!user && isDemoMode) {
      const newId = `demo_s_${Date.now()}`;
      const item: SaleRecord = { ...record, id: newId, farmId, createdAt: now };
      setSales(prev => [item, ...prev]);
      if (record.rabbitId) {
        const rabbit = rabbits.find(r => r.rabbitId === record.rabbitId || r.id === record.rabbitId);
        if (rabbit) updateRabbit(rabbit.id, { status: 'Sold' });
      }
      return newId;
    }
    const docRef = await addDoc(collection(db, 'farms', farmId, 'sales'), {
      ...record,
      farmId,
      createdAt: now,
    });
    return docRef.id;
  };

  const deleteSale = async (id: string) => {
    if (!user && isDemoMode) {
      setSales(prev => prev.filter(s => s.id !== id));
      return;
    }
    await deleteDoc(doc(db, 'farms', farmId, 'sales', id));
  };

  // Notifications
  const markNotificationAsRead = async (id: string) => {
    if (!user && isDemoMode) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      return;
    }
    await updateDoc(doc(db, 'farms', farmId, 'notifications', id), { isRead: true });
  };

  const markAllNotificationsAsRead = async () => {
    if (!user && isDemoMode) {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      return;
    }
    const batch = writeBatch(db);
    notifications.filter(n => !n.isRead).forEach(n => {
      const ref = doc(db, 'farms', farmId, 'notifications', n.id);
      batch.update(ref, { isRead: true });
    });
    await batch.commit();
  };

  const deleteNotification = async (id: string) => {
    if (!user && isDemoMode) {
      setNotifications(prev => prev.filter(n => n.id !== id));
      return;
    }
    await deleteDoc(doc(db, 'farms', farmId, 'notifications', id));
  };

  // Computed Real-time KPIs
  const stats = useMemo(() => {
    const totalRabbits = rabbits.filter(r => r.status !== 'Deceased' && r.status !== 'Sold').length;
    const bucks = rabbits.filter(r => r.gender === 'male' && r.status !== 'Sold' && r.status !== 'Deceased').length;
    const does = rabbits.filter(r => r.gender === 'female' && r.status !== 'Sold' && r.status !== 'Deceased').length;
    const kits = rabbits.filter(r => {
      if (r.status === 'Sold' || r.status === 'Deceased') return false;
      if (!r.dateOfBirth) return false;
      const ageDays = (new Date().getTime() - new Date(r.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24);
      return ageDays <= 60; // 2 months or younger
    }).length;
    const pregnantDoes = rabbits.filter(r => r.status === 'Pregnant').length;
    const sickRabbits = rabbits.filter(r => r.status === 'Sick').length;
    const soldRabbits = rabbits.filter(r => r.status === 'Sold').length;

    const activePregnancies = breedingRecords.filter(b => b.status === 'Active').length;

    const totalSales = sales.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
    const totalExpenses = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const netProfit = totalSales - totalExpenses;

    const feedExpense = expenses.filter(e => e.category === 'Feed').reduce((acc, c) => acc + c.amount, 0);
    const medicineExpense = expenses.filter(e => e.category === 'Medicine' || e.category === 'Vaccination').reduce((acc, c) => acc + c.amount, 0);

    const lowStockCount = inventory.filter(i => i.quantity <= i.minStockLevel).length;

    const todayStr = new Date().toISOString().split('T')[0];
    const upcomingVaccinationsCount = vaccinations.filter(v => {
      if (!v.nextVaccinationDate) return false;
      const diff = (new Date(v.nextVaccinationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 14;
    }).length;

    const overdueVaccinationsCount = vaccinations.filter(v => {
      if (!v.nextVaccinationDate) return false;
      return new Date(v.nextVaccinationDate).getTime() < new Date(todayStr).getTime();
    }).length;

    return {
      totalRabbits,
      bucks,
      does,
      kits,
      pregnantDoes,
      sickRabbits,
      soldRabbits,
      activePregnancies,
      totalSales,
      totalExpenses,
      netProfit,
      feedExpense,
      medicineExpense,
      lowStockCount,
      upcomingVaccinationsCount,
      overdueVaccinationsCount,
    };
  }, [rabbits, breedingRecords, expenses, sales, inventory, vaccinations]);

  return (
    <FarmContext.Provider value={{
      rabbits,
      breedingRecords,
      kindlingRecords,
      healthRecords,
      vaccinations,
      feedingRecords,
      expenses,
      inventory,
      sales,
      notifications,
      isLoading,
      addRabbit,
      updateRabbit,
      deleteRabbit,
      addBreedingRecord,
      updateBreedingRecord,
      deleteBreedingRecord,
      addKindlingRecord,
      deleteKindlingRecord,
      addHealthRecord,
      updateHealthRecord,
      deleteHealthRecord,
      addVaccination,
      deleteVaccination,
      addFeedingRecord,
      deleteFeedingRecord,
      addExpense,
      deleteExpense,
      addInventoryItem,
      updateInventoryItem,
      deleteInventoryItem,
      addSale,
      deleteSale,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      deleteNotification,
      seedFarmData,
      stats,
    }}>
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
};
