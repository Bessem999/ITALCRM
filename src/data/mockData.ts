import { Vehicle, OverdueInvoice, Lead, UserAccount, DealershipSettings, CashflowData, SaleTransaction, TestDriveReservation } from '../types';

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'v-1',
    model: 'FIAT 500e La Prima Électrique',
    category: 'Électrique',
    salePrice: 85000,
    costPrice: 72000,
    marginDt: 13000,
    marginPercent: 15.3,
    stockCount: 6,
    status: 'Disponible',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
    vin: 'ZFA33200001928374',
    year: 2024,
    fuelType: 'Électrique'
  },
  {
    id: 'v-2',
    model: 'FIAT Tipo Berline 1.4 Fire',
    category: 'Berline',
    salePrice: 62000,
    costPrice: 53000,
    marginDt: 9000,
    marginPercent: 14.5,
    stockCount: 8,
    status: 'Disponible',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    vin: 'ZFA35600008837482',
    year: 2024,
    fuelType: 'Essence'
  },
  {
    id: 'v-3',
    model: 'FIAT 600e Hybrid Red Edition',
    category: 'SUV',
    salePrice: 98000,
    costPrice: 84000,
    marginDt: 14000,
    marginPercent: 14.2,
    stockCount: 4,
    status: 'Disponible',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    vin: 'ZFA36400009918237',
    year: 2024,
    fuelType: 'Hybride'
  },
  {
    id: 'v-4',
    model: 'FIAT Fastback Abarth Turbo 1.3',
    category: 'Coupé',
    salePrice: 115000,
    costPrice: 98000,
    marginDt: 17000,
    marginPercent: 14.8,
    stockCount: 2,
    status: 'Réservé',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    vin: 'ZFA36300007738201',
    year: 2024,
    fuelType: 'Essence'
  },
  {
    id: 'v-5',
    model: 'FIAT Doblò Combi Maxi 1.5 HDi',
    category: 'Utilitaire',
    salePrice: 74000,
    costPrice: 63000,
    marginDt: 11000,
    marginPercent: 14.8,
    stockCount: 5,
    status: 'Disponible',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    vin: 'ZFA26300002293847',
    year: 2024,
    fuelType: 'Diesel'
  }
];

export const INITIAL_OVERDUE_INVOICES: OverdueInvoice[] = [
  {
    id: 'inv-101',
    clientName: 'Entreprise Alpha',
    clientType: 'Entreprise',
    daysOverdue: 15,
    amountDt: 45000,
    invoiceNumber: 'FAC-2024-089',
    dueDate: '21/07/2024',
    status: 'En retard'
  },
  {
    id: 'inv-102',
    clientName: 'M. Dupont',
    clientType: 'Particulier',
    daysOverdue: 8,
    amountDt: 12500,
    invoiceNumber: 'FAC-2024-094',
    dueDate: '28/07/2024',
    status: 'Relancé'
  },
  {
    id: 'inv-103',
    clientName: 'Société Beta',
    clientType: 'Entreprise',
    daysOverdue: 32,
    amountDt: 120000,
    invoiceNumber: 'FAC-2024-072',
    dueDate: '04/07/2024',
    status: 'En retard'
  },
  {
    id: 'inv-104',
    clientName: 'Sarl Car Luxe',
    clientType: 'Entreprise',
    daysOverdue: 19,
    amountDt: 68000,
    invoiceNumber: 'FAC-2024-085',
    dueDate: '17/07/2024',
    status: 'Relancé'
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    clientName: 'Sami Ben Ali',
    email: 'sami.benali@gmail.com',
    phone: '+216 98 123 456',
    interestedModel: 'SUV Premium X5',
    status: 'Négociation',
    estimatedValueDt: 250000,
    assignedAgent: 'Jean Dupont',
    createdAt: '01/08/2024',
    notes: 'Intéressé par une reprise de son ancien véhicule.'
  },
  {
    id: 'lead-2',
    clientName: 'Cabinet Trabelsi & Co',
    email: 'contact@trabelsi-law.tn',
    phone: '+216 71 888 999',
    interestedModel: 'Berline Executive V8',
    status: 'Essai',
    estimatedValueDt: 180000,
    assignedAgent: 'Sophie Martin',
    createdAt: '03/08/2024',
    notes: 'Essai planifié samedi à 10h.'
  },
  {
    id: 'lead-3',
    clientName: 'Amira Mansour',
    email: 'amira.m@hotmail.fr',
    phone: '+216 22 456 789',
    interestedModel: 'Compacte Hybride E2',
    status: 'Contacté',
    estimatedValueDt: 95000,
    assignedAgent: 'Karim Bouazizi',
    createdAt: '04/08/2024',
    notes: 'Demande d un devis personnalisé pour financement leasing.'
  },
  {
    id: 'lead-4',
    clientName: 'Transport Express TN',
    email: 'flotte@transport-express.tn',
    phone: '+216 31 111 222',
    interestedModel: 'Crossover Électrique EQ',
    status: 'Nouveau',
    estimatedValueDt: 330000,
    assignedAgent: 'Jean Dupont',
    createdAt: '05/08/2024',
    notes: 'Achats de flotte : 2 véhicules électriques.'
  }
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-1',
    fullName: 'Jean Dupont',
    email: 'admin@italcar.com',
    role: 'Admin',
    status: true,
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    lastLogin: 'Aujourd\'hui à 08:45',
    department: 'Administration & Accès'
  },
  {
    id: 'usr-2',
    fullName: 'Karim Bouazizi',
    email: 'commercial@italcar.com',
    role: 'Commercial',
    status: true,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    lastLogin: 'Aujourd\'hui à 09:12',
    department: 'Équipe Ventes'
  },
  {
    id: 'usr-3',
    fullName: 'Youssef Ben Ammar',
    email: 'ceo@italcar.com',
    role: 'CEO',
    status: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    lastLogin: 'Aujourd\'hui à 10:30',
    department: 'Direction Générale'
  },
  {
    id: 'usr-4',
    fullName: 'Hédi Mansouri',
    email: 'cfo@italcar.com',
    role: 'CFO',
    status: true,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    lastLogin: 'Hier à 16:45',
    department: 'Direction Financière'
  },
  {
    id: 'usr-5',
    fullName: 'Sophie Martin',
    email: 'sophie.martin@italcar.com',
    role: 'Commercial',
    status: true,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    lastLogin: 'Hier à 17:30',
    department: 'Équipe Ventes'
  }
];

