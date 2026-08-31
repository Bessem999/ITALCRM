import { QuickMessageLog } from '../types';

export const formatPhoneForWhatsApp = (rawPhone: string): string => {
  if (!rawPhone) return '';
  const digits = rawPhone.replace(/\D/g, '');
  if (!digits) return '';
  // If Tunisian local 8-digit number, prepend country code 216
  if (digits.length === 8) {
    return `216${digits}`;
  }
  return digits;
};

export const getWhatsAppLink = (phone: string, text: string): string => {
  const cleanPhone = formatPhoneForWhatsApp(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
};

export const getSmsLink = (phone: string, text: string): string => {
  const digits = phone.replace(/[^\d+]/g, '');
  return `sms:${digits}?body=${encodeURIComponent(text)}`;
};

export interface MessageTemplate {
  id: string;
  category: 'essai' | 'facture' | 'stock' | 'sav' | 'offre' | 'libre';
  name: string;
  description: string;
  icon: string;
  badgeColor: string;
  defaultText: string;
}

export const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: 'essai_confirmation',
    category: 'essai',
    name: 'Confirmation Test Drive',
    description: 'Confirmation de date, heure et modèle réservé pour un essai',
    icon: 'Car',
    badgeColor: 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    defaultText:
      'Bonjour {{client}}, votre rendez-vous pour l\'essai du {{modele}} chez ITALCAR est bien confirmé pour le {{date}} à {{heure}}. Notre conseiller {{commercial}} aura le plaisir de vous accueillir au showroom. À très bientôt !',
  },
  {
    id: 'facture_relance',
    category: 'facture',
    name: 'Relance Facture / Solde',
    description: 'Rappel courtois pour règlement de facture échue avec montant',
    icon: 'FileText',
    badgeColor: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    defaultText:
      'Bonjour {{client}}, nous vous informons que la facture n° {{facture}} d\'un montant de {{montant}} DT est actuellement en attente de règlement (échéance : {{date}}). Merci de procéder au paiement par virement ou au service caisse ITALCAR. Cordialement, Direction Financière.',
  },
  {
    id: 'stock_disponible',
    category: 'stock',
    name: 'Véhicule Disponible en Stock',
    description: 'Alerter le prospect que son modèle d\'intérêt est arrivé',
    icon: 'CheckCircle2',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    defaultText:
      'Bonjour {{client}}, excellente nouvelle ! Le modèle {{modele}} que vous avez sélectionné est désormais disponible en concession pour visite et essai immédiat. Souhaitez-vous bloquer un créneau avec notre conseiller commercial ?',
  },
  {
    id: 'sav_pret',
    category: 'sav',
    name: 'Véhicule Prêt en Atelier (SAV)',
    description: 'Aviser le client de la fin des travaux de maintenance',
    icon: 'Wrench',
    badgeColor: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    defaultText:
      'Bonjour {{client}}, les travaux d\'entretien sur votre {{modele}} sont terminés avec succès à l\'atelier ITALCAR. Votre véhicule est lavé, contrôlé et disponible pour restitution dès aujourd\'hui. Bonne route !',
  },
  {
    id: 'offre_devis',
    category: 'offre',
    name: 'Offre Commerciale & Financement',
    description: 'Envoi d\'une proposition tarifaire ou plan de leasing',
    icon: 'Sparkles',
    badgeColor: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    defaultText:
      'Bonjour {{client}}, suite à notre échange, nous avons le plaisir de vous transmettre notre meilleure proposition pour le {{modele}} (Prix : {{montant}} DT avec options et garantie étendue). N\'hésitez pas à nous solliciter pour tout ajustement de mensualité.',
  },
  {
    id: 'message_libre',
    category: 'libre',
    name: 'Message Personnalisé Libre',
    description: 'Rédiger un message direct sur mesure',
    icon: 'MessageSquare',
    badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700',
    defaultText:
      'Bonjour {{client}}, nous restons à votre entière disposition pour toute information complémentaire concernant votre projet automobile chez ITALCAR. Bien cordialement, {{commercial}}.',
  },
];

export const fillTemplate = (
  template: string,
  variables: {
    client?: string;
    modele?: string;
    date?: string;
    heure?: string;
    commercial?: string;
    facture?: string;
    montant?: string | number;
    concession?: string;
  }
): string => {
  let result = template;
  result = result.replace(/{{client}}/g, variables.client || 'Client');
  result = result.replace(/{{modele}}/g, variables.modele || 'Véhicule');
  result = result.replace(/{{date}}/g, variables.date || new Date().toLocaleDateString('fr-FR'));
  result = result.replace(/{{heure}}/g, variables.heure || '10:00');
  result = result.replace(/{{commercial}}/g, variables.commercial || 'Équipe Commerciale');
  result = result.replace(/{{facture}}/g, variables.facture || 'FAC-2024-XXX');
  result = result.replace(/{{montant}}/g, typeof variables.montant === 'number' ? variables.montant.toLocaleString() : (variables.montant || '0'));
  result = result.replace(/{{concession}}/g, variables.concession || 'ITALCAR Concession');
  return result;
};

// Initial mock logs for communications
export const INITIAL_MESSAGE_LOGS: QuickMessageLog[] = [
  {
    id: 'msg-1',
    recipientName: 'Sami Ben Ali',
    recipientPhone: '+216 98 123 456',
    channel: 'whatsapp',
    templateType: 'Confirmation Test Drive',
    messageText: 'Bonjour Sami Ben Ali, votre rendez-vous pour l\'essai du FIAT 500e La Prima Électrique chez ITALCAR est bien confirmé pour le 15/08/2026 à 10:00.',
    sentAt: 'Aujourd\'hui 09:15',
    senderName: 'Bessem (Commercial)',
    status: 'Ouvert',
  },
  {
    id: 'msg-2',
    recipientName: 'Entreprise Alpha',
    recipientPhone: '+216 20 444 888',
    channel: 'whatsapp',
    templateType: 'Relance Facture / Solde',
    messageText: 'Bonjour Entreprise Alpha, nous vous informons que la facture n° FAC-2024-089 d\'un montant de 45 000 DT est actuellement en attente de règlement.',
    sentAt: 'Hier 14:30',
    senderName: 'Mohamed (CFO)',
    status: 'Délivré',
  },
  {
    id: 'msg-3',
    recipientName: 'M. Mansour',
    recipientPhone: '+216 97 654 321',
    channel: 'sms',
    templateType: 'Véhicule Prêt en Atelier (SAV)',
    messageText: 'Bonjour M. Mansour, les travaux d\'entretien sur votre Compacte Hybride E2 sont terminés avec succès à l\'atelier ITALCAR. Votre véhicule est prêt.',
    sentAt: '12/08/2026 16:45',
    senderName: 'Atelier SAV',
    status: 'Délivré',
  },
];
