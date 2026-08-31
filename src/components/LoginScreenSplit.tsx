import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LayoutGrid, ArrowLeft } from 'lucide-react';
import { UserAccount } from '../types';
import { INITIAL_USERS } from '../data/mockData';

const fiatCarBg = '/src/assets/images/fiat_car_background_1785923623464.jpg';

interface LoginScreenSplitProps {
  onLoginSuccess: (user: UserAccount) => void;
  onSwitchToCard: () => void;
}

export const LoginScreenSplit: React.FC<LoginScreenSplitProps> = ({
  onLoginSuccess,
  onSwitchToCard,
}) => {
  const [selectedUser, setSelectedUser] = useState<UserAccount>(INITIAL_USERS[2]);
  const [email, setEmail] = useState(INITIAL_USERS[2].email);
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSelectUser = (u: UserAccount) => {
    setSelectedUser(u);
    setEmail(u.email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const matched = INITIAL_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase()) || selectedUser;
      onLoginSuccess(matched);
    }, 400);
  };

  return (
    <div className="bg-[#f9f9f9] text-[#1a1c1c] min-h-screen flex w-full font-sans antialiased">
      {/* Switcher Floater */}
      <button
        onClick={onSwitchToCard}
        className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#001F3F] border border-slate-200 shadow-sm hover:bg-white transition-all flex items-center gap-1.5"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Format Carte Centrée</span>
      </button>

      <div className="flex w-full min-h-screen">
        {/* Left Side: Automotive Image / Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-[#001F3F] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
            style={{
              backgroundImage: `url(${fiatCarBg})`,
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#000613]/90 via-[#001F3F]/60 to-transparent"></div>

          <div className="relative z-10 p-12 flex flex-col justify-end h-full w-full">
            <div className="glass-panel p-8 rounded-2xl max-w-lg border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-[#000613] mb-3 tracking-tight">
                CRMfy Motors — Rôles & Accès
              </h2>
              <p className="text-sm text-[#43474e] leading-relaxed">
                Connectez-vous selon votre rôle : Administrateur, Commercial, Direction Générale (CEO) ou Direction Financière (CFO).
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md space-y-6">
            {/* Header */}
            <div className="text-center flex flex-col items-center">
              <div className="w-16 h-16 mb-4 rounded-2xl bg-[#001F3F] text-white font-bold text-xl flex items-center justify-center shadow-md">
                CRMfy
              </div>
              <h1 className="text-2xl font-black text-[#000613] tracking-tight">
                Connexion CRMfy Motors
              </h1>
              <p className="text-xs text-[#43474e] mt-1">
                Choisissez votre rôle d'accès (Cahier des charges)
              </p>
            </div>

            {/* Quick Role Picker */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
              <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                Comptes Démo par Rôle :
              </label>
              <div className="grid grid-cols-2 gap-2">
                {INITIAL_USERS.slice(0, 4).map((u) => {
                  const isSel = selectedUser.id === u.id;
                  const roleBadgeColor = 
                    u.role === 'Admin' ? 'bg-rose-100 text-rose-800' :
                    u.role === 'Commercial' ? 'bg-sky-100 text-sky-800' :
                    u.role === 'CEO' ? 'bg-purple-100 text-purple-800' :
                    'bg-emerald-100 text-emerald-800';

                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleSelectUser(u)}
                      className={`p-2 rounded-xl text-left border transition-all flex items-center gap-2 ${
                        isSel 
                          ? 'bg-white border-[#001F3F] ring-2 ring-[#001F3F]/15 shadow-2xs' 
                          : 'bg-white/60 border-slate-200 hover:bg-white'
                      }`}
                    >
                      <img src={u?.avatar || "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80"} alt={u?.fullName || "User"} className="w-7 h-7 rounded-full object-cover shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 truncate">{(u?.fullName || 'Utilisateur').split(' ')[0]}</span>
                          <span className={`text-[9px] font-bold px-1 rounded ${roleBadgeColor}`}>{u.role}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1">
                <label
                  htmlFor="email-split"
                  className="text-xs font-semibold text-[#1a1c1c] block"
                >
                  Email professionnel
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email-split"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@italcar.com"
                    required
                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#001F3F] text-xs text-[#1a1c1c]"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label
                  htmlFor="password-split"
                  className="text-xs font-semibold text-[#1a1c1c] block"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password-split"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-11 pr-11 py-2.5 bg-white border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#001F3F] text-xs text-[#1a1c1c]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#001F3F] hover:bg-[#00132b] py-3 px-6 rounded-xl font-bold text-xs text-white transition-all shadow-md cursor-pointer flex items-center justify-center"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Connexion...</span>
                  </span>
                ) : (
                  <span>Se connecter ({selectedUser.fullName} - {selectedUser.role})</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
