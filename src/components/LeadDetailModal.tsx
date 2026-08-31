import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  Car, 
  Calendar, 
  Clock, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  Tag, 
  ArrowRight, 
  ShieldCheck, 
  Plus, 
  MessageSquare,
  Share2,
  Smartphone,
  Copy,
  Check,
  Send,
  ExternalLink
} from 'lucide-react';
import { Lead, Vehicle, TestDriveReservation } from '../types';
import { QuickMessageRecipient } from './QuickMessageModal';
import { getWhatsAppLink, getSmsLink, MESSAGE_TEMPLATES, fillTemplate } from '../utils/messaging';

interface LeadDetailModalProps {
  lead: Lead;
  vehicles: Vehicle[];
  reservations: TestDriveReservation[];
  onClose: () => void;
  onUpdateLeadStatus: (id: string, status: Lead['status']) => void;
  onOpenReserveModal: (vehicleId?: string, clientName?: string) => void;
  onOpenQuickMessage?: (recipient: QuickMessageRecipient) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  vehicles,
  reservations,
  onClose,
  onUpdateLeadStatus,
  onOpenReserveModal,
  onOpenQuickMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'history' | 'reservations' | 'messaging'>('details');
  const [newNote, setNewNote] = useState('');
  const [notesList, setNotesList] = useState<string[]>(
    lead.notes ? [lead.notes, 'Prospect très intéressé par le pack options confort.'] : ['A demandé un rappel pour révision du prix de reprise.']
  );
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const matchedVehicle = vehicles.find((v) => v.model === lead.interestedModel) || vehicles[0];
  const clientReservations = reservations.filter(
    (r) => r.clientName.toLowerCase().includes(lead.clientName.toLowerCase()) || r.email.toLowerCase() === lead.email.toLowerCase()
  );

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotesList([`${newNote.trim()} (${new Date().toLocaleDateString('fr-FR')} ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })})`, ...notesList]);
    setNewNote('');
  };

  const handleDirectWhatsApp = (text?: string) => {
    const message = text || `Bonjour ${lead.clientName}, je me permets de vous contacter concernant votre intérêt pour le modèle ${lead.interestedModel} chez ITALCAR.`;
    const link = getWhatsAppLink(lead.phone, message);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleDirectSms = (text?: string) => {
    const message = text || `Bonjour ${lead.clientName}, suite à votre demande sur le ${lead.interestedModel}, ITALCAR reste à votre disposition.`;
    const link = getSmsLink(lead.phone, message);
    window.open(link, '_self');
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const stages: Lead['status'][] = ['Nouveau', 'Contacté', 'Essai', 'Négociation', 'Gagné', 'Perdu'];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full modal-shadow border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150 my-auto max-h-[90vh] flex flex-col shadow-2xl">
        {/* Fixed Header */}
        <div className="flex justify-between items-start px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#001F3F] dark:bg-sky-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {lead?.clientName?.charAt(0) || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-[#000613] dark:text-white">{lead?.clientName || 'Client Prospect'}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  lead.status === 'Gagné' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300' :
                  lead.status === 'Perdu' ? 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300' :
                  lead.status === 'Négociation' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300' :
                  lead.status === 'Essai' ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300' :
                  'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                }`}>
                  {lead.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Prospect enregistré le {lead.createdAt} • Commercial : <strong className="text-slate-700 dark:text-slate-200">{lead.assignedAgent}</strong>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Quick Action WhatsApp in header */}
            <button
              onClick={() => handleDirectWhatsApp()}
              title="Envoyer un message WhatsApp"
              className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            {/* Quick Action SMS in header */}
            <button
              onClick={() => handleDirectSms()}
              title="Envoyer un SMS direct"
              className="p-2 bg-sky-50 hover:bg-sky-100 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-200 dark:border-sky-800 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">SMS</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Fermer la fenêtre"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pipeline Stage Tracker */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-850">
          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Avancement dans le Pipeline Commercial</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            {stages.map((stage) => {
              const isCurrent = lead.status === stage;
              return (
                <button
                  key={stage}
                  onClick={() => onUpdateLeadStatus(lead.id, stage)}
                  className={`py-1.5 px-1.5 rounded-lg text-center font-bold text-[11px] transition-all border cursor-pointer ${
                    isCurrent
                      ? 'bg-[#001F3F] dark:bg-sky-600 text-white border-[#001F3F] dark:border-sky-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                >
                  {stage}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Tabs inside Modal */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 text-xs font-bold overflow-x-auto shrink-0 bg-white dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-2.5 px-4 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'details' ? 'border-[#001F3F] dark:border-sky-500 text-[#001F3F] dark:text-sky-400 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Fiche Client & Véhicule
          </button>
          <button
            onClick={() => setActiveTab('messaging')}
            className={`py-2.5 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'messaging' ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>WhatsApp & SMS Rapide</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2.5 px-4 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'history' ? 'border-[#001F3F] dark:border-sky-500 text-[#001F3F] dark:text-sky-400 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Historique & Notes ({notesList.length})
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`py-2.5 px-4 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'reservations' ? 'border-[#001F3F] dark:border-sky-500 text-[#001F3F] dark:text-sky-400 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Essais & Visites Planifiées ({clientReservations.length})
          </button>
        </div>

        {/* Scrollable Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 text-xs">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Info */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <User className="w-4 h-4 text-[#001F3F]" />
                    <span>Coordonnées du Prospect</span>
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400">ID: {lead.id}</span>
                </div>

                <div className="space-y-2 text-slate-700">
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="font-bold text-slate-900">{lead.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDirectWhatsApp()}
                        className="p-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-md text-[10px] font-bold flex items-center gap-1"
                        title="Ouvrir WhatsApp"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </button>
                      <button
                        onClick={() => handleDirectSms()}
                        className="p-1 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-md text-[10px] font-bold flex items-center gap-1"
                        title="Ouvrir SMS"
                      >
                        <Smartphone className="w-3 h-3" />
                        <span>SMS</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold">{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>Budget Estimé : <strong className="text-emerald-700 font-bold">{lead.estimatedValueDt.toLocaleString()} DT</strong></span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <button
                    onClick={() => {
                      if (onOpenQuickMessage) {
                        onOpenQuickMessage({
                          name: lead.clientName,
                          phone: lead.phone,
                          type: 'lead',
                          model: lead.interestedModel,
                          amountDt: lead.estimatedValueDt,
                          agent: lead.assignedAgent
                        });
                      } else {
                        setActiveTab('messaging');
                      }
                    }}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-center transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Envoyer un message prédéfini (WhatsApp / SMS)</span>
                  </button>
                </div>
              </div>

              {/* Interested Vehicle Info */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#001F3F]" />
                  <span>Véhicule d'Intérêt</span>
                </h4>
                {matchedVehicle ? (
                  <div className="space-y-2">
                    <p className="font-extrabold text-slate-900 text-sm">{matchedVehicle.model}</p>
                    <p className="text-slate-600">Catégorie : <strong className="text-slate-800">{matchedVehicle.category}</strong></p>
                    <p className="text-slate-600">Prix Catalogue : <strong className="text-slate-800">{matchedVehicle.salePrice.toLocaleString()} DT</strong></p>
                    <p className="text-slate-600">Disponibilité : <span className="text-emerald-700 font-bold">{matchedVehicle.stockCount} en stock [{matchedVehicle.status}]</span></p>
                  </div>
                ) : (
                  <p className="text-slate-500 italic">{lead.interestedModel}</p>
                )}
              </div>
            </div>
          )}

          {/* Quick Messaging Tab */}
          {activeTab === 'messaging' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200/70 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                    <Share2 className="w-4 h-4 text-emerald-600" />
                    <span>Sélectionnez un modèle de message rapide pour {lead.clientName}</span>
                  </h4>
                  <p className="text-[11px] text-emerald-800/80 mt-0.5">
                    Le texte est généré instantanément avec les variables du prospect (modèle, commercial, budget).
                  </p>
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      if (onOpenQuickMessage) {
                        onOpenQuickMessage({
                          name: lead.clientName,
                          phone: lead.phone,
                          type: 'lead',
                          model: lead.interestedModel,
                          amountDt: lead.estimatedValueDt,
                          agent: lead.assignedAgent,
                        });
                      }
                    }}
                    className="bg-[#001F3F] text-white px-3 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1"
                  >
                    <span>Ouvrir Hub Complet</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {MESSAGE_TEMPLATES.map((tmpl) => {
                  const filledText = fillTemplate(tmpl.defaultText, {
                    client: lead.clientName,
                    modele: lead.interestedModel,
                    commercial: lead.assignedAgent,
                    montant: lead.estimatedValueDt,
                    concession: 'ITALCAR',
                  });

                  return (
                    <div
                      key={tmpl.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${tmpl.badgeColor}`}>
                          {tmpl.name}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopy(filledText, tmpl.id)}
                            className="p-1 text-slate-500 hover:text-slate-800 bg-white rounded border border-slate-200 text-[10px] font-semibold flex items-center gap-1"
                            title="Copier le message"
                          >
                            {copiedText === tmpl.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedText === tmpl.id ? 'Copié' : 'Copier'}</span>
                          </button>

                          <button
                            onClick={() => handleDirectWhatsApp(filledText)}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold flex items-center gap-1"
                          >
                            <Share2 className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </button>

                          <button
                            onClick={() => handleDirectSms(filledText)}
                            className="px-2 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-[10px] font-bold flex items-center gap-1"
                          >
                            <Smartphone className="w-3 h-3" />
                            <span>SMS</span>
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-700 bg-white p-2 rounded-lg border border-slate-200/80 leading-relaxed font-sans">
                        {filledText}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Ajouter un compte-rendu ou une remarque..."
                  className="flex-1 p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#001F3F]"
                />
                <button
                  type="submit"
                  className="bg-[#001F3F] text-white px-4 py-2.5 rounded-xl font-bold hover:bg-[#00142b] transition-colors"
                >
                  Ajouter
                </button>
              </form>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {notesList.map((note, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2 text-slate-700">
                    <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <p>{note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reservations' && (
            <div className="space-y-3">
              {clientReservations.length === 0 ? (
                <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <p className="text-slate-500 mb-3">Aucun essai sur route ni visite programmée pour ce prospect.</p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenReserveModal(matchedVehicle?.id, lead.clientName);
                    }}
                    className="bg-[#001F3F] text-white px-4 py-2 rounded-xl font-bold text-xs"
                  >
                    Planifier un Test Drive
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {clientReservations.map((res) => (
                    <div key={res.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-900">{res.type} — {res.vehicleModel}</span>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          {res.date} à {res.timeSlot} • Commercial : {res.assignedAgent}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {res.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Fixed Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0 bg-white dark:bg-slate-900 rounded-b-3xl">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenReserveModal(matchedVehicle?.id, lead.clientName);
              }}
              className="px-3.5 py-2 bg-sky-50 dark:bg-sky-950/80 text-[#001F3F] dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-bold rounded-xl hover:bg-sky-100 dark:hover:bg-sky-900 transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <Calendar className="w-4 h-4" />
              <span>Réserver Test Drive</span>
            </button>

            <button
              onClick={() => {
                if (onOpenQuickMessage) {
                  onOpenQuickMessage({
                    name: lead.clientName,
                    phone: lead.phone,
                    type: 'lead',
                    model: lead.interestedModel,
                    amountDt: lead.estimatedValueDt,
                    agent: lead.assignedAgent,
                  });
                }
              }}
              className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Relance WhatsApp / SMS</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#001F3F] dark:bg-sky-600 text-white font-bold rounded-xl hover:bg-[#00142b] dark:hover:bg-sky-700 transition-colors cursor-pointer text-xs shadow-sm"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