export const INITIAL_SETTINGS: DealershipSettings = {
  name: 'ITALCAR',
  phone: '+216 71 000 000',
  address: 'Zone Industrielle Les Charguia II, Tunis',
  contactEmail: 'contact@italcar.com',
  website: 'https://www.italcar.com',
  timezone: 'Afrique/Tunis (CET)',
  currency: 'DT - Dinar Tunisien',
  language: 'Français'
};

export const CASHFLOW_6_MONTHS: CashflowData[] = [
  { month: 'Mars', revenues: 1850000, expenses: 1420000 },
  { month: 'Avril', revenues: 2100000, expenses: 1550000 },
  { month: 'Mai', revenues: 2350000, expenses: 1680000 },
  { month: 'Juin', revenues: 1950000, expenses: 1490000 },
  { month: 'Juillet', revenues: 2600000, expenses: 1780000 },
  { month: 'Août', revenues: 2450000, expenses: 1620000 }
];

export const CASHFLOW_THIS_YEAR: CashflowData[] = [
  { month: 'Jan', revenues: 1650000, expenses: 1300000 },
  { month: 'Fév', revenues: 1750000, expenses: 1380000 },
  { month: 'Mar', revenues: 1850000, expenses: 1420000 },
  { month: 'Avr', revenues: 2100000, expenses: 1550000 },
  { month: 'Mai', revenues: 2350000, expenses: 1680000 },
  { month: 'Juin', revenues: 1950000, expenses: 1490000 },
  { month: 'Juil', revenues: 2600000, expenses: 1780000 },
  { month: 'Août', revenues: 2450000, expenses: 1620000 }
];

export const INITIAL_SALES: SaleTransaction[] = [
  {
    id: 'sale-1',
    invoiceNo: 'FAC-2024-102',
    clientName: 'Sami Ben Ali',
    vehicleModel: 'SUV Premium X5',
    amountDt: 250000,
    date: '04/08/2024',
    status: 'Payée'
  },
  {
    id: 'sale-2',
    invoiceNo: 'FAC-2024-101',
    clientName: 'Sarl Car Luxe',
    vehicleModel: 'Berline Executive V8',
    amountDt: 180000,
    date: '02/08/2024',
    status: 'Payée'
  },
  {
    id: 'sale-3',
    invoiceNo: 'FAC-2024-099',
    clientName: 'Société Beta',
    vehicleModel: 'Compacte Hybride E2',
    amountDt: 95000,
    date: '29/07/2024',
    status: 'En retard'
  },
  {
    id: 'sale-4',
    invoiceNo: 'FAC-2024-098',
    clientName: 'Amira Mansour',
    vehicleModel: 'Crossover Électrique EQ',
    amountDt: 165000,
    date: '25/07/2024',
    status: 'En attente'
  }
];

export const INITIAL_RESERVATIONS: TestDriveReservation[] = [
  {
    id: 'res-1',
    clientName: 'Sami Ben Ali',
    phone: '+216 98 123 456',
    email: 'sami.benali@gmail.com',
    vehicleId: 'v-1',
    vehicleModel: 'SUV Premium X5',
    type: 'Test Drive (Essai)',
    date: '2024-08-08',
    timeSlot: '10:00',
    assignedAgent: 'Jean Dupont',
    status: 'Confirmée',
    notes: 'Essai sur route & vérification équipement intérieur.',
    createdAt: '05/08/2024'
  },
  {
    id: 'res-2',
    clientName: 'Cabinet Trabelsi',
    phone: '+216 71 888 999',
    email: 'contact@trabelsi-law.tn',
    vehicleId: 'v-2',
    vehicleModel: 'Berline Executive V8',
    type: 'Visite Véhicule',
    date: '2024-08-09',
    timeSlot: '14:30',
    assignedAgent: 'Sophie Martin',
    status: 'Confirmée',
    notes: 'Présentation de la finition cuir et essais des options.',
    createdAt: '04/08/2024'
  },
  {
    id: 'res-3',
    clientName: 'Amira Mansour',
    phone: '+216 22 456 789',
    email: 'amira.m@hotmail.fr',
    vehicleId: 'v-3',
    vehicleModel: 'Compacte Hybride E2',
    type: 'Test Drive (Essai)',
    date: '2024-08-10',
    timeSlot: '11:15',
    assignedAgent: 'Karim Bouazizi',
    status: 'En attente',
    notes: 'Demande de test drive en ville.',
    createdAt: '05/08/2024'
  }
];
