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
              {notfication.length !== 0 && (
                <div className="flex flex-col items-center justify-center p-10 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 128 128"
                    width="128"
                    height="128"
                    preserveAspectRatio="xMidYMid meet"
                    style={{
                      width: '100%',
                      height: '100%',
                      transform: 'translate3d(0px, 0px, 0px)',
                      contentVisibility: 'visible',
                    }}
                    id="Notification"
                  >
                    <defs>
                      <clipPath id="__lottie_element_10389">
                        <rect width="128" height="128" x="0" y="0" />
                      </clipPath>
                    </defs>
                    <g clip-path="url(#__lottie_element_10389)">
                      <g
                        transform="matrix(1,0,0,1,60.5,11.5)"
                        opacity="1"
                        style={{ display: 'block' }}
                      >
                        <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="miter"
                            fill-opacity="0"
                            stroke-miterlimit="4"
                            stroke="rgb(0,0,0)"
                            stroke-opacity="1"
                            stroke-width="7"
                            d=" M3.5,3.5 C3.5,3.5 3.5,10.5 3.5,10.5"
                          />
                        </g>
                      </g>
                      <g
                        transform="matrix(0.9410480260848999,-0.33827295899391174,0.33827295899391174,0.9410480260848999,89.84773254394531,89.31034851074219)"
                        opacity="1"
                        style={{ display: 'block' }}
                      >
                        <g opacity="1" transform="matrix(1,0,0,1,15,13)">
                          <path
                            stroke-linecap="butt"
                            stroke-linejoin="miter"
                            fill-opacity="0"
                            stroke-miterlimit="4"
                            stroke="rgb(0,0,0)"
                            stroke-opacity="1"
                            stroke-width="7"
                            d=" M0,6 C-4.418000221252441,6 -8,2.4179999828338623 -8,-2 C-8,-2 -8,-6 -8,-6 C-8,-6 8,-6 8,-6 C8,-6 8,-2 8,-2 C8,2.4179999828338623 4.418000221252441,6 0,6z"
                          />
                        </g>
                      </g>
                      <g
                        transform="matrix(0.9410480260848999,-0.33827295899391174,0.33827295899391174,0.9410480260848999,17.972164154052734,33.10683822631836)"
                        opacity="1"
                        style={{ display: 'block' }}
                      >
                        <g
                          opacity="1"
                          transform="matrix(1,0,0,1,46.39500045776367,45)"
                        >
                          <path
                            stroke-linecap="butt"
                            stroke-linejoin="miter"
                            fill-opacity="0"
                            stroke-miterlimit="4"
                            stroke="rgb(0,0,0)"
                            stroke-opacity="1"
                            stroke-width="7"
                            d=" M0,-38 C14.020000457763672,-38 25.385000228881836,-26.635000228881836 25.385000228881836,-12.614999771118164 C25.385000228881836,-12.614999771118164 25.385000228881836,-2.743000030517578 25.385000228881836,-2.743000030517578 C25.385000228881836,4.050000190734863 27.347000122070312,10.696999549865723 31.03499984741211,16.400999069213867 C31.03499984741211,16.400999069213867 35.145999908447266,22.759000778198242 35.145999908447266,22.759000778198242 C39.39500045776367,29.332000732421875 34.676998138427734,38 26.85099983215332,38 C26.85099983215332,38 -26.85099983215332,38 -26.85099983215332,38 C-34.676998138427734,38 -39.39500045776367,29.332000732421875 -35.145999908447266,22.759000778198242 C-35.145999908447266,22.759000778198242 -31.03499984741211,16.400999069213867 -31.03499984741211,16.400999069213867 C-27.347000122070312,10.696999549865723 -25.385000228881836,4.050000190734863 -25.385000228881836,-2.743000030517578 C-25.385000228881836,-2.743000030517578 -25.385000228881836,-12.614999771118164 -25.385000228881836,-12.614999771118164 C-25.385000228881836,-26.635000228881836 -14.020000457763672,-38 0,-38z"
                          />
                        </g>
                      </g>
                    </g>
                  </svg>
                  <p className="mt-4 text-lg font-medium text-gray-900">
                    You have no new notifications.
                  </p>
                </div>
              )}

              {/* {notfication.map((item) => (
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
              ))} */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notfication;
