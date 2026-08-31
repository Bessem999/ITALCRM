import React, { useState } from 'react';
import { 
  Search, 
  FileText, 
  Bell, 
  HelpCircle, 
  Menu, 
  User, 
  LogOut, 
  Settings, 
  ChevronDown,
  ShieldCheck,
  Sun,
  Moon,
  Share2
} from 'lucide-react';
import { ViewMode, UserAccount } from '../types';

interface HeaderProps {
  onExportPdf: () => void;
  onSelectView: (view: ViewMode) => void;
  onToggleMobileMenu?: () => void;
  onSearchChange: (term: string) => void;
  searchTerm: string;
  currentUser?: UserAccount;
  allUsers?: UserAccount[];
  onSwitchUser?: (u: UserAccount) => void;
  onLogout: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onOpenQuickMessage?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onExportPdf,
  onSelectView,
  onToggleMobileMenu,
  onSearchChange,
  searchTerm,
  currentUser,
  allUsers = [],
  onSwitchUser,
  onLogout,
  isDarkMode = false,
  onToggleDarkMode,
  onOpenQuickMessage,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'Facture en retard', desc: 'Société Beta - 120 000 DT (30+ jours)', time: 'Il y a 10 min', unread: true },
    { id: 2, title: 'Nouveau Lead', desc: 'Sami Ben Ali - SUV Premium X5', time: 'Il y a 1 heure', unread: true },
    { id: 3, title: 'Essai Confirmé', desc: 'Cabinet Trabelsi - Samedi 10:00', time: 'Il y a 3 heures', unread: false },
  ];

  const role = currentUser?.role || 'Admin';
  const roleBadgeStyle = 
    role === 'Admin' ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800' :
    role === 'Commercial' ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800' :
    role === 'CEO' ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800' :
    'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto shadow-xs transition-colors">
      {/* Search & Mobile Menu Button */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        
        <div className="relative w-full max-w-xs sm:max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher un client, modèle, facture..."
            className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-full text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#001F3F] dark:focus:border-sky-500 focus:ring-1 focus:ring-[#001F3F] transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Badge Indicator */}
        <div className={`hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold shadow-2xs ${roleBadgeStyle}`}>
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Rôle : {role}</span>
        </div>

        {/* Quick Message Hub Action Button */}
        {onOpenQuickMessage && (
          <button
            onClick={onOpenQuickMessage}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-full text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors shadow-2xs cursor-pointer"
            title="Envoyer un message WhatsApp / SMS rapide"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">WhatsApp / SMS</span>
          </button>
        )}

        {/* Export PDF Button */}
        <button
          onClick={onExportPdf}
          className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span className="hidden sm:inline">Exporter PDF</span>
        </button>

        {/* Dark Mode Toggle Button */}
        {onToggleDarkMode && (
          <button
            onClick={onToggleDarkMode}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            title={isDarkMode ? "Passer au mode clair" : "Passer au mode sombre"}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            )}
          </button>
        )}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Notifications</h4>
                <span className="text-[10px] font-semibold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 px-2 py-0.5 rounded-full">2 nouvelles</span>
              </div>
              <div className="divide-y divide-slate-50 dark:divide-slate-800 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${n.unread ? 'bg-sky-50/40 dark:bg-sky-950/30' : ''}`}>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 flex justify-between">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">{n.time}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help Center */}
        <button
          onClick={() => alert('Support Client ITALCAR CRM : support@italcar.com | Tél: +216 71 000 000')}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors hidden sm:block cursor-pointer"
          title="Aide & Support"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Profile Avatar Menu & Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 pl-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-full transition-all cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#001F3F] dark:bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
              {currentUser?.fullName?.charAt(0) || 'U'}
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden md:inline max-w-[100px] truncate">
              {currentUser?.fullName ? currentUser.fullName.split(' ')[0] : 'Utilisateur'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{currentUser?.fullName || 'Utilisateur'}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{currentUser?.email}</p>
                <div className="mt-2 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Rôle actif : {currentUser?.role || 'Admin'}
                </div>
              </div>

              {/* Quick Switch Persona (Demo feature) */}
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Changer d'utilisateur (Test) :
                </p>
                <div className="space-y-1">
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        if (onSwitchUser) onSwitchUser(u);
                        setShowProfileMenu(false);
                      }}
                      className={`w-full text-left px-2 py-1 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        u.id === currentUser?.id
                          ? 'bg-slate-100 dark:bg-slate-800 font-bold text-[#001F3F] dark:text-sky-400'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span className="truncate">{u.fullName || 'Utilisateur'}</span>
                      <span className="text-[10px] text-slate-400">({u.role})</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 px-2 space-y-0.5">
                <button
                  onClick={() => {
                    onSelectView('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Paramètres Concession</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
