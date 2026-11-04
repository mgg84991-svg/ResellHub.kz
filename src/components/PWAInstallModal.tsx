import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Laptop, 
  Download, 
  Share2, 
  PlusSquare, 
  CheckCircle2, 
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { usePWAInstall, PWAUserPlatform } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, platform, install } = usePWAInstall();

  // Active tab defaults to detected device, or iPhone if unknown
  const [activeTab, setActiveTab] = useState<'ios' | 'android' | 'mac'>(() => {
    if (platform === 'android') return 'android';
    if (platform === 'mac' || platform === 'windows') return 'mac';
    return 'ios';
  });

  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 overflow-hidden">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with App Logo & Title */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-950 p-1.5 shadow-xl shadow-emerald-500/25 shrink-0 border border-emerald-500/30 flex items-center justify-center">
            <img src="/icon.svg" alt="ResellHub.kz Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Официальное PWA-приложение</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Скачать ResellHub на экран «Домой»
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Установка на iPhone, Android, Mac и ПК — мгновенный доступ без ограничений
            </p>
          </div>
        </div>

        {/* 1-Click Native Install Button (if browser supports beforeinstallprompt) */}
        {isInstallable && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-sky-500/10 border border-emerald-500/30">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                  Установка в 1 клик поддерживается!
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Нажмите кнопку ниже для моментальной установки на ваше устройство
                </div>
              </div>
              <button
                onClick={handleNativeInstall}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/25 transition shrink-0 flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Установить</span>
              </button>
            </div>
          </div>
        )}

        {/* Platform Selection Tabs */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 mb-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'ios'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iPhone / iPad</span>
          </button>

          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'android'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
            <span>Android</span>
          </button>

          <button
            onClick={() => setActiveTab('mac')}
            className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'mac'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Mac / ПК</span>
          </button>
        </div>

        {/* TAB 1: iOS iPhone / iPad Instructions */}
        {activeTab === 'ios' && (
          <div className="space-y-3.5 text-slate-700 dark:text-slate-300">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Пошаговая установка в Safari на iPhone и iPad (за 10 секунд):
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
              <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                1
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-900 dark:text-white">
                  Откройте Safari и нажмите кнопку «Поделиться»
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 flex items-center gap-1">
                  Значок квадрата со стрелкой вверх <Share2 className="w-3.5 h-3.5 inline text-sky-500" /> на нижней панели Safari.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
              <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                2
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-900 dark:text-white">
                  Выберите «На экран «Домой»»
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 flex items-center gap-1">
                  Прокрутите список действий вниз до пункта <PlusSquare className="w-3.5 h-3.5 inline text-slate-600 dark:text-slate-300" /> <b>«На экран «Домой»»</b> (Add to Home Screen).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
              <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                3
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-900 dark:text-white">
                  Нажмите «Добавить» в правом верхнем углу
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                  Приложение ResellHub.kz появится на рабочем столе и будет запускаться на весь экран без адресной строки.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Android Instructions */}
        {activeTab === 'android' && (
          <div className="space-y-3.5 text-slate-700 dark:text-slate-300">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Установка на смартфоны и планшеты Android (Google Chrome / Samsung Internet):
            </div>

            {isInstallable ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Ваш браузер готов к установке
                </div>
                <button
                  onClick={handleNativeInstall}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Установить прямо сейчас</span>
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      Нажмите на меню браузера (⋮)
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      Три точки в правом верхнем углу Chrome или нижнем углу Samsung Internet.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      Выберите «Установить приложение»
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      Или пункт «Добавить на главный экран». Подтвердите установку.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 3: Mac / PC Instructions */}
        {activeTab === 'mac' && (
          <div className="space-y-3.5 text-slate-700 dark:text-slate-300">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Установка на Apple Mac (macOS) и Windows:
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
              <div className="w-7 h-7 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold text-xs flex items-center justify-center shrink-0">
                
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-900 dark:text-white">
                  В Safari на Mac (macOS Sonoma и новее):
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                  В верхнем системном меню нажмите <b>«Файл»</b> → <b>«Добавить в Dock...»</b> (Add to Dock). Приложение будет работать как полноценная программа Mac!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
              <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                🌐
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-900 dark:text-white">
                  В Google Chrome / Microsoft Edge / Yandex:
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                  Нажмите на значок <Download className="w-3.5 h-3.5 inline text-emerald-500" /> («Установить приложение») прямо в правой части адресной строки браузера.
                </p>
              </div>
            </div>

            {isInstallable && (
              <button
                onClick={handleNativeInstall}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Установить на этот компьютер</span>
              </button>
            )}
          </div>
        )}

        {/* Benefits list */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-500 dark:text-slate-400">
          <div className="flex flex-col items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Мгновенный запуск</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Без App Store</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-sky-500" />
            <span>Работает офлайн</span>
          </div>
        </div>

        {/* Download ResellHub Logo Asset Box */}
        <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-950 p-1 flex items-center justify-center shrink-0 border border-slate-800">
              <img src="/icon.svg" alt="logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Официальный логотип ResellHub
              </div>
              <div className="text-[10px] text-slate-400">
                Векторный SVG и PNG для экрана «Домой»
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href="/icon.svg"
              download="resellhub-logo.svg"
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs transition flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>SVG</span>
            </a>
            <a
              href="/pwa-512x512.png"
              download="resellhub-512.png"
              className="px-2.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-[11px] transition flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>PNG</span>
            </a>
          </div>
        </div>

        {/* Done / Close Button */}
        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition"
        >
          Понятно, закрыть
        </button>

      </div>
    </div>
  );
};
