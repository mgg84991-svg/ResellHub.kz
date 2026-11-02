import React from 'react';
import { 
  Smartphone, 
  Armchair, 
  Shirt, 
  Bike, 
  Tv, 
  Gamepad2, 
  Baby, 
  Car,
  LayoutGrid
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const ICON_MAP: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="w-5 h-5" />,
  Armchair: <Armchair className="w-5 h-5" />,
  Shirt: <Shirt className="w-5 h-5" />,
  Bike: <Bike className="w-5 h-5" />,
  Tv: <Tv className="w-5 h-5" />,
  Gamepad2: <Gamepad2 className="w-5 h-5" />,
  Baby: <Baby className="w-5 h-5" />,
  Car: <Car className="w-5 h-5" />
};

export const CategoriesBar: React.FC = () => {
  const { categories, filters, setFilters } = useApp();

  const selectedCategoryObj = categories.find(c => c.id === filters.category);

  const handleSelectCategory = (catId: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === catId ? 'all' : catId,
      subCategory: undefined
    }));
  };

  const handleSelectSubCategory = (subCat: string) => {
    setFilters(prev => ({
      ...prev,
      subCategory: prev.subCategory === subCat ? undefined : subCat
    }));
  };

  return (
    <div className="py-4">
      {/* Category Cards Carousel */}
      <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {/* All items card */}
        <button
          onClick={() => setFilters(prev => ({ ...prev, category: 'all', subCategory: undefined }))}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl whitespace-nowrap text-xs sm:text-sm font-semibold transition border shrink-0 ${
            filters.category === 'all'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-750'
          }`}
        >
          <div className={`p-1 rounded-lg ${filters.category === 'all' ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
            <LayoutGrid className="w-4 h-4" />
          </div>
          <span>Все категории</span>
        </button>

        {categories.map(cat => {
          const isSelected = filters.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl whitespace-nowrap text-xs sm:text-sm font-semibold transition border shrink-0 ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <div className={`p-1 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700 text-emerald-600 dark:text-emerald-400'}`}>
                {ICON_MAP[cat.iconName] || <LayoutGrid className="w-4 h-4" />}
              </div>
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Subcategories chips if category is active */}
      {selectedCategoryObj && selectedCategoryObj.subCategories.length > 0 && (
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pt-2 pb-1 text-xs">
          <span className="text-slate-400 dark:text-slate-500 text-[11px] font-medium whitespace-nowrap shrink-0">
            Подкатегории:
          </span>
          {selectedCategoryObj.subCategories.map(subCat => {
            const isSubSelected = filters.subCategory === subCat;
            return (
              <button
                key={subCat}
                onClick={() => handleSelectSubCategory(subCat)}
                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition border ${
                  isSubSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white font-medium'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {subCat}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
