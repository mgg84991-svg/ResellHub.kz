import React, { useState } from 'react';
import { X, Star, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

const RATING_LABELS: Record<number, string> = {
  1: 'Ужасно',
  2: 'Плохо',
  3: 'Нормально',
  4: 'Хорошо',
  5: 'Отлично, рекомендую!'
};

const SUGGESTED_TAGS = [
  'Быстрая отправка',
  'Товар как в описании',
  'Вежливый продавец',
  'Надежная упаковка',
  'Пунктуальность',
  'Хорошая скидка'
];

export const ReviewModal: React.FC = () => {
  const { 
    isReviewModalOpen, 
    setIsReviewModalOpen, 
    reviewTargetOrder, 
    addReview,
    updateOrderStatus,
    showToast 
  } = useApp();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Товар как в описании', 'Быстрая отправка']);

  if (!isReviewModalOpen || !reviewTargetOrder) return null;

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      showToast('Пожалуйста, напишите пару слов о сделке', 'error');
      return;
    }

    addReview(
      reviewTargetOrder.sellerId,
      rating,
      reviewText.trim(),
      selectedTags,
      reviewTargetOrder.listingTitle
    );

    // mark order completed & reviewed
    updateOrderStatus(reviewTargetOrder.id, 'completed');

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    setIsReviewModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Оставить отзыв о продавце
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {reviewTargetOrder.sellerName} • {reviewTargetOrder.listingTitle}
            </p>
          </div>
          <button
            onClick={() => setIsReviewModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          {/* Interactive Stars */}
          <div className="text-center py-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map(star => {
                const isFilled = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 text-slate-300 dark:text-slate-600 transition transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        isFilled ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <span className="text-xs font-bold text-amber-500">
              {RATING_LABELS[hoverRating || rating]}
            </span>
          </div>

          {/* Quick Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Что понравилось:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_TAGS.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`text-xs px-2.5 py-1 rounded-xl font-medium border transition ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text Area */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Комментарий о покупке
            </label>
            <textarea
              rows={3}
              required
              placeholder="Расскажите о состоянии товара, скорости ответа продавца и доставке..."
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Опубликовать отзыв</span>
          </button>
        </form>

      </div>
    </div>
  );
};
