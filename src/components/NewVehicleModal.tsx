import React, { useState } from 'react';
import { X, Car, Image, DollarSign, AlertCircle } from 'lucide-react';
import { Vehicle } from '../types';
import { isValidName, isValidVin } from '../utils/validation';

interface NewVehicleModalProps {
  onClose: () => void;
  onAddVehicle?: (v: Vehicle) => void;
  vehicleToEdit?: Vehicle | null;
  onUpdateVehicle?: (v: Vehicle) => void;
}

export const NewVehicleModal: React.FC<NewVehicleModalProps> = ({
  onClose,
  onAddVehicle,
  vehicleToEdit,
  onUpdateVehicle,
}) => {
  const [model, setModel] = useState(vehicleToEdit ? vehicleToEdit.model : '');
  const [category, setCategory] = useState<Vehicle['category']>(vehicleToEdit ? vehicleToEdit.category : 'Électrique');
  const [salePrice, setSalePrice] = useState(vehicleToEdit ? vehicleToEdit.salePrice : 85000);
  const [costPrice, setCostPrice] = useState(vehicleToEdit ? vehicleToEdit.costPrice : 72000);
  const [stockCount, setStockCount] = useState(vehicleToEdit ? vehicleToEdit.stockCount : 1);
  const [vin, setVin] = useState(vehicleToEdit ? vehicleToEdit.vin : ('ZFA' + Math.floor(1000000000 + Math.random() * 9000000000)));
  const [fuelType, setFuelType] = useState<Vehicle['fuelType']>(vehicleToEdit ? vehicleToEdit.fuelType : 'Électrique');
  const [status, setStatus] = useState<Vehicle['status']>(vehicleToEdit ? vehicleToEdit.status : 'Disponible');
  const [imageUrl, setImageUrl] = useState(vehicleToEdit ? vehicleToEdit.image : '');

  // Validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const defaultImages: Record<string, string> = {
    SUV: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    Berline: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    Compacte: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
    Coupé: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    Électrique: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
    Utilitaire: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!isValidName(model)) {
      newErrors.model = 'Le nom du modèle doit contenir au moins 3 caractères.';
    }

    if (Number(salePrice) <= 0 || isNaN(Number(salePrice))) {
      newErrors.salePrice = 'Le prix de vente doit être supérieur à 0 DT.';
    }

    if (Number(costPrice) <= 0 || isNaN(Number(costPrice))) {
      newErrors.costPrice = "Le coût d'acquisition doit être supérieur à 0 DT.";
    }

    if (Number(salePrice) > 0 && Number(costPrice) >= Number(salePrice)) {
      newErrors.costPrice = "Attention: Le coût d'acquisition est supérieur ou égal au prix de vente (marge négative).";
    }

    if (Number(stockCount) < 0 || isNaN(Number(stockCount))) {
      newErrors.stockCount = 'La quantité en stock doit être un nombre positif ou nul.';
    }

    if (!isValidVin(vin)) {
      newErrors.vin = 'Le code VIN doit comporter au moins 8 caractères alphanumériques.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const marginDt = Number(salePrice) - Number(costPrice);
    const marginPercent = Number(((marginDt / Number(salePrice)) * 100).toFixed(1));

    if (vehicleToEdit && onUpdateVehicle) {
      const updatedVehicle: Vehicle = {
        ...vehicleToEdit,
        model: model.trim(),
        category,
        salePrice: Number(salePrice),
        costPrice: Number(costPrice),
        marginDt,
        marginPercent,
        stockCount: Number(stockCount),
        status,
        image: imageUrl.trim() || vehicleToEdit.image || defaultImages[category] || defaultImages['Électrique'],
        vin: vin.trim(),
        fuelType,
      };
      onUpdateVehicle(updatedVehicle);
    } else if (onAddVehicle) {
      const newVehicle: Vehicle = {
        id: `v-${Date.now()}`,
        model: model.trim(),
        category,
        salePrice: Number(salePrice),
        costPrice: Number(costPrice),
        marginDt,
        marginPercent,
        stockCount: Number(stockCount),
        status: 'Disponible',
        image: imageUrl.trim() || defaultImages[category] || defaultImages['Électrique'],
        vin: vin.trim(),
        year: 2024,
        fuelType,
      };
      onAddVehicle(newVehicle);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full modal-shadow border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150 my-auto max-h-[90vh] flex flex-col shadow-2xl">
        {/* Fixed Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#001F3F] dark:bg-sky-600 text-white rounded-xl shadow-xs">
              <Car className="w-5 h-5 text-sky-300 dark:text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#000613] dark:text-white">
                {vehicleToEdit ? 'Modifier le Véhicule' : 'Ajouter un Véhicule au Stock'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {vehicleToEdit ? 'Mise à jour des informations, tarifs et disponibilité.' : 'Contrôle de conformité et calcul de marge automatique.'}
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

        {/* Scrollable Body */}
        <form id="vehicle-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4 text-xs font-semibold">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Nom du Modèle *</label>
            <input
              type="text"
              value={model}
              onChange={(e) => {
                setModel(e.target.value);
                if (errors.model) setErrors({ ...errors, model: '' });
              }}
              placeholder="Ex: FIAT 500e La Prima"
              className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-normal focus:outline-none transition-colors dark:bg-slate-800 dark:text-slate-100 ${
                errors.model ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30' : 'border-slate-200 dark:border-slate-700 focus:border-[#001F3F] dark:focus:border-sky-500'
              }`}
            />
            {errors.model && (
              <span className="flex items-center gap-1 text-red-600 dark:text-red-400 text-[11px] font-medium mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.model}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Catégorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-normal focus:outline-none focus:border-[#001F3F] dark:focus:border-sky-500 bg-white dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="Électrique">Électrique</option>
                <option value="SUV">SUV</option>
                <option value="Berline">Berline</option>
                <option value="Compacte">Compacte</option>
                <option value="Coupé">Coupé</option>
                <option value="Utilitaire">Utilitaire</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Motorisation</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-normal focus:outline-none focus:border-[#001F3F] dark:focus:border-sky-500 bg-white dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="Électrique">Électrique</option>
                <option value="Hybride">Hybride</option>
                <option value="Essence">Essence</option>
                <option value="Diesel">Diesel</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Prix de Vente (DT) *</label>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => {
                  setSalePrice(Number(e.target.value));
                  if (errors.salePrice) setErrors({ ...errors, salePrice: '' });
                }}
                className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-normal focus:outline-none transition-colors dark:bg-slate-800 dark:text-slate-100 ${
                  errors.salePrice ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30' : 'border-slate-200 dark:border-slate-700 focus:border-[#001F3F] dark:focus:border-sky-500'
                }`}
              />
              {errors.salePrice && (
                <span className="flex items-center gap-1 text-red-600 dark:text-red-400 text-[10px] font-medium mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.salePrice}
                </span>
              )}
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Coût d'Acquisition (DT) *</label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => {
                  setCostPrice(Number(e.target.value));
                  if (errors.costPrice) setErrors({ ...errors, costPrice: '' });
                }}
                className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-normal focus:outline-none transition-colors dark:bg-slate-800 dark:text-slate-100 ${
                  errors.costPrice ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30' : 'border-slate-200 dark:border-slate-700 focus:border-[#001F3F] dark:focus:border-sky-500'
                }`}
              />
              {errors.costPrice && (
                <span className="flex items-center gap-1 text-red-600 dark:text-red-400 text-[10px] font-medium mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.costPrice}
                </span>
              )}
            </div>
          </div>

          {/* Realtime Margin Preview */}
          <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300 font-medium">Marge brute estimée :</span>
            <span className={`font-black ${salePrice - costPrice > 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {(salePrice - costPrice).toLocaleString()} DT ({(( (salePrice - costPrice) / (salePrice || 1) ) * 100).toFixed(1)}%)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Quantité en Stock *</label>
              <input
                type="number"
                value={stockCount}
                onChange={(e) => {
                  setStockCount(Number(e.target.value));
                  if (errors.stockCount) setErrors({ ...errors, stockCount: '' });
                }}
                className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-normal focus:outline-none transition-colors dark:bg-slate-800 dark:text-slate-100 ${
                  errors.stockCount ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30' : 'border-slate-200 dark:border-slate-700 focus:border-[#001F3F] dark:focus:border-sky-500'
                }`}
              />
              {errors.stockCount && (
                <span className="flex items-center gap-1 text-red-600 dark:text-red-400 text-[10px] font-medium mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.stockCount}
                </span>
              )}
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Code VIN *</label>
              <input
                type="text"
                value={vin}
                onChange={(e) => {
                  setVin(e.target.value);
                  if (errors.vin) setErrors({ ...errors, vin: '' });
                }}
                className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-normal focus:outline-none transition-colors dark:bg-slate-800 dark:text-slate-100 ${
                  errors.vin ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30' : 'border-slate-200 dark:border-slate-700 focus:border-[#001F3F] dark:focus:border-sky-500'
                }`}
              />
              {errors.vin && (
                <span className="flex items-center gap-1 text-red-600 dark:text-red-400 text-[10px] font-medium mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.vin}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">URL de l'image (optionnel)</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-normal focus:outline-none focus:border-[#001F3F] dark:focus:border-sky-500 dark:bg-slate-800 dark:text-slate-100"
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
            form="vehicle-form"
            className="px-5 py-2.5 bg-[#001F3F] dark:bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-[#00142b] dark:hover:bg-sky-700 transition-colors cursor-pointer shadow-sm"
          >
            {vehicleToEdit ? 'Enregistrer les Modifications' : 'Ajouter au Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};
