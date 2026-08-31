import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageSquare, 
  Send, 
  Copy, 
  Check, 
  ExternalLink, 
  Smartphone, 
  Car, 
  FileText, 
  CheckCircle2, 
  Wrench, 
  Sparkles, 
  History, 
  User, 
  Phone, 
  Calendar, 
  Clock, 
  DollarSign, 
  Info,
  ShieldCheck,
  ChevronRight,
  Share2
} from 'lucide-react';
import { Lead, OverdueInvoice, TestDriveReservation, UserAccount, QuickMessageLog } from '../types';
import { 
  MESSAGE_TEMPLATES, 
  MessageTemplate, 
  fillTemplate, 
  getWhatsAppLink, 
  getSmsLink, 
  formatPhoneForWhatsApp 
} from '../utils/messaging';

export interface QuickMessageRecipient {
  name: string;
  phone: string;
  type?: 'lead' | 'invoice' | 'reservation' | 'sav' | 'custom';
  model?: string;
  invoiceNo?: string;
  amountDt?: number;
  date?: string;
  timeSlot?: string;
  agent?: string;
}

interface QuickMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRecipient?: QuickMessageRecipient | null;
  currentUser?: UserAccount;
  leads?: Lead[];
  overdueInvoices?: OverdueInvoice[];
  reservations?: TestDriveReservation[];
  logs?: QuickMessageLog[];
  onAddLog?: (log: QuickMessageLog) => void;
}

