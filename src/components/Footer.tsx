import React from 'react';
import { ShoppingBag, ShieldCheck, Heart, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setFilters, setCurrentView, categories } = useApp();

  return (
    <footer className="mt-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-12 pb-24 sm:pb-12 text-slate-600 dark:text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-lg font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                ResellHub.kz
              </span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Удобный и надежный сервис в Казахстане для продажи и покупки ненужных вещей, мебели, техники и одежды с самовывозом и курьерской доставкой.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Безопасные расчеты и Kaspi QR</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Популярные категории
            </h4>
            <ul className="space-y-2">
              {categories.slice(0, 5).map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, category: cat.id }));
                      setCurrentView('home');
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Rules & Trust */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Безопасность и правила
            </h4>
            <ul className="space-y-2">
              <li className="hover:text-emerald-600 cursor-pointer">Как работает безопасная доставка по РК</li>
              <li className="hover:text-emerald-600 cursor-pointer">Покупка самовывозом (без доставки)</li>
              <li className="hover:text-emerald-600 cursor-pointer">Правила публикации объявлений</li>
              <li className="hover:text-emerald-600 cursor-pointer">Советы по быстрой продаже в Казахстане</li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Помощь и контакты в РК
            </h4>
            <p className="text-xs text-slate-500 mb-2">
              Служба заботы о пользователях отвечает 24/7 в чате
            </p>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="font-bold text-slate-800 dark:text-slate-200">support@resellhub.kz</div>
              <div className="text-[11px] text-slate-400">+7 (727) 355-88-00 (Алматы / Казахстан)</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Работаем по всему Казахстану</div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} ResellHub. Платформа ресейла и доски объявлений.
          </div>
          <div className="flex items-center gap-1">
            <span>Создано с заботой об экологии и удобстве пользователей</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
