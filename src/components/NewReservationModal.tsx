import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Car, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Check, 
  ShieldCheck, 
  AlertCircle, 
  XCircle,
  AlertTriangle,
  Sparkles,
  Info
} from 'lucide-react';
import { Vehicle, TestDriveReservation, Lead } from '../types';
import { isValidName, isValidPhone, isValidEmail, isFutureOrTodayDate } from '../utils/validation';
import { SnackBarNotification } from './SnackBar';

interface NewReservationModalProps {
  onClose: () => void;
  onAddReservation: (res: TestDriveReservation) => void;
  vehicles: Vehicle[];
  leads?: Lead[];
  reservations?: TestDriveReservation[];
  preselectedVehicleId?: string;
  preselectedClientName?: string;
  onTriggerSnackBar?: (notification: Omit<SnackBarNotification, 'id'>) => void;
}

export const NewReservationModal: React.FC<NewReservationModalProps> = ({
  onClose,
  onAddReservation,
  vehicles,
  leads = [],
  reservations = [],
  preselectedVehicleId,
  preselectedClientName,
  onTriggerSnackBar,
}) => {
  const defaultVehicle = vehicles.find((v) => v.id === preselectedVehicleId) || vehicles[0];

  const [clientName, setClientName] = useState(preselectedClientName || '');
  const [phone, setPhone] = useState('+216 ');
  const [email, setEmail] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState(defaultVehicle?.id || '');
  const [reservationType, setReservationType] = useState<'Test Drive (Essai)' | 'Visite Véhicule'>('Test Drive (Essai)');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('10:00');
  const [assignedAgent, setAssignedAgent] = useState('Karim Bouazizi');
  const [notes, setNotes] = useState('');

  // Validation & Rejection Banner state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [rejectionMessage, setRejectionMessage] = useState<string | null>(null);

  // If client selects a known lead, autofill
  const handleSelectLead = (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (lead) {
      setClientName(lead.clientName);
      setPhone(lead.phone);
      setEmail(lead.email);
      const matchedVeh = vehicles.find((v) => v.model === lead.interestedModel);
      if (matchedVeh) {
        setSelectedVehicleId(matchedVeh.id);
      }
      setErrors({});
      setRejectionMessage(null);
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    const rejectionReasons: string[] = [];

    if (!isValidName(clientName)) {
      newErrors.clientName = 'Le nom du client doit comporter au moins 3 caractères.';
      rejectionReasons.push('Nom du client incomplet (3 car. min)');
    }

    if (!isValidPhone(phone)) {
      newErrors.phone = 'Numéro de téléphone invalide (au moins 8 chiffres requis).';
      rejectionReasons.push('Téléphone invalide');
    }

    if (email && !isValidEmail(email)) {
      newErrors.email = 'Adresse email invalide (format: exemple@domaine.com).';
      rejectionReasons.push('Email non conforme');
    }

    if (!isFutureOrTodayDate(date)) {
      newErrors.date = 'La date du rendez-vous ne peut pas être dans le passé.';
      rejectionReasons.push('Date dans le passé');
    }

    if (!selectedVehicleId) {
      newErrors.vehicle = 'Veuillez sélectionner un véhicule.';
      rejectionReasons.push('Aucun véhicule sélectionné');
    } else {
      const selectedVeh = vehicles.find((v) => v.id === selectedVehicleId);
      if (selectedVeh && selectedVeh.status === 'Vendu') {
        newErrors.vehicle = 'Ce véhicule est marqué comme Vendu et non disponible pour essai.';
        rejectionReasons.push(`Véhicule "${selectedVeh.model}" déjà vendu`);
      } else if (selectedVeh && selectedVeh.stockCount <= 0) {
        newErrors.vehicle = 'Rupture de stock pour ce véhicule.';
        rejectionReasons.push(`Véhicule "${selectedVeh.model}" en rupture de stock`);
      }
    }

    // Check for conflicting reservations at the same time slot on the same vehicle
    if (selectedVehicleId && date && timeSlot) {
      const conflictingRes = reservations.find(
        (r) =>
          r.vehicleId === selectedVehicleId &&
          r.date === date &&
          r.timeSlot === timeSlot &&
          r.status === 'Confirmée'
      );
      if (conflictingRes) {
        newErrors.timeSlot = `Le créneau de ${timeSlot} est déjà réservé pour ce modèle le ${date}.`;
        rejectionReasons.push(`Créneau de ${timeSlot} déjà occupé par un autre client`);
      }
    }

    setErrors(newErrors);

    if (rejectionReasons.length > 0) {
      const fullReason = rejectionReasons.join(' • ');
      setRejectionMessage(fullReason);
      return false;
    }

    setRejectionMessage(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validate();

    if (!isValid) {
      const summaryMsg = rejectionMessage || 'Veuillez corriger les informations requises pour valider le rendez-vous.';
      
      // Trigger Rejection Snack Bar
      if (onTriggerSnackBar) {
        onTriggerSnackBar({
          type: 'rejection',
          title: reservationType === 'Visite Véhicule' ? 'Demande d\'Inspection Rejetée' : 'Demande d\'Essai Rejetée',
          message: summaryMsg,
          details: `Client : ${clientName || 'Inconnu'} • Véhicule : ${vehicles.find((v) => v.id === selectedVehicleId)?.model || 'Non sélectionné'}`,
          badge: 'Formulaire Refusé',
          duration: 6000,
        });
      }
      return;
    }

    const veh = vehicles.find((v) => v.id === selectedVehicleId);
    const vehicleModel = veh ? veh.model : 'Modèle Sélectionné';

    const newRes: TestDriveReservation = {
      id: `res-${Date.now()}`,
      clientName: clientName.trim(),
      phone: phone.trim(),
      email: email.trim() || 'client@domaine.tn',
      vehicleId: selectedVehicleId,
      vehicleModel,
      type: reservationType,
      date,
      timeSlot,
      assignedAgent,
      status: 'Confirmée',
      notes: notes.trim(),
      createdAt: new Date().toLocaleDateString('fr-FR'),
    };

    onAddReservation(newRes);

    // Trigger Success Snack Bar
    const isInspection = reservationType === 'Visite Véhicule';
    if (onTriggerSnackBar) {
      onTriggerSnackBar({
        type: 'success',
        title: isInspection ? 'Inspection & Visite Confirmée' : 'Test Drive (Essai) Confirmé',
        message: `${isInspection ? 'Visite & inspection atelier' : 'Essai sur route'} planifié(e) avec succès pour ${newRes.clientName}.`,
        details: `${newRes.vehicleModel} • ${newRes.date} à ${newRes.timeSlot} • Conseiller : ${newRes.assignedAgent}`,
        badge: 'Réservation Validée ✓',
        duration: 6000,
      });
    }

    onClose();
  };

  // Explicit rejection / cancellation trigger by user
  const handleExplicitDecline = () => {
    if (onTriggerSnackBar) {
      onTriggerSnackBar({
        type: 'rejection',
        title: 'Demande de Réservation Annulée / Déclinée',
        message: `La création du rendez-vous pour ${clientName || 'ce prospect'} a été abandonnée.`,
        badge: 'Annulé',
        duration: 4000,
      });
    }
    onClose();
  };

  const timeSlots = ['09:00', '10:00', '11:15', '14:00', '15:30', '17:00'];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full modal-shadow border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150 my-auto max-h-[90vh] flex flex-col shadow-2xl">
        {/* Fixed Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#001F3F] dark:bg-sky-600 text-white rounded-xl shadow-xs">
              <Calendar className="w-5 h-5 text-sky-300 dark:text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#000613] dark:text-white flex items-center gap-2">
                <span>{reservationType === 'Visite Véhicule' ? 'Planifier une Inspection / Visite' : 'Réserver un Test Drive (Essai)'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-sky-100 dark:bg-sky-950/60 text-[#001F3F] dark:text-sky-300 rounded-full border border-sky-300 dark:border-sky-800">
                  Direct CRM
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Planification des essais sur route et inspections techniques en concession.
              </p>
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

        {/* Scrollable Form Body */}
        <form id="reservation-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4 text-xs">
          
          {/* Rejection / Validation Warning Alert Banner */}
          {rejectionMessage && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/80 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 text-red-800 dark:text-red-300">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-extrabold text-xs text-red-900 dark:text-red-200">
                  Demande Rejetée — Veuillez corriger les éléments suivants :
                </p>
                <p className="text-[11px] text-red-700 dark:text-red-300 font-medium mt-0.5">
                  {rejectionMessage}
                </p>
              </div>
            </div>
          )}

          {/* Known Lead Quick Select */}
          {leads.length > 0 && !preselectedClientName && (
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <label className="block text-slate-700 dark:text-slate-200 font-bold mb-1">
                Charger un prospect existant (optionnel)
              </label>
              <select
                onChange={(e) => handleSelectLead(e.target.value)}
                defaultValue=""
                className="w-full bg-white dark:bg-slate-900 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-[#001F3F] dark:focus:border-sky-500"
              >
                <option value="" disabled>-- Sélectionner un prospect existant --</option>
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.clientName} — Intéressé par {l.interestedModel} ({l.phone})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Type of Reservation Toggle */}
          <div>
            <label className="block text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider mb-2">
              Type de Prestation / Rendez-vous *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setReservationType('Test Drive (Essai)');
                  setRejectionMessage(null);
                }}
                className={`py-3 px-4 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  reservationType === 'Test Drive (Essai)'
                    ? 'bg-[#001F3F] dark:bg-sky-600 text-white border-[#001F3F] dark:border-sky-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>Test Drive (Essai Route)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setReservationType('Visite Véhicule');
                  setRejectionMessage(null);
                }}
                className={`py-3 px-4 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  reservationType === 'Visite Véhicule'
                    ? 'bg-[#001F3F] dark:bg-sky-600 text-white border-[#001F3F] dark:border-sky-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Visite & Inspection</span>
              </button>
            </div>
          </div>

          {/* Client Info */}
          <div className="space-y-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Nom Complet du Client *</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => {
                    setClientName(e.target.value);
                    if (errors.clientName) setErrors({ ...errors, clientName: '' });
                    if (rejectionMessage) setRejectionMessage(null);
                  }}
                  placeholder="Ex: M. Skander Ben Ahmed"
                  className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-slate-900 dark:text-slate-100 dark:bg-slate-800 focus:outline-none transition-colors ${
                    errors.clientName ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30' : 'border-slate-300 dark:border-slate-700 focus:border-[#001F3F] dark:focus:border-sky-500'
                  }`}
                />
              </div>
              {errors.clientName && (
                <span className="flex items-center gap-1 text-red-600 dark:text-red-400 text-[11px] font-medium mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.clientName}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Téléphone *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors({ ...errors, phone: '' });
                      if (rejectionMessage) setRejectionMessage(null);
                    }}
                    placeholder="+216 98 000 000"
                    className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-slate-900 dark:text-slate-100 dark:bg-slate-800 focus:outline-none transition-colors ${
                      errors.phone ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30' : 'border-slate-300 dark:border-slate-700 focus:border-[#001F3F] dark:focus:border-sky-500'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <span className="flex items-center gap-1 text-red-600 dark:text-red-400 text-[10px] font-medium mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {errors.phone}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Email Client (Optionnel)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: '' });
                      if (rejectionMessage) setRejectionMessage(null);
                    }}
                    placeholder="client@mail.tn"
                    className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-slate-900 dark:text-slate-100 dark:bg-slate-800 focus:outline-none transition-colors ${
                      errors.email ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30' : 'border-slate-300 dark:border-slate-700 focus:border-[#001F3F] dark:focus:border-sky-500'
                    }`}
                  />
                </div>
                {errors.email && (
                  <span className="flex items-center gap-1 text-red-600 dark:text-red-400 text-[10px] font-medium mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {errors.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Vehicle Selection */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Véhicule Réservé *</label>
            <select
              value={selectedVehicleId}
              onChange={(e) => {
                setSelectedVehicleId(e.target.value);
                if (errors.vehicle) setErrors({ ...errors, vehicle: '' });
                if (rejectionMessage) setRejectionMessage(null);
              }}
              className={`w-full py-2.5 px-3 border rounded-xl text-slate-900 dark:text-slate-100 font-semibold focus:outline-none bg-white dark:bg-slate-800 ${
                errors.vehicle ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30' : 'border-slate-300 dark:border-slate-700 focus:border-[#001F3F] dark:focus:border-sky-500'
              }`}
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.model} — {v.category} ({v.salePrice.toLocaleString()} DT) - Stock: {v.stockCount} [{v.status}]
                </option>
              ))}
            </select>
            {errors.vehicle && (
              <span className="flex items-center gap-1 text-red-600 dark:text-red-400 text-[10px] font-medium mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.vehicle}
              </span>
            )}
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Date du rendez-vous *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (errors.date) setErrors({ ...errors, date: '' });
                  if (rejectionMessage) setRejectionMessage(null);
                }}
                className={`w-full py-2.5 px-3 border rounded-xl text-slate-900 dark:text-slate-100 font-semibold focus:outline-none transition-colors bg-white dark:bg-slate-800 ${
                  errors.date ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30' : 'border-slate-300 dark:border-slate-700 focus:border-[#001F3F] dark:focus:border-sky-500'
                }`}
              />
              {errors.date && (
                <span className="flex items-center gap-1 text-red-600 dark:text-red-400 text-[10px] font-medium mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.date}
                </span>
              )}
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Créneau Horaire *</label>
              <div className="grid grid-cols-3 gap-1.5">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      setTimeSlot(slot);
                      if (errors.timeSlot) setErrors({ ...errors, timeSlot: '' });
                      if (rejectionMessage) setRejectionMessage(null);
                    }}
                    className={`py-2 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                      timeSlot === slot
                        ? 'bg-[#001F3F] dark:bg-sky-600 text-white border-[#001F3F] dark:border-sky-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              {errors.timeSlot && (
                <span className="flex items-center gap-1 text-red-600 dark:text-red-400 text-[10px] font-medium mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.timeSlot}
                </span>
              )}
            </div>
          </div>

          {/* Agent Commercial */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Agent Commercial Assigné</label>
            <select
              value={assignedAgent}
              onChange={(e) => setAssignedAgent(e.target.value)}
              className="w-full py-2.5 px-3 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#001F3F] dark:focus:border-sky-500 bg-white dark:bg-slate-800"
            >
              <option value="Jean Dupont">Jean Dupont (Admin)</option>
              <option value="Karim Bouazizi">Karim Bouazizi (Conseiller Commercial)</option>
              <option value="Youssef Ben Ammar">Youssef Ben Ammar (Directeur)</option>
              <option value="Inès Ben Salem">Inès Ben Salem (SAV & Inspection)</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Notes / Instructions particulières</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Permis de conduire vérifié, souhaite tester les accélérations sur autoroute ou vérifier le coffre."
              className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 dark:bg-slate-800 focus:outline-none focus:border-[#001F3F] dark:focus:border-sky-500"
            />
          </div>
        </form>

        {/* Fixed Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white dark:bg-slate-900 rounded-b-3xl">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:flex">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Vérification & alerte en temps réel</span>
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleExplicitDecline}
              className="px-3.5 py-2.5 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 font-bold rounded-xl transition-colors cursor-pointer text-xs"
              title="Décliner / Rejeter la réservation"
            >
              Décliner
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs"
            >
              Fermer
            </button>
            <button
              type="submit"
              form="reservation-form"
              className="px-5 py-2.5 bg-[#001F3F] dark:bg-sky-600 text-white font-bold rounded-xl hover:bg-[#00142b] dark:hover:bg-sky-700 transition-colors shadow-sm cursor-pointer text-xs flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Valider le Rendez-vous</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
