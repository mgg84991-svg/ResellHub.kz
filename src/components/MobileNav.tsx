import React from 'react';
import { Home, Layers, PlusCircle, MessageSquare, User as UserIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileNav: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currentUser,
    setIsAuthModalOpen,
    openAuthModal,
    setIsCreateModalOpen,
    setIsChatModalOpen,
    unreadMessagesCount,
    setFilters,
    showToast
  } = useApp();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around shadow-lg">
      {/* Home */}
      <button
        onClick={() => {
          setCurrentView('home');
          setFilters(prev => ({ ...prev, category: 'all' }));
        }}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition ${
          currentView === 'home'
            ? 'text-emerald-600 dark:text-emerald-400 font-bold'
            : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Главная</span>
      </button>

      {/* Catalog */}
      <button
        onClick={() => {
          setCurrentView('home');
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
        className="flex flex-col items-center gap-1 text-[10px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
      >
        <Layers className="w-5 h-5" />
        <span>Категории</span>
      </button>

      {/* Sell Floating Button */}
      <button
        onClick={() => {
          if (!currentUser) {
            openAuthModal('login', 'Чтобы подать объявление, войдите в систему или зарегистрируйтесь по номеру телефона');
          } else {
            setIsCreateModalOpen(true);
          }
        }}
        className="flex flex-col items-center -mt-6 group"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 group-active:scale-95 transition-transform ring-4 ring-white dark:ring-slate-900">
          <PlusCircle className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
          Продать
        </span>
      </button>

      {/* Messages */}
      <button
        onClick={() => {
          if (!currentUser) {
            setIsAuthModalOpen(true);
          } else {
            setIsChatModalOpen(true);
          }
        }}
        className="relative flex flex-col items-center gap-1 text-[10px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5" />
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
              {unreadMessagesCount}
            </span>
          )}
        </div>
        <span>Чаты</span>
      </button>

      {/* Profile */}
      <button
        onClick={() => {
          if (!currentUser) {
            setIsAuthModalOpen(true);
          } else {
            setCurrentView('profile');
          }
        }}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition ${
          currentView === 'profile'
            ? 'text-emerald-600 dark:text-emerald-400 font-bold'
            : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        {currentUser ? (
          <img
            src={currentUser.avatar}
            alt=""
            className="w-5 h-5 rounded-full object-cover ring-1 ring-emerald-500"
          />
        ) : (
          <UserIcon className="w-5 h-5" />
        )}
        <span>Кабинет</span>
      </button>
    </nav>
  );
};
