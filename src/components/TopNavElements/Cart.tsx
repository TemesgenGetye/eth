import { ShoppingCart, X } from 'lucide-react';
import { useCart } from '../../Context/Cart';
import { useNavigate } from 'react-router-dom';
import NoProductSmall from '../ui/NoProductSmall';
import { useCartItems } from '../../hooks/store';
import { useLanguage } from '../../Context/Languge';

function Cart({
  activeModal,
  handleLinkClick,
  closeModal,
}: {
  activeModal: string;
  handleLinkClick: (modalName: string) => void;
  closeModal: () => void;
}) {
  const { cart } = useCart();
  const { cartItems } = useCartItems();
  const { t } = useLanguage();

  const navigate = useNavigate();
  return (
    <div className="relative">
      <div
        className="flex cursor-pointer flex-col items-center justify-center text-sm text-gray-400 hover:text-gray-900"
        onClick={() => handleLinkClick('cart')}
      >
        <ShoppingCart className="mr-1 h-4 w-4" />
        <p className="text-s text-gray-500">{t('common.navigation.cart')}</p>
      </div>
      {activeModal === 'cart' && (
        <div className="dropdown-pointer shadow-3xl absolute right-0 top-11 z-[10000] max-h-[600px] w-[400px] rounded-lg bg-white p-0 shadow-lg">
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="text-sm font-semibold text-gray-900">
              {t('common.cartt')} ({cart.length})
            </h3>
            <X
              className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            />
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {cart.length === 0 ? (
              <NoProductSmall />
            ) : (
              <div>
                {cartItems?.map((item) => (
                  <div
                    onClick={() => {
                      navigate('/cart');
                      closeModal();
                    }}
                    className="cursor-pointer"
                    key={item?.id}
                  >
                    <div className="border-b p-4 hover:bg-gray-100">
                      <div className="flex gap-3">
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                          <img
                            src={item?.imgUrls[0] || '/logo.png'}
                            alt={item?.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {item?.name}
                          </p>
                          <div>
                            <p className="text-xs font-medium text-gray-900">
                              {item?.price?.discounted}
                              <span className="font-semibold">{'AED'}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="border-t p-2 text-center">
            <button
              className="w-full p-4 text-xs font-medium text-blue-500 hover:bg-gray-100/70 hover:text-blue-700"
              onClick={() => {
                navigate('/cart');
                closeModal();
              }}
            >
              {t('common.viewAllCart')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
