import React from 'react';
import { RotateCcw, Truck, Tag, ShieldCheck, ArrowUpDown, X, Store } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ItemCondition, DeliveryFilterMode } from '../types';
import { CITIES_KZ } from '../data/mockData';

interface FilterSidebarProps {
  onCloseMobile?: () => void;
  isMobileModal?: boolean;
}

const CONDITIONS: { id: ItemCondition; label: string; desc: string }[] = [
  { id: 'new', label: 'Новое (с биркой / в коробке)', desc: 'Не использовалось' },
  { id: 'like_new', label: 'Отличное (как новое)', desc: 'Минимальные следы использования' },
  { id: 'good', label: 'Хорошее', desc: 'Полностью рабочее, бережный уход' },
  { id: 'fair', label: 'Удовлетворительное', desc: 'Заметные следы, требует чистки' },
  { id: 'for_parts', label: 'На запчасти / ремонт', desc: 'Неисправно или разукомплектовано' }
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ onCloseMobile, isMobileModal }) => {
  const { filters, setFilters, resetFilters } = useApp();

  const handleConditionToggle = (cond: ItemCondition) => {
    setFilters(prev => {
      const exists = prev.condition.includes(cond);
      return {
        ...prev,
        condition: exists ? prev.condition.filter(c => c !== cond) : [...prev.condition, cond]
      };
    });
  };

  const handlePricePreset = (min: number | null, max: number | null) => {
    setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }));
  };

  return (
    <div className={`space-y-6 ${isMobileModal ? 'p-4' : 'bg-white dark:bg-slate-800/80 p-5 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm'}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
        <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
          <span>Фильтры</span>
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={resetFilters}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Сбросить</span>
          </button>
          {isMobileModal && (
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* DELIVERY MODE: "Поиск товара без доставки" */}
      <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
          <Store className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Способ получения товара:</span>
        </label>
        
        <div className="space-y-1.5 text-xs">
          <button
            type="button"
            onClick={() => setFilters(prev => ({ ...prev, deliveryMode: 'all', hasDeliveryOnly: false }))}
            className={`w-full py-2 px-3 rounded-xl font-semibold text-left transition flex items-center justify-between ${
              filters.deliveryMode === 'all'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <span>Все товары</span>
            {filters.deliveryMode === 'all' && <span>✓</span>}
          </button>

          <button
            type="button"
            onClick={() => setFilters(prev => ({ ...prev, deliveryMode: 'pickup_only', hasDeliveryOnly: false }))}
            className={`w-full py-2 px-3 rounded-xl font-bold text-left transition flex items-center justify-between ${
              filters.deliveryMode === 'pickup_only'
                ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100/50'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span>📍 Только самовывоз (БЕЗ доставки)</span>
            </div>
            {filters.deliveryMode === 'pickup_only' && <span>✓</span>}
          </button>

          <button
            type="button"
            onClick={() => setFilters(prev => ({ ...prev, deliveryMode: 'delivery_only', hasDeliveryOnly: true }))}
            className={`w-full py-2 px-3 rounded-xl font-semibold text-left transition flex items-center justify-between ${
              filters.deliveryMode === 'delivery_only'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              <span>Только с доставкой</span>
            </div>
            {filters.deliveryMode === 'delivery_only' && <span>✓</span>}
          </button>
        </div>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-emerald-500" />
          <span>Сортировка</span>
        </label>
        <select
          value={filters.sortBy}
          onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
          className="w-full text-xs sm:text-sm font-medium py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="newest">Сначала новые объявления</option>
          <option value="price_asc">Сначала дешевле (₸)</option>
          <option value="price_desc">Сначала дороже (₸)</option>
          <option value="popular">По популярности и просмотрам</option>
        </select>
      </div>

      {/* Price Range in Tenge (₸) */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-emerald-500" />
          <span>Цена, ₸ (тенге)</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-slate-400">от</span>
            <input
              type="number"
              placeholder="0"
              value={filters.minPrice ?? ''}
              onChange={e => {
                const val = e.target.value ? Number(e.target.value) : null;
                setFilters(prev => ({ ...prev, minPrice: val }));
              }}
              className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-slate-400">до</span>
            <input
              type="number"
              placeholder="500 000"
              value={filters.maxPrice ?? ''}
              onChange={e => {
                const val = e.target.value ? Number(e.target.value) : null;
                setFilters(prev => ({ ...prev, maxPrice: val }));
              }}
              className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Quick price chips in Tenge */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          <button
            onClick={() => handlePricePreset(null, 25000)}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition"
          >
            до 25 000 ₸
          </button>
          <button
            onClick={() => handlePricePreset(25000, 100000)}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition"
          >
            25k - 100k ₸
          </button>
          <button
            onClick={() => handlePricePreset(100000, 250000)}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition"
          >
            100k - 250k ₸
          </button>
        </div>
      </div>

      {/* City in Kazakhstan */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Город в Казахстане
        </label>
        <select
          value={filters.city}
          onChange={e => setFilters(prev => ({ ...prev, city: e.target.value }))}
          className="w-full text-xs sm:text-sm font-medium py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          {CITIES_KZ.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Condition checkboxes */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
          Состояние товара
        </label>
        <div className="space-y-2">
          {CONDITIONS.map(cond => {
            const isChecked = filters.condition.includes(cond.id);
            return (
              <label
                key={cond.id}
                className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none group"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleConditionToggle(cond.id)}
                  className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                />
                <div>
                  <div className={`font-semibold ${isChecked ? 'text-emerald-600 dark:text-emerald-400' : 'group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                    {cond.label}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">
                    {cond.desc}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {isMobileModal && (
        <button
          onClick={onCloseMobile}
          className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/25"
        >
          Применить фильтры
        </button>
      )}
    </div>
  );
};
