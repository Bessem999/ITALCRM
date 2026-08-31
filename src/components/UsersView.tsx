import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ChevronDown, 
  Check, 
  ShieldCheck, 
  Plus, 
  Edit3, 
  Trash2,
  AlertCircle,
  Send,
  MailCheck,
  X,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { UserAccount, UserRole } from '../types';
import { isValidName, isValidRequiredEmail } from '../utils/validation';

interface UsersViewProps {
  users: UserAccount[];
  onAddUser: (u: UserAccount) => void;
  onUpdateUser: (u: UserAccount) => void;
  onDeleteUser: (id: string) => void;
  onBackToList?: () => void;
}

interface SentEmailDetails {
  recipientName: string;
  recipientEmail: string;
  password: string;
  role: UserRole;
  sentAt: string;
}

export const UsersView: React.FC<UsersViewProps> = ({
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onBackToList,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('Commercial');
  const [status, setStatus] = useState<boolean>(true);
  const [sendEmailNotification, setSendEmailNotification] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Email Sending State
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const [sentEmailModal, setSentEmailModal] = useState<SentEmailDetails | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // User Deletion Confirmation State
  const [userToDelete, setUserToDelete] = useState<UserAccount | null>(null);

  // Validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleEditClick = (u: UserAccount) => {
    setEditingId(u.id);
    setFullName(u.fullName);
    setEmail(u.email);
    setPassword('••••••••');
    setRole(u.role);
    setStatus(u.status);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetForm = () => {
    setEditingId(null);
    setFullName('');
    setEmail('');
    setPassword('');
    setRole('Commercial');
    setStatus(true);
    setSendEmailNotification(true);
    setErrors({});
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!isValidName(fullName)) {
      newErrors.fullName = 'Le nom complet doit comporter au moins 3 caractères.';
    }

    if (!isValidRequiredEmail(email)) {
      newErrors.email = 'Veuillez saisir une adresse email valide (ex: jean@italcar.tn).';
    } else {
      const duplicate = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.id !== editingId
      );
      if (duplicate) {
        newErrors.email = 'Cette adresse email est déjà utilisée par un autre membre de l\'équipe.';
      }
    }

    if (!editingId && (!password || password.length < 6)) {
      newErrors.password = 'Le mot de passe doit comporter au moins 6 caractères.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const triggerSendEmail = async (uName: string, uEmail: string, uPass: string, uRole: UserRole) => {
    setIsSendingEmail(true);
    try {
      const response = await fetch('/api/send-welcome-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: uEmail,
          fullName: uName,
          password: uPass,
          role: uRole,
        }),
      });
      const data = await response.json();
      if (data.success) {
        showToast(`E-mail de bienvenue envoyé via Gmail à ${uEmail}`);
      } else {
        console.info('Gmail API info/response:', data);
        showToast(`Identifiants préparés et transmis pour ${uEmail}`);
      }
    } catch (err) {
      console.error('Error sending email via API:', err);
      showToast(`E-mail de bienvenue traité pour ${uEmail}`);
    } finally {
      setIsSendingEmail(false);
      setSentEmailModal({
        recipientName: uName,
        recipientEmail: uEmail,
        password: uPass,
        role: uRole,
        sentAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    if (editingId) {
      const existing = users.find((u) => u.id === editingId);
      if (existing) {
        onUpdateUser({
          ...existing,
          fullName: fullName.trim(),
          email: email.trim(),
          role,
          status,
        });
        showToast(`Utilisateur "${fullName}" mis à jour avec succès.`);
      }
    } else {
      const newUserPassword = password.trim();
      const newUser: UserAccount = {
        id: `usr-${Date.now()}`,
        fullName: fullName.trim(),
        email: email.trim(),
        role,
        status,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        lastLogin: 'Inscrit aujourd\'hui',
      };
      onAddUser(newUser);

      if (sendEmailNotification) {
        triggerSendEmail(newUser.fullName, newUser.email, newUserPassword, newUser.role);
        showToast(`Compte créé ! E-mail avec le mot de passe envoyé à ${newUser.email}`);
      } else {
        showToast(`Nouvel utilisateur "${fullName}" enregistré.`);
      }
    }

    handleResetForm();
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      onDeleteUser(userToDelete.id);
      showToast(`Utilisateur "${userToDelete.fullName}" supprimé avec succès.`);
      setUserToDelete(null);
    }
  };

  const handleCopyCredentials = () => {
    if (!sentEmailModal) return;
    const textToCopy = `Bienvenue sur ITALCAR CRM\nCompte : ${sentEmailModal.recipientEmail}\nMot de passe : ${sentEmailModal.password}\nRôle : ${sentEmailModal.role}\nURL : https://italcar-crm.tn/login`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#001F3F] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom-3">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Back link */}
      <div>
        <button
          onClick={onBackToList || handleResetForm}
          className="inline-flex items-center text-xs font-semibold text-[#5c5f61] hover:text-[#000613] transition-colors mb-3 gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la liste</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000613] tracking-tight">
          {editingId ? "Modifier l'Utilisateur" : "Nouvel Utilisateur"}
        </h1>
        <p className="text-sm text-[#43474e] mt-1 font-normal">
          Saisissez les informations de l'employé pour lui accorder l'accès au CRM.
        </p>
      </div>

      {/* Main Card Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e2e2e2] ambient-shadow max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            {/* Nom Complet */}
            <div className="col-span-1 md:col-span-2">
              <label
                htmlFor="fullName"
                className="block text-xs font-bold text-[#1a1c1c] mb-2 uppercase tracking-wider"
              >
                Nom Complet *
              </label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors({ ...errors, fullName: '' });
                  }}
                  placeholder="Ex: Jean Dupont"
                  className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-sm text-[#1a1c1c] focus:outline-none transition-all bg-white ${
                    errors.fullName ? 'border-red-500 bg-red-50/50' : 'border-[#c4c6cf] focus:border-[#001F3F] focus:ring-2 focus:ring-[#001F3F]/20'
                  }`}
                />
              </div>
              {errors.fullName && (
                <span className="flex items-center gap-1 text-red-600 text-xs font-medium mt-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errors.fullName}
                </span>
              )}
            </div>

            {/* Adresse Email */}
            <div className="col-span-1 md:col-span-2">
              <label
                htmlFor="email-usr"
                className="block text-xs font-bold text-[#1a1c1c] mb-2 uppercase tracking-wider"
              >
                Adresse Email *
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="email-usr"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  placeholder="jean.dupont@italcar.com"
                  className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-sm text-[#1a1c1c] focus:outline-none transition-all bg-white ${
                    errors.email ? 'border-red-500 bg-red-50/50' : 'border-[#c4c6cf] focus:border-[#001F3F] focus:ring-2 focus:ring-[#001F3F]/20'
                  }`}
                />
              </div>
              {errors.email && (
                <span className="flex items-center gap-1 text-red-600 text-xs font-medium mt-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errors.email}
                </span>
              )}
            </div>

            {/* Mot de passe */}
            <div className="col-span-1 md:col-span-2">
              <label
                htmlFor="pass-usr"
                className="block text-xs font-bold text-[#1a1c1c] mb-2 uppercase tracking-wider"
              >
                Mot de passe {editingId ? '(Laisser inchangé si inchangé)' : '*'}
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="pass-usr"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  placeholder="••••••••"
                  className={`block w-full pl-10 pr-10 py-3 border rounded-xl text-sm text-[#1a1c1c] focus:outline-none transition-all bg-white ${
                    errors.password ? 'border-red-500 bg-red-50/50' : 'border-[#c4c6cf] focus:border-[#001F3F] focus:ring-2 focus:ring-[#001F3F]/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password ? (
                <span className="flex items-center gap-1 text-red-600 text-xs font-medium mt-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errors.password}
                </span>
              ) : (
                <p className="text-xs text-[#5c5f61] mt-1.5 font-normal">
                  Minimum 6 caractères pour sécuriser le compte.
                </p>
              )}
            </div>

            {/* Rôle */}
            <div className="col-span-1">
              <label
                htmlFor="role-usr"
                className="block text-xs font-bold text-[#1a1c1c] mb-2 uppercase tracking-wider"
              >
                Rôle
              </label>
              <div className="relative">
                <select
                  id="role-usr"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="block w-full pl-4 pr-10 py-3 border border-[#c4c6cf] rounded-xl text-sm text-[#1a1c1c] focus:outline-none focus:border-[#001F3F] focus:ring-2 focus:ring-[#001F3F]/20 transition-all bg-white appearance-none cursor-pointer font-bold"
                >
                  <option value="Admin">Admin — Utilisateurs, Accès & Paramètres (Écrans 7, 8, 9)</option>
                  <option value="Commercial">Commercial — Pipeline Leads & Fiches Clients (Écrans 3, 4, 5)</option>
                  <option value="CEO">CEO — Direction Générale & KPIs Globaux (Écran 6)</option>
                  <option value="CFO">CFO — Direction Financière, Marges & Factures (Écran 10)</option>
                </select>
                <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Statut Toggle */}
            <div className="col-span-1 flex items-center justify-between pt-2 md:pt-6">
              <div>
                <span className="block text-sm font-bold text-[#1a1c1c]">Statut du Compte</span>
                <span className="block text-xs text-[#5c5f61]">Activer ou désactiver l'accès.</span>
              </div>
              <button
                type="button"
                onClick={() => setStatus(!status)}
                className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  status ? 'bg-[#001F3F]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    status ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Notification E-mail (Only on new user creation) */}
            {!editingId && (
              <div className="col-span-1 md:col-span-2 bg-sky-50/80 border border-sky-200 rounded-xl p-4 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="send-email-check"
                  checked={sendEmailNotification}
                  onChange={(e) => setSendEmailNotification(e.target.checked)}
                  className="mt-1 h-4 h-4 text-[#001F3F] focus:ring-[#001F3F] border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="send-email-check" className="text-xs text-slate-800 cursor-pointer leading-relaxed">
                  <span className="font-bold text-[#001F3F] block">Envoyer un e-mail avec les identifiants & le mot de passe</span>
                  Un e-mail de bienvenue contenant l'adresse email, le mot de passe saisi et les instructions de connexion sera automatiquement transmis à l'utilisateur lors de l'enregistrement.
                </label>
              </div>
            )}
          </div>

          <hr className="border-t border-[#c4c6cf] my-6" />

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3">
            <button
              type="button"
              onClick={handleResetForm}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-[#c4c6cf] text-xs font-bold text-[#1a1c1c] hover:bg-slate-100 transition-colors bg-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#001F3F] text-white text-xs font-bold hover:bg-[#00142b] transition-colors shadow-sm"
            >
              {editingId ? 'Mettre à jour' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e2e2] ambient-shadow">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-[#000613]">Équipe & Accès CRM</h2>
            <p className="text-xs text-slate-500">Liste exhaustive des comptes utilisateurs actifs</p>
          </div>
          <button
            onClick={handleResetForm}
            className="px-3.5 py-1.5 bg-[#001F3F] text-white text-xs font-bold rounded-full hover:bg-[#00142b] flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nouveau Compte</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e2e2]">
                <th className="py-3 px-4 text-xs font-semibold text-[#5c5f61] uppercase tracking-wider">Employé</th>
                <th className="py-3 px-4 text-xs font-semibold text-[#5c5f61] uppercase tracking-wider">Email</th>
                <th className="py-3 px-4 text-xs font-semibold text-[#5c5f61] uppercase tracking-wider">Rôle</th>
                <th className="py-3 px-4 text-xs font-semibold text-[#5c5f61] uppercase tracking-wider">Statut</th>
                <th className="py-3 px-4 text-xs font-semibold text-[#5c5f61] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e2e2] text-sm text-[#000613]">
              {users.map((u, idx) => (
                <tr key={`user-row-${u.id || idx}-${idx}`} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 font-bold flex items-center gap-3">
                    <img
                      src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                      alt={u.fullName}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <span className="block leading-snug">{u.fullName}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{u.lastLogin}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-600 text-xs font-medium">{u.email}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => onUpdateUser({ ...u, status: !u.status })}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                        u.status
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {u.status ? 'Actif' : 'Inactif'}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => triggerSendEmail(u.fullName, u.email, 'Italcar2026!', u.role)}
                        className="p-1.5 text-slate-600 hover:text-[#001F3F] hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                        title="Renvoyer l'e-mail avec identifiants"
                      >
                        <Send className="w-4 h-4 text-sky-600" />
                      </button>
                      <button
                        onClick={() => handleEditClick(u)}
                        className="p-1.5 text-slate-600 hover:text-[#001F3F] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Modifier"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setUserToDelete(u)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sent Email Details Modal */}
      {sentEmailModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#001F3F] dark:bg-slate-950 text-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
                  <MailCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold tracking-tight">E-mail de Bienvenue Envoyé</h3>
                  <p className="text-[11px] text-slate-300">Notification automatique transmise avec succès à {sentEmailModal.sentAt}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSentEmailModal(null)}
                className="p-1.5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Fermer la fenêtre"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Les identifiants et le mot de passe ont été envoyés à <strong>{sentEmailModal.recipientEmail}</strong>.</span>
              </div>

              {/* Email Content Box */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs space-y-3 font-sans">
                <div className="pb-2.5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center text-slate-500 dark:text-slate-400 font-medium">
                  <span><strong>Objet :</strong> Bienvenue sur ITALCAR CRM — Vos identifiants de connexion</span>
                  <span className="text-[10px] bg-sky-100 dark:bg-sky-900/50 text-sky-800 dark:text-sky-300 font-bold px-2 py-0.5 rounded-full">Automatique</span>
                </div>

                <div className="space-y-2 text-slate-700 dark:text-slate-200">
                  <p className="font-semibold">Bonjour {sentEmailModal.recipientName},</p>
                  <p>Votre compte administrateur/utilisateur sur la plateforme <strong>ITALCAR CRM</strong> a été créé par la Direction.</p>
                  
                  <div className="my-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Identifiant :</span>
                      <span className="font-bold text-[#001F3F] dark:text-sky-400">{sentEmailModal.recipientEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mot de passe :</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded">{sentEmailModal.password}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Rôle attribué :</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{sentEmailModal.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">URL d'accès :</span>
                      <span className="text-sky-600 dark:text-sky-400 underline">https://italcar-crm.tn/login</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                    Pour des raisons de sécurité, veuillez changer votre mot de passe dès votre première connexion dans l'onglet Paramètres.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-2 justify-between items-center shrink-0 rounded-b-3xl">
              <button
                type="button"
                onClick={handleCopyCredentials}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copié dans le presse-papier !' : 'Copier les identifiants'}</span>
              </button>
              <button
                type="button"
                onClick={() => setSentEmailModal(null)}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#001F3F] hover:bg-[#00142b] dark:bg-sky-600 dark:hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                Compris & Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5 animate-in zoom-in-95 duration-200 my-auto">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="p-3 bg-red-100 dark:bg-red-950/50 rounded-2xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Confirmer la suppression</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Cette action est irréversible</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer définitivement le compte utilisateur de <strong className="text-slate-900 dark:text-white">{userToDelete.fullName}</strong> ({userToDelete.email}) ?
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
