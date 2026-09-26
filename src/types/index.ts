export type RabbitGender = 'male' | 'female';

export type RabbitStatus = 
  | 'Active'
  | 'Breeding'
  | 'Pregnant'
  | 'Sick'
  | 'Sold'
  | 'Deceased'
  | 'Retired';

export interface Rabbit {
  id: string;
  farmId: string;
  rabbitId: string; // User-facing ID e.g. "RT-001"
  earTag?: string;
  name: string;
  gender: RabbitGender;
  breed: string;
  color: string;
  dateOfBirth: string; // ISO format "YYYY-MM-DD"
  weight: number; // in kg
  status: RabbitStatus;
  cageNumber: string;
  farmSection?: string;
  fatherId?: string;
  motherId?: string;
  purchaseDate?: string;
  purchaseCost?: number;
  source?: string;
  photoUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type BreedingStatus = 'Active' | 'Successful' | 'Failed' | 'Kindled';

export interface BreedingRecord {
  id: string;
  farmId: string;
  buckId: string; // Father / Male Rabbit ID
  buckName: string;
  doeId: string; // Mother / Female Rabbit ID
  doeName: string;
  breedingDate: string; // ISO date
  expectedKindlingDate: string; // Breeding date + 31 days
  actualKindlingDate?: string;
  breedingMethod: 'Natural' | 'Artificial Insemination';
  attemptsCount: number;
  status: BreedingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KindlingRecord {
  id: string;
  farmId: string;
  breedingId?: string;
  doeId: string;
  doeName: string;
  buckId?: string;
  buckName?: string;
  kindlingDate: string;
  expectedDate?: string;
  totalKits: number;
  liveKits: number;
  stillbornKits: number;
  maleKits?: number;
  femaleKits?: number;
  nestCondition: 'Good' | 'Fair' | 'Poor';
  motherCondition: 'Excellent' | 'Good' | 'Weak' | 'Distressed';
  notes?: string;
  createdAt: string;
}

export type HealthSeverity = 'Healthy' | 'Sick' | 'Under Treatment' | 'Recovered' | 'Critical';

export interface HealthRecord {
  id: string;
  farmId: string;
  rabbitId: string;
  rabbitName: string;
  date: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  medicine: string;
  dosage: string;
  veterinarian?: string;
  treatmentStartDate: string;
  treatmentEndDate?: string;
  status: HealthSeverity;
  cost: number;
  notes?: string;
  createdAt: string;
}

export interface VaccinationRecord {
  id: string;
  farmId: string;
  rabbitId: string;
  rabbitName: string;
  vaccineName: string;
  dateAdministered: string;
  nextVaccinationDate: string;
  dose: string;
  batchNumber?: string;
  veterinarian?: string;
  cost: number;
  notes?: string;
  createdAt: string;
}

export type FeedType = 'Pellets' | 'Hay' | 'Greens' | 'Vegetables' | 'Grains' | 'Supplements' | 'Other';

export interface FeedingRecord {
  id: string;
  farmId: string;
  feedType: FeedType;
  quantity: number;
  unit: 'kg' | 'g' | 'bags' | 'bundles';
  costPerUnit: number;
  totalCost: number; // quantity * costPerUnit
  feedingDate: string;
  numberOfRabbits: number;
  targetGroup: string; // e.g. "All Rabbits", "Breeding Does", "Grower Pen A", or specific Rabbit ID
  notes?: string;
  createdAt: string;
}

export type ExpenseCategory = 
  | 'Feed'
  | 'Medicine'
  | 'Vaccination'
  | 'Equipment'
  | 'Cages'
  | 'Electricity'
  | 'Water'
  | 'Transportation'
  | 'Labor'
  | 'Maintenance'
  | 'Other';

export interface ExpenseRecord {
  id: string;
  farmId: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Mobile Money' | 'Card' | 'Other';
  receiptUrl?: string;
  notes?: string;
  createdAt: string;
}

export type InventoryCategory = 'Feed' | 'Medicines' | 'Equipment' | 'Supplements' | 'Other';

export interface InventoryItem {
  id: string;
  farmId: string;
  name: string;
  category: InventoryCategory;
  quantity: number;
  unit: string; // kg, liters, bottles, bags, pieces
  purchasePrice: number;
  supplier?: string;
  purchaseDate?: string;
  expiryDate?: string;
  minStockLevel: number;
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type SaleType = 'Meat Rabbit' | 'Breeding Stock' | 'Kit' | 'Pet' | 'Manure/Fur';
export type PaymentStatus = 'Paid' | 'Pending' | 'Partial';

export interface SaleRecord {
  id: string;
  farmId: string;
  rabbitId?: string; // If specific rabbit sold
  rabbitName?: string;
  rabbitCount: number; // 1 or more
  saleType: SaleType;
  customerName: string;
  customerPhone?: string;
  saleDate: string;
  weightKg?: number;
  pricePerKg?: number;
  totalPrice: number;
  paymentMethod: 'Cash' | 'Mobile Money' | 'Bank Transfer' | 'Card';
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
}

export interface FarmNotification {
  id: string;
  farmId: string;
  title: string;
  message: string;
  category: 'Vaccination' | 'Kindling' | 'Low Inventory' | 'Medicine Expiry' | 'Breeding' | 'Health' | 'Sale';
  targetType?: 'rabbit' | 'inventory' | 'breeding' | 'kindling';
  targetId?: string;
  date: string;
  isRead: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  farmId: string;
  farmName: string;
  farmLocation: string;
  farmDescription?: string;
  photoUrl?: string;
  createdAt: string;
}

export interface WeightRecord {
  id: string;
  rabbitId: string;
  date: string;
  weight: number; // in kg
  notes?: string;
}
