import React, { useState } from 'react';
import { X, Upload, Plus, Sparkles, Check, Image as ImageIcon, Info, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { ItemCondition } from '../types';
import { CITIES_KZ } from '../data/mockData';

const PRESET_PHOTOS = [
  { label: 'Смартфон', url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80' },
  { label: 'Наушники', url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Гитара', url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80' },
  { label: 'Кофемашина', url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80' },
  { label: 'Велосипед', url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80' },
  { label: 'Одежда', url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80' },
  { label: 'Монитор', url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80' },
  { label: 'LEGO', url: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=800&q=80' }
];

export const CreateListingModal: React.FC = () => {
  const { 
    isCreateModalOpen, 
    setIsCreateModalOpen, 
    addListing, 
    currentUser, 
    openAuthModal,
    categories,
    selectedCity,
    showToast
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [category, setCategory] = useState('electronics');
  const [subCategory, setSubCategory] = useState('');
  const [condition, setCondition] = useState<ItemCondition>('like_new');
  const [city, setCity] = useState(selectedCity === 'Все города' ? 'Алматы' : selectedCity);
  const [address, setAddress] = useState('');
  const [hasDelivery, setHasDelivery] = useState(false); // default without delivery
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
  ]);

  if (!isCreateModalOpen) return null;

  // Strict check: unauthenticated users cannot post items
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
        <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-500/20">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Публикация требует авторизации
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Не каждый посетитель может загрузить вещь: чтобы исключить мошенников, требуется войти в систему. Если у вас еще нет аккаунта, зарегистрируйтесь по номеру телефона Казахстана.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                setIsCreateModalOpen(false);
                openAuthModal('register', 'Зарегистрируйтесь по номеру телефона для размещения своих объявлений на ResellHub.kz');
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/25 transition active:scale-95"
            >
              Зарегистрироваться по номеру телефона 🇰🇿
            </button>

            <button
              onClick={() => {
                setIsCreateModalOpen(false);
                openAuthModal('login', 'Войдите под своим логином или телефоном с паролем');
              }}
              className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
            >
              Уже есть аккаунт? Войти с паролем
            </button>

            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="w-full py-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentCategoryObj = categories.find(c => c.id === category);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddPresetPhoto = (url: string) => {
    if (!images.includes(url)) {
      setImages(prev => [...prev, url]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Укажите название товара', 'error');
      return;
    }
    if (!price || Number(price) <= 0) {
      showToast('Укажите корректную цену в тенге', 'error');
      return;
    }
    if (images.length === 0) {
      showToast('Добавьте хотя бы одну фотографию товара', 'error');
      return;
    }

    addListing({
      title: title.trim(),
      description: description.trim() || 'Состояние отличное, все вопросы в личных сообщениях.',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      isNegotiable,
      category,
      subCategory: subCategory || undefined,
      condition,
      images,
      city,
      address: address.trim() || undefined,
      sellerId: currentUser?.id || 'guest',
      sellerName: currentUser?.name || 'Пользователь',
      sellerAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      sellerRating: currentUser?.rating || 5.0,
      sellerReviewsCount: currentUser?.reviewsCount || 0,
      hasDelivery
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setIsCreateModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-10">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Загрузить объявление о продаже
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Продажа вещей в Казахстане • Цены в тенге (₸)
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(false)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Название товара <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Например: Смартфон iPhone 13 128GB или Горный велосипед"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
            />
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Категория <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={e => {
                  setCategory(e.target.value);
                  setSubCategory('');
                }}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Подкатегория
              </label>
              <select
                value={subCategory}
                onChange={e => setSubCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none"
              >
                <option value="">Выберите подкатегорию</option>
                {currentCategoryObj?.subCategories.map(sc => (
                  <option key={sc} value={sc}>{sc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
              Состояние вещи <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'new', label: 'Новое (в упаковке)' },
                { id: 'like_new', label: 'Как новое' },
                { id: 'good', label: 'Хорошее' },
                { id: 'fair', label: 'Б/У с дефектами' },
                { id: 'for_parts', label: 'На запчасти' }
              ].map(item => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setCondition(item.id as ItemCondition)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition ${
                    condition === item.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Photos */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Фотографии товара <span className="text-rose-500">*</span>
            </label>

            {/* Photos Grid */}
            <div className="flex flex-wrap gap-3 mb-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-full transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-0 inset-x-0 bg-emerald-600 text-white text-[9px] font-bold text-center py-0.5">
                      Главное
                    </span>
                  )}
                </div>
              ))}

              {/* Upload button */}
              <label className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-emerald-500 transition">
                <Upload className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-medium">Загрузить</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Preset quick photos helper */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Выберите фото из образцов:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_PHOTOS.map(p => (
                  <button
                    type="button"
                    key={p.label}
                    onClick={() => handleAddPresetPhoto(p.url)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-emerald-500 text-slate-700 dark:text-slate-300 transition"
                  >
                    + {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Price & Bargain in Tenge ₸ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Ваша цена, ₸ (тенге) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                placeholder="25000"
                value={price}
                onChange={e => setPrice(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Цена нового товара, ₸ (для скидки)
              </label>
              <input
                type="number"
                placeholder="Например: 45000"
                value={originalPrice}
                onChange={e => setOriginalPrice(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Delivery & Pickup options (Без доставки / С доставкой) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
              Способ передачи товара <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                !hasDelivery 
                  ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30' 
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
              }`}>
                <input
                  type="radio"
                  name="delivery_choice"
                  checked={!hasDelivery}
                  onChange={() => setHasDelivery(false)}
                  className="mt-0.5 w-4 h-4 text-emerald-600"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Без доставки (Самовывоз)
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Покупатель забирает товар лично при встрече
                  </span>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                hasDelivery 
                  ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30' 
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
              }`}>
                <input
                  type="radio"
                  name="delivery_choice"
                  checked={hasDelivery}
                  onChange={() => setHasDelivery(true)}
                  className="mt-0.5 w-4 h-4 text-emerald-600"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    С доставкой курьером
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Отправка через курьерскую службу или почту
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Negotiable toggle */}
          <div>
            <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isNegotiable}
                onChange={e => setIsNegotiable(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Возможен торг (сауда бар)
              </span>
            </label>
          </div>

          {/* Location in Kazakhstan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Город в Казахстане <span className="text-rose-500">*</span>
              </label>
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none"
              >
                {CITIES_KZ.filter(c => c !== 'Все города').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Район или улица (для самовывоза)
              </label>
              <input
                type="text"
                placeholder="Например: Бостандыкский район, пр. Достык"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Подробное описание
            </label>
            <textarea
              rows={4}
              placeholder="Опишите состояние вещи, причину продажи, комплектность..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Опубликовать в ResellHub.kz</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
