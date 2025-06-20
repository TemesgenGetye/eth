import { useState } from 'react';
import Listing from '../components/Listing';
import useMyAds from '../hooks/useMyAds';
import useCustomers from '../hooks/useCustomers';
import { ProductType } from '../components/type';
import MyAdsSkeleton from '../components/MyAdsSkeleton';
import { useLanguage } from '../Context/Languge';

export default function MyAds() {
  const { t } = useLanguage();
  const uId = localStorage.getItem('user-id');
  // console.log('id', uId);
  const { customers, isLoading } = useCustomers();
  // console.log('customers', customers);

  const loggedUser = customers?.find((customer) => customer.uuid === uId);
  // console.log('loggedUser', loggedUser);
  const [activeTab, setActiveTab] = useState('all');
  const { myAdds, isLoadingAds } = useMyAds(loggedUser?.id);

  // Filter products based on active tab
  const filteredAds = myAdds?.filter((ad) => {
    switch (activeTab) {
      case 'all':
        return true;
      case 'live':
        return ad.status === 'live';
      case 'drafts':
        return ad.status === 'draft';
      case 'review':
        return ad.status === 'pending';
      case 'rejected':
        return ad.status === 'rejected';
      case 'expired':
        return ad.status === 'expired';
      default:
        return true;
    }
  });

  const grouped = filteredAds?.reduce(
    (acc, product) => {
      const categoryName = product.category?.name || 'Uncategorized';
      const subcategoryName = product.subcategory?.name || 'Uncategorized';

      if (!acc[categoryName]) {
        acc[categoryName] = {};
      }

      if (!acc[categoryName][subcategoryName]) {
        acc[categoryName][subcategoryName] = [];
      }

      acc[categoryName][subcategoryName].push(product);

      return acc;
    },
    {} as Record<string, Record<string, ProductType[]>>
  );

  const tabs = [
    { id: 'all', label: t('common.adss.allAds'), count: myAdds?.length || 0 },
    {
      id: 'live',
      label: t('common.adss.live'),
      count: myAdds?.filter((ad) => ad.status === 'live').length || 0,
    },
    {
      id: 'drafts',
      label: t('common.adss.drafts'),
      count: myAdds?.filter((ad) => ad.status === 'draft').length || 0,
    },
    {
      id: 'review',
      label: t('common.adss.underReview'),
      count: myAdds?.filter((ad) => ad.status === 'pending').length || 0,
    },
    {
      id: 'rejected',
      label: t('common.adss.rejected'),
      count: myAdds?.filter((ad) => ad.status === 'rejected').length || 0,
    },
    {
      id: 'expired',
      label: t('common.adss.expired'),
      count: myAdds?.filter((ad) => ad.status === 'expired').length || 0,
    },
  ];

  const getNoAdsMessage = () => {
    switch (activeTab) {
      case 'all':
        return t('common.adss.noAdsYet');
      case 'live':
        return t('common.adss.noLiveAds');
      case 'drafts':
        return t('common.adss.noDraftAds');
      case 'review':
        return t('common.adss.noReviewAds');
      case 'rejected':
        return t('common.adss.noRejectedAds');
      case 'expired':
        return t('common.adss.noExpiredAds');
      default:
        return t('common.adss.noAdsYet');
    }
  };

  if (isLoading || isLoadingAds) {
    return <MyAdsSkeleton />;
  }

  return (
    <div className="flex min-h-screen justify-center bg-gray-50">
      <div className="mx-auto w-[65rem]">
        {/* Header */}
        <h1 className="mb-8 text-2xl font-bold text-black">
          {t('common.adss.title')}
        </h1>

        {/* Filter Tabs */}
        <div className="mb-8 flex flex-wrap gap-4 p-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-700 text-white'
                  : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="mb-24 md:mb-0">
          {filteredAds && filteredAds.length > 0 && grouped ? (
            Object.entries(grouped).map(([categoryName, subcategories]) => (
              <Listing
                key={categoryName}
                title={categoryName}
                subcategories={subcategories}
                showEditButton={activeTab === 'live'}
              />
            ))
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
              <div className="mb-6">
                <img
                  src="/cactus.png"
                  alt="No ads illustration"
                  className="mx-auto h-32 w-32"
                />
              </div>
              <h2 className="mb-8 text-xl font-semibold text-black">
                {getNoAdsMessage()}
              </h2>
              {activeTab === 'all' && (
                <a href="/post-ad">
                  <button className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700">
                    {t('common.ads.postAdNow')}
                  </button>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
