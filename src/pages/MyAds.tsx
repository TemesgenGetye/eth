import { useState } from 'react';
import Listing from '../components/Listing';
import useMyAds from '../hooks/useMyAds';
import useCustomers from '../hooks/useCustomers';
import { ProductType } from '../components/type'; 

export default function MyAds() {
  const uId = localStorage.getItem('user-id');
  console.log('id', uId);
  const { customers } = useCustomers();
  console.log('customers', customers);

  const loggedUser = customers?.find((customer) => customer.uuid === uId);
  console.log('loggedUser', loggedUser);
  const [activeTab, setActiveTab] = useState('all');
  const { myAdds } = useMyAds(loggedUser?.id);

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
  console.log(grouped);

  const tabs = [
    { id: 'all', label: 'All Ads', count: myAdds?.length || 0 },
    {
      id: 'live',
      label: 'Live',
      count: myAdds?.filter((ad) => ad.status === 'live').length || 0,
    },
    {
      id: 'drafts',
      label: 'Drafts',
      count: myAdds?.filter((ad) => ad.status === 'draft').length || 0,
    },
    {
      id: 'review',
      label: 'Under Review',
      count: myAdds?.filter((ad) => ad.status === 'pending').length || 0,
    },
    {
      id: 'rejected',
      label: 'Rejected',
      count: myAdds?.filter((ad) => ad.status === 'rejected').length || 0,
    },
    {
      id: 'expired',
      label: 'Expired',
      count: myAdds?.filter((ad) => ad.status === 'expired').length || 0,
    },
  ];

  const getNoAdsMessage = () => {
    switch (activeTab) {
      case 'all':
        return "You haven't placed any ads yet";
      case 'live':
        return "You don't have any live ads";
      case 'drafts':
        return "You don't have any draft ads";
      case 'review':
        return "You don't have any ads under review";
      case 'rejected':
        return "You don't have any rejected ads";
      case 'expired':
        return "You don't have any expired ads";
      default:
        return "You haven't placed any ads yet";
    }
  };

  return (
    <div className="flex min-h-screen justify-center bg-gray-50">
      <div className="mx-auto w-[65rem] p-6">
        {/* Header */}
        <h1 className="mb-8 text-2xl font-bold text-black">My Ads</h1>

        {/* Filter Tabs */}
        <div className="mb-8 flex flex-wrap gap-4 ">
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
                  Post ad now
                </button>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
