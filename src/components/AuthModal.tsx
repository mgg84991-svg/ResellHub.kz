import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  Phone, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  MessageSquare,
  AlertCircle,
  MapPin
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CITIES_KZ } from '../data/mockData';
import { ResellHubLogo } from './ResellHubLogo';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    login, 
    registerWithPhone,
    authModalMode,
    authModalReason,
    showToast 
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Phone registration fields (Kazakhstan)
  const [phone, setPhone] = useState('+7 (7');
  const [name, setName] = useState('');
  const [city, setCity] = useState('Алматы');
  const [smsCode, setSmsCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [codeCountdown, setCodeCountdown] = useState(0);

  const [error, setError] = useState<string | null>(null);

  // Sync mode with context
  useEffect(() => {
    if (authModalMode) {
      setMode(authModalMode);
    }
  }, [authModalMode, isAuthModalOpen]);

  // Countdown timer for SMS
  useEffect(() => {
    if (codeCountdown <= 0) return;
    const timer = setTimeout(() => {
      setCodeCountdown(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [codeCountdown]);

  if (!isAuthModalOpen) return null;

  // Handle phone number input with Kazakhstan mask (+7 7XX XXX-XX-XX)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    // Keep numbers only
    const digits = val.replace(/\D/g, '');
    if (!digits) {
      setPhone('+7 (7');
      return;
    }

    // Format into +7 (7XX) XXX-XX-XX
    let d = digits;
    if (d.startsWith('8')) d = '7' + d.slice(1);
    if (!d.startsWith('7')) d = '7' + d;
    if (d.length === 1) d = '77';

    let formatted = '+7 (';
    if (d.length > 1) formatted += d.substring(1, 4);
    if (d.length >= 4) formatted += ') ' + d.substring(4, 7);
    if (d.length >= 7) formatted += '-' + d.substring(7, 9);
    if (d.length >= 9) formatted += '-' + d.substring(9, 11);

    setPhone(formatted);
  };

  const handleSendSms = () => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 11) {
      setError('Введите полный номер телефона в Казахстане (+7 7XX XXX-XX-XX)');
      return;
    }
    setError(null);
    // Generate a 4-digit SMS code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCode(code);
    setIsCodeSent(true);
    setCodeCountdown(45);
    showToast(`📲 SMS отправлено на ${phone}. Код: ${code}`, 'info');
  };

  const handleAutoFillCode = () => {
    if (generatedCode) {
      setSmsCode(generatedCode);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'login') {
      const res = login(loginIdentifier, password);
      if (!res.success) {
        setError(res.error || 'Ошибка входа. Проверьте правильность логина и пароля.');
      } else {
        setIsAuthModalOpen(false);
      }
    } else {
      // Registration via phone
      const digits = phone.replace(/\D/g, '');
      if (digits.length < 11) {
        setError('Пожалуйста, укажите полный номер телефона Казахстана');
        return;
      }
      if (!name.trim()) {
        setError('Пожалуйста, введите ваше имя');
        return;
      }
      if (!password || password.length < 5) {
        setError('Пароль должен содержать минимум 5 символов');
        return;
      }
      if (isCodeSent && generatedCode && smsCode.trim() !== generatedCode) {
        setError('Неверный код из SMS. Проверьте полученный код');
        return;
      }

      const res = registerWithPhone(name, phone, password, city);
      if (!res.success) {
        setError(res.error || 'Ошибка регистрации');
      } else {
        setIsAuthModalOpen(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 overflow-hidden max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-5 flex flex-col items-center">
          <ResellHubLogo size="md" className="mb-2" />
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            {mode === 'login' ? 'Вход в аккаунт ResellHub' : 'Регистрация по номеру телефона'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {mode === 'login' 
              ? 'Войдите по номеру телефона или логину с паролем' 
              : 'Для публикации объявлений и покупок подтвердите номер телефона'}
          </p>
        </div>

        {/* Reason Alert (e.g. When trying to sell without login) */}
        {authModalReason && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Публикация доступна авторизованным пользователям:</span>
              <span className="text-[11px] leading-relaxed opacity-90">{authModalReason}</span>
            </div>
          </div>
        )}

        {/* Mode Tabs */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 mb-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2 rounded-lg transition ${
              mode === 'login' 
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Войти
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-2 rounded-lg transition ${
              mode === 'register' 
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Регистрация (телефон РК)
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Active SMS Banner if code was sent */}
        {mode === 'register' && isCodeSent && generatedCode && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs">
            <div className="flex items-center justify-between font-bold text-emerald-800 dark:text-emerald-200">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                Входящее SMS от ResellHub:
              </span>
              <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 font-mono tracking-widest text-emerald-700 dark:text-emerald-300">
                {generatedCode}
              </span>
            </div>
            <button
              type="button"
              onClick={handleAutoFillCode}
              className="mt-1.5 text-[11px] text-emerald-700 dark:text-emerald-300 underline font-semibold hover:opacity-80"
            >
              Вставить проверочный код автоматически ({generatedCode})
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' ? (
            <>
              {/* Phone number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Номер телефона в Казахстане
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-base">🇰🇿</span>
                  <input
                    type="tel"
                    required
                    placeholder="+7 (701) 000-00-00"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Формат: +7 (7XX) XXX-XX-XX
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Ваше имя и фамилия
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Например: Арман Сериков"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* City Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Город в Казахстане
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                  >
                    {CITIES_KZ.filter(c => c !== 'Все города').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Придумайте пароль
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Минимум 5 символов"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* SMS Code Verification Block */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                    Подтверждение номера
                  </span>
                  <button
                    type="button"
                    onClick={handleSendSms}
                    disabled={codeCountdown > 0}
                    className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline disabled:opacity-50"
                  >
                    {codeCountdown > 0 ? `Повтор через ${codeCountdown}с` : 'Получить SMS-код'}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="4-значный код из SMS"
                    value={smsCode}
                    onChange={e => setSmsCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs tracking-widest font-mono text-center focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Login Identifier: Phone or Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Номер телефона или Email
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="+7 (7XX) XXX-XX-XX или email"
                    value={loginIdentifier}
                    onChange={e => setLoginIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Пароль
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500"
                  />
                  <span>Запомнить меня</span>
                </label>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(null); }}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline text-[11px] font-semibold"
                >
                  Нет аккаунта? Зарегистрироваться
                </button>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center gap-2 mt-2"
          >
            {mode === 'login' ? 'Войти в систему' : 'Зарегистрироваться по номеру телефона'}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Данные защищены протоколами безопасности Казахстана</span>
        </div>

      </div>
    </div>
  );
};
