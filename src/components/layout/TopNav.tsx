import { useState, useEffect, useRef } from 'react';
import {
  Heart,
  MessageCircle,
  User,
  X,
  List,
  LogOutIcon,
  LogInIcon,
  LucideVerified,
} from 'lucide-react';
import Favourite from '../TopNavElements/Favourite';
import Cart from '../TopNavElements/Cart';
import Notfication from '../TopNavElements/Notfication';
import { useAuth } from '../../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../../services/supabase';
// import { useVerficationModal } from '../../Context/VerficationModal';
import { useGetCustomer } from '../../hooks/useCustomers';

const NavLinks = () => {
  const [activeModal, setActiveModal] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const navlinksRef = useRef<HTMLDivElement>(null);
  // const { open, setOpen } = useVerficationModal(); YW unused state 

  const { customer } = useGetCustomer(
    user?.identities?.at(0)?.user_id as string
  );

  const handleLinkClick = (modalName: string) => {
    if (!user?.email) {
      navigate('/login');
    } else {
      setActiveModal(activeModal === modalName ? '' : modalName);
    }
  };

  const closeModal = () => {
    setActiveModal('');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navlinksRef.current &&
        !navlinksRef.current.contains(event.target as Node)
      ) {
        setActiveModal('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      className="navlinks relative flex items-center space-x-6"
      ref={navlinksRef}
    >
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
          className="flex cursor-pointer flex-col items-center justify-center text-sm text-gray-400 hover:text-gray-900"
          onClick={() => handleLinkClick('chats')}
        >
          <MessageCircle className="mr-1 h-4 w-4" />
          <p className="text-sm text-gray-500">Chats</p>
        </div>
        {activeModal === 'chats' && (
          <div className="dropdown-pointer absolute -right-4 top-12 z-50 w-64 rounded-lg bg-white p-4 shadow-lg">
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
          className="flex cursor-pointer flex-row items-center justify-center text-sm text-gray-400 hover:text-gray-900"
          onClick={() => handleLinkClick('profile')}
        >
          <User className="mr-1 h-4 w-4" />
          <p className="text-sm text-gray-500">
            {customer?.name || user?.email}
          </p>
        </div>
        {activeModal === 'profile' && (
          <div className="dropdown-pointer absolute right-5 top-10 z-[1000] w-64 rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold capitalize">Profile</h3>
              <X className="h-4 w-4 cursor-pointer" onClick={closeModal} />
            </div>
            <ul className="space-y-2">
              <li
                className="hover flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-gray-100"
                onClick={() => {
                  navigate('/profile');
                  closeModal();
                }}
              >
                <button className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <p className="text-sm text-gray-500">Profile</p>
                </button>
              </li>
              <li
                className="hover flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-gray-100"
                onClick={() => {
                  navigate('/my-ads');
                  closeModal();
                }}
              >
                <button className="flex items-center space-x-2">
                  <List className="h-4 w-4" />
                  <p className="text-sm text-gray-500">My Ads</p>
                </button>
              </li>
              <li
                className="hover flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-gray-100"
                onClick={() => {
                  navigate('/favourites');
                  closeModal();
                }}
              >
                <button className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <p className="text-sm text-gray-500">Favorites</p>
                </button>
              </li>

              <li
                className="hover flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-gray-100"
                onClick={() => {
                  // setOpen(true);
                  closeModal();
                }}
              >
                <button className="flex items-center space-x-2">
                  <LucideVerified
                    className="h-4 w-4"
                    color={`${
                      customer?.verification_status === 'verified'
                        ? '#00C38C'
                        : '#FF0000'
                    }`}
                  />
                  <p className="text-sm text-gray-500">
                    {customer?.verification_status === 'verified'
                      ? 'Verified'
                      : 'Verify your account'}
                  </p>
                </button>
              </li>

              <li
                className="hover flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-gray-100"
                onClick={() => {
                  navigate('/chat');
                  closeModal();
                }}
              >
                <button className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <p className="text-sm text-gray-500">Chats</p>
                </button>
              </li>
              <li
                className="hover flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-gray-100"
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate('/');
                  closeModal();
                }}
              >
                <button className="flex items-center space-x-2">
                  {customer?.email ? (
                    <>
                      <LogOutIcon className="h-4 w-4" />
                      <p className="text-sm text-gray-500">Logout</p>
                    </>
                  ) : (
                    <>
                      <LogInIcon className="h-4 w-4" />
                      <p className="text-sm text-gray-500">Login</p>
                    </>
                  )}
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      {/* Place Ad */}
      <Link
        to={'/post-ad'}
        className="rounded-md bg-blue-700 p-2 px-5 text-sm font-semibold text-white hover:bg-blue-800"
      >
        Place Your Ad
      </Link>
    </div>
  );
};

export default NavLinks;
