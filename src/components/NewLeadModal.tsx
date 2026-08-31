import React, { useState } from 'react';
import { X, UserPlus, Phone, Mail, Car, DollarSign, AlertCircle } from 'lucide-react';
import { Lead, Vehicle } from '../types';
import { isValidName, isValidPhone, isValidEmail } from '../utils/validation';

interface NewLeadModalProps {
  onClose: () => void;
  onAddLead: (lead: Lead) => void;
  availableVehicles: Vehicle[];
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({
  onClose,
  onAddLead,
  availableVehicles,
}) => {
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+216 ');
  const [interestedModel, setInterestedModel] = useState(availableVehicles[0]?.model || 'FIAT 500e');
  const [estimatedValueDt, setEstimatedValueDt] = useState(85000);
  const [assignedAgent, setAssignedAgent] = useState('Karim Bouazizi');
  const [notes, setNotes] = useState('');

  // Validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!isValidName(clientName)) {
      newErrors.clientName = 'Le nom du client doit comporter au moins 3 caractères.';
    }

    if (!isValidPhone(phone)) {
      newErrors.phone = 'Numéro de téléphone invalide (au moins 8 chiffres requis).';
    }

    if (email && !isValidEmail(email)) {
      newErrors.email = 'Adresse email invalide (format: exemple@domaine.com).';
    }

    if (Number(estimatedValueDt) <= 0 || isNaN(Number(estimatedValueDt))) {
      newErrors.estimatedValueDt = 'Le budget estimé doit être un nombre positif.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      clientName: clientName.trim(),
      email: email.trim() || 'non-renseigné@mail.com',
      phone: phone.trim(),
      interestedModel,
      status: 'Nouveau',
      estimatedValueDt: Number(estimatedValueDt),
      assignedAgent,
      createdAt: new Date().toLocaleDateString('fr-FR'),
      notes: notes.trim(),
    };

    onAddLead(newLead);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full modal-shadow border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150 my-auto max-h-[90vh] flex flex-col shadow-2xl">
        {/* Fixed Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#001F3F] dark:bg-sky-600 text-white rounded-xl shadow-xs">
              <UserPlus className="w-5 h-5 text-sky-300 dark:text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#000613] dark:text-white">Ajouter un Prospect</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Contrôle de saisie activé pour la qualité des données.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Fermer la fenêtre"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <form id="lead-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4 text-xs font-semibold">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Nom du Client / Entreprise *</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => {
                setClientName(e.target.value);
                if (errors.clientName) setErrors({ ...errors, clientName: '' });
              }}
              placeholder="Ex: Société Ben Ammar"
              className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-normal focus:outline-none transition-colors dark:bg-slate-800 dark:text-slate-100 ${
                errors.clientName ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30 focus:border-red-600' : 'border-slate-200 dark:border-slate-700 focus:border-[#001F3F] dark:focus:border-sky-500'
              }`}
            />
            {errors.clientName && (
              <span className="flex items-center gap-1 text-red-600 dark:text-red-400 text-[11px] font-medium mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.clientName}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Téléphone *</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors({ ...errors, phone: '' });
                }}
                placeholder="+216 98 000 000"
                className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-normal focus:outline-none transition-colors dark:bg-slate-800 dark:text-slate-100 ${
                  errors.phone ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30 focus:border-red-600' : 'border-slate-200 dark:border-slate-700 focus:border-[#001F3F] dark:focus:border-sky-500'
                }`}
              />
              {errors.phone && (
                <span className="flex items-center gap-1 text-red-600 dark:text-red-400 text-[10px] font-medium mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.phone}
                </span>
              )}
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="client@domaine.tn"
                className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-normal focus:outline-none transition-colors dark:bg-slate-800 dark:text-slate-100 ${
                  errors.email ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30 focus:border-red-600' : 'border-slate-200 dark:border-slate-700 focus:border-[#001F3F] dark:focus:border-sky-500'
                }`}
              />
              {errors.email && (
                <span className="flex items-center gap-1 text-red-600 dark:text-red-400 text-[10px] font-medium mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Modèle d'intérêt</label>
              <select
                value={interestedModel}
                onChange={(e) => setInterestedModel(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-normal focus:outline-none focus:border-[#001F3F] dark:focus:border-sky-500 bg-white dark:bg-slate-800 dark:text-slate-100"
              >
                {availableVehicles.map((v) => (
                  <option key={v.id} value={v.model}>{v.model}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Budget estimé (DT) *</label>
              <input
                type="number"
                value={estimatedValueDt}
                onChange={(e) => {
                  setEstimatedValueDt(Number(e.target.value));
                  if (errors.estimatedValueDt) setErrors({ ...errors, estimatedValueDt: '' });
                }}
                className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-normal focus:outline-none transition-colors dark:bg-slate-800 dark:text-slate-100 ${
                  errors.estimatedValueDt ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30' : 'border-slate-200 dark:border-slate-700 focus:border-[#001F3F] dark:focus:border-sky-500'
                }`}
              />
              {errors.estimatedValueDt && (
                <span className="flex items-center gap-1 text-red-600 dark:text-red-400 text-[10px] font-medium mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.estimatedValueDt}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Agent Assigné</label>
            <select
              value={assignedAgent}
              onChange={(e) => setAssignedAgent(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-normal focus:outline-none focus:border-[#001F3F] dark:focus:border-sky-500 bg-white dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="Jean Dupont">Jean Dupont (Admin)</option>
              <option value="Karim Bouazizi">Karim Bouazizi (Commercial)</option>
              <option value="Youssef Ben Ammar">Youssef Ben Ammar (CEO)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Notes / Remarques</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Souhaite un essai samedi prochain"
              className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-normal focus:outline-none focus:border-[#001F3F] dark:focus:border-sky-500 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </form>

        {/* Fixed Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2 shrink-0 bg-white dark:bg-slate-900 rounded-b-3xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="submit"
            form="lead-form"
            className="px-5 py-2.5 bg-[#001F3F] dark:bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-[#00142b] dark:hover:bg-sky-700 transition-colors cursor-pointer shadow-sm"
          >
            Enregistrer le Prospect
          </button>
        </div>
      </div>
    </div>
  );
};
