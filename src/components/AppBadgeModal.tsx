import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  Sparkles, 
  Check, 
  Share2, 
  ExternalLink,
  Laptop,
  CheckCircle2
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface AppBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppBadgeModal: React.FC<AppBadgeModalProps> = ({ isOpen, onClose }) => {
  const { install, isInstallable, platform } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<'emerald' | 'dark' | 'gold'>('emerald');

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Фирменный стиль ResellHub</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            Значок приложения ResellHub
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Официальный значок маркетплейса в высоком разрешении для экрана «Домой», macOS, Android и печати
          </p>
        </div>

        {/* Large Badge Showcase Card */}
        <div className="relative rounded-3xl p-6 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-800 text-center mb-6 shadow-inner overflow-hidden">
          {/* Ambient background glow */}
          <div className="absolute inset-0 bg-radial from-emerald-500/20 via-teal-500/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            {/* The Badge */}
            <div className="group relative w-32 h-32 sm:w-36 sm:h-36 rounded-[34px] shadow-2xl shadow-emerald-500/30 transform transition-transform duration-300 hover:scale-105 p-[2px] bg-gradient-to-tr from-emerald-400 via-teal-300 to-sky-400">
              <img 
                src="/icon.svg" 
                alt="Значок ResellHub" 
                className="w-full h-full rounded-[32px] object-cover filter drop-shadow-md"
              />
              <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black shadow-md uppercase">
                512×512 HD
              </span>
            </div>

            <div className="mt-4 font-black text-white text-base tracking-tight">
              ResellHub<span className="text-emerald-400">.kz</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Векторный значок с символом ресейла и знаком Казахстана
            </div>
          </div>
        </div>

        {/* Mockup Previews: How the badge looks in iOS & Android */}
        <div className="mb-6 space-y-2">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Отображение значка на устройствах:
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {/* iOS Preview Box */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-950 p-0.5 shadow-md shrink-0">
                <img src="/apple-touch-icon.png" alt="iOS" className="w-full h-full rounded-[10px] object-cover" />
              </div>
              <div className="text-left overflow-hidden">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">iPhone / iPad</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Экран «Домой» (iOS)</div>
                <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">180×180 Retina</span>
              </div>
            </div>

            {/* Android / Desktop Preview Box */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-950 p-0.5 shadow-md shrink-0">
                <img src="/pwa-192x192.png" alt="Android" className="w-full h-full rounded-[10px] object-cover" />
              </div>
              <div className="text-left overflow-hidden">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">Android / Mac</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Лаунчер и Dock</div>
                <span className="text-[9px] font-semibold text-sky-600 dark:text-sky-400">192×192 Material</span>
              </div>
            </div>
          </div>
        </div>

        {/* Download Buttons Section */}
        <div className="space-y-2.5 mb-6">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Скачать значок в нужном формате:
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a
              href="/icon.svg"
              download="resellhub-badge.svg"
              className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Скачать SVG (Вектор)</span>
            </a>

            <a
              href="/pwa-512x512.png"
              download="resellhub-badge-512.png"
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>PNG (512×512 HD)</span>
            </a>

            <a
              href="/apple-touch-icon.png"
              download="resellhub-apple-touch-icon.png"
              className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Apple Icon (180×180)</span>
            </a>

            <a
              href="/favicon.svg"
              download="resellhub-favicon.svg"
              className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Favicon (.SVG)</span>
            </a>
          </div>
        </div>

        {/* 1-Click Install to Home Screen Button */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-sky-500/10 border border-emerald-500/30 mb-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-500" />
                Добавить значок на экран «Домой»
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Значок появится рядом с вашими любимыми приложениями
              </div>
            </div>

            <button
              onClick={async () => {
                if (isInstallable) {
                  await install();
                } else {
                  // Fallback: copy link or show tips
                  handleCopyLink();
                }
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/25 transition shrink-0 flex items-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
              <span>{copied ? 'Ссылка скопирована' : 'Установить'}</span>
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition"
        >
          Закрыть
        </button>

      </div>
    </div>
  );
};
