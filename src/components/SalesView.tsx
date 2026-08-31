import React, { useState } from 'react';
import { SaleTransaction } from '../types';
import { CreditCard, FileText, CheckCircle2, Clock, AlertTriangle, Plus, Search, ArrowUpDown, Share2, Smartphone } from 'lucide-react';
import { QuickMessageRecipient } from './QuickMessageModal';
import { getWhatsAppLink, getSmsLink } from '../utils/messaging';

interface SalesViewProps {
  sales: SaleTransaction[];
  onAddSale: (s: SaleTransaction) => void;
  onExportPdf?: () => void;
  onOpenQuickMessage?: (recipient: QuickMessageRecipient) => void;
}

export const SalesView: React.FC<SalesViewProps> = ({ sales, onAddSale, onExportPdf, onOpenQuickMessage }) => {
  const [filterStatus, setFilterStatus] = useState<string>('Tous');
  const [search, setSearch] = useState('');
  const [amountSort, setAmountSort] = useState<'none' | 'asc' | 'desc'>('none');

  const filteredSales = sales.filter((s) => {
    const matchesSearch = s.clientName.toLowerCase().includes(search.toLowerCase()) || 
                          s.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
                          s.vehicleModel.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'Tous' || s.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedSales = [...filteredSales].sort((a, b) => {
    if (amountSort === 'asc') return a.amountDt - b.amountDt;
    if (amountSort === 'desc') return b.amountDt - a.amountDt;
    return 0;
  });

  const totalVolume = sales.reduce((acc, s) => acc + s.amountDt, 0);

  const handleInvoiceWhatsApp = (sale: SaleTransaction) => {
    const text = `Bonjour ${sale.clientName}, nous vous rappelons que la facture n° ${sale.invoiceNo} concernant le véhicule ${sale.vehicleModel} pour un montant de ${sale.amountDt.toLocaleString()} DT est actuellement en attente de règlement. Merci de contacter la comptabilité ITALCAR.`;
    const link = getWhatsAppLink('+216 98 000 111', text);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleInvoiceSms = (sale: SaleTransaction) => {
    const text = `Rappel ITALCAR: Facture ${sale.invoiceNo} (${sale.amountDt.toLocaleString()} DT) en attente. Merci de régulariser votre solde.`;
    const link = getSmsLink('+216 98 000 111', text);
    window.open(link, '_self');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000613] dark:text-white tracking-tight">
            Gestion des Ventes & Facturation
          </h1>
          <p className="text-sm text-[#5c5f61] dark:text-slate-400 mt-1">
            Suivi des transactions, factures acquittées et relances clients directes
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {onOpenQuickMessage && (
            <button
              onClick={() => onOpenQuickMessage({ name: '', phone: '', type: 'invoice' })}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-2xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <Share2 className="w-4 h-4" />
              <span>Relance Facture (WhatsApp/SMS)</span>
            </button>
          )}

          {onExportPdf && (
            <button
              onClick={onExportPdf}
              className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-4 py-2 rounded-2xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#001F3F] dark:text-sky-400" />
              <span>Exporter PDF</span>
            </button>
          )}
          <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-[#001F3F] dark:text-sky-400">
            Volume total : <span className="text-emerald-700 dark:text-emerald-400 text-sm font-extrabold">{totalVolume.toLocaleString()} DT</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#e2e2e2] dark:border-slate-800 ambient-shadow flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher facture, client, modèle..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-slate-100 focus:outline-none focus:border-[#001F3F]"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1 px-2 text-slate-500 text-xs font-bold shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#001F3F] dark:text-sky-400" />
              <span className="hidden sm:inline">Tri montant :</span>
            </div>
            <select
              value={amountSort}
              onChange={(e) => setAmountSort(e.target.value as 'none' | 'asc' | 'desc')}
              className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="none">Par défaut</option>
              <option value="asc">Montant : Croissant (▲)</option>
              <option value="desc">Montant : Décroissant (▼)</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
          {['Tous', 'Payée', 'En attente', 'En retard'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-[#001F3F] dark:bg-sky-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#e2e2e2] dark:border-slate-800 ambient-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e2e2] dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
                <th className="py-3 px-4 text-xs font-semibold text-[#5c5f61] dark:text-slate-400 uppercase tracking-wider">Facture</th>
                <th className="py-3 px-4 text-xs font-semibold text-[#5c5f61] dark:text-slate-400 uppercase tracking-wider">Client</th>
                <th className="py-3 px-4 text-xs font-semibold text-[#5c5f61] dark:text-slate-400 uppercase tracking-wider">Véhicule</th>
                <th className="py-3 px-4 text-xs font-semibold text-[#5c5f61] dark:text-slate-400 uppercase tracking-wider">Montant (DT)</th>
                <th className="py-3 px-4 text-xs font-semibold text-[#5c5f61] dark:text-slate-400 uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 text-xs font-semibold text-[#5c5f61] dark:text-slate-400 uppercase tracking-wider">Statut</th>
                <th className="py-3 px-4 text-xs font-semibold text-[#5c5f61] dark:text-slate-400 uppercase tracking-wider text-right">Relance Rapide</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e2e2] dark:divide-slate-800 text-sm text-[#000613] dark:text-slate-200">
              {sortedSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-4 font-bold text-[#001F3F] dark:text-sky-400 font-mono text-xs">{sale.invoiceNo}</td>
                  <td className="py-4 px-4 font-bold">{sale.clientName}</td>
                  <td className="py-4 px-4 text-slate-700 dark:text-slate-300">{sale.vehicleModel}</td>
                  <td className="py-4 px-4 font-extrabold text-slate-900 dark:text-white">{sale.amountDt.toLocaleString()} DT</td>
                  <td className="py-4 px-4 text-slate-500 dark:text-slate-400 text-xs">{sale.date}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        sale.status === 'Payée'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                          : sale.status === 'En attente'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300'
                      }`}
                    >
                      {sale.status === 'Payée' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {sale.status === 'En attente' && <Clock className="w-3.5 h-3.5" />}
                      {sale.status === 'En retard' && <AlertTriangle className="w-3.5 h-3.5" />}
                      <span>{sale.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {sale.status !== 'Payée' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            if (onOpenQuickMessage) {
                              onOpenQuickMessage({
                                name: sale.clientName,
                                phone: '+216 98 000 111',
                                type: 'invoice',
                                invoiceNo: sale.invoiceNo,
                                amountDt: sale.amountDt,
                                model: sale.vehicleModel,
                              });
                            } else {
                              handleInvoiceWhatsApp(sale);
                            }
                          }}
                          className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                          title="Relancer sur WhatsApp"
                        >
                          <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </button>

                        <button
                          onClick={() => handleInvoiceSms(sale)}
                          className="px-2.5 py-1 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                          title="Relancer par SMS"
                        >
                          <Smartphone className="w-3.5 h-3.5 text-sky-600" />
                          <span className="hidden sm:inline">SMS</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Acquittée</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
