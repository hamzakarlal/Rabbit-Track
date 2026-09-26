// Calculations and helper utilities for Rabbit Track

export const GESTATION_DAYS = 31; // Average rabbit gestation period (30-32 days)
export const WEANING_DAYS = 42; // ~6 weeks

/**
 * Calculates human-readable age from date of birth
 */
export function calculateAge(dobString: string): {
  totalDays: number;
  totalMonths: number;
  formatted: string;
} {
  if (!dobString) return { totalDays: 0, totalMonths: 0, formatted: 'Unknown' };
  
  const birth = new Date(dobString);
  const now = new Date();
  
  const diffTime = Math.max(0, now.getTime() - birth.getTime());
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const totalMonths = Math.floor(totalDays / 30.4375);
  
  if (totalDays < 30) {
    return {
      totalDays,
      totalMonths: 0,
      formatted: `${totalDays} ${totalDays === 1 ? 'day' : 'days'}`
    };
  }
  
  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;
  
  if (years === 0) {
    return {
      totalDays,
      totalMonths,
      formatted: `${totalMonths} ${totalMonths === 1 ? 'month' : 'months'}`
    };
  }
  
  return {
    totalDays,
    totalMonths,
    formatted: remainingMonths > 0 
      ? `${years}y ${remainingMonths}m` 
      : `${years} ${years === 1 ? 'year' : 'years'}`
  };
}

/**
 * Compute expected kindling date from breeding date
 */
export function calculateExpectedKindling(breedingDateStr: string): string {
  const d = new Date(breedingDateStr);
  d.setDate(d.getDate() + GESTATION_DAYS);
  return d.toISOString().split('T')[0];
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Calculate survival rate percentage
 */
export function calculateSurvivalRate(liveKits: number, totalKits: number): number {
  if (totalKits <= 0) return 0;
  return Math.min(100, Math.round((liveKits / totalKits) * 100));
}

/**
 * Check if a date is within N days from now (upcoming)
 */
export function isUpcoming(dateStr: string, withinDays: number = 7): boolean {
  if (!dateStr) return false;
  const target = new Date(dateStr);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= withinDays;
}

/**
 * Check if a date is overdue (in the past)
 */
export function isOverdue(dateStr: string): boolean {
  if (!dateStr) return false;
  const target = new Date(dateStr);
  const now = new Date();
  // Strip hours for date-only comparison
  target.setHours(0,0,0,0);
  now.setHours(0,0,0,0);
  return target.getTime() < now.getTime();
}
