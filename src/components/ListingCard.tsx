import React from 'react';
import { Heart, MapPin, ShieldCheck, Truck, Clock, MessageSquare } from 'lucide-react';
import { Listing } from '../types';
import { useApp } from '../context/AppContext';

interface ListingCardProps {
  listing: Listing;
}

const CONDITION_LABELS: Record<string, { text: string; bg: string }> = {
  new: { text: 'Новое', bg: 'bg-emerald-500 text-white' },
  like_new: { text: 'Как новое', bg: 'bg-blue-500 text-white' },
  good: { text: 'Хорошее', bg: 'bg-amber-500 text-white' },
  fair: { text: 'Б/У', bg: 'bg-slate-500 text-white' },
  for_parts: { text: 'На запчасти', bg: 'bg-rose-500 text-white' }
};

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const { 
    favorites, 
    toggleFavorite, 
    setActiveListingId, 
    setCurrentView,
    startOrOpenChatWithSeller,
    currentUser
  } = useApp();

  const isFavorited = favorites.includes(listing.id);
  const conditionInfo = CONDITION_LABELS[listing.condition] || { text: 'Б/У', bg: 'bg-slate-500 text-white' };

  // Calculate discount percentage
  const discountPercent = listing.originalPrice 
    ? Math.round(((listing.originalPrice - listing.price) / listing.originalPrice) * 100) 
    : 0;

  const handleCardClick = () => {
    setActiveListingId(listing.id);
    setCurrentView('listing_detail');
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(listing.id);
  };

  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    startOrOpenChatWithSeller(listing);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Moderation Status Banner if pending/rejected */}
      {listing.moderationStatus === 'pending' && (
        <div className="bg-amber-500 text-white text-[10px] font-bold px-3 py-1 text-center tracking-wide uppercase">
          ⏳ На проверке модератором
        </div>
      )}
      {listing.moderationStatus === 'rejected' && (
        <div className="bg-rose-600 text-white text-[10px] font-bold px-3 py-1 text-center tracking-wide uppercase">
          ⚠️ Отклонено: {listing.moderationReason || 'Нарушение правил'}
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
        <img
          src={listing.images[0] || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80'}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all shadow-md active:scale-90 ${
            isFavorited
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:text-rose-500 hover:bg-white'
          }`}
          title={isFavorited ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Badges on Top Left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm ${conditionInfo.bg}`}>
            {conditionInfo.text}
          </span>
          {discountPercent > 0 && (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500 text-white shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {listing.hasDelivery ? (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-600/90 backdrop-blur-sm text-white shadow-sm flex items-center gap-1">
              <Truck className="w-2.5 h-2.5" /> Доставка
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-600/95 backdrop-blur-sm text-white shadow-sm flex items-center gap-1">
              Без доставки
            </span>
          )}
        </div>

        {/* Sold overlay */}
        {listing.status === 'sold' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
            <span className="px-4 py-1.5 rounded-full bg-white/90 text-slate-900 font-extrabold text-xs uppercase tracking-wider shadow-lg">
              Продано
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-1.5">
            <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {listing.price.toLocaleString('ru-RU')} ₸
            </span>
            {listing.originalPrice && listing.originalPrice > listing.price && (
              <span className="text-xs text-slate-400 line-through">
                {listing.originalPrice.toLocaleString('ru-RU')} ₸
              </span>
            )}
            {listing.isNegotiable && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                Торг
              </span>
            )}
          </div>

          {/* Title */}
          <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {listing.title}
          </h4>
        </div>

        {/* Card Footer: City, Date & Quick Chat */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1 truncate mr-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{listing.city}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {currentUser?.id !== listing.sellerId && (
              <button
                onClick={handleChatClick}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 dark:bg-slate-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400 text-slate-600 dark:text-slate-300 transition"
                title="Написать продавцу"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
            )}
            <span className="text-[10px] text-slate-400">
              {new Date(listing.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
