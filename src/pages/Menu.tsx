import {
  Bell,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  HelpCircle,
  Heart,
  Languages,
  Lock,
  LogOut,
  MapPin,
  Pencil,
  Settings,
  User,
  LucideProps,
  ShoppingCart,
} from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useGetCustomer } from '../hooks/useCustomers';
import { Badge } from '../components/ui/Badge';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../services/supabase';
import { useLanguage } from '../Context/Languge';
import toast from 'react-hot-toast';

const Menu = () => {
  const { user } = useAuth();
  const { customer, isLoadingCustomer } = useGetCustomer(user?.id || '');
  const isVerified = customer?.verification_status === 'verified';
  const navigate = useNavigate();
  const [isCityExpanded, setIsCityExpanded] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Dubai');
  const { language, setLanguage, t } = useLanguage();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate('/login');
    } else {
      console.error('Error logging out:', error);
    }
  };

  const handleLanguageToggle = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
    toast.success(
      newLanguage === 'ar' ? 'تم التبديل إلى العربية' : 'Switched to English'
    );
  };

  if (isLoadingCustomer) {
    return (
      <div className="flex h-screen items-center justify-center">
        {t('common.loading')}
      </div>
    );
  }

  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('');
  };

  const formattedDate = customer?.created_at
    ? new Date(customer.created_at).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      })
    : '';

  const cities = [
    { key: 'allCitiesUAE', value: t('common.menu.allCitiesUAE') },
    { key: 'abuDhabi', value: t('common.menu.abuDhabi') },
    { key: 'ajman', value: t('common.menu.ajman') },
    { key: 'alAin', value: t('common.menu.alAin') },
    { key: 'dubai', value: t('common.menu.dubai') },
    { key: 'fujairah', value: t('common.menu.fujairah') },
    { key: 'rasAlKhaimah', value: t('common.menu.rasAlKhaimah') },
    { key: 'sharjah', value: t('common.menu.sharjah') },
    { key: 'ummAlQuwain', value: t('common.menu.ummAlQuwain') },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white p-4">
        <div className="flex items-center">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-400 text-2xl font-bold text-white">
              {getInitials(customer?.name)}
            </div>
            <button className="absolute bottom-0 right-0 rounded-full bg-gray-800 p-1 text-white">
              <Pencil size={12} />
            </button>
          </div>
          <div className="ml-4">
            <h1 className="text-lg font-bold">{customer?.name}</h1>
            <p className="text-sm text-gray-500">
              {t('common.menu.joinedOn')} {formattedDate}
            </p>
          </div>
        </div>
      </div>

      {!isVerified && (
        <div className="m-4 flex items-center justify-between rounded-lg bg-blue-50 p-4">
          <div className="flex items-center">
            <div className="relative mr-4 flex-shrink-0">
              <svg
                className="h-10 w-10 text-blue-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-3.5-3.5 1.41-1.41L11 14.17l5.59-5.59L18 10l-7 7z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">
                {t('common.menu.gotVerifiedBadgeYet')}
              </h2>
              <p className="text-sm text-gray-600">
                {t('common.menu.getMoreVisibility')}
              </p>
              <p className="text-sm text-gray-600">
                {t('common.menu.enhanceYourCredibility')}
              </p>
              <a href="#" className="text-sm font-semibold text-blue-600">
                {t('common.menu.learnMore')}
              </a>
            </div>
          </div>
          <ChevronRight size={24} className="text-gray-500" />
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 p-4">
        <QuickAction
          icon={Heart}
          label={t('common.favorites')}
          href="/favourites"
        />
        <QuickAction label={t('common.menu.myAds')} href="/my-ads" />
        <QuickAction
          icon={ShoppingCart}
          label={t('common.menu.myCart')}
          href="/cart"
        />
        <QuickAction
          icon={Bell}
          label={t('common.notifications')}
          href="/chats"
        />
      </div>

      <div className="bg-white">
        <MenuItem icon={User} label={t('common.profile')} collapsible />
        <MenuItem
          icon={Settings}
          label={t('common.menu.account')}
          collapsible
        />
        <MenuItem icon={Lock} label={t('common.menu.security')} />
      </div>

      <div className="mt-4 bg-white">
        <MenuItem
          icon={MapPin}
          label={t('common.menu.city')}
          value={selectedCity}
          collapsible
          isExpanded={isCityExpanded}
          onClick={() => setIsCityExpanded(!isCityExpanded)}
        />
        {isCityExpanded && (
          <div className="bg-white pl-8 pr-4">
            {cities.map((city) => (
              <div
                key={city.key}
                className="cursor-pointer border-t border-gray-100 p-4 hover:bg-gray-50"
                onClick={() => {
                  setSelectedCity(city.value);
                  setIsCityExpanded(false);
                }}
              >
                {city.value}
              </div>
            ))}
          </div>
        )}
        <MenuItem
          icon={Languages}
          label={t('common.menu.language')}
          value={language === 'en' ? 'English' : 'العربية'}
          onClick={handleLanguageToggle}
        />
        <MenuItem icon={HelpCircle} label={t('common.help')} />
      </div>

      <div className="mt-4 bg-white">
        <button
          onClick={handleLogout}
          className="flex w-full items-center p-4 text-red-500"
        >
          <LogOut className="mr-4" size={16} />
          <span className="text-gray-500">{t('common.menu.logout')}</span>
        </button>
      </div>
    </div>
  );
};

interface QuickActionProps {
  icon?: React.ElementType<LucideProps>;
  label: string;
  href: string;
}

const QuickAction = ({ icon: Icon, label, href }: QuickActionProps) => (
  <Link
    to={href}
    className="flex flex-col items-center justify-center rounded-2xl bg-blue-50 p-4 shadow-sm"
  >
    {Icon && <Icon className="mb-2 text-blue-400" size={16} />}
    {!Icon && (
      <svg
        width="18"
        height="18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-blue-400"
      >
        <path
          d="M7.875 5.875a.25.25 0 01.25-.25h4.563a.25.25 0 01.25.25V6.5a.25.25 0 01-.25.25H8.125a.25.25 0 01-.25-.25v-.625zM14.25 2.25H3.75c-.825 0-1.5.675-1.5 1.5v10.5c0 .825.675 1.5 1.5 1.5h10.5c.825 0 1.5-.675 1.5-1.5V3.75c0-.825-.675-1.5-1.5-1.5zm0 11.75a.25.25 0 01-.25.25H4a.25.25 0 01-.25-.25V4A.25.25 0 014 3.75h10a.25.25 0 01.25.25v10zm-7.5-7.5a.25.25 0 01-.25.25h-1a.25.25 0 01-.25-.25v-.625a.25.25 0 01.25-.25h1a.25.25 0 01.25.25V6.5z"
          fill="currentColor"
        ></path>
        <path
          d="M12.656 8.438h-4.5a.281.281 0 00-.281.28v.563c0 .156.126.281.281.281h4.5a.281.281 0 00.281-.28v-.563a.281.281 0 00-.28-.281zM5.531 9.563h.938a.281.281 0 00.281-.282V8.72a.281.281 0 00-.281-.281H5.53a.281.281 0 00-.281.28v.563c0 .156.126.281.281.281zM12.655 11.25h-4.5a.281.281 0 00-.28.281v.563c0 .155.125.281.28.281h4.5a.281.281 0 00.282-.281v-.563a.281.281 0 00-.281-.281zM5.53 12.375h.938a.281.281 0 00.281-.281v-.563a.281.281 0 00-.281-.281h-.937a.281.281 0 00-.282.281v.563c0 .155.126.281.282.281z"
          fill="currentColor"
        ></path>
      </svg>
    )}
    <span className="text-sm text-blue-400">{label}</span>
  </Link>
);

interface MenuItemProps {
  icon: React.ElementType<LucideProps>;
  label: string;
  collapsible?: boolean;
  newBadge?: boolean;
  value?: string;
  onClick?: () => void;
  isExpanded?: boolean;
}

const MenuItem = ({
  icon: Icon,
  label,
  collapsible,
  newBadge,
  value,
  onClick,
  isExpanded,
}: MenuItemProps) => (
  <div
    className="flex cursor-pointer items-center justify-between border-b border-gray-100 p-4 last:border-b-0"
    onClick={onClick}
  >
    <div className="flex items-center">
      <Icon className="mr-4 text-gray-600" size={16} />
      <span className="font-medium text-gray-500">{label}</span>
      {newBadge && <Badge className="ml-2">NEW</Badge>}
    </div>
    <div className="flex items-center">
      {value && <span className="mr-2 text-gray-500">{value}</span>}
      {collapsible ? (
        isExpanded ? (
          <ChevronUp className="text-gray-400" />
        ) : (
          <ChevronDown className="text-gray-400" />
        )
      ) : (
        <></>
      )}
    </div>
  </div>
);

export default Menu;
