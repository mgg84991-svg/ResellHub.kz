import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  Tag, 
  ShoppingBag, 
  Sparkles, 
  ArrowLeft,
  CheckCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ChatModal: React.FC = () => {
  const { 
    isChatModalOpen, 
    setIsChatModalOpen, 
    conversations, 
    activeConversationId, 
    setActiveConversationId,
    sendMessage,
    currentUser,
    setOrderTargetListing,
    setIsOrderModalOpen,
    listings
  } = useApp();

  const [messageInput, setMessageInput] = useState('');
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [offerPriceInput, setOfferPriceInput] = useState<number | ''>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto select first conversation if none selected
  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId, setActiveConversationId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeConversationId]);

  if (!isChatModalOpen) return null;

  const currentConv = conversations.find(c => c.id === activeConversationId);
  const matchedListing = listings.find(l => l.id === currentConv?.listingId);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentConv || !messageInput.trim()) return;
    sendMessage(currentConv.id, messageInput.trim());
    setMessageInput('');
  };

  const handleQuickQuestion = (text: string) => {
    if (!currentConv) return;
    sendMessage(currentConv.id, text);
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentConv || !offerPriceInput || Number(offerPriceInput) <= 0) return;
    sendMessage(
      currentConv.id, 
      `Предлагаю забрать товар за ${Number(offerPriceInput).toLocaleString('ru-RU')} ₽. Что думаете?`, 
      Number(offerPriceInput)
    );
    setOfferModalOpen(false);
    setOfferPriceInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl h-[90vh] max-h-[750px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex overflow-hidden">
        
        {/* Left Side: Conversation List (hidden on mobile if conversation is selected) */}
        <div className={`w-full md:w-80 shrink-0 border-r border-slate-200 dark:border-slate-800 flex flex-col ${
          currentConv && 'hidden md:flex'
        }`}>
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-500" />
              <span>Сообщения</span>
            </h3>
            <button
              onClick={() => setIsChatModalOpen(false)}
              className="md:hidden p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                У вас пока нет активных диалогов. Откройте любое объявление и нажмите «Написать продавцу».
              </div>
            ) : (
              conversations.map(conv => {
                const isSelected = conv.id === activeConversationId;
                const otherPartyName = currentUser?.id === conv.buyerId ? conv.sellerName : conv.buyerName;
                const otherPartyAvatar = currentUser?.id === conv.buyerId ? conv.sellerAvatar : conv.buyerAvatar;
                const unread = currentUser?.id === conv.buyerId ? conv.unreadCountForBuyer : conv.unreadCountForSeller;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`p-3.5 flex gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition ${
                      isSelected ? 'bg-emerald-50/70 dark:bg-emerald-950/30' : ''
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img src={otherPartyAvatar} alt="" className="w-11 h-11 rounded-full object-cover" />
                      {unread > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                          {unread}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {otherPartyName}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 truncate mb-1">
                        {conv.listingTitle}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Active Chat Thread */}
        {currentConv ? (
          <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50 dark:bg-slate-900/50">
            {/* Top Bar with Seller Info & Listing Mini-Card */}
            <div className="p-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setActiveConversationId(null)}
                  className="md:hidden p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img
                  src={currentUser?.id === currentConv.buyerId ? currentConv.sellerAvatar : currentConv.buyerAvatar}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {currentUser?.id === currentConv.buyerId ? currentConv.sellerName : currentConv.buyerName}
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium truncate">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                    <span>В сети • Отвечает обычно за 5 минут</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsChatModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Pinned Listing Preview Card */}
            <div className="px-4 py-2 bg-slate-100/70 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={currentConv.listingImage}
                  alt=""
                  className="w-10 h-10 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {currentConv.listingTitle}
                  </div>
                  <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    {currentConv.listingPrice.toLocaleString('ru-RU')} ₸
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setOfferModalOpen(true)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:border-emerald-500 flex items-center gap-1 transition"
                >
                  <Tag className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">Предложить цену</span>
                </button>

                {matchedListing && matchedListing.status !== 'sold' && currentUser?.id === currentConv.buyerId && (
                  <button
                    onClick={() => {
                      setOrderTargetListing(matchedListing);
                      setIsOrderModalOpen(true);
                      setIsChatModalOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition shadow-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{matchedListing.hasDelivery ? 'Купить' : 'Забрать'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {currentConv.messages.map(msg => {
                const isMe = msg.senderId === currentUser?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-xs text-xs sm:text-sm leading-relaxed ${
                        isMe
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-xs'
                      }`}
                    >
                      {msg.isOffer && (
                        <div className="mb-1 pb-1 border-b border-white/20 dark:border-slate-700 text-[11px] font-bold flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          <span>Предложение цены: {msg.offerPrice?.toLocaleString('ru-RU')} ₸</span>
                        </div>
                      )}
                      <div>{msg.text}</div>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 px-1">
                      <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-emerald-500" />}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Chips */}
            <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto bg-white/70 dark:bg-slate-900/70 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                <Sparkles className="w-3 h-3 text-amber-500 inline mr-1" /> Быстрый вопрос:
              </span>
              {[
                'Здравствуйте! Ещё продаётся?',
                'Возможен ли торг?',
                'Где можно забрать товар?',
                'Отправите доставкой?'
              ].map(q => (
                <button
                  key={q}
                  onClick={() => handleQuickQuestion(q)}
                  className="px-2.5 py-1 rounded-full text-[11px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 whitespace-nowrap transition"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Message Input Bar */}
            <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                placeholder="Напишите сообщение..."
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 border border-transparent focus:border-emerald-500 text-xs sm:text-sm focus:outline-none"
              />
              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white transition active:scale-95 shadow-md shadow-emerald-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <MessageSquare className="w-12 h-12 mb-3 text-slate-300 dark:text-slate-700" />
            <p className="text-sm font-semibold">Выберите диалог слева для просмотра переписки</p>
          </div>
        )}

      </div>

      {/* Offer Price Modal */}
      {offerModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-emerald-500" />
                <span>Предложить свою цену</span>
              </h4>
              <button onClick={() => setOfferModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSendOffer} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Текущая цена продавца: <b>{currentConv?.listingPrice.toLocaleString('ru-RU')} ₸</b>
                </label>
                <input
                  type="number"
                  required
                  placeholder="Ваша сумма, ₸"
                  value={offerPriceInput}
                  onChange={e => setOfferPriceInput(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOfferModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20"
                >
                  Отправить предложение
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
