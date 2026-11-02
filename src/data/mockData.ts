import { Category, Listing, Order, Review, User, Conversation, NotificationItem } from '../types';

export const CITIES_KZ = [
  'Все города',
  'Алматы',
  'Астана',
  'Шымкент',
  'Караганда',
  'Актобе',
  'Тараз',
  'Павлодар',
  'Усть-Каменогорск',
  'Семей',
  'Атырау',
  'Костанай',
  'Кызылорда',
  'Уральск',
  'Петропавловск',
  'Актау'
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'electronics',
    name: 'Электроника',
    iconName: 'Smartphone',
    count: 142,
    color: 'from-blue-500 to-indigo-600',
    subCategories: ['Смартфоны', 'Ноутбуки', 'Наушники', 'Игровые консоли', 'Фототехника', 'Планшеты']
  },
  {
    id: 'furniture',
    name: 'Мебель и интерьер',
    iconName: 'Armchair',
    count: 89,
    color: 'from-amber-500 to-orange-600',
    subCategories: ['Столы и стулья', 'Диваны и кресла', 'Шкафы', 'Освещение', 'Декор', 'Зеркала']
  },
  {
    id: 'clothing',
    name: 'Одежда и обувь',
    iconName: 'Shirt',
    count: 215,
    color: 'from-pink-500 to-rose-600',
    subCategories: ['Верхняя одежда', 'Обувь', 'Аксессуары', 'Сумки и рюкзаки', 'Часы', 'Платья']
  },
  {
    id: 'sports',
    name: 'Спорт и отдых',
    iconName: 'Bike',
    count: 64,
    color: 'from-emerald-500 to-teal-600',
    subCategories: ['Велосипеды', 'Самокаты', 'Тренажеры', 'Туризм и кемпинг', 'Зимний спорт', 'Рыбалка']
  },
  {
    id: 'appliances',
    name: 'Бытовая техника',
    iconName: 'Tv',
    count: 53,
    color: 'from-cyan-500 to-blue-600',
    subCategories: ['Кофемашины', 'Пылесосы', 'Микроволновки', 'Блендеры', 'Телевизоры', 'Утюги']
  },
  {
    id: 'hobbies',
    name: 'Хобби и развлечения',
    iconName: 'Gamepad2',
    count: 78,
    color: 'from-purple-500 to-indigo-700',
    subCategories: ['Музыкальные инструменты', 'Настольные игры', 'Книги', 'Коллекционирование', 'Lego', 'Винил']
  },
  {
    id: 'kids',
    name: 'Детские товары',
    iconName: 'Baby',
    count: 47,
    color: 'from-yellow-400 to-amber-600',
    subCategories: ['Коляски', 'Автокресла', 'Игрушки', 'Детская мебель', 'Одежда для малышей']
  },
  {
    id: 'auto_parts',
    name: 'Авто и запчасти',
    iconName: 'Car',
    count: 36,
    color: 'from-slate-600 to-slate-800',
    subCategories: ['Шины и диски', 'Аксессуары в салон', 'Инструменты', 'Электроника для авто']
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user_admin',
    name: 'Арман Сериков (Админ)',
    email: 'admin@resellhub.kz',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    phone: '+7 (701) 555-01-01',
    city: 'Алматы',
    registeredAt: '2024-01-10',
    rating: 5.0,
    reviewsCount: 42,
    isVerified: true,
    activeListingsCount: 3,
    completedDealsCount: 28,
    bio: 'Администратор ResellHub Казахстан. Контроль честности сделок и модерация объявлений.',
    password: '12345'
  },
  {
    id: 'user_current',
    name: 'Даулет Касымов',
    email: 'daulet@resellhub.kz',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    phone: '+7 (777) 345-67-89',
    city: 'Алматы',
    registeredAt: '2024-03-15',
    rating: 4.9,
    reviewsCount: 14,
    isVerified: true,
    activeListingsCount: 2,
    completedDealsCount: 11,
    bio: 'Продаю ненужные вещи в отличном состоянии. Бережное отношение.',
    password: '12345'
  },
  {
    id: 'user_daria',
    name: 'Айгерим Нурланова',
    email: 'aigerim@resellhub.kz',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    phone: '+7 (702) 890-12-34',
    city: 'Астана',
    registeredAt: '2023-11-20',
    rating: 4.8,
    reviewsCount: 26,
    isVerified: true,
    activeListingsCount: 4,
    completedDealsCount: 31,
    bio: 'Дизайнер интерьеров из Астаны. Периодически обновляю домашний декор и электронику.',
    password: '12345'
  },
  {
    id: 'user_ivan',
    name: 'Бауржан Омаров',
    email: 'baurzhan@resellhub.kz',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    phone: '+7 (705) 678-90-12',
    city: 'Шымкент',
    registeredAt: '2024-02-01',
    rating: 5.0,
    reviewsCount: 8,
    isVerified: true,
    activeListingsCount: 3,
    completedDealsCount: 7,
    bio: 'Музыкант и аудиофил. Продаю аппаратуру, гитары и винил.',
    password: '12345'
  }
];

