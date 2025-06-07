'use client';

import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import {
  Send,
  ShoppingBag,
  CreditCard,
  HelpCircle,
  ChevronLeft,
  Phone,
  Clock,
  Paperclip,
  ImageIcon,
  Smile,
} from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useCustomers from '../hooks/useCustomers';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      name: 'Sarah Johnson',
      avatar: '/placeholder.svg?height=40&width=40',
      message: 'Hello! Welcome to ShopEase support. How can I help you today?',
      time: '10:30 AM',
    },
    {
      id: 2,
      sender: 'user',
      message: 'Hi, I have a question about my recent order #45678',
      time: '10:31 AM',
    },
    {
      id: 3,
      sender: 'agent',
      name: 'Sarah Johnson',
      avatar: '/placeholder.svg?height=40&width=40',
      message:
        "I'd be happy to help you with that! Let me look up your order details. One moment please...",
      time: '10:32 AM',
    },
    {
      id: 4,
      sender: 'agent',
      name: 'Sarah Johnson',
      avatar: '/placeholder.svg?height=40&width=40',
      message:
        "I can see your order #45678 was shipped yesterday and is currently in transit. It should arrive by Thursday. Is there anything specific about the order you'd like to know?",
      time: '10:33 AM',
    },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [quickReplies] = useState([
    { id: 1, text: 'Where is my order?' },
    { id: 2, text: 'How do I return an item?' },
    { id: 3, text: 'Can I change my shipping address?' },
    { id: 4, text: 'Do you offer international shipping?' },
  ]);

  const [orders] = useState([
    {
      id: '45678',
      date: 'June 5, 2025',
      status: 'Shipped',
      items: 2,
      total: '$124.99',
      trackingNumber: '1Z999AA1234567890',
    },
    {
      id: '45612',
      date: 'May 28, 2025',
      status: 'Delivered',
      items: 1,
      total: '$89.99',
      trackingNumber: '1Z999AA1234567891',
    },
  ]);

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
        name: 'Sarah Johnson',
        avatar: '/placeholder.svg?height=40&width=40',
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
      return "Your order is currently being processed and should be shipped within 1-2 business days. You'll receive a tracking number via email once it ships.";
    } else if (lowerMsg.includes('return') || lowerMsg.includes('refund')) {
      return "We offer hassle-free returns within 30 days of purchase. You can initiate a return from your account's order history page or I can help you start the process now.";
    } else if (
      lowerMsg.includes('discount') ||
      lowerMsg.includes('coupon') ||
      lowerMsg.includes('promo')
    ) {
      return "I'd be happy to check for available promotions! You can use code WELCOME15 for 15% off your first order. Would you like me to suggest some current deals?";
    } else {
      return "Thank you for your message. I'll help you with that right away. Could you please provide a bit more information so I can better assist you?";
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
        message =
          'I need help tracking my order. Can you help me find the status?';
        break;
      case 'payment':
        message = "I'm having issues with my payment. Can you assist me?";
        break;
      case 'returns':
        message =
          'I need to return an item. How do I start the return process?';
        break;
      case 'help':
        message = 'I need general help with my account and orders.';
        break;
    }

    if (message) {
      setNewMessage(message);
      // Auto-send the message
      setTimeout(() => handleSendMessage(), 100);
    }
  };

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleCallSupport = () => {
    alert('Calling support at 1-800-SHOP-EASE...');
  };

  const handleFileUpload = () => {
    alert('File upload feature coming soon!');
  };

  const handleImageUpload = () => {
    alert('Image upload feature coming soon!');
  };

  const handleEmojiClick = () => {
    alert('Emoji picker coming soon!');
  };

  // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

  const navigate = useNavigate();

  const { user } = useAuth();

  const { customers, isLoading, error } = useCustomers();

  const filterdCustomers = customers?.filter(
    (customer) => customer.uuid === user?.identities?.at(0)?.user_id
  );

  console.log(filterdCustomers);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 px-4 py-4">
      {/* Header */}
      <header className="">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <a
                href="/"
                className="flex items-center gap-2 transition-colors hover:text-blue-600"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="font-semibold">Customer Support</span>
              </a>
            </div>

            <div>
              <a
                href="/help"
                className="text-blue-500 transition-colors hover:text-blue-700"
              >
                Help Center
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col rounded-2xl md:flex-row">
        {/* Sidebar - Agent Info & Quick Actions */}
        <div className="w-full rounded-3xl border-r border-gray-200 bg-white md:w-80">
          {/* Agent Info */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={filterdCustomers?.at(0)?.img_url || '/logo.png'}
                  alt="Agent"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
              </div>
              <div>
                <h3 className="font-semibold">
                  {filterdCustomers?.at(0)?.name}
                </h3>

                <div className="mt-1 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="text-xs text-gray-500">Online</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <button
                onClick={handleCallSupport}
                className="flex items-center gap-1 transition-colors hover:text-blue-600"
              >
                <Phone className="h-4 w-4" />
                <span>Call Support</span>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4">
            <h3 className="mb-3 font-semibold">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickAction('track')}
                className="flex flex-col items-center justify-center rounded-lg bg-blue-50 p-3 transition-colors hover:bg-blue-100"
              >
                <ShoppingBag className="mb-1 h-6 w-6 text-blue-500" />
                <span className="text-center text-xs">Track Order</span>
              </button>
              <button
                onClick={() => handleQuickAction('payment')}
                className="flex flex-col items-center justify-center rounded-lg bg-blue-50 p-3 transition-colors hover:bg-blue-100"
              >
                <CreditCard className="mb-1 h-6 w-6 text-blue-500" />
                <span className="text-center text-xs">Payment Issues</span>
              </button>
              <button
                onClick={() => handleQuickAction('returns')}
                className="flex flex-col items-center justify-center rounded-lg bg-blue-50 p-3 transition-colors hover:bg-blue-100"
              >
                <ShoppingBag className="mb-1 h-6 w-6 text-blue-500" />
                <span className="text-center text-xs">Returns</span>
              </button>
              <button
                onClick={() => handleQuickAction('help')}
                className="flex flex-col items-center justify-center rounded-lg bg-blue-50 p-3 transition-colors hover:bg-blue-100"
              >
                <HelpCircle className="mb-1 h-6 w-6 text-blue-500" />
                <span className="text-center text-xs">Help</span>
              </button>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="border-t border-gray-200 p-4">
            <h3 className="mb-3 font-semibold">Your Recent Orders</h3>
            <div className="space-y-3">
              {orders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => handleOrderClick(order)}
                  className="w-full rounded-lg bg-gray-50 p-3 text-left transition-colors hover:bg-gray-100"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-xs text-gray-500">
                        Placed on {order.date}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        order.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-2 text-sm">
                    {order.items} items • {order.total}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="ml-3 flex flex-1 flex-col rounded-3xl bg-white">
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
                          src={'/logo.png'}
                          alt={msg.name}
                          className="h-6 w-6 rounded-full"
                        />
                        <span className="text-xs font-medium">{msg.name}</span>
                      </div>
                    )}
                    <p>{msg.message}</p>
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
                        src="/logo.png"
                        alt="Sarah Johnson"
                        className="h-6 w-6 rounded-full"
                      />
                      <span className="text-xs font-medium">Sarah Johnson</span>
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
          <div className=" border-t border-gray-200 p-4">
            <div className="flex items-end gap-2">
              <div className="flex-1 rounded-2xl bg-gray-100 px-4 py-3">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
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
                      <ImageIcon className="h-5 w-5" />
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

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Order Details</h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-medium">#{selectedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span>{selectedOrder.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    selectedOrder.status === 'Shipped'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {selectedOrder.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Items:</span>
                <span>{selectedOrder.items}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">{selectedOrder.total}</span>
              </div>
              {selectedOrder.trackingNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tracking:</span>
                  <span className="font-mono text-sm">
                    {selectedOrder.trackingNumber}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => {
                  setNewMessage(`I need help with order #${selectedOrder.id}`);
                  setShowOrderModal(false);
                }}
                className="flex-1 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
              >
                Ask About This Order
              </button>
              <button
                onClick={() => setShowOrderModal(false)}
                className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
