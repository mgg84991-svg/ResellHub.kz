import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  Listing, 
  Category, 
  Review, 
  Order, 
  Conversation, 
  NotificationItem, 
  FilterOptions,
  ModerationStatus
} from '../types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_LISTINGS, 
  INITIAL_USERS, 
  INITIAL_REVIEWS, 
  INITIAL_ORDERS, 
  INITIAL_CONVERSATIONS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';

interface AppContextType {
  // Auth
  currentUser: User | null;
  users: User[];
  login: (email: string, pass: string) => { success: boolean; error?: string };
  register: (name: string, email: string, pass: string, city: string) => { success: boolean; error?: string };
  logout: () => void;
  switchUser: (userId: string) => void;
  updateUserProfile: (data: Partial<User>) => void;

  // Listings
  listings: Listing[];
  addListing: (listingData: Omit<Listing, 'id' | 'createdAt' | 'views' | 'favoritesCount' | 'moderationStatus' | 'status'>) => Listing;
  updateListing: (id: string, updates: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  favorites: string[];
  toggleFavorite: (listingId: string) => void;

  // Filters & Navigation
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  resetFilters: () => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  categories: Category[];

  // Views & Modals
  currentView: 'home' | 'listing_detail' | 'profile' | 'admin' | 'chat';
  setCurrentView: (view: 'home' | 'listing_detail' | 'profile' | 'admin' | 'chat') => void;
  activeListingId: string | null;
  setActiveListingId: (id: string | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  isChatModalOpen: boolean;
  setIsChatModalOpen: (open: boolean) => void;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  isOrderModalOpen: boolean;
  setIsOrderModalOpen: (open: boolean) => void;
  orderTargetListing: Listing | null;
  setOrderTargetListing: (listing: Listing | null) => void;
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
  reviewTargetOrder: Order | null;
  setReviewTargetOrder: (order: Order | null) => void;

  // Chat & Messages
  conversations: Conversation[];
  sendMessage: (convId: string, text: string, offerPrice?: number) => void;
  startOrOpenChatWithSeller: (listing: Listing) => void;
  unreadMessagesCount: number;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;
  addNotification: (title: string, message: string, type: NotificationItem['type'], linkAction?: NotificationItem['linkAction']) => void;

  // Orders
  orders: Order[];
  createOrder: (listing: Listing, deliveryAddress: string) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Reviews
  reviews: Review[];
  addReview: (sellerId: string, rating: number, text: string, tags?: string[], listingTitle?: string) => void;
  replyToReview: (reviewId: string, replyText: string) => void;

  // Admin / Moderation
  moderateListing: (listingId: string, status: ModerationStatus, reason?: string) => void;
  toggleUserBan: (userId: string) => void;
  changeUserRole: (userId: string, role: User['role']) => void;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Toast
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('rsh_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('rsh_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('rsh_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Users & Auth (Migrated to Kazakhstan KZ v3)
  const [users, setUsers] = useState<User[]>(() => {
    const isKZ = localStorage.getItem('rsh_kz_v3');
    if (!isKZ) {
      localStorage.setItem('rsh_kz_v3', 'true');
      localStorage.setItem('rsh_users', JSON.stringify(INITIAL_USERS));
      localStorage.setItem('rsh_listings', JSON.stringify(INITIAL_LISTINGS));
      localStorage.setItem('rsh_orders', JSON.stringify(INITIAL_ORDERS));
      localStorage.setItem('rsh_conversations', JSON.stringify(INITIAL_CONVERSATIONS));
      localStorage.setItem('rsh_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_USERS;
    }
    const saved = localStorage.getItem('rsh_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('rsh_current_user');
    return saved ? JSON.parse(saved) : null; // Guest by default so uploading prompts for login & password
  });

  useEffect(() => {
    localStorage.setItem('rsh_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('rsh_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('rsh_current_user');
    }
  }, [currentUser]);

  // Listings
  const [listings, setListings] = useState<Listing[]>(() => {
    const isKZ = localStorage.getItem('rsh_kz_v3');
    if (!isKZ) return INITIAL_LISTINGS;
    const saved = localStorage.getItem('rsh_listings');
    return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
  });

  useEffect(() => {
    localStorage.setItem('rsh_listings', JSON.stringify(listings));
  }, [listings]);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('rsh_favorites');
    return saved ? JSON.parse(saved) : ['list_1', 'list_3'];
  });

  useEffect(() => {
    localStorage.setItem('rsh_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (listingId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(listingId);
      const next = exists ? prev.filter(id => id !== listingId) : [...prev, listingId];
      setListings(current => current.map(item => {
        if (item.id === listingId) {
          return {
            ...item,
            favoritesCount: Math.max(0, item.favoritesCount + (exists ? -1 : 1))
          };
        }
        return item;
      }));
      showToast(exists ? 'Удалено из избранного' : 'Добавлено в избранное ❤️', 'info');
      return next;
    });
  };

  // Categories
  const categories = INITIAL_CATEGORIES;

  // Selected City & Filters (Kazakhstan)
  const [selectedCity, setSelectedCity] = useState<string>('Все города');
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    category: 'all',
    subCategory: undefined,
    minPrice: null,
    maxPrice: null,
    condition: [],
    city: 'Все города',
    hasDeliveryOnly: false,
    deliveryMode: 'all',
    sortBy: 'newest'
  });

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'all',
      subCategory: undefined,
      minPrice: null,
      maxPrice: null,
      condition: [],
      city: 'Все города',
      hasDeliveryOnly: false,
      deliveryMode: 'all',
      sortBy: 'newest'
    });
  };

  // Views & Modals
  const [currentView, setCurrentView] = useState<'home' | 'listing_detail' | 'profile' | 'admin' | 'chat'>('home');
  const [activeListingId, setActiveListingId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderTargetListing, setOrderTargetListing] = useState<Listing | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewTargetOrder, setReviewTargetOrder] = useState<Order | null>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 3800);
  };

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('rsh_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('rsh_orders', JSON.stringify(orders));
  }, [orders]);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('rsh_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  useEffect(() => {
    localStorage.setItem('rsh_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Conversations
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('rsh_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  useEffect(() => {
    localStorage.setItem('rsh_conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('rsh_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('rsh_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (
    title: string, 
    message: string, 
    type: NotificationItem['type'], 
    linkAction?: NotificationItem['linkAction']
  ) => {
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      userId: currentUser?.id || 'guest',
      title,
      message,
      createdAt: new Date().toISOString(),
      type,
      read: false,
      linkAction
    };
    setNotifications(prev => [newNotif, ...prev]);
    showToast(`🔔 ${title}: ${message}`, 'info');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const unreadMessagesCount = conversations.reduce((acc, conv) => {
    if (!currentUser) return acc;
    if (conv.buyerId === currentUser.id) return acc + conv.unreadCountForBuyer;
    if (conv.sellerId === currentUser.id) return acc + conv.unreadCountForSeller;
    return acc;
  }, 0);

  // Authentication methods
  const login = (email: string, pass: string): { success: boolean; error?: string } => {
    if (!email || !pass) {
      return { success: false, error: 'Пожалуйста, введите логин (email) и пароль' };
    }
    const target = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!target) {
      return { success: false, error: 'Пользователь с таким email не найден' };
    }
    if (target.isBanned) {
      return { success: false, error: 'Этот аккаунт заблокирован администратором' };
    }
    
    // Check password: user password or master password 12345
    const isMasterPassword = pass === '12345';
    const isUserPassword = target.password ? target.password === pass : true;

    if (!isMasterPassword && !isUserPassword) {
      return { success: false, error: 'Неверный пароль доступа' };
    }

    setCurrentUser(target);
    showToast(`Добро пожаловать, ${target.name}!`, 'success');
    return { success: true };
  };

  const register = (name: string, email: string, pass: string, city: string): { success: boolean; error?: string } => {
    if (!name.trim() || !email.trim() || !pass) {
      return { success: false, error: 'Пожалуйста, заполните все обязательные поля' };
    }
    if (pass.length < 5) {
      return { success: false, error: 'Пароль должен содержать минимум 5 символов' };
    }
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, error: 'Пользователь с таким email уже зарегистрирован' };
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: 'user',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
      city: city || 'Алматы',
      registeredAt: new Date().toISOString().split('T')[0],
      rating: 5.0,
      reviewsCount: 0,
      isVerified: true,
      activeListingsCount: 0,
      completedDealsCount: 0,
      bio: 'Участник ResellHub Казахстан',
      password: pass
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`Аккаунт успешно создан! Добро пожаловать, ${newUser.name}!`, 'success');
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Вы вышли из системы', 'info');
  };

  const switchUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      showToast(`Переключено на: ${user.name} (${user.role.toUpperCase()})`, 'info');
    }
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    showToast('Профиль успешно обновлен', 'success');
  };

  // Add Listing
  const addListing = (listingData: Omit<Listing, 'id' | 'createdAt' | 'views' | 'favoritesCount' | 'moderationStatus' | 'status'>): Listing => {
    const newId = `list_${Date.now()}`;
    const newListing: Listing = {
      ...listingData,
      id: newId,
      createdAt: new Date().toISOString(),
      views: 1,
      favoritesCount: 0,
      status: 'active',
      moderationStatus: currentUser?.role === 'admin' ? 'approved' : 'pending'
    };

    setListings(prev => [newListing, ...prev]);

    // Update user's count
    if (currentUser) {
      updateUserProfile({
        activeListingsCount: (currentUser.activeListingsCount || 0) + 1
      });
    }

    addNotification(
      'Объявление на проверке',
      `Ваше объявление «${newListing.title}» отправлено модераторам. Обычно это занимает не более 5 минут.`,
      'moderation',
      { view: 'profile_listings', targetId: newId }
    );

    return newListing;
  };

  const updateListing = (id: string, updates: Partial<Listing>) => {
    setListings(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    showToast('Объявление обновлено', 'success');
  };

  const deleteListing = (id: string) => {
    setListings(prev => prev.filter(item => item.id !== id));
    showToast('Объявление удалено', 'info');
  };

  // Chat Actions
  const startOrOpenChatWithSeller = (listing: Listing) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      showToast('Войдите в аккаунт, чтобы написать продавцу', 'info');
      return;
    }
    if (listing.sellerId === currentUser.id) {
      showToast('Это ваше собственное объявление!', 'info');
      return;
    }

    // Check if conversation exists
    let conv = conversations.find(c => 
      c.listingId === listing.id && 
      ((c.buyerId === currentUser.id && c.sellerId === listing.sellerId) || 
       (c.sellerId === currentUser.id && c.buyerId === listing.sellerId))
    );

    if (!conv) {
      conv = {
        id: `conv_${Date.now()}`,
        listingId: listing.id,
        listingTitle: listing.title,
        listingPrice: listing.price,
        listingImage: listing.images[0] || '',
        buyerId: currentUser.id,
        buyerName: currentUser.name,
        buyerAvatar: currentUser.avatar,
        sellerId: listing.sellerId,
        sellerName: listing.sellerName,
        sellerAvatar: listing.sellerAvatar,
        lastMessage: 'Начат диалог по объявлению',
        lastMessageTime: new Date().toISOString(),
        unreadCountForBuyer: 0,
        unreadCountForSeller: 1,
        messages: [
          {
            id: `msg_${Date.now()}`,
            senderId: currentUser.id,
            senderName: currentUser.name,
            text: `Здравствуйте! Интересует «${listing.title}». Подскажите, актуально ли объявление?`,
            createdAt: new Date().toISOString()
          }
        ]
      };
      setConversations(prev => [conv!, ...prev]);
    }

    setActiveConversationId(conv.id);
    setIsChatModalOpen(true);
  };

  const sendMessage = (convId: string, text: string, offerPrice?: number) => {
    if (!currentUser || !text.trim()) return;

    const newMessage: {
      id: string;
      senderId: string;
      senderName: string;
      text: string;
      createdAt: string;
      isOffer?: boolean;
      offerPrice?: number;
    } = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      ...(offerPrice ? { isOffer: true, offerPrice } : {})
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === convId) {
        const isBuyer = conv.buyerId === currentUser.id;
        return {
          ...conv,
          lastMessage: offerPrice ? `Предложение цены: ${offerPrice.toLocaleString()} ₽` : text.trim(),
          lastMessageTime: new Date().toISOString(),
          unreadCountForBuyer: isBuyer ? 0 : conv.unreadCountForBuyer + 1,
          unreadCountForSeller: isBuyer ? conv.unreadCountForSeller + 1 : 0,
          messages: [...conv.messages, newMessage]
        };
      }
      return conv;
    }));

    // Realistic auto-reply simulation from seller after 3.5 seconds if sending as buyer
    const targetConv = conversations.find(c => c.id === convId);
    if (targetConv && targetConv.buyerId === currentUser.id) {
      setTimeout(() => {
        const replies = [
          'Здравствуйте! Да, всё в силе. Можно забрать сегодня или оформить доставку.',
          'Добрый день! Товар в наличии, состояние в точности как на фото.',
          'Отличное предложение! Договорились, готов отдать за эту сумму.',
          'Спасибо за сообщение! Готов отправить сегодня вечером через сервис доставки.'
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        const sellerMsg = {
          id: `msg_seller_${Date.now()}`,
          senderId: targetConv.sellerId,
          senderName: targetConv.sellerName,
          text: randomReply,
          createdAt: new Date().toISOString()
        };

        setConversations(currList => currList.map(c => {
          if (c.id === convId) {
            return {
              ...c,
              lastMessage: randomReply,
              lastMessageTime: new Date().toISOString(),
              unreadCountForBuyer: c.unreadCountForBuyer + 1,
              messages: [...c.messages, sellerMsg]
            };
          }
          return c;
        }));

        addNotification(
          `Новое сообщение от ${targetConv.sellerName}`,
          randomReply,
          'message',
          { view: 'chat', targetId: convId }
        );
      }, 3500);
    }
  };

  // Orders
  const createOrder = (listing: Listing, deliveryAddress: string): Order => {
    if (!currentUser) throw new Error('Требуется авторизация');

    const deliveryFee = listing.hasDelivery ? 350 : 0;
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      listingImage: listing.images[0] || '',
      price: listing.price,
      deliveryFee,
      totalPrice: listing.price + deliveryFee,
      buyerId: currentUser.id,
      sellerId: listing.sellerId,
      sellerName: listing.sellerName,
      createdAt: new Date().toISOString(),
      status: 'paid',
      deliveryAddress,
      trackingNumber: `RSH-${Math.floor(1000000 + Math.random() * 9000000)}`,
      reviewed: false
    };

    setOrders(prev => [newOrder, ...prev]);

    // Mark listing as sold
    updateListing(listing.id, { status: 'sold' });

    addNotification(
      'Заказ успешно оформлен!',
      `Заказ «${listing.title}» оплачен. Продавец оповещен и готовит отправку.`,
      'order',
      { view: 'profile_orders', targetId: newOrder.id }
    );

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    showToast(`Статус заказа изменен на: ${status}`, 'info');
  };

  // Reviews
  const addReview = (sellerId: string, rating: number, text: string, tags?: string[], listingTitle?: string) => {
    if (!currentUser) return;
    const newReview: Review = {
      id: `rev_${Date.now()}`,
      listingTitle: listingTitle || 'Покупка на ResellHub',
      sellerId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      rating,
      text,
      createdAt: new Date().toISOString().split('T')[0],
      dealType: 'purchase',
      tags
    };

    setReviews(prev => [newReview, ...prev]);

    // Recalculate seller rating
    const sellerReviews = [...reviews.filter(r => r.sellerId === sellerId), newReview];
    const avg = sellerReviews.reduce((sum, r) => sum + r.rating, 0) / sellerReviews.length;
    
    setUsers(currUsers => currUsers.map(u => {
      if (u.id === sellerId) {
        return {
          ...u,
          rating: Number(avg.toFixed(1)),
          reviewsCount: sellerReviews.length
        };
      }
      return u;
    }));

    showToast('Спасибо за ваш отзыв! Рейтинг продавца обновлен.', 'success');
  };

  const replyToReview = (reviewId: string, replyText: string) => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          reply: {
            text: replyText,
            createdAt: new Date().toISOString().split('T')[0]
          }
        };
      }
      return r;
    }));
    showToast('Ответ на отзыв опубликован', 'success');
  };

  // Admin moderation
  const moderateListing = (listingId: string, status: ModerationStatus, reason?: string) => {
    setListings(prev => prev.map(l => {
      if (l.id === listingId) {
        return {
          ...l,
          moderationStatus: status,
          moderationReason: reason
        };
      }
      return l;
    }));

    const targetListing = listings.find(l => l.id === listingId);
    if (targetListing) {
      const msg = status === 'approved' 
        ? `Ваше объявление «${targetListing.title}» одобрено и видно всем покупателям!`
        : `Объявление «${targetListing.title}» отклонено модератором: ${reason || 'Нарушение правил площадки'}`;
      
      addNotification(
        status === 'approved' ? 'Объявление одобрено' : 'Объявление отклонено',
        msg,
        'moderation',
        { view: 'profile_listings', targetId: listingId }
      );
    }

    showToast(
      status === 'approved' ? 'Объявление одобрено модератором' : 'Объявление отклонено',
      status === 'approved' ? 'success' : 'info'
    );
  };

  const toggleUserBan = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextState = !u.isBanned;
        showToast(nextState ? `Пользователь ${u.name} заблокирован` : `Пользователь ${u.name} разблокирован`, 'info');
        return { ...u, isBanned: nextState };
      }
      return u;
    }));
  };

  const changeUserRole = (userId: string, role: User['role']) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        showToast(`Роль пользователя ${u.name} изменена на: ${role}`, 'success');
        return { ...u, role };
      }
      return u;
    }));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        login,
        register,
        logout,
        switchUser,
        updateUserProfile,
        listings,
        addListing,
        updateListing,
        deleteListing,
        favorites,
        toggleFavorite,
        filters,
        setFilters,
        resetFilters,
        selectedCity,
        setSelectedCity,
        categories,
        currentView,
        setCurrentView,
        activeListingId,
        setActiveListingId,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isChatModalOpen,
        setIsChatModalOpen,
        activeConversationId,
        setActiveConversationId,
        isOrderModalOpen,
        setIsOrderModalOpen,
        orderTargetListing,
        setOrderTargetListing,
        isReviewModalOpen,
        setIsReviewModalOpen,
        reviewTargetOrder,
        setReviewTargetOrder,
        conversations,
        sendMessage,
        startOrOpenChatWithSeller,
        unreadMessagesCount,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,
        addNotification,
        orders,
        createOrder,
        updateOrderStatus,
        reviews,
        addReview,
        replyToReview,
        moderateListing,
        toggleUserBan,
        changeUserRole,
        isDarkMode,
        toggleDarkMode,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