export const INITIAL_LISTINGS: Listing[] = [
  {
    id: 'list_1',
    title: 'Беспроводные наушники Sony WH-1000XM4',
    description: 'Оригинальные наушники Sony в идеальном состоянии. Лучшее активное шумоподавление. Использовались только дома за ноутбуком. Аккумулятор держит до 30 часов. В комплекте чехол, кабель 3.5мм и зарядка Type-C.',
    price: 95000,
    originalPrice: 145000,
    isNegotiable: true,
    category: 'electronics',
    subCategory: 'Наушники',
    condition: 'like_new',
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Алматы',
    address: 'м. Алатау, пр. Абая 115',
    sellerId: 'user_current',
    sellerName: 'Даулет Касымов',
    sellerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    sellerRating: 4.9,
    sellerReviewsCount: 14,
    createdAt: '2026-11-01T12:00:00Z',
    views: 342,
    favoritesCount: 28,
    status: 'active',
    moderationStatus: 'approved',
    hasDelivery: true,
    tags: ['sony', 'наушники', 'bluetooth', 'алматы'],
    featured: true
  },
  {
    id: 'list_2',
    title: 'Кофемашина рожковая DeLonghi Dedica EC 685',
    description: 'Компактная итальянская кофемашина из нержавеющей стали. 15 бар, быстрый нагрев за 35 секунд. Готовит отличный эспрессо и капучино с плотной пенкой. Только самовывоз в Астане без доставки, любые проверки при встрече.',
    price: 49000,
    originalPrice: 85000,
    isNegotiable: false,
    category: 'appliances',
    subCategory: 'Кофемашины',
    condition: 'good',
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Астана',
    address: 'Левый берег, пр. Мангилик Ел 24',
    sellerId: 'user_daria',
    sellerName: 'Айгерим Нурланова',
    sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    sellerRating: 4.8,
    sellerReviewsCount: 26,
    createdAt: '2026-10-30T10:15:00Z',
    views: 189,
    favoritesCount: 17,
    status: 'active',
    moderationStatus: 'approved',
    hasDelivery: false, // БЕЗ ДОСТАВКИ (САМОВЫВОЗ)
    tags: ['delonghi', 'кофемашина', 'астана', 'самовывоз'],
    featured: false
  },
  {
    id: 'list_3',
    title: 'Акустическая гитара Fender CD-60S All-Mahogany',
    description: 'Дредноут из массива красного дерева. Богатый бархатистый теплый звук. Установлены струны Elixir Nanoweb 11-52. Без сколов. В комплекте чехол Rockbag и каподастр. Без доставки, осмотр на месте.',
    price: 125000,
    originalPrice: 175000,
    isNegotiable: true,
    category: 'hobbies',
    subCategory: 'Музыкальные инструменты',
    condition: 'like_new',
    images: [
      'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Шымкент',
    address: 'пр. Тауке хана 54',
    sellerId: 'user_ivan',
    sellerName: 'Бауржан Омаров',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    sellerRating: 5.0,
    sellerReviewsCount: 8,
    createdAt: '2026-10-28T16:40:00Z',
    views: 412,
    favoritesCount: 45,
    status: 'active',
    moderationStatus: 'approved',
    hasDelivery: false, // БЕЗ ДОСТАВКИ (САМОВЫВОЗ)
    tags: ['fender', 'гитара', 'шымкент', 'самовывоз'],
    featured: true
  },
  {
    id: 'list_4',
    title: 'Игровой монитор 27" LG UltraGear 2K 165Hz',
    description: 'Разрешение 2560x1440 QHD, 1мс Nano IPS, 165 Гц, G-Sync Compatible. Без битых пикселей. Полная коробка, подставка с регулировкой по высоте. Отправка по Казахстану курьером.',
    price: 145000,
    originalPrice: 210000,
    isNegotiable: false,
    category: 'electronics',
    subCategory: 'Ноутбуки',
    condition: 'like_new',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Алматы',
    address: 'Бостандыкский район, ул. Розыбакиева',
    sellerId: 'user_current',
    sellerName: 'Даулет Касымов',
    sellerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    sellerRating: 4.9,
    sellerReviewsCount: 14,
    createdAt: '2026-10-29T14:20:00Z',
    views: 267,
    favoritesCount: 31,
    status: 'active',
    moderationStatus: 'approved',
    hasDelivery: true,
    tags: ['lg', 'монитор', 'гейминг', 'алматы'],
    featured: false
  },
  {
    id: 'list_5',
    title: 'Горный велосипед Trek Marlin 6 (Размер L)',
    description: 'Алюминиевая рама, вилка SR Suntour с блокировкой. Трансмиссия 1x10 Shimano Deore, гидравлические тормоза Tektro. Катан один сезон в Алматы по терренкуру. Состояние отличное. Без доставки (самовывоз).',
    price: 220000,
    originalPrice: 320000,
    isNegotiable: true,
    category: 'sports',
    subCategory: 'Велосипеды',
    condition: 'good',
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Алматы',
    address: 'мкр. Самал-2',
    sellerId: 'user_admin',
    sellerName: 'Арман Сериков (Админ)',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    sellerRating: 5.0,
    sellerReviewsCount: 42,
    createdAt: '2026-10-25T09:30:00Z',
    views: 520,
    favoritesCount: 63,
    status: 'active',
    moderationStatus: 'approved',
    hasDelivery: false, // БЕЗ ДОСТАВКИ (САМОВЫВОЗ)
    tags: ['trek', 'велосипед', 'спорт', 'алматы', 'самовывоз'],
    featured: true
  },
  {
    id: 'list_6',
    title: 'Шерстяное пальто Massimo Dutti (M)',
    description: 'Классическое пальто из 100% шерсти бежевого цвета. Идеальный крой, надевалось всего несколько раз. Чистое, без катышков. Отправлю доставкой по Казахстану.',
    price: 58000,
    originalPrice: 120000,
    isNegotiable: true,
    category: 'clothing',
    subCategory: 'Верхняя одежда',
    condition: 'like_new',
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Астана',
    address: 'пр. Кабанбай батыра 17',
    sellerId: 'user_daria',
    sellerName: 'Айгерим Нурланова',
    sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    sellerRating: 4.8,
    sellerReviewsCount: 26,
    createdAt: '2026-11-01T08:10:00Z',
    views: 145,
    favoritesCount: 19,
    status: 'active',
    moderationStatus: 'approved',
    hasDelivery: true,
    tags: ['пальто', 'massimodutti', 'одежда', 'астана'],
    featured: false
  },
  {
    id: 'list_7',
    title: 'Конструктор LEGO Star Wars Millennium Falcon',
    description: 'Оригинальный набор LEGO Star Wars. Собран один раз, стоял на витрине. Все 1351 деталь на месте, все фигурки в идеале. Коробка и инструкция в комплекте.',
    price: 72000,
    originalPrice: 105000,
    isNegotiable: false,
    category: 'hobbies',
    subCategory: 'Lego',
    condition: 'like_new',
    images: [
      'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1619086303291-0ef7699e4b31?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Караганда',
    address: 'пр. Бухар Жырау 32',
    sellerId: 'user_current',
    sellerName: 'Даулет Касымов',
    sellerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    sellerRating: 4.9,
    sellerReviewsCount: 14,
    createdAt: '2026-10-31T17:30:00Z',
    views: 310,
    favoritesCount: 52,
    status: 'active',
    moderationStatus: 'approved',
    hasDelivery: true,
    tags: ['lego', 'starwars', 'караганда'],
    featured: true
  },
  {
    id: 'list_8',
    title: 'Письменный рабочий стол IKEA Bekant 140x60',
    description: 'Прочный стол с регулируемыми ножками. Цвет столешницы беленый дуб. Снизу сетка для проводов. Только самовывоз в Алматы (без доставки), помещается в легковой автомобиль со сложенными сиденьями.',
    price: 38000,
    originalPrice: 75000,
    isNegotiable: true,
    category: 'furniture',
    subCategory: 'Столы и стулья',
    condition: 'good',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80'
    ],
    city: 'Алматы',
    address: 'Алмалинский район, ул. Гоголя 86',
    sellerId: 'user_admin',
    sellerName: 'Арман Сериков (Админ)',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    sellerRating: 5.0,
    sellerReviewsCount: 42,
    createdAt: '2026-10-27T11:00:00Z',
    views: 180,
    favoritesCount: 14,
    status: 'active',
    moderationStatus: 'approved',
    hasDelivery: false, // БЕЗ ДОСТАВКИ (САМОВЫВОЗ)
    tags: ['ikea', 'стол', 'мебель', 'алматы', 'самовывоз'],
    featured: false
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    listingId: 'list_prev_1',
    listingTitle: 'Игровая консоль PS5',
    sellerId: 'user_current',
    authorId: 'user_ivan',
    authorName: 'Бауржан Омаров',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    text: 'Отличный продавец! Встретились в Алматы, всё проверили. Рекомендую к сотрудничеству!',
    createdAt: '2026-10-20',
    reply: {
      text: 'Бауржан, рахмет за покупку! Приятной игры!',
      createdAt: '2026-10-20'
    },
    dealType: 'sale',
    tags: ['Быстрая сделка', 'Товар как в описании', 'Пунктуальность']
  },
  {
    id: 'rev_2',
    listingId: 'list_prev_2',
    listingTitle: 'Умная колонка Яндекс Станция',
    sellerId: 'user_current',
    authorId: 'user_daria',
    authorName: 'Айгерим Нурланова',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    text: 'Колонка в идеальном состоянии. Отправили курьером по Астане в день заказа.',
    createdAt: '2026-09-14',
    dealType: 'sale',
    tags: ['Быстрая отправка', 'Отличная упаковка']
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_101',
    listingId: 'list_past_1',
    listingTitle: 'Виниловый проигрыватель Audio-Technica LP60X',
    listingImage: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=400&q=80',
    price: 65000,
    deliveryFee: 1500,
    totalPrice: 66500,
    buyerId: 'user_current',
    sellerId: 'user_ivan',
    sellerName: 'Бауржан Омаров',
    createdAt: '2026-10-18T14:00:00Z',
    status: 'completed',
    deliveryAddress: 'г. Алматы, мкр. Самал-2, д. 12',
    trackingNumber: 'KZ-RSH-884920',
    reviewed: true
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    listingId: 'list_1',
    listingTitle: 'Беспроводные наушники Sony WH-1000XM4',
    listingPrice: 95000,
    listingImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80',
    buyerId: 'user_daria',
    buyerName: 'Айгерим Нурланова',
    buyerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    sellerId: 'user_current',
    sellerName: 'Даулет Касымов',
    sellerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    lastMessage: 'Сәлеметсіз бе! Да, наушники в наличии. Можем встретиться сегодня в Алматы.',
    lastMessageTime: '2026-11-02T05:10:00Z',
    unreadCountForBuyer: 0,
    unreadCountForSeller: 1,
    messages: [
      {
        id: 'msg_1',
        senderId: 'user_daria',
        senderName: 'Айгерим Нурланова',
        text: 'Сәлеметсіз бе! Наушники ещё продаются? Возможен ли торг до 90 000 ₸?',
        createdAt: '2026-11-02T04:55:00Z'
      },
      {
        id: 'msg_2',
        senderId: 'user_current',
        senderName: 'Даулет Касымов',
        text: 'Сәлеметсіз бе! Да, в наличии. Договорились, за 90 000 ₸ готов отдать при самовывозе!',
        createdAt: '2026-11-02T05:10:00Z',
        isOffer: true,
        offerPrice: 90000
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'user_current',
    title: 'Новое сообщение',
    message: 'Айгерим Нурланова ответила на ваш запрос по наушникам Sony WH-1000XM4',
    createdAt: '2026-11-02T05:10:00Z',
    type: 'message',
    read: false,
    linkAction: {
      view: 'chat',
      targetId: 'conv_1'
    }
  }
];
