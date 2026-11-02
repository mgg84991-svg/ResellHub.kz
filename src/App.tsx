import React, { useState, useMemo } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { HeroBanner } from './components/HeroBanner';
import { CategoriesBar } from './components/CategoriesBar';
import { FilterSidebar } from './components/FilterSidebar';
import { ListingCard } from './components/ListingCard';
import { ListingDetailModal } from './components/ListingDetailModal';
import { CreateListingModal } from './components/CreateListingModal';
import { ChatModal } from './components/ChatModal';
import { AuthModal } from './components/AuthModal';
import { OrderCheckoutModal } from './components/OrderCheckoutModal';
import { ReviewModal } from './components/ReviewModal';
import { UserProfile } from './components/UserProfile';
import { AdminPanel } from './components/AdminPanel';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { Sparkles, SlidersHorizontal, PackageOpen, RotateCcw } from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    currentView, 
    listings, 
    filters, 
    resetFilters,
    currentUser
  } = useApp();

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filter and sort listings
  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      // Moderation: only show approved listings to general public, or if current user owns it or is admin
      if (item.moderationStatus !== 'approved') {
        const isOwner = currentUser?.id === item.sellerId;
        const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'moderator';
        if (!isOwner && !isAdmin) return false;
      }

      // Search Query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesTags = item.tags?.some(t => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesTags) return false;
      }

      // Category
      if (filters.category !== 'all' && item.category !== filters.category) {
        return false;
      }

      // Subcategory
      if (filters.subCategory && item.subCategory !== filters.subCategory) {
        return false;
      }

      // Price filter
      if (filters.minPrice !== null && item.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== null && item.price > filters.maxPrice) {
        return false;
      }

      // Condition filter
      if (filters.condition.length > 0 && !filters.condition.includes(item.condition)) {
        return false;
      }

      // City filter
      if (filters.city !== 'Все города' && item.city !== filters.city) {
        return false;
      }

      // Delivery filter mode ('all' | 'delivery_only' | 'pickup_only' - Поиск без доставки)
      if (filters.deliveryMode === 'pickup_only' && item.hasDelivery) {
        return false; // Поиск товара без доставки (только самовывоз)
      }
      if (filters.deliveryMode === 'delivery_only' && !item.hasDelivery) {
        return false;
      }
      if (filters.hasDeliveryOnly && !item.hasDelivery) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_asc') return a.price - b.price;
      if (filters.sortBy === 'price_desc') return b.price - a.price;
      if (filters.sortBy === 'popular') return (b.views + b.favoritesCount * 2) - (a.views + a.favoritesCount * 2);
      // default newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [listings, filters, currentUser]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Top Navbar */}
      <Navbar onToggleFiltersMobile={() => setIsMobileFiltersOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* VIEW 1: Home Marketplace Feed */}
        {currentView === 'home' && (
          <>
            {/* Hero Banner */}
            <HeroBanner />

            {/* Visual Categories Carousel */}
            <CategoriesBar />

            {/* Layout with Sidebar & Listing Grid */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Desktop Filters Sidebar */}
              <aside className="hidden lg:block lg:col-span-3 sticky top-24">
                <FilterSidebar />
              </aside>

              {/* Feed Content */}
              <section className="lg:col-span-9 space-y-4">
                {/* Result header */}
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      {filters.category === 'all' ? 'Рекомендации для вас' : 'Товары в категории'}
                    </h2>
                    <span className="text-xs text-slate-400 font-medium">
                      Найдено: {filteredListings.length}
                    </span>
                  </div>

                  {/* Active filters clear if any */}
                  {(filters.searchQuery || filters.category !== 'all' || filters.minPrice !== null || filters.maxPrice !== null || filters.condition.length > 0 || filters.hasDeliveryOnly) && (
                    <button
                      onClick={resetFilters}
                      className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Сбросить фильтры</span>
                    </button>
                  )}
                </div>

                {/* Empty State */}
                {filteredListings.length === 0 ? (
                  <div className="p-12 sm:p-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                    <PackageOpen className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700" />
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                      По вашему запросу ничего не найдено
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Попробуйте изменить диапазон цен, выбрать другой город или сбросить фильтры поиска.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
                    >
                      Показать все объявления
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredListings.map(listing => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                )}
              </section>

            </div>
          </>
        )}

        {/* VIEW 2: Listing Detail */}
        {currentView === 'listing_detail' && <ListingDetailModal />}

        {/* VIEW 3: Personal Cabinet / Profile */}
        {currentView === 'profile' && <UserProfile />}

        {/* VIEW 4: Admin / Moderation Panel */}
        {currentView === 'admin' && <AdminPanel />}

      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />

      {/* Global Modals */}
      <AuthModal />
      <CreateListingModal />
      <ChatModal />
      <OrderCheckoutModal />
      <ReviewModal />

      {/* Live Toast Alerts */}
      <Toast />

      {/* Mobile Filters Drawer Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] overflow-y-auto">
            <FilterSidebar 
              isMobileModal 
              onCloseMobile={() => setIsMobileFiltersOpen(false)} 
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
