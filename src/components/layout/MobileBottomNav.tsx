import { Home, Search, PlusCircle, MessageCircle, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useMediaQuery from '../../hooks/useMediaQuery';

const navItems = [
  { label: 'Home', icon: Home, to: '/' },
  { label: 'Search', icon: Search, to: '/search' },
  { label: 'Post an ad', icon: PlusCircle, to: '/post-ad', center: true },
  { label: 'Chats', icon: MessageCircle, to: '/chats' },
  { label: 'Menu', icon: Menu, to: '/menu' },
];

const MobileBottomNav = () => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const location = useLocation();
  if (!isMobile) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-gray-200 bg-white shadow-lg">
      {navItems.map((item, idx) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.to;
        if (item.center) {
          return (
            <Link
              key={item.label}
              to={item.to}
              className="-mt-6 flex flex-col items-center justify-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg ring-4 ring-white">
                <Icon size={18} />
              </span>
              <span className="mt-1 text-xs text-gray-700">{item.label}</span>
            </Link>
          );
        }
        return (
          <Link
            key={item.label}
            to={item.to}
            className={`flex flex-col items-center justify-center ${isActive ? 'text-blue-600' : 'text-gray-500'} hover:text-blue-700`}
          >
            <Icon size={18} />
            <span className="mt-1 text-xs">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;
