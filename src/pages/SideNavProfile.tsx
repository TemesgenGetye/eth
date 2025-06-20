import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../Context/Languge';

function SideNavProfile() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="p-20">
      <div className="w-80 border-r border-gray-200 bg-white p-6">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">
          {t('common.sideNav.account')}
        </h2>

        <nav className="space-y-2">
          {/* Profile */}
          <div
            className="flex cursor-pointer items-center gap-3 rounded-lg bg-yellow-600 px-4 py-3 text-white"
            onClick={() => navigate('/profile')}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="font-medium">{t('common.sideNav.profile')}</span>
          </div>

          {/* My Ads */}
          <div
            className="flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50"
            onClick={() => navigate('/my-ads')}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{t('common.sideNav.myAds')}</span>
          </div>

          {/* My Listings */}
          <div
            className="flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50"
            onClick={() => navigate('/my-listings')}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span>{t('common.sideNav.myListings')}</span>
          </div>

          {/* Refer and Earn */}
          <div
            className="flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50"
            onClick={() => navigate('/refer')}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{t('common.sideNav.referAndEarn')}</span>
          </div>

          {/* Subscription */}
          <div
            className="flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50"
            onClick={() => navigate('/pricing')}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>{t('common.sideNav.subscription')}</span>
          </div>

          {/* Scraping Preferences */}
          <div
            className="flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50"
            onClick={() => navigate('/preferences')}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
            </svg>
            <span>{t('common.sideNav.scrapingPreferences')}</span>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default SideNavProfile;
