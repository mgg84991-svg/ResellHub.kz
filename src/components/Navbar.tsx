import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  PlusCircle, 
  MessageSquare, 
  Bell, 
  Sun, 
  Moon, 
  MapPin, 
  User as UserIcon, 
  ShieldCheck, 
  LogOut, 
  Package, 
  Layers, 
  X,
  ChevronDown,
  Sparkles,
  ShoppingBag,
  SlidersHorizontal
} from 'lucide-react';
import { useApp } from '../context/AppContext';

import { CITIES_KZ } from '../data/mockData';
import { PWAInstallButton } from './PWAInstallButton';
import { ResellHubLogo } from './ResellHubLogo';

interface NavbarProps {
  onToggleFiltersMobile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleFiltersMobile }) => {
  const { 
    currentUser, 
    logout, 
    setIsAuthModalOpen, 
    openAuthModal,
    setIsCreateModalOpen,
    setIsChatModalOpen,
    unreadMessagesCount,
    unreadNotificationsCount,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    currentView,
    setCurrentView,
    filters,
    setFilters,
    selectedCity,
    setSelectedCity,
    categories,
    isDarkMode,
    toggleDarkMode,
    showToast,
    setIsBadgeModalOpen
  } = useApp();

  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const cityRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setIsCityDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (catalogRef.current && !catalogRef.current.contains(e.target as Node)) {
        setIsCatalogOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
    if (currentView !== 'home') {
      setCurrentView('home');
    }
  };

  const handleClearSearch = () => {
    setFilters(prev => ({ ...prev, searchQuery: '' }));
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setFilters(prev => ({ ...prev, city }));
    setIsCityDropdownOpen(false);
  };

  const handleCategoryClick = (catId: string) => {
    setFilters(prev => ({ ...prev, category: catId, subCategory: undefined }));
    setIsCatalogOpen(false);
    if (currentView !== 'home') {
      setCurrentView('home');
    }
  };

  const handleSellClick = () => {
    if (!currentUser) {
      openAuthModal('login', 'Чтобы разместить объявление, войдите в систему или зарегистрируйтесь по номеру телефона');
    } else {
      setIsCreateModalOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors bg-white/95 border-slate-200 dark:bg-slate-900/95 dark:border-slate-800">
      {/* Top Kazakhstan Announcement Bar */}
      <div className="bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 text-white text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap">
              🇰🇿 Казахстан • KZT (₸)
            </span>
            <span className="hidden sm:inline truncate text-[11px]">
              Безопасный ресейл-маркетплейс: Алматы, Астана, Шымкент и все города Казахстана
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            {currentUser ? (
              <span className="bg-black/20 px-2.5 py-0.5 rounded-full">
                Вы вошли: <b>{currentUser.name}</b> {currentUser.role === 'admin' ? '(Администратор)' : ''}
              </span>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Войти с паролем</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo & City */}
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            <button 
              onClick={() => { setCurrentView('home'); }} 
              className="flex items-center group text-left transition-transform active:scale-98"
              aria-label="На главную ResellHub.kz"
            >
              <ResellHubLogo size="md" />
            </button>

            {/* City Selector */}
            <div className="relative hidden md:block" ref={cityRef}>
              <button
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-700"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span>{selectedCity}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isCityDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-52 max-h-72 overflow-y-auto bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50">
                  {CITIES_KZ.map(city => (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className={`w-full text-left px-3.5 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition ${selectedCity === city ? 'font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20' : 'text-slate-700 dark:text-slate-300'}`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search & Catalog Button */}
          <div className="flex-1 max-w-2xl flex items-center gap-2">
            {/* Catalog Dropdown */}
            <div className="relative shrink-0" ref={catalogRef}>
              <button
                onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm transition shadow-sm ${
                  isCatalogOpen 
                    ? 'bg-emerald-600 text-white shadow-emerald-500/25' 
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline">Категории</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCatalogOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCatalogOpen && (
                <div className="absolute left-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 z-50">
                  <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Все категории
                  </div>
                  <button
                    onClick={() => handleCategoryClick('all')}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700 transition ${filters.category === 'all' ? 'font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30' : 'text-slate-700 dark:text-slate-200'}`}
                  >
                    <span>Все товары</span>
                    <span className="text-xs text-slate-400">1000+</span>
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700 transition ${filters.category === cat.id ? 'font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30' : 'text-slate-700 dark:text-slate-200'}`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <input
                type="text"
                value={filters.searchQuery}
                onChange={handleSearchChange}
                placeholder="Поиск ненужных вещей, мебели, техники..."
                className="w-full pl-10 pr-9 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
              />
              {filters.searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Filters Trigger */}
            {onToggleFiltersMobile && (
              <button
                onClick={onToggleFiltersMobile}
                className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                title="Фильтры"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* PWA Install Button (iPhone, Android, Mac) */}
            <PWAInstallButton variant="navbar" />

            {/* App Badge Button */}
            <button
              onClick={() => setIsBadgeModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition active:scale-95 shadow-2xs"
              title="Фирменный значок приложения ResellHub (скачать SVG/PNG)"
            >
              <img src="/favicon.svg" alt="" className="w-4 h-4 rounded-md shadow-2xs" />
              <span className="hidden sm:inline">Значок</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={isDarkMode ? 'Включить светлую тему' : 'Включить темную тему'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {/* Notifications Popover */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Уведомления"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 sm:w-4.5 sm:h-4.5 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-emerald-500" /> Уведомления
                    </span>
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        Прочитать все
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60 my-1">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        Нет новых уведомлений
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.linkAction?.view === 'chat') {
                              setIsChatModalOpen(true);
                            } else if (n.linkAction?.view === 'profile_orders') {
                              setCurrentView('profile');
                            }
                            setIsNotifOpen(false);
                          }}
                          className={`p-2.5 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition flex gap-3 ${!n.read ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : ''}`}
                        >
                          <div className="w-2 h-2 mt-1.5 rounded-full shrink-0" style={{ backgroundColor: !n.read ? '#10b981' : 'transparent' }} />
                          <div className="flex-1">
                            <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                              {n.title}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                              {n.message}
                            </div>
                            <div className="text-[9px] text-slate-400 mt-1">
                              {new Date(n.createdAt).toLocaleDateString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Chat Icon */}
            <button
              onClick={() => {
                if (!currentUser) {
                  setIsAuthModalOpen(true);
                } else {
                  setIsChatModalOpen(true);
                }
              }}
              className="relative p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Сообщения"
            >
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadMessagesCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 sm:w-4.5 sm:h-4.5 bg-emerald-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {/* Post Listing Button */}
            <button
              onClick={handleSellClick}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-500/25 transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Разместить объявление</span>
            </button>

            {/* User Profile / Login */}
            {currentUser ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 sm:pl-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-emerald-500/40"
                  />
                  <span className="hidden md:block text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 z-50">
                    <div className="p-3 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
                      <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1 truncate">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{currentUser.name}</div>
                        <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                        <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold">
                          ⭐ {currentUser.rating} ({currentUser.reviewsCount} отзывов)
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setCurrentView('profile');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl flex items-center gap-2.5 transition"
                      >
                        <UserIcon className="w-4 h-4 text-emerald-500" />
                        <span>Личный кабинет</span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentView('profile');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl flex items-center gap-2.5 transition"
                      >
                        <Package className="w-4 h-4 text-blue-500" />
                        <span>Мои заказы и покупки</span>
                      </button>

                      {(currentUser.role === 'admin' || currentUser.role === 'moderator') && (
                        <button
                          onClick={() => {
                            setCurrentView('admin');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-xl flex items-center gap-2.5 transition"
                        >
                          <ShieldCheck className="w-4 h-4 text-purple-500" />
                          <span>Панель модератора / Админка</span>
                        </button>
                      )}

                      <div className="pt-1">
                        <PWAInstallButton variant="menu" />
                      </div>
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-700">
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl flex items-center gap-2.5 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Выйти из аккаунта</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Войти
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
