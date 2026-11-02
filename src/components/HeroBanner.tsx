import React from 'react';
import { PlusCircle, ShieldCheck, Sparkles, Truck, HeartHandshake, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HeroBanner: React.FC = () => {
  const { setIsCreateModalOpen, currentUser, setIsAuthModalOpen, setFilters } = useApp();

  const handlePostClick = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
    } else {
      setIsCreateModalOpen(true);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 text-white p-6 sm:p-10 lg:p-12 mb-6 border border-emerald-900/30 shadow-xl">
      {/* Background glow effects */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl space-y-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>🇰🇿 Ресейл-маркетплейс Казахстана • Цены в тенге (₸)</span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
          Подарите вещам <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">вторую жизнь</span>
        </h1>

        <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-xl">
          Продавайте ненужные вещи в Алматы, Астане, Шымкенте и по всему Казахстану. Покупайте с безопасной сделкой или забирайте лично самовывозом без доставки!
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handlePostClick}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/30 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Разместить объявление</span>
          </button>

          <button
            onClick={() => setFilters(prev => ({ ...prev, deliveryMode: 'pickup_only', hasDeliveryOnly: false }))}
            className="px-4 py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs sm:text-sm border border-amber-400/30 transition flex items-center gap-1.5"
          >
            <span>📍 Товары без доставки (самовывоз)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setFilters(prev => ({ ...prev, category: 'electronics' }))}
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md text-white font-semibold text-xs sm:text-sm border border-white/10 transition flex items-center gap-1.5"
          >
            <span>Электроника</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>

        {/* Features row */}
        <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10 text-slate-300 text-[11px] sm:text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Защита сделок</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Быстрая доставка</span>
          </div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Честные отзывы</span>
          </div>
        </div>
      </div>
    </div>
  );
};
