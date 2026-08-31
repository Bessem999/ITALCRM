import React, { useState, useEffect } from 'react';
import { ViewMode, Vehicle, OverdueInvoice, Lead, UserAccount, DealershipSettings, SaleTransaction, TestDriveReservation } from './types';
import { 
  INITIAL_VEHICLES, 
  INITIAL_OVERDUE_INVOICES, 
  INITIAL_LEADS, 
  INITIAL_USERS, 
  INITIAL_SETTINGS, 
  INITIAL_SALES,
  INITIAL_RESERVATIONS
} from './data/mockData';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { InventoryView } from './components/InventoryView';
import { SalesView } from './components/SalesView';
import { LeadsView } from './components/LeadsView';
import { ServiceView } from './components/ServiceView';
import { UsersView } from './components/UsersView';
import { SettingsView } from './components/SettingsView';
import { LoginScreenCard } from './components/LoginScreenCard';
import { LoginScreenSplit } from './components/LoginScreenSplit';
import { PdfExportModal } from './components/PdfExportModal';
import { NewLeadModal } from './components/NewLeadModal';
import { NewVehicleModal } from './components/NewVehicleModal';
import { NewReservationModal } from './components/NewReservationModal';
import { QuickMessageModal, QuickMessageRecipient } from './components/QuickMessageModal';
import { QuickMessageLog } from './types';
import { useFirestoreSync } from './hooks/useFirestoreSync';
import { SnackBar, SnackBarNotification } from './components/SnackBar';

