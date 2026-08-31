import React, { useState } from 'react';
import { Vehicle } from '../types';
import { Search, Plus, Filter, Car, Tag, CheckCircle, AlertCircle, ChevronRight, Calendar, Edit3, ArrowUpDown, FileText } from 'lucide-react';
import { NewVehicleModal } from './NewVehicleModal';

interface InventoryViewProps {
  vehicles: Vehicle[];
  onOpenAddModal: () => void;
  onUpdateVehicleStatus: (id: string, newStatus: Vehicle['status']) => void;
  onUpdateVehicle?: (updatedVehicle: Vehicle) => void;
  onOpenReserveModal?: (vehicleId?: string) => void;
  onExportPdf?: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  vehicles,
  onOpenAddModal,
  onUpdateVehicleStatus,
  onUpdateVehicle,
  onOpenReserveModal,
  onExportPdf,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [priceSort, setPriceSort] = useState<'none' | 'asc' | 'desc'>('none');
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = v.model.toLowerCase().includes(search.toLowerCase()) || 
                          (v.vin && v.vin.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'Tous' || v.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    if (priceSort === 'asc') return a.salePrice - b.salePrice;
    if (priceSort === 'desc') return b.salePrice - a.salePrice;
    return 0;
  });

  const categories = ['Tous', 'SUV', 'Berline', 'Compacte', 'Coupé', 'Électrique'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000613] dark:text-white tracking-tight">
            Inventaire & Stock Véhicules
          </h1>
          <p className="text-sm text-[#5c5f61] dark:text-slate-400 mt-1">
            Gestion du parc automobile, disponibilité et rentabilité
          </p>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {onExportPdf && (
            <button
              onClick={onExportPdf}
              className="flex-1 sm:flex-initial bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-4 py-2.5 rounded-full text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#001F3F] dark:text-sky-400" />
              <span>Exporter PDF</span>
            </button>
          )}
          <button
            onClick={onOpenAddModal}
            className="flex-1 sm:flex-initial bg-[#001F3F] dark:bg-sky-600 text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#00142b] dark:hover:bg-sky-700 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un Véhicule</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#e2e2e2] dark:border-slate-800 ambient-shadow flex flex-col lg:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher modèle ou VIN..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-slate-100 focus:outline-none focus:border-[#001F3F]"
            />
          </div>

          {/* Price Sorting Selector */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1 px-2 text-slate-500 text-xs font-bold shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#001F3F] dark:text-sky-400" />
              <span className="hidden sm:inline">Tri prix :</span>
            </div>
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value as 'none' | 'asc' | 'desc')}
              className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="none">Par défaut</option>
              <option value="asc">Prix : Croissant (▲)</option>
              <option value="desc">Prix : Décroissant (▼)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#001F3F] dark:bg-sky-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedVehicles.map((v) => (
          <div
            key={v.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-[#e2e2e2] dark:border-slate-800 ambient-shadow overflow-hidden hover:shadow-md transition-all flex flex-col"
          >
            <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <img
                src={v.image}
                alt={v.model}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#001F3F] dark:text-sky-400">
                {v.category} • {v.fuelType}
              </div>
              <div className="absolute top-3 right-3">
                <select
                  value={v.status}
                  onChange={(e) => onUpdateVehicleStatus(v.id, e.target.value as any)}
                  className={`px-3 py-1 rounded-full text-xs font-bold border border-white/50 shadow-xs cursor-pointer focus:outline-none ${
                    v.status === 'Disponible'
                      ? 'bg-emerald-500 text-white'
                      : v.status === 'Réservé'
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-700 text-white'
                  }`}
                >
                  <option value="Disponible">Disponible</option>
                  <option value="Réservé">Réservé</option>
                  <option value="Vendu">Vendu</option>
                  <option value="En transit">En transit</option>
                </select>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#000613] dark:text-white">{v.model}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">VIN: {v.vin || 'N/A'}</p>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Prix Vente</span>
                    <span className="font-extrabold text-[#001F3F] dark:text-sky-400 text-sm">
                      {v.salePrice.toLocaleString()} DT
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Marge estimée</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                      +{v.marginDt.toLocaleString()} DT ({v.marginPercent}%)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Stock dispo : <strong>{v.stockCount} unités</strong></span>
                  <span className="text-[#001F3F] dark:text-sky-400 font-bold">Année {v.year}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => setEditingVehicle(v)}
                    className="flex-1 py-2 px-3 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Modifier</span>
                  </button>
                  {onOpenReserveModal && (
                    <button
                      onClick={() => onOpenReserveModal(v.id)}
                      className="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-[#001F3F] dark:hover:bg-sky-600 text-slate-800 dark:text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Réserver</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Vehicle Modal */}
      {editingVehicle && (
        <NewVehicleModal
          vehicleToEdit={editingVehicle}
          onClose={() => setEditingVehicle(null)}
          onUpdateVehicle={(updatedV) => {
            if (onUpdateVehicle) {
              onUpdateVehicle(updatedV);
            }
            setEditingVehicle(null);
          }}
        />
      )}
    </div>
  );
};
