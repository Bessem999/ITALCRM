import React from 'react';
import { 
  LayoutDashboard, 
  Car, 
  CreditCard, 
  Users, 
  Settings, 
  UserCog, 
  Plus, 
  LogOut,
  ChevronRight,
  Calendar,
  ShieldCheck,
  Sun,
  Moon,
  Share2,
  Wrench
} from 'lucide-react';
import { ViewMode, UserAccount, UserRole } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  onOpenNewLead: () => void;
  onOpenNewVehicle: () => void;
  onOpenReserveModal?: () => void;
  onOpenQuickMessage?: () => void;
  dealershipName: string;
  isLoggedIn: boolean;
  currentUser?: UserAccount;
  allUsers?: UserAccount[];
  onSwitchUser?: (u: UserAccount) => void;
  onLogout: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  onOpenNewLead,
  onOpenNewVehicle,
  onOpenReserveModal,
  onOpenQuickMessage,
  dealershipName,
  isLoggedIn,
  currentUser,
  allUsers = [],
  onSwitchUser,
  onLogout,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const role: UserRole = currentUser?.role || 'Admin';

  // All possible navigation items
  const allNavItems = [
    { id: 'dashboard' as ViewMode, label: 'Dashboard CEO', icon: LayoutDashboard, roles: ['CEO', 'CFO'] as UserRole[] },
    { id: 'leads' as ViewMode, label: 'Pipeline Leads', icon: Users, roles: ['Commercial', 'CEO'] as UserRole[] },
    { id: 'inventory' as ViewMode, label: 'Inventaire Stock', icon: Car, roles: ['Commercial', 'CEO', 'CFO'] as UserRole[] },
    { id: 'sales' as ViewMode, label: 'Ventes & Factures', icon: CreditCard, roles: ['CFO', 'CEO'] as UserRole[] },
    { id: 'service' as ViewMode, label: 'SAV & Maintenance', icon: Wrench, roles: ['Commercial', 'CEO', 'Admin'] as UserRole[] },
    { id: 'users' as ViewMode, label: 'Utilisateurs & Rôles', icon: UserCog, roles: ['Admin'] as UserRole[] },
    { id: 'settings' as ViewMode, label: 'Paramètres Concession', icon: Settings, roles: ['Admin'] as UserRole[] },
  ];

  // Filter items based on active user role
  const allowedNavItems = allNavItems.filter((item) => item.roles.includes(role));

  const roleBadgeStyle = 
    role === 'Admin' ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800' :
    role === 'Commercial' ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800' :
    role === 'CEO' ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800' :
    'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen fixed left-0 top-0 flex flex-col z-40 shadow-sm transition-all duration-200">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#001F3F] dark:bg-sky-600 flex items-center justify-center text-white font-black text-sm shadow-md">
            CRM
          </div>
          <div>
            <h1 className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight leading-none">
              {dealershipName || 'ITALCAR'}
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">Concession Auto</p>
          </div>
        </div>
      </div>

      {/* User Info & Role Card */}
      {currentUser && (
        <div className="p-3 mx-3 my-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center gap-2.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.fullName}
              className="w-9 h-9 rounded-full object-cover border border-slate-300 dark:border-slate-600 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{currentUser.fullName}</p>
              <div className={`mt-0.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black border ${roleBadgeStyle}`}>
                <ShieldCheck className="w-3 h-3" />
                <span>{role}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Nav Items */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <div className="px-3 my-2 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
          <span>Espace {role}</span>
          <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-bold">{allowedNavItems.length} accès</span>
        </div>
        
        {allowedNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={`sidebar-nav-${item.id}`}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#001F3F] dark:bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-300' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-sky-300" />}
            </button>
          );
        })}

        {/* Quick Demo Role Switcher in Sidebar (Cahier des Charges) */}
        <div className="pt-4 px-3 mb-1.5 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Changer de Rôle (Démo)
        </div>

        <div className="space-y-1">
          {allUsers.slice(0, 4).map((u, idx) => {
            const isSel = currentUser?.id === u.id;
            return (
              <button
                key={u?.id ? `sidebar-user-${u.id}` : `sidebar-user-idx-${idx}`}
                onClick={() => {
                  if (onSwitchUser) onSwitchUser(u);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                  isSel
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold border border-slate-300 dark:border-slate-700'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span className="truncate">{(u?.fullName || 'Utilisateur').split(' ')[0]} ({u?.role || 'Utilisateur'})</span>
                {isSel && <span className="w-1.5 h-1.5 rounded-full bg-[#001F3F] dark:bg-sky-400"></span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons & Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
        {onToggleDarkMode && (
          <button
            onClick={onToggleDarkMode}
            className="w-full py-2 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
              <span>{isDarkMode ? 'Mode Sombre Activé' : 'Mode Clair Activé'}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
              {isDarkMode ? 'Sombre' : 'Clair'}
            </span>
          </button>
        )}

        {onOpenQuickMessage && (
          <button
            onClick={onOpenQuickMessage}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-emerald-100" />
            <span>WhatsApp / SMS Rapide</span>
          </button>
        )}

        {role === 'Commercial' && onOpenReserveModal && (
          <button
            onClick={onOpenReserveModal}
            className="w-full bg-[#001F3F] dark:bg-sky-600 text-white py-2 px-3 rounded-xl text-xs font-bold hover:bg-[#001730] dark:hover:bg-sky-700 transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-sky-300" />
            <span>Réserver Essai / Visite</span>
          </button>
        )}

        {role === 'Commercial' && (
          <button
            onClick={onOpenNewLead}
            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 py-2 px-3 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Lead</span>
          </button>
        )}

        {(role === 'CEO' || role === 'CFO' || role === 'Commercial') && (
          <button
            onClick={onOpenNewVehicle}
            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-2 px-3 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Car className="w-4 h-4" />
            <span>Ajouter Véhicule</span>
          </button>
        )}

        {isLoggedIn && (
          <button
            onClick={onLogout}
            className="w-full pt-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        )}
      </div>
    </aside>
  );
};
