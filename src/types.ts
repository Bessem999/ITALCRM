export interface TestDriveReservation {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  vehicleId: string;
  vehicleModel: string;
  type: 'Test Drive (Essai)' | 'Visite Véhicule';
  date: string;
  timeSlot: string;
  assignedAgent: string;
  status: 'Confirmée' | 'En attente' | 'Terminée' | 'Annulée';
  notes?: string;
  createdAt: string;
}

export type ViewMode = 
  | 'dashboard' 
  | 'inventory' 
  | 'sales' 
  | 'leads' 
  | 'service' 
  | 'settings' 
  | 'users' 
  | 'login_card' 
  | 'login_split';

export interface Vehicle {
  id: string;
  model: string;
  category: 'SUV' | 'Berline' | 'Compacte' | 'Coupé' | 'Électrique' | 'Utilitaire';
  salePrice: number;
  costPrice: number;
  marginDt: number;
  marginPercent: number;
  stockCount: number;
  status: 'Disponible' | 'Réservé' | 'Vendu' | 'En transit';
  image: string;
  vin?: string;
  year: number;
  fuelType: 'Essence' | 'Diesel' | 'Hybride' | 'Électrique';
}

export interface OverdueInvoice {
  id: string;
  clientName: string;
  clientType: 'Entreprise' | 'Particulier';
  daysOverdue: number;
  amountDt: number;
  invoiceNumber: string;
  dueDate: string;
  status: 'En retard' | 'Relancé' | 'Payé';
}

export interface Lead {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  interestedModel: string;
  status: 'Nouveau' | 'Contacté' | 'Essai' | 'Négociation' | 'Gagné' | 'Perdu';
  estimatedValueDt: number;
  assignedAgent: string;
  createdAt: string;
  notes?: string;
}

export type UserRole = 'Admin' | 'Commercial' | 'CEO' | 'CFO';

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: boolean; // active = true, inactive = false
  avatar?: string;
  lastLogin?: string;
  department?: string;
}

export interface DealershipSettings {
  name: string;
  phone: string;
  address: string;
  contactEmail: string;
  website: string;
  timezone: string;
  currency: string;
  language: string;
}

export interface CashflowData {
  month: string;
  revenues: number;
  expenses: number;
}

export interface SaleTransaction {
  id: string;
  invoiceNo: string;
  clientName: string;
  vehicleModel: string;
  amountDt: number;
  date: string;
  status: 'Payée' | 'En attente' | 'En retard';
}

export interface QuickMessageLog {
  id: string;
  recipientName: string;
  recipientPhone: string;
  channel: 'whatsapp' | 'sms';
  templateType: string;
  messageText: string;
  sentAt: string;
  senderName: string;
  status: 'Envoyé' | 'Délivré' | 'Ouvert';
}
