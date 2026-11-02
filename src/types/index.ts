export type UserRole = 'user' | 'moderator' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  city: string;
  registeredAt: string;
  isBanned?: boolean;
  rating: number;
  reviewsCount: number;
  isVerified?: boolean;
  activeListingsCount?: number;
  completedDealsCount?: number;
  bio?: string;
  password?: string;
}

export type ItemCondition = 'new' | 'like_new' | 'good' | 'fair' | 'for_parts';

export type ModerationStatus = 'approved' | 'pending' | 'rejected';

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  isNegotiable: boolean;
  category: string;
  subCategory?: string;
  condition: ItemCondition;
  images: string[];
  city: string;
  address?: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerRating: number;
  sellerReviewsCount: number;
  createdAt: string;
  views: number;
  favoritesCount: number;
  status: 'active' | 'sold' | 'archived';
  moderationStatus: ModerationStatus;
  moderationReason?: string;
  hasDelivery: boolean;
  tags?: string[];
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  count: number;
  color: string;
  subCategories: string[];
}

export interface Review {
  id: string;
  listingId?: string;
  listingTitle?: string;
  sellerId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  rating: number; // 1 to 5
  text: string;
  createdAt: string;
  reply?: {
    text: string;
    createdAt: string;
  };
  dealType: 'purchase' | 'sale';
  tags?: string[];
}

export type OrderStatus = 'pending' | 'paid' | 'shipping' | 'delivered' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  price: number;
  deliveryFee: number;
  totalPrice: number;
  buyerId: string;
  sellerId: string;
  sellerName: string;
  createdAt: string;
  status: OrderStatus;
  deliveryAddress: string;
  trackingNumber?: string;
  reviewed?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
  imageUrl?: string;
  isOffer?: boolean;
  offerPrice?: number;
}

export interface Conversation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingPrice: number;
  listingImage: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCountForBuyer: number;
  unreadCountForSeller: number;
  messages: ChatMessage[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  createdAt: string;
  type: 'message' | 'order' | 'moderation' | 'review' | 'price_drop';
  read: boolean;
  linkAction?: {
    view: 'chat' | 'profile_orders' | 'profile_listings' | 'listing';
    targetId?: string;
  };
}

export type DeliveryFilterMode = 'all' | 'delivery_only' | 'pickup_only';

export interface FilterOptions {
  searchQuery: string;
  category: string;
  subCategory?: string;
  minPrice: number | null;
  maxPrice: number | null;
  condition: ItemCondition[];
  city: string;
  hasDeliveryOnly: boolean;
  deliveryMode: DeliveryFilterMode;
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'popular';
}
