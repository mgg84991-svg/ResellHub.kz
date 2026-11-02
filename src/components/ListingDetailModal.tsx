import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  Eye, 
  Calendar, 
  MessageSquare, 
  ShoppingBag, 
  Star, 
  CheckCircle2, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ListingDetailModal: React.FC = () => {
  const { 
    activeListingId, 
    listings, 
    setCurrentView, 
    favorites, 
    toggleFavorite, 
    startOrOpenChatWithSeller,
    setOrderTargetListing,
    setIsOrderModalOpen,
    currentUser,
    reviews,
    showToast
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const listing = listings.find(l => l.id === activeListingId);

  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <p className="text-slate-500 mb-4">Объявление не найдено или было удалено</p>
        <button
          onClick={() => setCurrentView('home')}
          className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold"
        >
          Вернуться на главную
        </button>
      </div>
    );
  }

  const isFavorited = favorites.includes(listing.id);
  const sellerReviews = reviews.filter(r => r.sellerId === listing.sellerId);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Ссылка скопирована в буфер обмена', 'success');
  };

  const handleBuyClick = () => {
    setOrderTargetListing(listing);
    setIsOrderModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад к списку объявлений</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5 transition"
            title="Поделиться"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Поделиться</span>
          </button>

          <button
            onClick={() => toggleFavorite(listing.id)}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
              isFavorited
                ? 'border-rose-300 bg-rose-50 dark:bg-rose-950/40 text-rose-600'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current text-rose-500' : ''}`} />
            <span className="hidden sm:inline">{isFavorited ? 'В избранном' : 'В избранное'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Photos Gallery & Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Gallery */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="relative aspect-[16/10] bg-slate-900 flex items-center justify-center">
              <img
                src={listing.images[activeImageIndex] || listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-contain"
              />

              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : listing.images.length - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white transition backdrop-blur-xs"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev < listing.images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white transition backdrop-blur-xs"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Status pill */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-sm">
                  {listing.condition === 'new' ? 'Новое' : listing.condition === 'like_new' ? 'Как новое' : 'Б/У'}
                </span>
                {listing.hasDelivery ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white flex items-center gap-1 shadow-md">
                    <Truck className="w-3.5 h-3.5" /> Доставка
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-600 text-white flex items-center gap-1 shadow-md">
                    Без доставки (Самовывоз)
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {listing.images.length > 1 && (
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 flex gap-2 overflow-x-auto border-t border-slate-100 dark:border-slate-700">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                      activeImageIndex === idx ? 'border-emerald-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Description */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(listing.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {listing.views} просмотров
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5" />
                  {listing.favoritesCount} в избранном
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {listing.title}
              </h1>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Состояние</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {listing.condition === 'new' ? 'Новое' : listing.condition === 'like_new' ? 'Идеальное' : listing.condition === 'good' ? 'Хорошее' : 'Б/У'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Город продажи</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{listing.city}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Торг</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {listing.isNegotiable ? 'Возможен (сауда)' : 'Без торга'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Безопасная сделка</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Поддерживается
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Категория</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{listing.subCategory || listing.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Способ передачи</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{listing.hasDelivery ? 'Доставка курьером' : 'Без доставки (самовывоз)'}</span>
              </div>
            </div>

            {/* Description Text */}
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                Описание продавца
              </h3>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {/* Location & Address */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>Местоположение в Казахстане</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {listing.city}{listing.address ? `, ${listing.address}` : ''}
              </p>
              <div className="mt-3 p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Точный адрес и ориентир для самовывоза согласовываются с продавцом в чате</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Price Card & Seller Info */}
        <div className="lg:col-span-4 space-y-6">
          {/* Price & Action Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm sticky top-24 space-y-5">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Стоимость</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {listing.price.toLocaleString('ru-RU')} ₸
                </span>
                {listing.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {listing.originalPrice.toLocaleString('ru-RU')} ₸
                  </span>
                )}
              </div>
              {listing.isNegotiable && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1 inline-block">
                  💬 Продавец готов к разумному торгу
                </span>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2.5">
              {currentUser?.id !== listing.sellerId && (
                <>
                  <button
                    onClick={handleBuyClick}
                    disabled={listing.status === 'sold'}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition active:scale-98"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {listing.status === 'sold'
                        ? 'Товар продан'
                        : listing.hasDelivery
                        ? 'Купить с доставкой'
                        : 'Оформить безопасный самовывоз'}
                    </span>
                  </button>

                  <button
                    onClick={() => startOrOpenChatWithSeller(listing)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold text-sm flex items-center justify-center gap-2 transition active:scale-98"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-500" />
                    <span>Написать продавцу</span>
                  </button>
                </>
              )}

              {currentUser?.id === listing.sellerId && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-center text-xs text-amber-800 dark:text-amber-200 font-semibold">
                  Это ваше объявление. Вы можете отредактировать его в Личном кабинете.
                </div>
              )}
            </div>

            {/* Safety Guarantee */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Безопасная сделка ResellHub</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                Деньги резервируются и переводятся продавцу только после того, как вы лично проверите товар при получении.
              </p>
            </div>

            {/* Seller Profile Card */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={listing.sellerAvatar}
                  alt={listing.sellerName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/30"
                />
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{listing.sellerName}</span>
                    <span className="text-emerald-500" title="Проверенный продавец">✓</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1 font-semibold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" /> {listing.sellerRating}
                    </span>
                    <span>•</span>
                    <span>{listing.sellerReviewsCount} отзывов</span>
                  </div>
                </div>
              </div>

              {/* Seller Reviews Preview */}
              <div className="space-y-2.5 mt-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Последние отзывы о продавце:
                </span>
                {sellerReviews.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Пока нет отзывов</p>
                ) : (
                  sellerReviews.slice(0, 2).map(rev => (
                    <div key={rev.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{rev.authorName}</span>
                        <div className="flex text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 line-clamp-2 text-[11px]">
                        "{rev.text}"
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
