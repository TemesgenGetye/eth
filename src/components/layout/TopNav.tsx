import { useState } from 'react';
import {
  Bell,
  Search,
  Heart,
  MessageCircle,
  User,
  X,
  List,
  ChevronRight,
  CarTaxiFrontIcon,
  ShoppingCart,
} from 'lucide-react';
import Favourite from '../TopNavElements/Favourite';
import Cart from '../TopNavElements/Cart';

const NavLinks = () => {
  const [activeModal, setActiveModal] = useState('');

  const handleLinkClick = (modalName: string) => {
    setActiveModal(activeModal === modalName ? '' : modalName);
  };

  const closeModal = () => {
    setActiveModal('');
  };

  return (
    <div className="relative flex items-center space-x-6">
      {/* Notifications */}
      <div className="relative">
        <div
          className="flex cursor-pointer flex-col items-center justify-center text-sm text-gray-400 hover:text-gray-900"
          onClick={() => handleLinkClick('notifications')}
        >
          <Bell className="mr-1 h-4 w-4" />
          <p>Notifications</p>
        </div>
        {activeModal === 'notifications' && (
          <div className="dropdown-pointer absolute right-2 top-12 z-50 w-64 rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold capitalize">
                Notifications
              </h3>
              <X className="h-4 w-4 cursor-pointer" onClick={closeModal} />
            </div>
            <p className="text-sm text-gray-500">
              You have no new notifications.
            </p>
          </div>
        )}
      </div>

      {/* My Searches */}
      <Cart
        activeModal={activeModal}
        handleLinkClick={handleLinkClick}
        closeModal={closeModal}
      />
      {/* Favorites */}
      <Favourite
        activeModal={activeModal}
        handleLinkClick={handleLinkClick}
        closeModal={closeModal}
      />
      {/* Chats */}
      <div className="relative">
        <div
          className="  flex cursor-pointer flex-col items-center justify-center text-sm text-gray-400 hover:text-gray-900"
          onClick={() => handleLinkClick('chats')}
        >
          <MessageCircle className="mr-1 h-4 w-4" />
          <p className="text-sm text-gray-500">Chats</p>
        </div>
        {activeModal === 'chats' && (
          <div className=" dropdown-pointer absolute -right-4  top-12 z-50 w-64 rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold capitalize">Chats</h3>
              <X className="h-4 w-4 cursor-pointer" onClick={closeModal} />
            </div>
            <p className="text-sm text-gray-500">
              Your chat messages will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="relative">
        <div
          className=" flex cursor-pointer flex-row items-center justify-center text-sm text-gray-400 hover:text-gray-900"
          onClick={() => handleLinkClick('profile')}
        >
          <User className="mr-1 h-4 w-4" />
          <p className="text-sm text-gray-500">Temesgen Getye</p>
        </div>
        {activeModal === 'profile' && (
          <div className=" dropdown-pointer absolute right-5 top-10 z-50 w-64 rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold capitalize">Profile</h3>
              <X className="h-4 w-4 cursor-pointer" onClick={closeModal} />
            </div>
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <p className="text-sm text-gray-500">Profile</p>
                </div>
                <ChevronRight className="h-4 w-4" />
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <p className="text-sm text-gray-500">My Ads</p>
                </div>
                <ChevronRight className="h-4 w-4" />
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <p className="text-sm text-gray-500">Favorites</p>
                </div>
                <ChevronRight className="h-4 w-4" />
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <p className="text-sm text-gray-500">Chats</p>
                </div>
                <ChevronRight className="h-4 w-4" />
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <List className="h-4 w-4" />
                  <p className="text-sm text-gray-500">My Ads</p>
                </div>
                <ChevronRight className="h-4 w-4" />
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavLinks;
