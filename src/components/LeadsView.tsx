import React, { useState } from 'react';
import { Lead, Vehicle, TestDriveReservation } from '../types';
import { 
  Users, 
  Plus, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle, 
  ArrowRight, 
  MessageSquare, 
  Eye, 
  Search, 
  Filter, 
  Car, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Grid, 
  List, 
  UserCheck,
  Share2,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { LeadDetailModal } from './LeadDetailModal';
import { QuickMessageRecipient } from './QuickMessageModal';
import { getWhatsAppLink, getSmsLink } from '../utils/messaging';

interface LeadsViewProps {
  leads: Lead[];
  vehicles?: Vehicle[];
  reservations?: TestDriveReservation[];
  onOpenNewLeadModal: () => void;
  onUpdateLeadStatus: (id: string, newStatus: Lead['status']) => void;
  onOpenReserveModal?: (vehicleId?: string, clientName?: string) => void;
  onOpenQuickMessage?: (recipient: QuickMessageRecipient) => void;
}

const STAGE_CONFIG: Record<Lead['status'], { label: string; color: string; badge: string; border: string }> = {
  'Nouveau': {
    label: 'Nouveau',
    color: 'bg-sky-500',
    badge: 'bg-sky-50 text-sky-800 border-sky-200',
    border: 'border-sky-300',
  },
  'Contacté': {
    label: 'Contacté',
    color: 'bg-indigo-500',
    badge: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    border: 'border-indigo-300',
  },
  'Essai': {
    label: 'Essai',
    color: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    border: 'border-amber-300',
  },
  'Négociation': {
    label: 'Négociation',
    color: 'bg-purple-500',
    badge: 'bg-purple-50 text-purple-800 border-purple-200',
    border: 'border-purple-300',
  },
  'Gagné': {
    label: 'Gagné',
    color: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    border: 'border-emerald-300',
  },
  'Perdu': {
    label: 'Perdu',
    color: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-800 border-rose-200',
    border: 'border-rose-300',
  },
};

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads,
  vehicles = [],
  reservations = [],
  onOpenNewLeadModal,
  onUpdateLeadStatus,
  onOpenReserveModal,
  onOpenQuickMessage,
}) => {
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string>('Tous');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  const stages: Lead['status'][] = ['Nouveau', 'Contacté', 'Essai', 'Négociation', 'Gagné', 'Perdu'];

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.interestedModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery);
    const matchesAgent = selectedAgent === 'Tous' || lead.assignedAgent === selectedAgent;
    return matchesSearch && matchesAgent;
  });

  // Calculate Metrics
  const totalLeadsCount = leads.length;
  const totalPipelineValue = leads.reduce((sum, l) => sum + l.estimatedValueDt, 0);
  const wonLeadsCount = leads.filter((l) => l.status === 'Gagné').length;
  const conversionRate = totalLeadsCount > 0 ? Math.round((wonLeadsCount / totalLeadsCount) * 100) : 0;
  const activeTestDrives = reservations.filter((r) => r.status === 'Confirmée' || r.status === 'En attente').length;

  const agents = ['Tous', ...Array.from(new Set(leads.map((l) => l.assignedAgent)))];

  const handleQuickWhatsApp = (e: React.MouseEvent, lead: Lead) => {
    e.stopPropagation();
    const text = `Bonjour ${lead.clientName}, suite à votre intérêt pour le modèle ${lead.interestedModel} chez ITALCAR, notre conseiller ${lead.assignedAgent} est à votre disposition pour organiser votre visite et essai.`;
    const link = getWhatsAppLink(lead.phone, text);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleQuickSms = (e: React.MouseEvent, lead: Lead) => {
    e.stopPropagation();
    const text = `Bonjour ${lead.clientName}, ITALCAR vous confirme la disponibilité du ${lead.interestedModel}. Contactez votre conseiller ${lead.assignedAgent}.`;
    const link = getSmsLink(lead.phone, text);
    window.open(link, '_self');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000613] dark:text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-[#001F3F] dark:text-sky-400" />
            Pipeline des Prospects & Leads
          </h1>
          <p className="text-xs sm:text-sm text-[#5c5f61] dark:text-slate-400 mt-0.5">
            Suivez et relancez vos opportunités commerciales via WhatsApp & SMS.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {onOpenQuickMessage && (
            <button
              onClick={() => onOpenQuickMessage({ name: '', phone: '', type: 'lead' })}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Messagerie Rapide (WhatsApp / SMS)</span>
            </button>
          )}

          {onOpenReserveModal && (
            <button
              onClick={() => onOpenReserveModal()}
              className="bg-white dark:bg-slate-900 text-[#001F3F] dark:text-sky-400 border border-[#001F3F] dark:border-sky-500 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Réserver Test Drive</span>
            </button>
          )}

          <button
            onClick={onOpenNewLeadModal}
            className="bg-[#001F3F] dark:bg-sky-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#00142b] dark:hover:bg-sky-700 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Prospect</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-sky-50 dark:bg-sky-950/60 text-[#001F3F] dark:text-sky-400 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Prospects</p>
            <p className="text-xl font-extrabold text-[#000613] dark:text-white">{totalLeadsCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Valeur Pipeline</p>
            <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400">{totalPipelineValue.toLocaleString()} DT</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Taux Conversion</p>
            <p className="text-xl font-extrabold text-[#000613] dark:text-white">{conversionRate}%</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Essais en cours</p>
            <p className="text-xl font-extrabold text-[#000613] dark:text-white">{activeTestDrives}</p>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filters & View Mode */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher nom, modèle, téléphone..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#001F3F]"
            />
          </div>

          {/* Commercial / Agent Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <UserCheck className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full sm:w-auto py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#001F3F] cursor-pointer"
            >
              <option value="Tous">Tous les Commerciaux</option>
              {agents.filter((a) => a !== 'Tous').map((agent) => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
            </select>
          </div>
        </div>

        {/* View Switcher Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-end md:self-auto">
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'kanban'
                ? 'bg-white dark:bg-slate-700 text-[#001F3F] dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Vue Kanban</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-700 text-[#001F3F] dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Vue Liste</span>
          </button>
        </div>
      </div>

      {/* Main View Display */}
      {viewMode === 'kanban' ? (
        /* Horizontal Scrollable Kanban Pipeline */
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin">
          {stages.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage);
            const stageConfig = STAGE_CONFIG[stage];
            const stageTotalValue = stageLeads.reduce((sum, l) => sum + l.estimatedValueDt, 0);

            return (
              <div
                key={stage}
                className="w-72 sm:w-80 shrink-0 bg-slate-50/90 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col h-full min-h-[480px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${stageConfig.color}`} />
                    <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      {stage}
                    </h3>
                  </div>
                  <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${stageConfig.badge}`}>
                    {stageLeads.length}
                  </span>
                </div>

                {/* Stage Value Subtotal */}
                <div className="mb-3 flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <span>Sous-total :</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{stageTotalValue.toLocaleString()} DT</span>
                </div>

                {/* Column Cards Container */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[650px] pr-0.5">
                  {stageLeads.length === 0 ? (
                    <div className="text-center py-12 px-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/40">
                      <p className="text-xs text-slate-400 font-medium">Aucun prospect à ce stade</p>
                    </div>
                  ) : (
                    stageLeads.map((lead) => {
                      const initials = lead.clientName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .substring(0, 2)
                        .toUpperCase();

                      return (
                        <div
                          key={lead.id}
                          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-3"
                        >
                          {/* Card Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-[#001F3F] dark:bg-sky-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                                {initials}
                              </div>
                              <div>
                                <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                                  {lead.clientName}
                                </h4>
                                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  {lead.phone}
                                </p>
                              </div>
                            </div>

                            {/* Quick 1-Click WhatsApp & SMS Icons */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => handleQuickWhatsApp(e, lead)}
                                title="Envoyer WhatsApp rapide"
                                className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-md transition-colors cursor-pointer"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleQuickSms(e, lead)}
                                title="Envoyer SMS rapide"
                                className="p-1 text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/60 rounded-md transition-colors cursor-pointer"
                              >
                                <Smartphone className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Vehicle & Budget Pill */}
                          <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-[#001F3F] dark:text-sky-400">
                              <Car className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span className="truncate">{lead.interestedModel}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60 dark:border-slate-700">
                              <span className="text-slate-500 dark:text-slate-400">Budget Estimé :</span>
                              <span className="font-black text-emerald-700 dark:text-emerald-400">{lead.estimatedValueDt.toLocaleString()} DT</span>
                            </div>
                          </div>

                          {/* Agent & Status Dropdown Row */}
                          <div className="flex items-center justify-between pt-1 gap-2 text-[11px]">
                            <span className="text-slate-500 dark:text-slate-400 font-medium truncate max-w-[110px]">
                              {lead.assignedAgent}
                            </span>
                            <select
                              value={lead.status}
                              onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as any)}
                              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg text-[10px] font-extrabold px-2 py-1 text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none"
                            >
                              {stages.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>

                          {/* Action Buttons Row */}
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <button
                              type="button"
                              onClick={() => setSelectedLeadForDetail(lead)}
                              className="py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-500" />
                              <span>Fiche Lead</span>
                            </button>

                            <button
                              type="button"
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
                                } else {
                                  setSelectedLeadForDetail(lead);
                                }
                              }}
                              className="py-1.5 px-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Share2 className="w-3 h-3 text-emerald-600" />
                              <span>Relancer</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View Mode */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                  <th className="py-3.5 px-4">Client / Prospect</th>
                  <th className="py-3.5 px-4">Téléphone / Email</th>
                  <th className="py-3.5 px-4">Modèle Souhaité</th>
                  <th className="py-3.5 px-4">Budget (DT)</th>
                  <th className="py-3.5 px-4">Commercial</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-4 text-right">Actions Rapides</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
                {filteredLeads.map((lead) => {
                  const stageConfig = STAGE_CONFIG[lead.status];
                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-slate-100">
                        {lead.clientName}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <span>{lead.phone}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">{lead.email}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#001F3F] dark:text-sky-400">
                        {lead.interestedModel}
                      </td>
                      <td className="py-3.5 px-4 font-black text-emerald-700 dark:text-emerald-400">
                        {lead.estimatedValueDt.toLocaleString()} DT
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600 dark:text-slate-400">
                        {lead.assignedAgent}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as any)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${stageConfig.badge}`}
                        >
                          {stages.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => handleQuickWhatsApp(e, lead)}
                            title="WhatsApp 1-clic"
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleQuickSms(e, lead)}
                            title="SMS 1-clic"
                            className="p-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedLeadForDetail(lead)}
                            className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Fiche</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Detail Lead */}
      {selectedLeadForDetail && (
        <LeadDetailModal
          lead={selectedLeadForDetail}
          vehicles={vehicles}
          reservations={reservations}
          onClose={() => setSelectedLeadForDetail(null)}
          onUpdateLeadStatus={onUpdateLeadStatus}
          onOpenReserveModal={onOpenReserveModal || (() => {})}
          onOpenQuickMessage={onOpenQuickMessage}
        />
      )}
    </div>
  );
};