export default function App() {
  const {
    vehicles,
    leads,
    reservations,
    users,
    addVehicleFS,
    updateVehicleFS,
    updateVehicleStatusFS,
    addLeadFS,
    updateLeadStatusFS,
    addReservationFS,
    updateReservationStatusFS,
    addUserFS,
    updateUserFS,
    deleteUserFS,
  } = useFirestoreSync();

  const [currentUser, setCurrentUser] = useState<UserAccount>(INITIAL_USERS[2]); // Default CEO Youssef Ben Ammar
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Dark Mode State with Local Storage persistence & prefers-color-scheme system detection
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('italcar_theme');
    if (saved !== null) {
      return saved === 'dark';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('italcar_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('italcar_theme', 'light');
    }
  }, [isDarkMode]);

  // Listen to system preference changes if user hasn't explicitly set a preference
  useEffect(() => {
    if (!window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('italcar_theme') === null) {
        setIsDarkMode(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Static Local Data for Invoices, Settings, Sales
  const [overdueInvoices, setOverdueInvoices] = useState<OverdueInvoice[]>(INITIAL_OVERDUE_INVOICES);
  const [settings, setSettings] = useState<DealershipSettings>(INITIAL_SETTINGS);
  const [sales, setSales] = useState<SaleTransaction[]>(INITIAL_SALES);

  // Modals
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [showNewLeadModal, setShowNewLeadModal] = useState<boolean>(false);
  const [showNewVehicleModal, setShowNewVehicleModal] = useState<boolean>(false);
  const [showReserveModal, setShowReserveModal] = useState<boolean>(false);
  const [reserveVehicleId, setReserveVehicleId] = useState<string | undefined>(undefined);
  const [reserveClientName, setReserveClientName] = useState<string | undefined>(undefined);

  // Global Snack Bar Notification System
  const [snackBars, setSnackBars] = useState<SnackBarNotification[]>([]);

  const handleTriggerSnackBar = (notif: Omit<SnackBarNotification, 'id'>) => {
    const id = `snack-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setSnackBars((prev) => [
      { ...notif, id },
      ...prev.slice(0, 2), // Stack max 3 notifications for clean layout
    ]);
  };

  const handleDismissSnackBar = (id: string) => {
    setSnackBars((prev) => prev.filter((n) => n.id !== id));
  };

  // WhatsApp & SMS Quick Message State & Persistence
  const [showQuickMessageModal, setShowQuickMessageModal] = useState<boolean>(false);
  const [quickMessageRecipient, setQuickMessageRecipient] = useState<QuickMessageRecipient | undefined>(undefined);
  const [messageLogs, setMessageLogs] = useState<QuickMessageLog[]>(() => {
    const saved = localStorage.getItem('italcar_message_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [
      {
        id: 'log-1',
        clientName: 'Sami Ben Ali',
        phone: '+216 98 123 456',
        channel: 'whatsapp',
        templateName: 'Premier Contact Prospect',
        message: 'Bonjour Sami Ben Ali, ravi de votre intérêt pour le SUV Premium X5 chez ITALCAR. Notre conseiller Youssef Ben Ammar reste à votre disposition.',
        timestamp: '14/08/2026 09:15',
        senderName: 'Youssef Ben Ammar',
      },
      {
        id: 'log-2',
        clientName: 'Société Beta',
        phone: '+216 98 000 111',
        channel: 'sms',
        templateName: 'Relance Facture en Retard',
        message: 'Rappel comptabilité ITALCAR: la facture FAC-2024-003 d\'un montant de 120 000 DT est en attente.',
        timestamp: '13/08/2026 16:40',
        senderName: 'Inès Ben Salem',
      },
    ];
  });

  const handleAddMessageLog = (log: QuickMessageLog) => {
    setMessageLogs((prev) => {
      const updated = [log, ...prev];
      localStorage.setItem('italcar_message_logs', JSON.stringify(updated));
      return updated;
    });
  };

  const handleOpenQuickMessage = (recipient?: QuickMessageRecipient) => {
    setQuickMessageRecipient(recipient || {
      name: leads[0]?.clientName || 'Client Prospect',
      phone: leads[0]?.phone || '+216 98 123 456',
      type: 'lead',
      model: leads[0]?.interestedModel || 'SUV Premium X5',
      agent: currentUser.fullName,
    });
    setShowQuickMessageModal(true);
  };

  // Default view based on role
  const getDefaultViewForRole = (role: UserAccount['role']): ViewMode => {
    switch (role) {
      case 'Admin':
        return 'users';
      case 'Commercial':
        return 'leads';
      case 'CEO':
        return 'dashboard';
      case 'CFO':
        return 'sales';
      default:
        return 'dashboard';
    }
  };

  // Handlers
  const handleOpenReserveModal = (vehicleId?: string, clientName?: string) => {
    setReserveVehicleId(vehicleId);
    setReserveClientName(clientName);
    setShowReserveModal(true);
  };

  const handleAddReservation = (newRes: TestDriveReservation) => {
    addReservationFS(newRes);
    const isInspection = newRes.type === 'Visite Véhicule';
    handleTriggerSnackBar({
      type: 'success',
      title: isInspection ? 'Inspection & Visite Confirmée' : 'Test Drive Confirmé',
      message: `${isInspection ? 'Visite & inspection en concession' : 'Essai sur route'} programmé(e) avec succès pour ${newRes.clientName}.`,
      details: `${newRes.vehicleModel} • ${newRes.date} à ${newRes.timeSlot} • Conseiller : ${newRes.assignedAgent}`,
      badge: 'Confirmé ✓',
      duration: 6000,
      actionLabel: 'Consulter l\'agenda',
      onAction: () => {
        setCurrentView('dashboard');
      },
    });
  };

  const handleUpdateReservationStatus = (id: string, newStatus: TestDriveReservation['status']) => {
    updateReservationStatusFS(id, newStatus);
    const targetRes = reservations.find((r) => r.id === id);
    const clientName = targetRes?.clientName || 'Client';
    const vehModel = targetRes?.vehicleModel || 'Véhicule';

    if (newStatus === 'Annulée') {
      handleTriggerSnackBar({
        type: 'rejection',
        title: 'Réservation Déclinée / Annulée',
        message: `Le rendez-vous pour ${clientName} (${vehModel}) a été annulé ou rejeté.`,
        badge: 'Annulée',
        duration: 5000,
      });
    } else if (newStatus === 'Confirmée') {
      handleTriggerSnackBar({
        type: 'success',
        title: 'Réservation Validée',
        message: `Le créneau pour ${clientName} (${vehModel}) est maintenant validé et confirmé.`,
        badge: 'Validé',
        duration: 5000,
      });
    } else if (newStatus === 'Terminée') {
      handleTriggerSnackBar({
        type: 'info',
        title: 'Rendez-vous Clôturé',
        message: `L'essai / inspection de ${clientName} a été marqué comme effectué.`,
        badge: 'Terminé',
        duration: 4500,
      });
    }
  };

  // Login & User Switch Handlers
  const handleLoginSuccess = (user?: UserAccount) => {
    const activeUser = user || users[0] || INITIAL_USERS[0];
    setCurrentUser(activeUser);
    setIsLoggedIn(true);
    setCurrentView(getDefaultViewForRole(activeUser.role));
  };

  const handleSwitchUser = (user: UserAccount) => {
    setCurrentUser(user);
    setCurrentView(getDefaultViewForRole(user.role));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('login_card');
  };

  const handleAddVehicle = (newV: Vehicle) => {
    addVehicleFS(newV);
  };

  const handleUpdateVehicle = (updatedV: Vehicle) => {
    updateVehicleFS(updatedV);
  };

  const handleUpdateVehicleStatus = (id: string, newStatus: Vehicle['status']) => {
    updateVehicleStatusFS(id, newStatus);
  };

  const handleAddLead = (newL: Lead) => {
    addLeadFS(newL);
  };

  const handleUpdateLeadStatus = (id: string, newStatus: Lead['status']) => {
    updateLeadStatusFS(id, newStatus);
  };

  const handleAddUser = (newU: UserAccount) => {
    addUserFS(newU);
  };

  const handleUpdateUser = (updatedU: UserAccount) => {
    updateUserFS(updatedU);
  };

  const handleDeleteUser = (id: string) => {
    deleteUserFS(id);
  };

  // Render Login Views
  if (currentView === 'login_card') {
    return (
      <LoginScreenCard
        onLoginSuccess={handleLoginSuccess}
        onSwitchToSplit={() => setCurrentView('login_split')}
      />
    );
  }

  if (currentView === 'login_split') {
    return (
      <LoginScreenSplit
        onLoginSuccess={handleLoginSuccess}
        onSwitchToCard={() => setCurrentView('login_card')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#121212] text-[#111827] dark:text-[#FFFFFF] flex font-sans antialiased transition-colors duration-250">
      {/* Sidebar - Desktop */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          onOpenNewLead={() => setShowNewLeadModal(true)}
          onOpenNewVehicle={() => setShowNewVehicleModal(true)}
          onOpenReserveModal={() => handleOpenReserveModal()}
          onOpenQuickMessage={() => handleOpenQuickMessage()}
          dealershipName={settings.name}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          allUsers={users}
          onSwitchUser={handleSwitchUser}
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
        />
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="relative w-64 max-w-xs bg-white dark:bg-slate-900 h-full z-10">
            <Sidebar
              currentView={currentView}
              onSelectView={(view) => {
                setCurrentView(view);
                setIsMobileMenuOpen(false);
              }}
              onOpenNewLead={() => {
                setShowNewLeadModal(true);
                setIsMobileMenuOpen(false);
              }}
              onOpenNewVehicle={() => {
                setShowNewVehicleModal(true);
                setIsMobileMenuOpen(false);
              }}
              onOpenReserveModal={() => {
                handleOpenReserveModal();
                setIsMobileMenuOpen(false);
              }}
              onOpenQuickMessage={() => {
                handleOpenQuickMessage();
                setIsMobileMenuOpen(false);
              }}
              dealershipName={settings.name}
              isLoggedIn={isLoggedIn}
              currentUser={currentUser}
              allUsers={users}
              onSwitchUser={handleSwitchUser}
              onLogout={handleLogout}
              isDarkMode={isDarkMode}
              onToggleDarkMode={handleToggleDarkMode}
            />
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          onExportPdf={() => setShowPdfModal(true)}
          onSelectView={setCurrentView}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenQuickMessage={() => handleOpenQuickMessage()}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          currentUser={currentUser}
          allUsers={users}
          onSwitchUser={handleSwitchUser}
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
        />

        {/* Dynamic Canvas View */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-8 max-w-7xl mx-auto w-full">
          {currentView === 'dashboard' && (
            <DashboardView
              vehicles={vehicles}
              overdueInvoices={overdueInvoices}
              reservations={reservations}
              onSelectVehicle={() => setCurrentView('inventory')}
              onNavigateToInvoices={() => setCurrentView('sales')}
              onOpenReserveModal={() => handleOpenReserveModal()}
              onUpdateReservationStatus={handleUpdateReservationStatus}
              onExportPdf={() => setShowPdfModal(true)}
              onOpenQuickMessage={handleOpenQuickMessage}
            />
          )}

          {currentView === 'inventory' && (
            <InventoryView
              vehicles={vehicles}
              onOpenAddModal={() => setShowNewVehicleModal(true)}
              onUpdateVehicleStatus={handleUpdateVehicleStatus}
              onUpdateVehicle={handleUpdateVehicle}
              onOpenReserveModal={(vehId) => handleOpenReserveModal(vehId)}
              onExportPdf={() => setShowPdfModal(true)}
            />
          )}

          {currentView === 'sales' && (
            <SalesView
              sales={sales}
              onAddSale={(s) => setSales([s, ...sales])}
              onExportPdf={() => setShowPdfModal(true)}
              onOpenQuickMessage={handleOpenQuickMessage}
            />
          )}

          {currentView === 'leads' && (
            <LeadsView
              leads={leads}
              vehicles={vehicles}
              reservations={reservations}
              onOpenNewLeadModal={() => setShowNewLeadModal(true)}
              onUpdateLeadStatus={handleUpdateLeadStatus}
              onOpenReserveModal={(vehId, clientName) => handleOpenReserveModal(vehId, clientName)}
              onOpenQuickMessage={handleOpenQuickMessage}
            />
          )}

          {currentView === 'service' && (
            <ServiceView onOpenQuickMessage={handleOpenQuickMessage} />
          )}

          {currentView === 'users' && (
            <UsersView
              users={users}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              onBackToList={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              settings={settings}
              onSaveSettings={setSettings}
              isDarkMode={isDarkMode}
              onToggleDarkMode={handleToggleDarkMode}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      {showQuickMessageModal && (
        <QuickMessageModal
          isOpen={showQuickMessageModal}
          onClose={() => setShowQuickMessageModal(false)}
          initialRecipient={quickMessageRecipient}
          logs={messageLogs}
          onAddLog={handleAddMessageLog}
        />
      )}

      {showPdfModal && (
        <PdfExportModal
          onClose={() => setShowPdfModal(false)}
          vehicles={vehicles}
          overdueInvoices={overdueInvoices}
          settings={settings}
        />
      )}

      {showNewLeadModal && (
        <NewLeadModal
          onClose={() => setShowNewLeadModal(false)}
          onAddLead={handleAddLead}
          availableVehicles={vehicles}
        />
      )}

      {showNewVehicleModal && (
        <NewVehicleModal
          onClose={() => setShowNewVehicleModal(false)}
          onAddVehicle={handleAddVehicle}
        />
      )}

      {showReserveModal && (
        <NewReservationModal
          onClose={() => setShowReserveModal(false)}
          onAddReservation={handleAddReservation}
          vehicles={vehicles}
          leads={leads}
          reservations={reservations}
          preselectedVehicleId={reserveVehicleId}
          preselectedClientName={reserveClientName}
          onTriggerSnackBar={handleTriggerSnackBar}
        />
      )}

      {/* Global SnackBar Notifications Layer */}
      <SnackBar
        notifications={snackBars}
        onDismiss={handleDismissSnackBar}
      />
    </div>
  );
}
