import React, { useState } from 'react';
import { DealershipSettings } from '../types';
import { Check, ChevronDown, Building, Globe, Moon, Sun, Palette } from 'lucide-react';

interface SettingsViewProps {
  settings: DealershipSettings;
  onSaveSettings: (s: DealershipSettings) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const [formData, setFormData] = useState<DealershipSettings>(settings);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setToastMsg('Modifications enregistrées avec succès.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-20">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#001F3F] dark:bg-sky-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom-3">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000613] dark:text-white tracking-tight">
          Paramètres Généraux
        </h1>
        <p className="text-sm text-[#5c5f61] dark:text-slate-400 mt-1">
          Gérez les informations principales et le thème visuel de votre concession.
        </p>
      </div>

      {/* Appearance / Dark Mode Section */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 ambient-shadow transition-colors">
        <h3 className="text-lg font-bold text-[#000613] dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#001F3F] dark:text-sky-400" />
          <span>Apparence & Thème Visuel</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Personnalisez le thème d'affichage pour une lisibilité optimale de jour comme de nuit.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => {
              if (isDarkMode && onToggleDarkMode) onToggleDarkMode();
            }}
            className={`p-4 rounded-xl border flex items-center gap-4 transition-all text-left cursor-pointer ${
              !isDarkMode
                ? 'border-[#001F3F] bg-sky-50/50 dark:bg-sky-950/20 ring-2 ring-[#001F3F]/20'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="p-3 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Mode Clair</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Thème standard épuré et lumineux</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!isDarkMode && onToggleDarkMode) onToggleDarkMode();
            }}
            className={`p-4 rounded-xl border flex items-center gap-4 transition-all text-left cursor-pointer ${
              isDarkMode
                ? 'border-sky-500 bg-sky-950/40 ring-2 ring-sky-500/30'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="p-3 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Mode Sombre</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Interface sombre contrastée et reposante</p>
            </div>
          </button>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations de la Concession Card */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 ambient-shadow transition-colors">
          <h3 className="text-lg font-bold text-[#000613] dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-[#001F3F] dark:text-sky-400" />
            <span>Informations de la Concession</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Nom de la concession
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#001F3F] dark:focus:border-sky-500 focus:ring-1 focus:ring-[#001F3F] transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Téléphone
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+216 XX XXX XXX"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#001F3F] dark:focus:border-sky-500 focus:ring-1 focus:ring-[#001F3F] transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Adresse
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Entrez l'adresse de la concession"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#001F3F] dark:focus:border-sky-500 focus:ring-1 focus:ring-[#001F3F] transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Email de contact
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="contact@italcar.com"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#001F3F] dark:focus:border-sky-500 focus:ring-1 focus:ring-[#001F3F] transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Site Web
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://www.italcar.com"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#001F3F] dark:focus:border-sky-500 focus:ring-1 focus:ring-[#001F3F] transition-colors"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Localisation et Unité Card */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 ambient-shadow transition-colors">
          <h3 className="text-lg font-bold text-[#000613] dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#001F3F] dark:text-sky-400" />
            <span>Localisation et Unité</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Fuseau horaire
              </label>
              <div className="relative">
                <select
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#001F3F] dark:focus:border-sky-500 focus:ring-1 focus:ring-[#001F3F] appearance-none cursor-pointer transition-colors"
                >
                  <option value="Afrique/Tunis (CET)">Afrique/Tunis (CET)</option>
                  <option value="Europe/Paris (CET)">Europe/Paris (CET)</option>
                  <option value="UTC">UTC (Universal Time)</option>
                </select>
                <ChevronDown className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Devise
              </label>
              <div className="relative">
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#001F3F] dark:focus:border-sky-500 focus:ring-1 focus:ring-[#001F3F] appearance-none cursor-pointer transition-colors"
                >
                  <option value="DT - Dinar Tunisien">DT - Dinar Tunisien</option>
                  <option value="EUR - Euro">EUR - Euro (€)</option>
                  <option value="USD - US Dollar">USD - US Dollar ($)</option>
                </select>
                <ChevronDown className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Langue de la plateforme
              </label>
              <div className="relative">
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#001F3F] dark:focus:border-sky-500 focus:ring-1 focus:ring-[#001F3F] appearance-none cursor-pointer transition-colors"
                >
                  <option value="Français">Français</option>
                  <option value="Anglais">Anglais</option>
                  <option value="Arabe">Arabe</option>
                </select>
                <ChevronDown className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Save Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => setFormData(settings)}
            className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#001F3F] dark:bg-sky-600 text-white font-bold text-xs hover:bg-[#00142b] dark:hover:bg-sky-700 transition-colors shadow-sm cursor-pointer"
          >
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
};
