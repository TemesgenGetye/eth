import { useState } from 'react';
import { Heart, MessageCircle, User, X, List, LogOutIcon } from 'lucide-react';
import Favourite from '../TopNavElements/Favourite';
import Cart from '../TopNavElements/Cart';
import Notfication from '../TopNavElements/Notfication';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useCustomers from '../../hooks/useCustomers';
import supabase from '../../services/supabase';

const NavLinks = () => {
  const [activeModal, setActiveModal] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { customers } = useCustomers();

  const filterdCustomers = customers?.filter(
    (customer) => customer.uuid === user?.identities?.at(0)?.user_id
  );

  const handleLinkClick = (modalName: string) => {
    if (filterdCustomers?.length === 0) {
      navigate('/login');
    } else {
      setActiveModal(activeModal === modalName ? '' : modalName);
    }
  };

  const closeModal = () => {
    setActiveModal('');
  };

  return (
    <div className="relative flex items-center space-x-6">
      {/* Notifications */}
      <Notfication
        activeModal={activeModal}
        handleLinkClick={handleLinkClick}
        closeModal={closeModal}
      />
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
          <p className="text-sm text-gray-500">
            {filterdCustomers?.at(0)?.name || user?.email}
          </p>
        </div>
        {activeModal === 'profile' && (
          <div className=" dropdown-pointer absolute right-5 top-10 z-50 w-64 rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold capitalize">Profile</h3>
              <X className="h-4 w-4 cursor-pointer" onClick={closeModal} />
            </div>
            <ul className="space-y-2">
              <li className="hover flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-gray-100">
                <button
                  className="flex items-center space-x-2"
                  onClick={() => {
                    navigate('/profile');
                    closeModal();
                  }}
                >
                  <User className="h-4 w-4" />
                  <p className="text-sm text-gray-500">Profile</p>
                </button>
              </li>
              <li className="hover flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-gray-100">
                <button
                  className="flex items-center space-x-2"
                  onClick={() => {
                    navigate('/my-ads');
                    closeModal();
                  }}
                >
                  <List className="h-4 w-4" />
                  <p className="text-sm text-gray-500">My Ads</p>
                </button>
              </li>
              <li className="hover flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-gray-100">
                <button
                  className="flex items-center space-x-2"
                  onClick={() => navigate('/favourites')}
                >
                  <Heart className="h-4 w-4" />
                  <p className="text-sm text-gray-500">Favorites</p>
                </button>
              </li>
              <li className="hover flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-gray-100">
                <button
                  className="flex items-center space-x-2"
                  onClick={() => navigate('/chat')}
                >
                  <MessageCircle className="h-4 w-4" />
                  <p className="text-sm text-gray-500">Chats</p>
                </button>
              </li>
              <li className="hover flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-gray-100">
                <button
                  className="flex items-center space-x-2"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    navigate('/');
                  }}
                >
                  <LogOutIcon className="h-4 w-4" />
                  <p className="text-sm text-gray-500">Logout</p>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavLinks;
