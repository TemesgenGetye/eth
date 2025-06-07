import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

export default function MyAds() {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Ads', count: 0 },
    { id: 'live', label: 'Live', count: 0 },
    { id: 'drafts', label: 'Drafts', count: 0 },
    { id: 'payment', label: 'Payment Pending', count: 0 },
    { id: 'review', label: 'Under Review', count: 0 },
    { id: 'rejected', label: 'Rejected', count: 0 },
    { id: 'expired', label: 'Expired', count: 0 },
  ];

  return (
    <div className="flex min-h-screen justify-center bg-gray-50">
      <div className="mx-auto max-w-6xl p-6">
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
                  ? 'bg-black/80 text-white'
                  : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Empty State */}
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <div className="mb-6">
            <img
              src="/cactus.png"
              alt="No ads illustration"
              className="mx-auto h-32 w-32"
            />
          </div>
          <h2 className="mb-8 text-xl font-semibold text-black">
            You haven't placed any ads yet
          </h2>
          <a href="/post-ad">
            <button className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700">
              Post ad now
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
