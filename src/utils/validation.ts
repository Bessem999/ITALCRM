// Input validation utilities (Contrôle de saisie)

export const isValidEmail = (email: string): boolean => {
  if (!email || email.trim() === '') return true; // Optional emails handled separately
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
};

export const isValidRequiredEmail = (email: string): boolean => {
  if (!email || email.trim() === '') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
};

export const isValidPhone = (phone: string): boolean => {
  if (!phone || phone.trim() === '' || phone.trim() === '+216') return false;
  // Allows Tunisian phone numbers (+216 20 000 000, 20000000) or standard international format
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  return cleaned.length >= 8 && /^\d+$/.test(cleaned);
};

export const isValidName = (name: string): boolean => {
  return typeof name === 'string' && name.trim().length >= 3;
};

export const isValidVin = (vin: string): boolean => {
  if (!vin || vin.trim().length < 8) return false;
  return /^[A-HJ-NPR-Z0-9]+$/i.test(vin.trim());
};

export const isFutureOrTodayDate = (dateStr: string): boolean => {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inputDate = new Date(dateStr);
  return inputDate >= today;
};
