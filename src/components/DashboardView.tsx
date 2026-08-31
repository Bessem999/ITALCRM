import React, { useState } from 'react';
import { 
  TrendingUp, 
  Receipt, 
  Percent, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  ArrowUpRight,
  ChevronRight,
  Filter,
  DollarSign,
  Calendar,
  Car,
  Clock,
  Plus,
  UserCheck,
  FileText,
  Share2,
  Smartphone,
  AlertTriangle,
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { Vehicle, OverdueInvoice, TestDriveReservation } from '../types';
import { CASHFLOW_6_MONTHS, CASHFLOW_THIS_YEAR } from '../data/mockData';
import { QuickMessageRecipient } from './QuickMessageModal';
import { getWhatsAppLink, getSmsLink } from '../utils/messaging';

interface DashboardViewProps {
  vehicles: Vehicle[];
  overdueInvoices: OverdueInvoice[];
  reservations?: TestDriveReservation[];
  onSelectVehicle?: (v: Vehicle) => void;
  onNavigateToInvoices?: () => void;
  onOpenReserveModal?: () => void;
  onUpdateReservationStatus?: (id: string, newStatus: TestDriveReservation['status']) => void;
  onExportPdf?: () => void;
  onOpenQuickMessage?: (recipient: QuickMessageRecipient) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  vehicles,
  overdueInvoices,
  reservations = [],
  onSelectVehicle,
  onNavigateToInvoices,
  onOpenReserveModal,
  onUpdateReservationStatus,
  onExportPdf,
  onOpenQuickMessage,
}) => {
  const [timeframe, setTimeframe] = useState<'6m' | '1y'>('6m');
  const [remindedInvoices, setRemindedInvoices] = useState<Record<string, boolean>>({});
  const [showAllOverdueModal, setShowAllOverdueModal] = useState(false);

  const cashflowData = timeframe === '6m' ? CASHFLOW_6_MONTHS : CASHFLOW_THIS_YEAR;

  const handleSendReminder = (inv: OverdueInvoice) => {
    if (onOpenQuickMessage) {
      onOpenQuickMessage({
        name: inv.clientName,
        phone: '+216 98 000 111',
        type: 'invoice',
        invoiceNo: inv.invoiceNumber,
        amountDt: inv.amountDt,
        date: inv.dueDate,
      });
    } else {
      const text = `Bonjour ${inv.clientName}, la facture ${inv.invoiceNumber} (${inv.amountDt.toLocaleString()} DT) est échue depuis ${inv.daysOverdue} jours. Merci de régulariser auprès d'ITALCAR.`;
      const link = getWhatsAppLink('+216 98 000 111', text);
      window.open(link, '_blank');
    }
    setRemindedInvoices((prev) => ({ ...prev, [inv.id]: true }));
  };

  const handleReservationWhatsApp = (res: TestDriveReservation) => {
    const text = `Bonjour ${res.clientName}, nous confirmons votre ${res.type} pour le modèle ${res.vehicleModel} le ${res.date} à ${res.timeSlot} chez ITALCAR. Commercial référent: ${res.assignedAgent}.`;
    const link = getWhatsAppLink(res.phone, text);
    window.open(link, '_blank');
  };

  const handleReservationSms = (res: TestDriveReservation) => {
    const text = `ITALCAR: RDV ${res.type} confirmé le ${res.date} à ${res.timeSlot} (${res.vehicleModel}). Conseiller: ${res.assignedAgent}.`;
    const link = getSmsLink(res.phone, text);
    window.open(link, '_self');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#000613] dark:text-white tracking-tight">
            Direction Financière
          </h1>
          <p className="text-sm text-[#5c5f61] dark:text-slate-400 mt-1 font-normal">
            Aperçu des performances financières, de la trésorerie et actions de relances rapides.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenQuickMessage && (
            <button
              onClick={() => onOpenQuickMessage({ name: '', phone: '', type: 'custom' })}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-emerald-100" />
              <span>Messagerie Rapide (WhatsApp/SMS)</span>
            </button>
          )}

          {onExportPdf && (
            <button
              onClick={onExportPdf}
              className="bg-[#001F3F] dark:bg-sky-600 hover:bg-[#00142b] dark:hover:bg-sky-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <FileText className="w-4 h-4 text-sky-300" />
              <span>Exporter Rapport PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CA Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-[#e2e2e2] dark:border-slate-800 ambient-shadow hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-[#5c5f61] dark:text-slate-400 uppercase tracking-wider">
              Chiffre d'Affaires (Mois)
            </span>
            <div className="p-2 rounded-full bg-[#d3e4fe] dark:bg-sky-950/80 text-[#001F3F] dark:text-sky-300">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#000613] dark:text-white tracking-tight mb-2">
            2 450 000 DT
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 w-fit px-2 py-0.5 rounded-full">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12.5% vs mois précédent</span>
          </div>
        </div>

        {/* Factures en attente */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-[#e2e2e2] dark:border-slate-800 ambient-shadow hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-[#5c5f61] dark:text-slate-400 uppercase tracking-wider">
              Factures en Attente
            </span>
            <div className="p-2 rounded-full bg-[#d3e4fe] dark:bg-sky-950/80 text-[#001F3F] dark:text-sky-300">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#000613] dark:text-white tracking-tight mb-2">
            180 500 DT
          </div>
          <div className="text-xs font-medium text-[#5c5f61] dark:text-slate-400">
            5 factures échues à relancer
          </div>
        </div>

        {/* Marge Moyenne */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-[#e2e2e2] dark:border-slate-800 ambient-shadow hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-[#5c5f61] dark:text-slate-400 uppercase tracking-wider">
              Marge Moyenne Brute
            </span>
            <div className="p-2 rounded-full bg-[#d3e4fe] dark:bg-sky-950/80 text-[#001F3F] dark:text-sky-300">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#000613] dark:text-white tracking-tight mb-2">
            14.8%
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 w-fit px-2 py-0.5 rounded-full">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+0.8% vs objectif</span>
          </div>
        </div>

        {/* Taux de Recouvrement */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-[#e2e2e2] dark:border-slate-800 ambient-shadow hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-[#5c5f61] dark:text-slate-400 uppercase tracking-wider">
              Taux de Recouvrement
            </span>
            <div className="p-2 rounded-full bg-[#d3e4fe] dark:bg-sky-950/80 text-[#001F3F] dark:text-sky-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#000613] dark:text-white tracking-tight mb-3">
            94.2%
          </div>
          <div className="w-full bg-[#e8e8e8] dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#001F3F] dark:bg-sky-500 h-2 rounded-full transition-all duration-500"
              style={{ width: '94.2%' }}
            ></div>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flux de Trésorerie (Spans 2 columns) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-[#e2e2e2] dark:border-slate-800 ambient-shadow flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#000613] dark:text-white">Flux de Trésorerie</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Comparatif mensuel des revenus et dépenses</p>
            </div>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as '6m' | '1y')}
              className="bg-slate-50 dark:bg-slate-800 border border-[#c4c6cf] dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 px-3 py-1.5 focus:outline-none focus:border-[#001F3F] cursor-pointer"
            >
              <option value="6m">Derniers 6 mois</option>
              <option value="1y">Cette année</option>
            </select>
          </div>

          {/* Recharts Bar Chart */}
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashflowData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#94a3b8' }} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k DT`} 
                />
                <Tooltip 
                  formatter={(value: number) => [`${value.toLocaleString()} DT`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', borderColor: '#334155', color: '#f8fafc', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => value === 'revenues' ? 'Revenus' : 'Dépenses'}
                />
                <Bar dataKey="revenues" name="revenues" fill="#38bdf8" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="expenses" name="expenses" fill="#64748b" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Factures en Retard Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-[#e2e2e2] dark:border-slate-800 ambient-shadow flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-[#000613] dark:text-white">Factures en Retard</h2>
            <span className="text-xs font-semibold bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 px-2 py-0.5 rounded-full">
              {overdueInvoices.length} critiques
            </span>
          </div>

          <div className="flex-1 space-y-3">
            {overdueInvoices.slice(0, 3).map((inv) => {
              const isReminded = remindedInvoices[inv.id];
              return (
                <div
                  key={inv.id}
                  className="flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 transition-all"
                >
                  <div>
                    <div className="text-sm font-bold text-[#000613] dark:text-white">
                      {inv.clientName}
                    </div>
                    <div className="text-xs text-[#5c5f61] dark:text-slate-400">
                      {inv.daysOverdue} jours de retard • {inv.invoiceNumber}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-[#ba1a1a] dark:text-rose-400">
                      {inv.amountDt.toLocaleString()} DT
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <button
                        onClick={() => handleSendReminder(inv)}
                        className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800"
                        title="Relancer sur WhatsApp / SMS"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>{isReminded ? 'Relancé' : 'Relancer'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setShowAllOverdueModal(true)}
            className="w-full mt-6 bg-[#f3f3f4] dark:bg-slate-800 text-[#000613] dark:text-white border border-[#c4c6cf] dark:border-slate-700 rounded-full py-2.5 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Voir Tout ({overdueInvoices.length})
          </button>
        </div>
      </div>

      {/* Réservations Test Drives & Visites Véhicules */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-[#e2e2e2] dark:border-slate-800 ambient-shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#001F3F] dark:text-sky-400" />
              <h2 className="text-lg font-bold text-[#000613] dark:text-white">Réservations Client : Essais & Visites</h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Planning des test drives et confirmations directes WhatsApp & SMS</p>
          </div>

          {onOpenReserveModal && (
            <button
              onClick={onOpenReserveModal}
              className="bg-[#001F3F] dark:bg-sky-600 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-[#00142b] dark:hover:bg-sky-700 transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvelle Réservation Client</span>
            </button>
          )}
        </div>

        {reservations.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            Aucune réservation planifiée pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reservations.map((res) => {
              return (
                <div
                  key={res.id}
                  className="bg-slate-50/80 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700 hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mb-1 ${
                        res.type === 'Test Drive (Essai)' ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300'
                      }`}>
                        {res.type}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">{res.clientName}</h4>
                      <p className="text-xs font-semibold text-[#001F3F] dark:text-sky-400 mt-0.5 flex items-center gap-1">
                        <Car className="w-3.5 h-3.5 text-slate-500" />
                        {res.vehicleModel}
                      </p>
                    </div>

                    <select
                      value={res.status}
                      onChange={(e) => onUpdateReservationStatus && onUpdateReservationStatus(res.id, e.target.value as any)}
                      className={`text-[10px] font-bold px-2 py-1 rounded-full border cursor-pointer focus:outline-none ${
                        res.status === 'Confirmée'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300'
                          : res.status === 'En attente'
                          ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300'
                          : res.status === 'Terminée'
                          ? 'bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-700 dark:text-slate-300'
                          : 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/80 dark:text-red-300'
                      }`}
                    >
                      <option value="Confirmée">Confirmée</option>
                      <option value="En attente">En attente</option>
                      <option value="Terminée">Terminée</option>
                      <option value="Annulée">Annulée</option>
                    </select>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800 text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                    <div className="flex items-center justify-between font-medium">
                      <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-100">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {res.date}
                      </span>
                      <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {res.timeSlot}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                      Tél : <strong className="text-slate-700 dark:text-slate-200">{res.phone}</strong> • Commercial : <strong className="text-slate-700 dark:text-slate-200">{res.assignedAgent}</strong>
                    </p>

                    {/* Quick WhatsApp / SMS Confirmation Actions */}
                    <div className="flex items-center justify-end gap-1.5 pt-1">
                      <button
                        onClick={() => handleReservationWhatsApp(res)}
                        className="p-1 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer border border-emerald-200 dark:border-emerald-800"
                        title="Confirmer par WhatsApp"
                      >
                        <Share2 className="w-3 h-3 text-emerald-600" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        onClick={() => handleReservationSms(res)}
                        className="p-1 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 text-sky-800 dark:text-sky-300 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer border border-sky-200 dark:border-sky-800"
                        title="Confirmer par SMS"
                      >
                        <Smartphone className="w-3 h-3 text-sky-600" />
                        <span>SMS</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Analyse de Rentabilité par Véhicule */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-[#e2e2e2] dark:border-slate-800 ambient-shadow">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-[#000613] dark:text-white">Analyse de Rentabilité par Véhicule</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Aperçu direct des marges brutes sur le stock courant</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e2e2] dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
                <th className="py-3 px-4 text-xs font-semibold text-[#5c5f61] dark:text-slate-400 uppercase tracking-wider">
                  Modèle Véhicule
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#5c5f61] dark:text-slate-400 uppercase tracking-wider">
                  Prix Vente (DT)
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#5c5f61] dark:text-slate-400 uppercase tracking-wider">
                  Coût Achat (DT)
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#5c5f61] dark:text-slate-400 uppercase tracking-wider">
                  Marge Brute (DT)
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#5c5f61] dark:text-slate-400 uppercase tracking-wider">
                  Marge (%)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e2e2] dark:divide-slate-800 text-sm text-[#000613] dark:text-slate-200">
              {vehicles.map((v) => (
                <tr
                  key={v.id}
                  onClick={() => onSelectVehicle && onSelectVehicle(v)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-4 font-bold flex items-center gap-3">
                    <img
                      src={v.image}
                      alt={v.model}
                      className="w-10 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shadow-2xs group-hover:scale-105 transition-transform"
                    />
                    <span>{v.model}</span>
                  </td>
                  <td className="py-4 px-4 font-semibold">
                    {v.salePrice.toLocaleString()} DT
                  </td>
                  <td className="py-4 px-4 text-[#5c5f61] dark:text-slate-400">
                    {v.costPrice.toLocaleString()} DT
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-100">
                    {v.marginDt.toLocaleString()} DT
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                        v.marginPercent >= 15
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                      }`}
                    >
                      {v.marginPercent.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: All Overdue Invoices */}
      {showAllOverdueModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full modal-shadow border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150 my-auto max-h-[90vh] flex flex-col shadow-2xl">
            {/* Fixed Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#000613] dark:text-white">
                    Factures en Retard de Paiement ({overdueInvoices.length})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Relancez rapidement les débiteurs par message direct
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAllOverdueModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Fermer la fenêtre"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {overdueInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700 gap-3 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{inv.clientName}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      N° <span className="font-mono">{inv.invoiceNumber}</span> • Échéance : {inv.dueDate} (
                      <span className="text-amber-600 dark:text-amber-400 font-bold">{inv.daysOverdue} jours</span>)
                    </p>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                    <span className="text-sm font-extrabold text-red-600 dark:text-red-400">
                      {inv.amountDt.toLocaleString()} DT
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSendReminder(inv)}
                      className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Relance WhatsApp / SMS</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Fixed Footer */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0 bg-white dark:bg-slate-900 rounded-b-3xl">
              <button
                type="button"
                onClick={() => setShowAllOverdueModal(false)}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
