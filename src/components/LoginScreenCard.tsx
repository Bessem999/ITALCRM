import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ShieldAlert, ArrowRight, ShieldCheck, Users, TrendingUp, DollarSign, CheckCircle2 } from 'lucide-react';
import { UserAccount } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface LoginScreenCardProps {
  onLoginSuccess: (user: UserAccount) => void;
  onSwitchToSplit: () => void;
}

export const LoginScreenCard: React.FC<LoginScreenCardProps> = ({
  onLoginSuccess,
  onSwitchToSplit,
}) => {
  const [selectedUser, setSelectedUser] = useState<UserAccount>(INITIAL_USERS[2]); // Default CEO or Commercial
  const [email, setEmail] = useState(INITIAL_USERS[2].email);
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSelectRoleUser = (u: UserAccount) => {
    setSelectedUser(u);
    setEmail(u.email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Match entered email or use selectedUser
      const matched = INITIAL_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase()) || selectedUser;
      onLoginSuccess(matched);
    }, 400);
  };

  return (
    <div className="bg-[#f3f3f4] min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 text-[#1a1c1c]">
      {/* Switcher Bar Top */}
      <div className="w-full max-w-[540px] mb-4 flex items-center justify-between text-xs text-slate-500">
        <span className="font-semibold text-slate-700">Format Carte Réduit</span>
        <button
          onClick={onSwitchToSplit}
          className="text-[#001F3F] hover:underline font-semibold flex items-center gap-1"
        >
          <span>Voir version Split Luxe</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <main className="w-full max-w-[540px]">
        {/* Login Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 ambient-shadow border border-[#e2e2e2]">
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="w-16 h-16 mb-4 rounded-2xl bg-[#001F3F] text-white flex items-center justify-center font-bold text-xl shadow-md">
              CRMfy
            </div>
            <h1 className="text-2xl font-black text-[#1a1c1c] mb-1 tracking-tight">
              Connexion CRMfy Motors
            </h1>
            <p className="text-xs text-slate-500">
              Plateforme multi-rôles pour Concession Automobile
            </p>
          </div>

          {/* Quick Role Selector Box (Cahier des charges) */}
          <div className="mb-6 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <label className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-2">
              Sélectionnez un Rôle Utilisateur (Cahier des Charges)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {INITIAL_USERS.slice(0, 4).map((u) => {
                const isSelected = selectedUser.id === u.id;
                const roleBadgeColor = 
                  u.role === 'Admin' ? 'bg-rose-100 text-rose-800' :
                  u.role === 'Commercial' ? 'bg-sky-100 text-sky-800' :
                  u.role === 'CEO' ? 'bg-purple-100 text-purple-800' :
                  'bg-emerald-100 text-emerald-800';

                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelectRoleUser(u)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-white border-[#001F3F] ring-2 ring-[#001F3F]/15 shadow-2xs'
                        : 'bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={u?.avatar || "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80"}
                      alt={u?.fullName || "User"}
                      className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 truncate">{(u?.fullName || 'Utilisateur').split(' ')[0]}</span>
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${roleBadgeColor}`}>
                          {u.role}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{u.department}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-[#1a1c1c] mb-1.5"
              >
                Adresse email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@dealership.com"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-[#c4c6cf] rounded-xl text-xs text-[#1a1c1c] placeholder-slate-400 focus:outline-none focus:border-[#001F3F] focus:ring-1 focus:ring-[#001F3F] transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-[#1a1c1c] mb-1.5"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 pr-10 bg-white border border-[#c4c6cf] rounded-xl text-xs text-[#1a1c1c] placeholder-slate-400 focus:outline-none focus:border-[#001F3F] focus:ring-1 focus:ring-[#001F3F] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl text-white bg-[#001F3F] hover:bg-[#00142b] font-bold text-xs shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Authentification...</span>
                </span>
              ) : (
                <span>Se connecter en tant que {selectedUser.fullName} ({selectedUser.role})</span>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};
