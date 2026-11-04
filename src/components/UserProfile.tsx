import React, { useState } from 'react';
import { 
  Package, 
  List, 
  Heart, 
  Star, 
  Settings, 
  ShieldCheck, 
  Truck, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  MessageSquare,
  Clock,
  MapPin,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order, Listing } from '../types';

export const UserProfile: React.FC = () => {
  const { 
    currentUser, 
    listings, 
    orders, 
    reviews, 
    favorites, 
    deleteListing, 
    updateListing, 
    setActiveListingId, 
    setCurrentView,
    setIsReviewModalOpen,
    setReviewTargetOrder,
    replyToReview,
    updateUserProfile,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'listings' | 'favorites' | 'reviews' | 'settings'>('orders');

  // Profile Edit State
  const [nameInput, setNameInput] = useState(currentUser?.name || '');
  const [cityInput, setCityInput] = useState(currentUser?.city || 'Алматы');
  const [phoneInput, setPhoneInput] = useState(currentUser?.phone || '');
  const [bioInput, setBioInput] = useState(currentUser?.bio || '');

  // Reply state
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <p className="text-slate-500 mb-4">Пожалуйста, войдите в систему для доступа к личному кабинету</p>
      </div>
    );
  }

  // Filter user's specific data
  const myListings = listings.filter(l => l.sellerId === currentUser.id);
  const myOrders = orders.filter(o => o.buyerId === currentUser.id);
  const myFavorites = listings.filter(l => favorites.includes(l.id));
  const myReviews = reviews.filter(r => r.sellerId === currentUser.id);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: nameInput,
      city: cityInput,
      phone: phoneInput,
      bio: bioInput
    });
  };

  const handleOpenReview = (order: Order) => {
    setReviewTargetOrder(order);
    setIsReviewModalOpen(true);
  };

  const handleSendReply = (reviewId: string) => {
    const text = replyInputs[reviewId];
    if (!text || !text.trim()) return;
    replyToReview(reviewId, text.trim());
    setReplyInputs(prev => ({ ...prev, [reviewId]: '' }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-emerald-500/30 shrink-0"
          />

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                  <span>{currentUser.name}</span>
                  {currentUser.isVerified && (
                    <span className="text-emerald-500 text-base" title="Подтвержденный профиль">✓</span>
                  )}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">{currentUser.email}</p>
              </div>

              {currentUser.role === 'admin' && (
                <span className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold text-xs uppercase tracking-wide self-center sm:self-auto">
                  🛡️ Администратор
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {currentUser.bio || 'Пользователь не добавил описание'}
            </p>

            {/* Quick Stats Chips */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold">
                <Star className="w-4 h-4 fill-current text-amber-500" />
                <span>{currentUser.rating} ({currentUser.reviewsCount} отзывов)</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span>{currentUser.city}</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>На сервисе с {currentUser.registeredAt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'orders', label: 'История заказов', icon: <Package className="w-4 h-4" />, count: myOrders.length },
          { id: 'listings', label: 'Мои объявления', icon: <List className="w-4 h-4" />, count: myListings.length },
          { id: 'favorites', label: 'Избранное', icon: <Heart className="w-4 h-4" />, count: myFavorites.length },
          { id: 'reviews', label: 'Отзывы обо мне', icon: <Star className="w-4 h-4" />, count: myReviews.length },
          { id: 'settings', label: 'Настройки', icon: <Settings className="w-4 h-4" /> }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Orders History */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              История покупок и заказов с доставкой
            </h3>
            <span className="text-xs text-slate-400">Всего покупок: {myOrders.length}</span>
          </div>

          {myOrders.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-slate-400">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-semibold text-sm">У вас пока нет оформленных заказов</p>
              <p className="text-xs mt-1">Выберите понравившийся товар на главной и нажмите «Купить с доставкой»</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={order.listingImage}
                      alt=""
                      className="w-16 h-16 rounded-2xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                          {order.status === 'paid' ? 'Оплачен' : order.status === 'shipping' ? 'В пути' : order.status === 'completed' ? 'Доставлен и завершен' : order.status}
                        </span>
                        {order.trackingNumber && (
                          <span className="text-[10px] text-slate-400">
                            Трек: {order.trackingNumber}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {order.listingTitle}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Продавец: <b className="text-slate-700 dark:text-slate-300">{order.sellerName}</b> • Адрес: {order.deliveryAddress}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-700">
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                      {order.totalPrice.toLocaleString('ru-RU')} ₸
                    </span>
                    {!order.reviewed ? (
                      <button
                        onClick={() => handleOpenReview(order)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>Оставить отзыв</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Отзыв оставлен
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Listings */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Ваши размещенные объявления
            </h3>
            <button
              onClick={() => {
                setActiveListingId(null);
                setCurrentView('home');
              }}
              className="text-xs font-semibold text-emerald-600 hover:underline"
            >
              Перейти к ленте
            </button>
          </div>

          {myListings.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-slate-400">
              <List className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-semibold text-sm">У вас пока нет активных объявлений</p>
              <p className="text-xs mt-1">Нажмите кнопку «Продать» в шапке сайта, чтобы разместить ненужную вещь</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myListings.map(item => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img src={item.images[0]} alt="" className="w-16 h-16 rounded-2xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          item.moderationStatus === 'approved' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : item.moderationStatus === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}>
                          {item.moderationStatus === 'approved' ? 'Активно' : item.moderationStatus === 'pending' ? 'На модерации' : 'Отклонено'}
                        </span>
                        {item.status === 'sold' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                            Продано
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">
                          {item.views} просмотров • {item.favoritesCount} в избранном
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {item.price.toLocaleString('ru-RU')} ₸
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-700">
                    <button
                      onClick={() => {
                        setActiveListingId(item.id);
                        setCurrentView('listing_detail');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200"
                    >
                      Посмотреть
                    </button>
                    {item.status !== 'sold' && (
                      <button
                        onClick={() => {
                          updateListing(item.id, { status: 'sold' });
                          showToast('Объявление помечено как проданное', 'info');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-xs font-semibold hover:bg-emerald-100"
                      >
                        Снять с продажи
                      </button>
                    )}
                    <button
                      onClick={() => deleteListing(item.id)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Favorites */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Избранные товары ({myFavorites.length})
          </h3>
          {myFavorites.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-slate-400">
              <Heart className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-semibold text-sm">В избранном пусто</p>
              <p className="text-xs mt-1">Нажимайте сердечко на карточках товаров, чтобы следить за скидками</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myFavorites.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    setActiveListingId(item.id);
                    setCurrentView('listing_detail');
                  }}
                  className="p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-lg transition flex gap-3"
                >
                  <img src={item.images[0]} alt="" className="w-20 h-20 rounded-2xl object-cover shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                      {item.price.toLocaleString('ru-RU')} ₸
                    </span>
                    <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-2 mt-1">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 mt-2 block">{item.city}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Reviews about me */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Отзывы покупателей ({myReviews.length})
            </h3>
            <span className="text-xs text-amber-500 font-bold flex items-center gap-1">
              <Star className="w-4 h-4 fill-current" /> Средняя оценка: {currentUser.rating} из 5.0
            </span>
          </div>

          {myReviews.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-slate-400">
              <Star className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-semibold text-sm">Отзывов пока нет</p>
              <p className="text-xs mt-1">После совершения первых продаж покупатели смогут оставить вам оценку</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myReviews.map(rev => (
                <div
                  key={rev.id}
                  className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 space-y-3 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={rev.authorAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{rev.authorName}</div>
                        <div className="text-[10px] text-slate-400">{rev.createdAt} • Товар: {rev.listingTitle}</div>
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {rev.text}
                  </p>

                  {/* Tags */}
                  {rev.tags && rev.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {rev.tags.map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold">
                          ✓ {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Existing Reply */}
                  {rev.reply && (
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border-l-2 border-emerald-500 text-xs">
                      <div className="font-bold text-slate-800 dark:text-slate-200 mb-1">
                        Ваш ответ ({rev.reply.createdAt}):
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">{rev.reply.text}</p>
                    </div>
                  )}

                  {/* Reply Form if no reply yet */}
                  {!rev.reply && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Ответить на отзыв покупателя..."
                        value={replyInputs[rev.id] || ''}
                        onChange={e => setReplyInputs(prev => ({ ...prev, [rev.id]: e.target.value }))}
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                      <button
                        onClick={() => handleSendReply(rev.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                      >
                        Ответить
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 max-w-2xl shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">
            Настройки личного кабинета
          </h3>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                ФИО или имя профиля
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Город
              </label>
              <input
                type="text"
                value={cityInput}
                onChange={e => setCityInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Телефон для связи
              </label>
              <input
                type="text"
                value={phoneInput}
                onChange={e => setPhoneInput(e.target.value)}
                placeholder="+7 (999) 000-00-00"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                О себе (для покупателей)
              </label>
              <textarea
                rows={3}
                value={bioInput}
                onChange={e => setBioInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition"
            >
              Сохранить изменения
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
