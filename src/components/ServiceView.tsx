import React from 'react';
import { Wrench, Calendar, CheckCircle2, Clock, ShieldCheck, Car, Share2, Smartphone } from 'lucide-react';
import { QuickMessageRecipient } from './QuickMessageModal';
import { getWhatsAppLink, getSmsLink } from '../utils/messaging';

interface ServiceViewProps {
  onOpenQuickMessage?: (recipient: QuickMessageRecipient) => void;
}

export const ServiceView: React.FC<ServiceViewProps> = ({ onOpenQuickMessage }) => {
  const serviceAppointments = [
    { id: 'srv-1', client: 'Société Car Luxe', phone: '+216 98 123 456', car: 'SUV Premium X5', service: 'Révision 30 000 km', status: 'En cours', date: 'Aujourd\'hui 10:30', tech: 'Inès Ben Salem' },
    { id: 'srv-2', client: 'M. Mansour', phone: '+216 98 654 321', car: 'Compacte Hybride E2', service: 'Contrôle système hybride & batteries', status: 'Planifié', date: 'Demain 09:00', tech: 'Inès Ben Salem' },
    { id: 'srv-3', client: 'Cabinet Trabelsi', phone: '+216 97 888 999', car: 'Berline Executive V8', service: 'Changement plaquettes de frein', status: 'Terminé', date: 'Hier', tech: 'Atelier Central' },
  ];

  const handleNotifyClientWhatsApp = (app: typeof serviceAppointments[0]) => {
    const text = `Bonjour ${app.client}, votre véhicule ${app.car} a terminé son intervention (${app.service}) dans nos ateliers ITALCAR et est prêt à être récupéré.`;
    const link = getWhatsAppLink(app.phone, text);
    window.open(link, '_blank');
  };

  const handleNotifyClientSms = (app: typeof serviceAppointments[0]) => {
    const text = `ITALCAR SAV: Votre véhicule ${app.car} est prêt à être récupéré à la concession suite à ${app.service}.`;
    const link = getSmsLink(app.phone, text);
    window.open(link, '_self');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000613] dark:text-white tracking-tight">
            Service Après-Vente & Maintenance
          </h1>
          <p className="text-sm text-[#5c5f61] dark:text-slate-400 mt-1">
            Planification des interventions, entretien atelier et alertes clients par WhatsApp & SMS
          </p>
        </div>

        {onOpenQuickMessage && (
          <button
            onClick={() => onOpenQuickMessage({ name: '', phone: '', type: 'service' })}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Share2 className="w-4 h-4" />
            <span>Alerte Client Atelier (WhatsApp/SMS)</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 ambient-shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-100 dark:bg-sky-950/80 text-[#001F3F] dark:text-sky-300 rounded-xl"><Wrench className="w-5 h-5" /></div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Interventions du jour</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">8 véhicules</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 ambient-shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-xl"><CheckCircle2 className="w-5 h-5" /></div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Taux de satisfaction SAV</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">98.5%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 ambient-shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 rounded-xl"><ShieldCheck className="w-5 h-5" /></div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Garanties Constructeur</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">100% à jour</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 ambient-shadow p-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Rendez-vous Ateliers & Notifications Clients</h3>
        <div className="space-y-3">
          {serviceAppointments.map((app) => (
            <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 gap-3">
              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-[#001F3F] dark:text-sky-400" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{app.client} — {app.car}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{app.service} • Technicien : {app.tech}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3">
                <span className="text-xs text-slate-500 dark:text-slate-400">{app.date}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  app.status === 'Terminé' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300' :
                  app.status === 'En cours' ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                }`}>
                  {app.status}
                </span>

                {/* Quick WhatsApp & SMS Alerts */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      if (onOpenQuickMessage) {
                        onOpenQuickMessage({
                          name: app.client,
                          phone: app.phone,
                          type: 'service',
                          model: app.car,
                          notes: app.service,
                        });
                      } else {
                        handleNotifyClientWhatsApp(app);
                      }
                    }}
                    className="p-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    title="Notifier par WhatsApp"
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden md:inline">WhatsApp</span>
                  </button>

                  <button
                    onClick={() => handleNotifyClientSms(app)}
                    className="p-1.5 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    title="Notifier par SMS"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-sky-600" />
                    <span className="hidden md:inline">SMS</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
