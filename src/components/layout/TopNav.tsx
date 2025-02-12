import { useState } from 'react';
import { Bell, Search, Heart, MessageCircle, User, X } from 'lucide-react';

const NavLinks = ({
  hoveredProfile,
  setHoveredProfile,
}: {
  hoveredProfile: string | null;
  setHoveredProfile: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const [activeModal, setActiveModal] = useState(null);

  const handleLinkClick = (modalName) => {
    setActiveModal(activeModal === modalName ? null : modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="relative flex items-center space-x-6">
      {/* Notifications */}
      <div
        className="flex cursor-pointer flex-col items-center justify-center text-sm text-gray-400 hover:text-gray-900"
        onClick={() => handleLinkClick('notifications')}
      >
        <Bell className="mr-1 h-4 w-4" />
        <p>Notifications</p>
      </div>

      {/* My Searches */}
      <div
        className="flex cursor-pointer flex-col items-center justify-center text-sm text-gray-400 hover:text-gray-900"
        onClick={() => handleLinkClick('searches')}
      >
        <Search className="mr-1 h-4 w-4" />
        <p>My Searches</p>
      </div>

      {/* Favorites */}
      <div
        className="flex cursor-pointer flex-col items-center justify-center text-sm text-gray-400 hover:text-gray-900"
        onClick={() => handleLinkClick('favorites')}
      >
        <Heart className="mr-1 h-4 w-4" />
        <p>Favorites</p>
      </div>

      {/* Chats */}
      <div
        className="flex cursor-pointer flex-col items-center justify-center text-sm text-gray-400 hover:text-gray-900"
        onClick={() => handleLinkClick('chats')}
      >
        <MessageCircle className="mr-1 h-4 w-4" />
        <p>Chats</p>
      </div>

      {/* My Ads */}
      <div
        className="flex cursor-pointer flex-col items-center justify-center text-sm text-gray-400 hover:text-gray-900"
        onClick={() => handleLinkClick('myAds')}
      >
        <User className="mr-1 h-4 w-4" />
        <p>My Ads</p>
      </div>

      {/* Modal */}
      {activeModal && (
        <div className="absolute right-0 top-12 z-50 w-64 rounded-lg bg-white p-4 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold capitalize">{activeModal}</h3>
            <X className="h-4 w-4 cursor-pointer" onClick={closeModal} />
          </div>
          <div>
            {activeModal === 'notifications' && (
              <p>You have no new notifications.</p>
            )}
            {activeModal === 'searches' && (
              <p>Your recent searches will appear here.</p>
            )}
            {activeModal === 'favorites' && (
              <p>Your favorite items will appear here.</p>
            )}
            {activeModal === 'chats' && (
              <p>Your chat messages will appear here.</p>
            )}
            {activeModal === 'myAds' && (
              <p>Your posted ads will appear here.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavLinks;
