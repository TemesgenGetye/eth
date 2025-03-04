import { Bell, X } from 'lucide-react';
import { Link } from 'react-router-dom';

function Notfication({
  activeModal,
  handleLinkClick,
  closeModal,
}: {
  activeModal: string;
  handleLinkClick: (modalName: string) => void;
  closeModal: () => void;
}) {
  const notfication = [
    {
      _id: '60c0d8d3c3a3d9d1c1d2d3',
      title: 'New Order',
      description: 'Your order has been placed successfully',
      image: './logo.png',
      date: '20 minutes ago',
      price: 100,
      status: 'success',
    },
    {
      _id: '60c0d8d3c3a3d9d1c1d',
      title: 'New Order',
      description: 'Your order has been placed successfully',
      image: './logo.png',
      price: 100,
      date: '20 minutes ago',
      status: 'success',
    },
    {
      _id: '60c0d83a3d9d1c1d2d3',
      title: 'Order Confirmed',
      description: 'Your order has been confirmed',
      image: './logo.png',
      date: '20 minutes ago',
      price: 100,
      status: 'success',
    },
    {
      _id: '60c0d3d9d1c1d2d3',
      title: 'New Order',
      description: 'Your order has been placed successfully',
      image: './logo.png',
      date: '20 minutes ago',
      price: 100,
      status: 'success',
    },
  ];

  return (
    <div>
      <div className="relative">
        <div
          className="flex cursor-pointer flex-col items-center justify-center text-sm text-gray-400 hover:text-gray-900"
          onClick={() => handleLinkClick('notifications')}
        >
          <Bell className="mr-1 h-4 w-4" />
          <p className="text-s text-gray-500">Notfication</p>
        </div>
        {activeModal === 'notifications' && (
          <div className="dropdown-pointer shadow-3xl absolute right-0 top-11 z-50 w-[400px] rounded-lg bg-white p-0 shadow-lg">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Notfication ({notfication.length})
              </h3>
              <X
                className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={closeModal}
              />
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {notfication.length === 0 && (
                <div className="flex flex-col items-center justify-center p-10 text-center">
                  <Bell className="h-16 w-16 text-gray-300" />
                  <p className="mt-4 text-lg font-medium text-gray-900">
                    You have no new notifications.
                  </p>
                </div>
              )}

              {notfication.map((item) => (
                <Link to={`/detail/${item?._id}`} key={item._id}>
                  <div className="border-b p-4">
                    <div className="flex gap-3">
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          src={item.image || './logo.png'}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {item.title}
                        </p>
                        <div>
                          <p className="text-xs font-medium text-gray-900">
                            {item?.price} {'ADE'}
                            <span className="font-semibold">{'AED'}</span>
                          </p>
                          <p className="text-xs font-medium text-gray-900">
                            {item.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notfication;
