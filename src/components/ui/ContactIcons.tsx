import React from 'react';
import { Mail, Phone, Instagram, Facebook, MessageCircle } from 'lucide-react';

const ContactIcons: React.FC = () => (
  <div className="mt-4 flex gap-4">
    <a
      href="mailto:info@888market.com"
      target="_blank"
      rel="noopener noreferrer"
      title="Email"
    >
      <Mail className="h-7 w-7 text-blue-500 transition-transform hover:scale-110" />
    </a>
    <a
      href="https://wa.me/971501234567"
      target="_blank"
      rel="noopener noreferrer"
      title="WhatsApp"
    >
      <MessageCircle className="h-7 w-7 text-green-500 transition-transform hover:scale-110" />
    </a>
    <a href="tel:+971501234567" title="Phone">
      <Phone className="h-7 w-7 text-gray-700 transition-transform hover:scale-110" />
    </a>
    <a
      href="https://instagram.com/888market"
      target="_blank"
      rel="noopener noreferrer"
      title="Instagram"
    >
      <Instagram className="h-7 w-7 text-pink-500 transition-transform hover:scale-110" />
    </a>
    <a
      href="https://facebook.com/888market"
      target="_blank"
      rel="noopener noreferrer"
      title="Facebook"
    >
      <Facebook className="h-7 w-7 text-blue-700 transition-transform hover:scale-110" />
    </a>
  </div>
);

export default ContactIcons;
