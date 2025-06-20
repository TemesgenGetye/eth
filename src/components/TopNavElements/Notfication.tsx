import { Bell, X } from 'lucide-react';
import { useLanguage } from '../../Context/Languge';

interface Notification {
  _id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  price: number;
  status: string;
}

function Notfication({
  activeModal,
  handleLinkClick,
  closeModal,
}: {
  activeModal: string;
  handleLinkClick: (modalName: string) => void;
  closeModal: () => void;
}) {
  const { t } = useLanguage();

  const notfication: Notification[] = [];

  return (
    <div>
      <div className="relative">
        <div
          className="flex cursor-pointer flex-col items-center justify-center text-sm text-gray-400 hover:text-gray-900"
          onClick={() => handleLinkClick('notifications')}
        >
          <Bell className="mr-1 h-4 w-4" />
          <p className="text-s text-gray-500">
            {t('common.navigation.notifications')}
          </p>
        </div>
        {activeModal === 'notifications' && (
          <div className="dropdown-pointer shadow-3xl absolute right-0 top-11 z-[10000] w-[400px] rounded-lg bg-white p-0 shadow-lg">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-sm font-semibold text-gray-900">
                {t('common.navigation.notifications')} ({notfication.length})
              </h3>
              <X
                className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={closeModal}
              />
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {notfication.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-10 text-center">
                  <img
                    src="/notfication.gif"
                    alt="alert"
                    className="size-[150px]"
                  />
                  <p className="mt-4 text-lg font-medium text-gray-900">
                    {t('common.navigation.noNotifications')}
                  </p>
                </div>
              ) : (
                <>
                  {notfication.map((item) => (
                    <div
                      key={item._id}
                      className="border-b p-4 hover:bg-gray-100"
                    >
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
                  ))}
                  <div className="p-2 text-center">
                    <button className="w-full p-4 text-xs font-medium text-blue-500 hover:bg-gray-100/70 hover:text-blue-700">
                      {t('common.navigation.viewAllNotifications')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notfication;
