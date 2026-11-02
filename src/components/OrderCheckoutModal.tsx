import React, { useState } from 'react';
import { X, ShieldCheck, Truck, CreditCard, Check, MapPin, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

export const OrderCheckoutModal: React.FC = () => {
  const { 
    isOrderModalOpen, 
    setIsOrderModalOpen, 
    orderTargetListing, 
    createOrder,
    currentUser,
    setCurrentView,
    showToast 
  } = useApp();

  const [address, setAddress] = useState(
    currentUser ? `г. ${currentUser.city}, пр. Абая, д. 45, кв. 18` : 'г. Алматы, пр. Достык, д. 10'
  );
  const [paymentMethod, setPaymentMethod] = useState<'kaspi' | 'card' | 'cash'>('kaspi');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOrderModalOpen || !orderTargetListing) return null;

  const deliveryFee = orderTargetListing.hasDelivery ? 1500 : 0;
  const total = orderTargetListing.price + deliveryFee;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      showToast('Укажите адрес или ориентир для встречи', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      createOrder(orderTargetListing, address.trim());
      setIsSubmitting(false);
      setIsOrderModalOpen(false);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });

      showToast(
        orderTargetListing.hasDelivery 
          ? 'Заказ оплачен и передан в доставку!' 
          : 'Самовывоз успешно оформлен! Продавец ждёт вас.',
        'success'
      );
      setCurrentView('profile');
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Безопасная сделка ResellHub</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {orderTargetListing.hasDelivery ? 'Оплата с курьерской доставкой по Казахстану' : 'Безопасная сделка с самовывозом (личная встреча)'}
            </p>
          </div>
          <button
            onClick={() => setIsOrderModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item Summary */}
        <div className="py-4 flex gap-4 items-center">
          <img
            src={orderTargetListing.images[0]}
            alt=""
            className="w-16 h-16 rounded-2xl object-cover shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
              {orderTargetListing.title}
            </h4>
            <div className="text-xs text-slate-400 mt-0.5">
              Продавец: <b className="text-slate-700 dark:text-slate-200">{orderTargetListing.sellerName}</b> ({orderTargetListing.city})
            </div>
            <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              {orderTargetListing.price.toLocaleString('ru-RU')} ₸
            </div>
          </div>
        </div>

        <form onSubmit={handlePay} className="space-y-4">
          {/* Address input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              <span>{orderTargetListing.hasDelivery ? 'Адрес доставки в Казахстане' : 'Адрес / ориентир для встречи и самовывоза'}</span>
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Способ оплаты
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: 'kaspi', label: 'Kaspi QR / Pay' },
                { id: 'card', label: 'Карта онлайн' },
                { id: 'cash', label: 'При встрече' }
              ].map(method => (
                <button
                  type="button"
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`py-2 px-2 rounded-xl font-semibold border text-center transition ${
                    paymentMethod === method.id
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Calculation Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Стоимость товара:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {orderTargetListing.price.toLocaleString('ru-RU')} ₸
              </span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Truck className="w-3 h-3 text-emerald-500" /> Доставка по Казахстану:
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {deliveryFee > 0 ? `${deliveryFee.toLocaleString('ru-RU')} ₸` : '0 ₸ (Самовывоз)'}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-extrabold text-sm text-slate-900 dark:text-white">
              <span>Итого к оплате:</span>
              <span className="text-emerald-600 dark:text-emerald-400 text-base">
                {total.toLocaleString('ru-RU')} ₸
              </span>
            </div>
          </div>

          {/* Safety Notice */}
          <p className="text-[11px] text-slate-400 leading-normal">
            🛡️ Ваши средства защищены. При самовывозе деньги передаются продавцу только после вашего личного осмотра вещи.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Обработка платежа...</span>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Оплатить {total.toLocaleString('ru-RU')} ₸</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
