# 🐇 Rabbit Track — Track. Breed. Grow.

A full-fledged, production-ready rabbit farming management mobile application built with **React, TypeScript, Tailwind CSS, and Firebase (Cloud Firestore & Authentication)** with offline synchronization and real-time herd intelligence.

---

## 🌟 Key Features

1. **Dashboard & Farm Analytics:**
   - Real-time rabbit herd demographics (bucks, does, kits, weaners, pregnant does, sick rabbits).
   - Gestation countdown tracker with visual progress bars (31-day cycle).
   - Operating financial balance sheets: Gross sales, operating costs, net margins.
   - Care and alert summary (due vaccines, low stock supplies, sick animals).
   - Quick action bar for rapid 1-tap logging.

2. **Rabbit Registry & Pedigree:**
   - Detailed rabbit profiling (Rabbit ID, Ear Tag, Name, Gender, Breed, Color, DOB, Calculated Age, Weight).
   - Lineage linking (Sire / Father and Dam / Mother).
   - Multi-tab rabbit dossier: Overview, Breeding logs, Medical treatments, and Vaccinations.
   - Dynamic Ear Tag QR codes for rapid mobile cage scanning and physical tag printing.
   - Fast multi-attribute filtering (Status, Gender, Breed, Cage).

3. **Breeding & Kindling Module:**
   - Pair tracking with automatic 31-day expected kindling date calculation.
   - Prevents invalid pairings.
   - 1-click conversion from active pregnancy to recorded litter kindling.
   - Kit count logging: Total kits, live kits, stillborn kits, nest condition, mother condition, and litter survival rate.

4. **Health & Veterinary Care:**
   - Disease symptom logging, diagnosis, medication dosages, and veterinarian tracking.
   - Automatic cost sync to farm expenses.
   - Dedicated Vaccination tracker with automatic 6-month booster reminders and overdue alerts.

5. **Feeding & Inventory Synchronization:**
   - Portioned feed logs (Pellets, Hay, Greens, Grains, Supplements) with cost calculations ($/kg, total $/feeding, cost per rabbit).
   - Automated inventory deduction: recording a feed session deducts from matching inventory stock.
   - Safety stock thresholds with automated "Low Stock Alert" notifications.

6. **Sales & Commercial Transactions:**
   - Live weight pricing (Weight × Price/kg) or Fixed Price sales.
   - Automatic rabbit status update to "Sold" upon transaction completion.
   - Customer records, phone numbers, and payment status tracking.

7. **Farm Performance Reports:**
   - Executive financial statements and inventory asset valuation.
   - Breeding success rates and average litter sizes.
   - 1-click CSV export and print-ready report generation.

8. **Cloud & Offline Architecture:**
   - Firebase Authentication (Email/Password & 1-click Instant Demo Farmer).
   - Cloud Firestore with `persistentLocalCache` for multi-tab offline synchronization.
   - Production Firestore Security Rules (`firestore.rules`) enforcing strict user and farm isolation.

---

## 🚀 Running the Application

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Deploying Security Rules:**
   Rules are located in `firestore.rules` and protect each isolated farm path `farms/{farmId}/*`.

---

## 📊 Database Schema Structure

```
users/{userId}
  ├── uid
  ├── email
  ├── fullName
  ├── farmId
  ├── farmName
  └── farmLocation

farms/{farmId}
  ├── rabbits/{rabbitId}
  ├── breeding/{breedingId}
  ├── kindlings/{kindlingId}
  ├── healthRecords/{healthId}
  ├── vaccinations/{vaccinationId}
  ├── feeding/{feedingId}
  ├── expenses/{expenseId}
  ├── inventory/{inventoryId}
  ├── sales/{saleId}
  └── notifications/{notificationId}
```