export const QuickMessageModal: React.FC<QuickMessageModalProps> = ({
  isOpen,
  onClose,
  initialRecipient,
  currentUser,
  leads = [],
  overdueInvoices = [],
  reservations = [],
  logs = [],
  onAddLog,
}) => {
  if (!isOpen) return null;

  // Selected Channel
  const [channel, setChannel] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');

  // Recipient form state
  const [recipientName, setRecipientName] = useState<string>(initialRecipient?.name || '');
  const [recipientPhone, setRecipientPhone] = useState<string>(initialRecipient?.phone || '');
  const [model, setModel] = useState<string>(initialRecipient?.model || 'FIAT 500e');
  const [invoiceNo, setInvoiceNo] = useState<string>(initialRecipient?.invoiceNo || 'FAC-2024-089');
  const [amountDt, setAmountDt] = useState<string>(initialRecipient?.amountDt ? initialRecipient.amountDt.toString() : '45000');
  const [targetDate, setTargetDate] = useState<string>(initialRecipient?.date || new Date().toLocaleDateString('fr-FR'));
  const [targetTime, setTargetTime] = useState<string>(initialRecipient?.timeSlot || '10:00');
  const [agentName, setAgentName] = useState<string>(currentUser?.fullName || 'Conseiller ITALCAR');

  // Selected Template
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(() => {
    if (initialRecipient?.type === 'invoice') return 'facture_relance';
    if (initialRecipient?.type === 'reservation') return 'essai_confirmation';
    if (initialRecipient?.type === 'sav') return 'sav_pret';
    return 'essai_confirmation';
  });

  // Custom Message body
  const [customMessage, setCustomMessage] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Update variables and message when recipient or template changes
  useEffect(() => {
    if (initialRecipient) {
      setRecipientName(initialRecipient.name || '');
      setRecipientPhone(initialRecipient.phone || '');
      if (initialRecipient.model) setModel(initialRecipient.model);
      if (initialRecipient.invoiceNo) setInvoiceNo(initialRecipient.invoiceNo);
      if (initialRecipient.amountDt) setAmountDt(initialRecipient.amountDt.toString());
      if (initialRecipient.date) setTargetDate(initialRecipient.date);
      if (initialRecipient.timeSlot) setTargetTime(initialRecipient.timeSlot);
      if (initialRecipient.agent) setAgentName(initialRecipient.agent);

      if (initialRecipient.type === 'invoice') setSelectedTemplateId('facture_relance');
      else if (initialRecipient.type === 'reservation') setSelectedTemplateId('essai_confirmation');
      else if (initialRecipient.type === 'sav') setSelectedTemplateId('sav_pret');
    }
  }, [initialRecipient]);

  // Compute filled template message
  const activeTemplate = MESSAGE_TEMPLATES.find((t) => t.id === selectedTemplateId) || MESSAGE_TEMPLATES[0];

  useEffect(() => {
    const filled = fillTemplate(activeTemplate.defaultText, {
      client: recipientName || 'Client',
      modele: model || 'Véhicule',
      date: targetDate,
      heure: targetTime,
      commercial: agentName,
      facture: invoiceNo,
      montant: amountDt,
      concession: 'ITALCAR Concession',
    });
    setCustomMessage(filled);
  }, [selectedTemplateId, recipientName, model, targetDate, targetTime, agentName, invoiceNo, amountDt]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(customMessage);
    setCopied(true);
    showToast('Message copié dans le presse-papiers !');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    if (!recipientPhone.trim()) {
      showToast('Veuillez renseigner un numéro de téléphone.');
      return;
    }
    const link = getWhatsAppLink(recipientPhone, customMessage);
    window.open(link, '_blank', 'noopener,noreferrer');

    // Add to history log
    if (onAddLog) {
      onAddLog({
        id: `msg-${Date.now()}`,
        recipientName: recipientName || 'Destinataire',
        recipientPhone: recipientPhone,
        channel: 'whatsapp',
        templateType: activeTemplate.name,
        messageText: customMessage,
        sentAt: `Aujourd'hui ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
        senderName: currentUser?.fullName || 'Commercial',
        status: 'Envoyé',
      });
    }

    showToast('Redirection WhatsApp ouverte !');
  };

  const handleSendSms = () => {
    if (!recipientPhone.trim()) {
      showToast('Veuillez renseigner un numéro de téléphone.');
      return;
    }
    const link = getSmsLink(recipientPhone, customMessage);
    window.open(link, '_self');

    // Add to history log
    if (onAddLog) {
      onAddLog({
        id: `msg-${Date.now()}`,
        recipientName: recipientName || 'Destinataire',
        recipientPhone: recipientPhone,
        channel: 'sms',
        templateType: activeTemplate.name,
        messageText: customMessage,
        sentAt: `Aujourd'hui ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
        senderName: currentUser?.fullName || 'Commercial',
        status: 'Envoyé',
      });
    }

    showToast('Application SMS déclenchée !');
  };

  const handleSelectContactPreset = (type: 'lead' | 'invoice' | 'res', id: string) => {
    if (type === 'lead') {
      const l = leads.find((item) => item.id === id);
      if (l) {
        setRecipientName(l.clientName);
        setRecipientPhone(l.phone);
        setModel(l.interestedModel);
        setAmountDt(l.estimatedValueDt.toString());
        setAgentName(l.assignedAgent);
      }
    } else if (type === 'invoice') {
      const inv = overdueInvoices.find((item) => item.id === id);
      if (inv) {
        setRecipientName(inv.clientName);
        setRecipientPhone('+216 98 000 111');
        setInvoiceNo(inv.invoiceNumber);
        setAmountDt(inv.amountDt.toString());
        setTargetDate(inv.dueDate);
        setSelectedTemplateId('facture_relance');
      }
    } else if (type === 'res') {
      const r = reservations.find((item) => item.id === id);
      if (r) {
        setRecipientName(r.clientName);
        setRecipientPhone(r.phone);
        setModel(r.vehicleModel);
        setTargetDate(r.date);
        setTargetTime(r.timeSlot);
        setAgentName(r.assignedAgent);
        setSelectedTemplateId('essai_confirmation');
      }
    }
  };

  // Helper icons for template badges
  const getTemplateIcon = (iconName: string) => {
    switch (iconName) {
      case 'Car': return <Car className="w-4 h-4" />;
      case 'FileText': return <FileText className="w-4 h-4" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-4 h-4" />;
      case 'Wrench': return <Wrench className="w-4 h-4" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl max-w-4xl w-full p-5 sm:p-7 modal-shadow border border-slate-200 dark:border-[#333333] animate-in zoom-in-95 duration-150 my-6 max-h-[92vh] flex flex-col justify-between">
        
        {/* Modal Top Header */}
        <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-[#000613] dark:text-white tracking-tight">
                  Messagerie Rapide — WhatsApp & SMS
                </h3>
                <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Direct Live
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Envoi instantané de relances, confirmations d'essai et alertes clients sans quitter le CRM
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 py-2.5 shrink-0">
          <div className="flex gap-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab('compose')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'compose'
                  ? 'bg-[#001F3F] dark:bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Rédiger & Envoyer</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-[#001F3F] dark:bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Historique d'envoi ({logs.length})</span>
            </button>
          </div>

          {/* Channel Selector Toggle */}
          {activeTab === 'compose' && (
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setChannel('whatsapp')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  channel === 'whatsapp'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => setChannel('sms')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  channel === 'sms'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-sky-600'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>SMS Direct</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-y-auto py-4 pr-1 space-y-5">
          {toastMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{toastMessage}</span>
            </div>
          )}

          {activeTab === 'compose' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Left Column: Template Selection & Recipient Info (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Recipient Details Card */}
                <div className="bg-slate-50 dark:bg-[#2A2A2A] p-4 rounded-2xl border border-slate-200 dark:border-[#333333] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#001F3F] dark:text-sky-400" />
                      Destinataire
                    </span>

                    {/* Quick Preset Selector */}
                    {leads.length > 0 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) handleSelectContactPreset('lead', e.target.value);
                        }}
                        defaultValue=""
                        className="text-[11px] bg-white dark:bg-[#1E1E1E] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#333333] rounded-lg px-2 py-0.5 focus:outline-none cursor-pointer"
                      >
                        <option value="" disabled>Choisir un prospect...</option>
                        {leads.map((l) => (
                          <option key={l.id} value={l.id}>{l.clientName} ({l.phone})</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Nom Client</label>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="Ex: Sami Ben Ali"
                        className="w-full text-xs font-semibold p-2 bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#333333] rounded-xl focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Téléphone</label>
                      <input
                        type="text"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        placeholder="+216 98 123 456"
                        className="w-full text-xs font-semibold p-2 bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#333333] rounded-xl focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  {/* Context variables based on template */}
                  <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Paramètres dynamiques</span>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-500 dark:text-slate-400">Modèle</label>
                        <input
                          type="text"
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          className="w-full text-xs p-1.5 bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#333333] rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 dark:text-slate-400">Montant (DT)</label>
                        <input
                          type="text"
                          value={amountDt}
                          onChange={(e) => setAmountDt(e.target.value)}
                          className="w-full text-xs p-1.5 bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#333333] rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 dark:text-slate-400">Date Prévue</label>
                        <input
                          type="text"
                          value={targetDate}
                          onChange={(e) => setTargetDate(e.target.value)}
                          className="w-full text-xs p-1.5 bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#333333] rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 dark:text-slate-400">N° Facture / Réf</label>
                        <input
                          type="text"
                          value={invoiceNo}
                          onChange={(e) => setInvoiceNo(e.target.value)}
                          className="w-full text-xs p-1.5 bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#333333] rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Templates Selector List */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                    <span>Modèles de Message Prédéfinis</span>
                    <span className="text-[10px] text-slate-400">{MESSAGE_TEMPLATES.length} disponibles</span>
                  </label>

                  <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                    {MESSAGE_TEMPLATES.map((tmpl) => {
                      const isSelected = selectedTemplateId === tmpl.id;
                      return (
                        <button
                          key={tmpl.id}
                          onClick={() => setSelectedTemplateId(tmpl.id)}
                          className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${
                            isSelected
                              ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-400 dark:border-sky-600 shadow-2xs'
                              : 'bg-white dark:bg-[#2A2A2A] border-slate-200 dark:border-[#333333] hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg border ${tmpl.badgeColor} shrink-0 mt-0.5`}>
                            {getTemplateIcon(tmpl.icon)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{tmpl.name}</h4>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                              {tmpl.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Column: Live Message Preview & Direct Trigger (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#001F3F] dark:text-sky-400" />
                      <span>Aperçu du Message & Personnalisation</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">
                        {customMessage.length} caractères • ~{Math.ceil(customMessage.length / 160)} SMS
                      </span>
                    </div>
                  </div>

                  {/* Message editor box styled as a chat bubble */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    channel === 'whatsapp'
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-sky-50/40 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800/60'
                  }`}>
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center gap-2">
                        {channel === 'whatsapp' ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-extrabold flex items-center gap-1">
                            <span>WhatsApp Web / Mobile</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-sky-600 text-white text-[10px] font-extrabold flex items-center gap-1">
                            <span>SMS Téléphonique</span>
                          </span>
                        )}
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          Vers : <strong className="text-slate-900 dark:text-white">{recipientPhone || '(Non renseigné)'}</strong>
                        </span>
                      </div>

                      <button
                        onClick={handleCopyMessage}
                        className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 px-2 py-1 bg-white dark:bg-[#1E1E1E] rounded-lg border border-slate-200 dark:border-[#333333] transition-colors cursor-pointer"
                        title="Copier le texte"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                        <span>{copied ? 'Copié !' : 'Copier'}</span>
                      </button>
                    </div>

                    <textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      rows={6}
                      className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-100 focus:outline-none resize-y leading-relaxed font-sans"
                      placeholder="Tapez votre message ici..."
                    />

                    <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Message certifié conforme concessionnaire ITALCAR</span>
                      </div>
                      <span>{new Date().toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-2 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Send WhatsApp Button */}
                    <button
                      onClick={handleSendWhatsApp}
                      className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold py-3 px-4 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 text-xs cursor-pointer group"
                    >
                      <Share2 className="w-4 h-4 text-emerald-200 group-hover:scale-110 transition-transform" />
                      <span>Envoyer sur WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-200 ml-auto" />
                    </button>

                    {/* Send SMS Button */}
                    <button
                      onClick={handleSendSms}
                      className="bg-[#001F3F] dark:bg-sky-600 hover:bg-[#00142b] dark:hover:bg-sky-700 text-white font-extrabold py-3 px-4 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 text-xs cursor-pointer group"
                    >
                      <Smartphone className="w-4 h-4 text-sky-200 group-hover:scale-110 transition-transform" />
                      <span>Envoyer par SMS Direct</span>
                      <ExternalLink className="w-3.5 h-3.5 text-sky-200 ml-auto" />
                    </button>
                  </div>

                  <p className="text-[11px] text-center text-slate-400 dark:text-slate-500">
                    L'envoi ouvre directement l'application WhatsApp Web/Desktop ou le gestionnaire SMS par défaut de votre appareil.
                  </p>
                </div>

              </div>

            </div>
          ) : (
            /* History Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Journal des Relances & Communications Récentes
                </h4>
                <span className="text-xs text-slate-500">{logs.length} messages envoyés</span>
              </div>

              {logs.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 dark:bg-[#2A2A2A] rounded-2xl border border-dashed border-slate-200 dark:border-[#333333]">
                  <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">Aucun message n'a encore été envoyé.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 bg-slate-50 dark:bg-[#2A2A2A] rounded-2xl border border-slate-200 dark:border-[#333333] hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            log.channel === 'whatsapp'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                              : 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300'
                          }`}>
                            {log.channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}
                          </span>
                          <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100">{log.recipientName}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">({log.recipientPhone})</span>
                          <span className="text-[10px] text-slate-400 ml-auto sm:ml-0">• {log.templateType}</span>
                        </div>

                        <p className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1E1E1E] p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700/70">
                          {log.messageText}
                        </p>

                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span>Envoyé par : <strong className="text-slate-600 dark:text-slate-300">{log.senderName}</strong></span>
                          <span>• {log.sentAt}</span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                          {log.status}
                        </span>

                        <button
                          onClick={() => {
                            setRecipientName(log.recipientName);
                            setRecipientPhone(log.recipientPhone);
                            setCustomMessage(log.messageText);
                            setActiveTab('compose');
                          }}
                          className="text-[11px] font-bold text-[#001F3F] dark:text-sky-400 hover:underline cursor-pointer"
                        >
                          Renvoyer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Info className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">ITALCAR CRM Téléphonie & Messagerie Multi-Canal</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 dark:bg-[#2A2A2A] text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
