'use client';

import { useState, useRef, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  Phone,
  ShoppingBag,
  CreditCard,
  HelpCircle,
  Paperclip,
  Image,
  Smile,
  Send,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCustomers from '../hooks/useCustomers';
import { useLanguage } from '../Context/Languge';

export default function ChatPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { customers, isLoading } = useCustomers();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      name: '888 Agent',
      avatar: '/placeholder.svg?height=40&width=40',
      message: t('common.welcomeMessage'),
      time: '10:30 AM',
    },
    {
      id: 2,
      sender: 'user',
      message: t('common.orderQuestionMessage'),
      time: '10:31 AM',
    },
    {
      id: 3,
      sender: 'agent',
      name: '888 Agent',
      avatar: '/placeholder.svg?height=40&width=40',
      message: t('common.happyToHelpMessage'),
      time: '10:32 AM',
    },
    {
      id: 4,
      sender: 'agent',
      name: '888 Agent',
      avatar: '/placeholder.svg?height=40&width=40',
      message: t('common.orderShippedMessage'),
      time: '10:33 AM',
    },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [quickReplies] = useState([
    { id: 1, text: t('common.whereIsMyOrder') },
    { id: 2, text: t('common.howToReturnItem') },
    { id: 3, text: t('common.changeShippingAddress') },
    { id: 4, text: t('common.internationalShipping') },
  ]);

  // Get the first customer as the agent
  const agent = customers?.at(0);
  const isVerified = agent?.verification_status === 'verified';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user' as const,
      message: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');

    // Simulate agent typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Add agent response
      const agentMessage = {
        id: messages.length + 2,
        sender: 'agent' as const,
        name: agent?.name || 'Sarah Johnson',
        avatar: agent?.img_url || '/logo.png',
        message: getAutoResponse(newMessage),
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, agentMessage]);
    }, 2000);
  };

  const getAutoResponse = (message: string) => {
    const lowerMsg = message.toLowerCase();
    if (
      lowerMsg.includes('order') ||
      lowerMsg.includes('delivery') ||
      lowerMsg.includes('shipping')
    ) {
      return t('common.orderProcessingResponse');
    } else if (lowerMsg.includes('return') || lowerMsg.includes('refund')) {
      return t('common.returnsResponse');
    } else if (
      lowerMsg.includes('discount') ||
      lowerMsg.includes('coupon') ||
      lowerMsg.includes('promo')
    ) {
      return t('common.discountResponse');
    } else {
      return t('common.defaultResponse');
    }
  };

  const handleQuickReply = (reply: string) => {
    setNewMessage(reply);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: string) => {
    let message = '';
    switch (action) {
      case 'track':
        message = t('common.trackOrderMessage');
        break;
      case 'payment':
        message = t('common.paymentIssueMessage');
        break;
      case 'returns':
        message = t('common.returnsMessage');
        break;
      case 'help':
        message = t('common.generalHelpMessage');
        break;
    }

    if (message) {
      setNewMessage(message);
      // Auto-send the message
      setTimeout(() => handleSendMessage(), 100);
    }
  };

  const handleCallSupport = () => {
    alert(t('common.callingSupport'));
  };

  const handleFileUpload = () => {
    alert(t('common.fileUploadComingSoon'));
  };

  const handleImageUpload = () => {
    alert(t('common.imageUploadComingSoon'));
  };

  const handleEmojiClick = () => {
    alert(t('common.emojiPickerComingSoon'));
  };

  const handleDismissBanner = () => {
    setShowBanner(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 transition-colors hover:text-blue-600"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="font-semibold">
                  {t('common.customerSupport')}
                </span>
              </button>
            </div>

            <div>
              <a
                href="/help"
                className="text-blue-500 transition-colors hover:text-blue-700"
              >
                {t('common.helpCenter')}
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col">
        {/* Banner */}
        {showBanner && !isLoading && !isVerified && (
          <div className="mx-4 mt-4 flex items-start rounded-lg bg-blue-50 p-4">
            <div className="mr-4 flex-shrink-0">
              <div className="relative">
                <img
                  src={agent?.img_url || '/logo.png'}
                  alt="Agent"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">
                {agent?.name || 'Support Agent'}
              </h3>
              <div className="mt-1 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-xs text-gray-500">
                  {t('common.online')}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <button
                  onClick={handleCallSupport}
                  className="flex items-center gap-1 transition-colors hover:text-blue-600"
                >
                  <Phone className="h-4 w-4" />
                  <span>{t('common.callSupport')}</span>
                </button>
              </div>
            </div>
            <button onClick={handleDismissBanner} className="ml-2">
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="p-4">
          <h3 className="mb-3 font-semibold">{t('common.quickActions')}</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button
              onClick={() => handleQuickAction('track')}
              className="flex flex-col items-center justify-center rounded-lg bg-blue-50 p-3 transition-colors hover:bg-blue-100"
            >
              <ShoppingBag className="mb-1 h-6 w-6 text-blue-500" />
              <span className="text-center text-xs">
                {t('common.trackOrder')}
              </span>
            </button>
            <button
              onClick={() => handleQuickAction('payment')}
              className="flex flex-col items-center justify-center rounded-lg bg-blue-50 p-3 transition-colors hover:bg-blue-100"
            >
              <CreditCard className="mb-1 h-6 w-6 text-blue-500" />
              <span className="text-center text-xs">
                {t('common.paymentIssues')}
              </span>
            </button>
            <button
              onClick={() => handleQuickAction('returns')}
              className="flex flex-col items-center justify-center rounded-lg bg-blue-50 p-3 transition-colors hover:bg-blue-100"
            >
              <ShoppingBag className="mb-1 h-6 w-6 text-blue-500" />
              <span className="text-center text-xs">{t('common.returns')}</span>
            </button>
            <button
              onClick={() => handleQuickAction('help')}
              className="flex flex-col items-center justify-center rounded-lg bg-blue-50 p-3 transition-colors hover:bg-blue-100"
            >
              <HelpCircle className="mb-1 h-6 w-6 text-blue-500" />
              <span className="text-center text-xs">{t('common.help')}</span>
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="border-t border-gray-200 p-4">
          <h3 className="mb-3 font-semibold">{t('common.yourRecentOrders')}</h3>
        </div>

        {/* Chat Area */}
        <div className="flex flex-1 flex-col rounded-t-3xl bg-white">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      msg.sender === 'user'
                        ? 'rounded-br-none bg-blue-500 text-white'
                        : 'rounded-bl-none bg-gray-100 text-black'
                    }`}
                  >
                    {msg.sender === 'agent' && (
                      <div className="mb-1 flex items-center gap-2">
                        <img
                          src={msg.avatar}
                          alt={msg.name}
                          className="h-6 w-6 rounded-full"
                        />
                        <span className="text-xs font-medium">{msg.name}</span>
                      </div>
                    )}
                    <p className="break-words">{msg.message}</p>
                    <div
                      className={`mt-1 text-xs ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}
                    >
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl rounded-bl-none bg-gray-100 p-4">
                    <div className="mb-1 flex items-center gap-2">
                      <img
                        src={agent?.img_url || '/logo.png'}
                        alt={agent?.name || 'Agent'}
                        className="h-6 w-6 rounded-full"
                      />
                      <span className="text-xs font-medium">
                        {agent?.name || 'Agent'}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: '0.4s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Replies */}
          <div className="border-t border-gray-200 px-4 py-2">
            <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
              {quickReplies.map((reply) => (
                <button
                  key={reply.id}
                  onClick={() => handleQuickReply(reply.text)}
                  className="whitespace-nowrap rounded-full bg-gray-100 px-4 py-2 text-sm transition-colors hover:bg-gray-200"
                >
                  {reply.text}
                </button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-end gap-2">
              <div className="flex-1 rounded-2xl bg-gray-100 px-4 py-3">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={t('common.typeYourMessage')}
                  className="max-h-32 w-full resize-none bg-transparent outline-none"
                  rows={1}
                />
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      onClick={handleFileUpload}
                      className="text-gray-500 transition-colors hover:text-gray-700"
                    >
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleImageUpload}
                      className="text-gray-500 transition-colors hover:text-gray-700"
                    >
                      <Image className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleEmojiClick}
                      className="text-gray-500 transition-colors hover:text-gray-700"
                    >
                      <Smile className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={newMessage.trim() === ''}
                className={`rounded-full p-3 transition-colors ${
                  newMessage.trim() === ''
                    ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
