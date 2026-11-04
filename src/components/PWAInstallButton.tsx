import React, { useState } from 'react';
import { Download, Smartphone, Laptop, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'floating' | 'banner' | 'menu';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'navbar' }) => {
  const { isInstallable, isInstalled, platform, install } = usePWAInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If already running inside installed standalone PWA, hide install triggers
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    // If browser supports native prompt directly, try it
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        setIsModalOpen(true);
      }
    } else {
      // Otherwise open the guide modal tailored to their device (iPhone / Mac / Android)
      setIsModalOpen(true);
    }
  };

  const getButtonLabel = () => {
    if (platform === 'ios') return 'Скачать на экран «Домой»';
    if (platform === 'mac') return 'Скачать на Mac';
    if (platform === 'android') return 'Скачать на экран «Домой»';
    return 'Скачать домой';
  };

  return (
    <>
      {variant === 'navbar' && (
        <button
          onClick={handleClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-sky-500/15 hover:from-emerald-500/25 hover:to-teal-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 text-xs font-bold transition active:scale-95 shadow-xs"
          title="Скачать ResellHub на главный экран (iPhone / Android / Mac)"
        >
          <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden md:inline">{getButtonLabel()}</span>
          <span className="md:hidden">Домой 📲</span>
        </button>
      )}

      {variant === 'floating' && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 z-40 animate-bounce">
          <button
            onClick={handleClick}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xl shadow-emerald-600/30 text-xs font-bold transition active:scale-95 border border-emerald-400/30"
          >
            <Download className="w-4 h-4" />
            <span>Установить приложение</span>
          </button>
        </div>
      )}

      {variant === 'menu' && (
        <button
          onClick={handleClick}
          className="w-full px-3 py-2 text-left text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl flex items-center gap-2.5 font-semibold transition"
        >
          <Download className="w-4 h-4" />
          <span>{getButtonLabel()}</span>
        </button>
      )}

      <PWAInstallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
