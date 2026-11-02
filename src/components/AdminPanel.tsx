import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Users, 
  Layers, 
  BarChart3, 
  AlertTriangle, 
  Search,
  Eye,
  UserCheck,
  UserX,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Listing, User, ModerationStatus } from '../types';

export const AdminPanel: React.FC = () => {
  const { 
    currentUser, 
    listings, 
    users, 
    moderateListing, 
    deleteListing, 
    toggleUserBan, 
    changeUserRole,
    categories,
    setCurrentView,
    setActiveListingId,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'moderation' | 'users' | 'content'>('moderation');
  const [moderationFilter, setModerationFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [userSearch, setUserSearch] = useState('');
  const [rejectReasonInputs, setRejectReasonInputs] = useState<Record<string, string>>({});

  // Access check
  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Доступ ограничен
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Для доступа к панели администратора требуются права Администратора или Модератора.
        </p>
        <button
          onClick={() => setCurrentView('home')}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
        >
          На главную
        </button>
      </div>
    );
  }

  // Filter listings by moderation status
  const filteredListings = listings.filter(l => {
    if (moderationFilter === 'all') return true;
    return l.moderationStatus === moderationFilter;
  });

  const pendingCount = listings.filter(l => l.moderationStatus === 'pending').length;

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleApprove = (id: string) => {
    moderateListing(id, 'approved');
  };

  const handleReject = (id: string) => {
    const reason = rejectReasonInputs[id] || 'Несоответствие правилам описания товара';
    moderateListing(id, 'rejected', reason);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Banner & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Вернуться на сайт</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <ShieldCheck className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <span>Панель модерации и управления</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Контроль качества объявлений, модерация контента и управление пользователями ResellHub
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 px-4 py-2.5 rounded-2xl text-xs font-bold text-purple-700 dark:text-purple-300">
          <span>Вы вошли как: <b>{currentUser.name}</b></span>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Всего объявлений</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{listings.length}</div>
          <span className="text-[10px] text-emerald-500 font-medium">Активная база маркетплейса</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Очередь модерации</span>
          <div className="text-2xl font-black text-amber-500">{pendingCount}</div>
          <span className="text-[10px] text-amber-500 font-medium">Требуют решения модератора</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Пользователей</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{users.length}</div>
          <span className="text-[10px] text-purple-500 font-medium">Зарегистрированные профили</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Категорий товаров</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{categories.length}</div>
          <span className="text-[10px] text-slate-400 font-medium">Каталог разделов</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold max-w-md">
        <button
          onClick={() => setActiveTab('moderation')}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'moderation' 
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>Модерация</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px]">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'users' 
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Пользователи ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'content' 
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Каталог</span>
        </button>
      </div>

      {/* Tab 1: Moderation Queue */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          {/* Subfilter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'pending', label: `Ожидают проверки (${pendingCount})` },
              { id: 'approved', label: 'Одобренные' },
              { id: 'rejected', label: 'Отклоненные' },
              { id: 'all', label: 'Все объявления' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setModerationFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  moderationFilter === f.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredListings.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-slate-400">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-500 opacity-60" />
              <p className="font-bold text-sm text-slate-700 dark:text-slate-300">Очередь чиста</p>
              <p className="text-xs mt-1">Нет объявлений с выбранным статусом</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredListings.map(item => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <img src={item.images[0]} alt="" className="w-20 h-20 rounded-2xl object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            item.moderationStatus === 'approved' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : item.moderationStatus === 'pending'
                              ? 'bg-amber-100 text-amber-700 animate-pulse'
                              : 'bg-rose-100 text-rose-700'
                          }`}>
                            {item.moderationStatus === 'approved' ? 'Одобрено' : item.moderationStatus === 'pending' ? 'Ожидает проверки' : 'Отклонено'}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Продавец: <b className="text-slate-700 dark:text-slate-200">{item.sellerName}</b> ({item.city})
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white truncate">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs mt-1">
                          <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                            {item.price.toLocaleString('ru-RU')} ₸
                          </span>
                          <span className="text-slate-400">• Категория: {item.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => {
                          setActiveListingId(item.id);
                          setCurrentView('listing_detail');
                        }}
                        className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition flex items-center gap-1"
                        title="Просмотреть"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Открыть</span>
                      </button>

                      {item.moderationStatus !== 'approved' && (
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Одобрить</span>
                        </button>
                      )}

                      {item.moderationStatus !== 'rejected' && (
                        <button
                          onClick={() => handleReject(item.id)}
                          className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Отклонить</span>
                        </button>
                      )}

                      <button
                        onClick={() => deleteListing(item.id)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        title="Удалить навсегда"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Description preview */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {item.description}
                  </div>

                  {/* Optional Reject Reason Input */}
                  {item.moderationStatus === 'pending' && (
                    <div className="pt-2 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Причина отклонения (если необходимо указать продавцу)..."
                        value={rejectReasonInputs[item.id] || ''}
                        onChange={e => setRejectReasonInputs(prev => ({ ...prev, [item.id]: e.target.value }))}
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: User Management */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-sm flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Поиск по имени или email..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
              />
            </div>
            <span className="text-xs text-slate-400">Найдено: {filteredUsers.length}</span>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredUsers.map(user => (
                <div key={user.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt="" className="w-11 h-11 rounded-full object-cover" />
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{user.name}</span>
                        {user.isBanned && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold">
                            ЗАБЛОКИРОВАН
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {user.email} • {user.city} • Рейтинг: ⭐ {user.rating} ({user.reviewsCount} отзывов)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Role selector */}
                    <select
                      value={user.role}
                      onChange={e => changeUserRole(user.id, e.target.value as any)}
                      className="text-xs font-semibold py-1.5 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white border-none focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="user">Пользователь</option>
                      <option value="moderator">Модератор</option>
                      <option value="admin">Администратор</option>
                    </select>

                    {/* Ban toggle */}
                    <button
                      onClick={() => toggleUserBan(user.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                        user.isBanned
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                          : 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60'
                      }`}
                    >
                      {user.isBanned ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Разблокировать</span>
                        </>
                      ) : (
                        <>
                          <UserX className="w-3.5 h-3.5" />
                          <span>Заблокировать</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Categories & Content */}
      {activeTab === 'content' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Категории маркетплейса
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => (
              <div
                key={cat.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{cat.name}</h4>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {cat.count} товаров
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Подкатегории: {cat.subCategories.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
