import { Clock, Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../Context/Languge';

interface Product {
  id: number;
  name: string;
  status: string;
  price: {
    discounted: number;
    currency: string;
  };
  imgUrls: string[];
}

interface ListingProps {
  key: string;
  subcategories: Record<string, Product[]>;
  title: string;
}

export default function Listing({ title, subcategories }: ListingProps) {
  const scats = Object.entries(subcategories);
  return (
    <div className="bg-white">
      <div className="bg-gray-50">
        <h2 className="bg-gray-200/50 p-4 text-sm font-bold text-gray-800">
          {title}
        </h2>
      </div>
      {scats?.map(([subcategoryName, products]: [string, Product[]], index) => (
        <ListItem name={subcategoryName} products={products} key={index} />
      ))}
    </div>
  );
}

const ListItem = ({
  name,
  products,
}: {
  name: string;
  products: Product[];
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleContinuePosting = (product: Product) => {
    // Navigate to PostAds with product data for editing
    navigate('/post-ad', {
      state: {
        editMode: true,
        productData: product,
      },
    });
  };

  const handleUpdateAd = (product: Product) => {
    // Navigate to PostAds with product data for updating live ads
    navigate('/post-ad', {
      state: {
        editMode: true,
        productData: product,
      },
    });
  };

  return (
    <div>
      <div className="border-b p-4">
        <h3 className="text-sm text-gray-500">{name}</h3>
      </div>
      <ul>
        {products?.map((product) => (
          <li className="border-b" key={product?.id}>
            <div className="flex items-start gap-4 p-4">
              {product?.imgUrls[0] ? (
                <img
                  src={product?.imgUrls[0]}
                  alt={product?.name}
                  className="size-[150px] object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="flex justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400"
                      >
                        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                        <circle cx="12" cy="13" r="3"></circle>
                      </svg>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">No Image</p>
                  </div>
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="mb-2 inline-block rounded-full bg-gray-500 px-3 py-1 text-sm text-white">
                      {product?.status}
                    </span>
                    <h3 className="text-base font-medium">{product?.name}</h3>
                    <p className="mt-1 text-base font-medium text-gray-700">
                      <span>{product?.price?.discounted}</span>
                      <span className="text-xs font-bold">
                        {product?.price?.currency}
                      </span>
                    </p>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span className="mr-1">•</span>
                      <span>Last Updated: May 21</span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>Ad expires in 7 days</span>
                    </div>
                  </div>

                  <button className="h-8 w-8">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end px-4 pb-4">
              {product?.status === 'live' ? (
                <button
                  onClick={() => handleUpdateAd(product)}
                  className="flex items-center gap-2 rounded-lg border border-blue-300 bg-blue-50 px-4 py-2 text-sm text-blue-600 transition-colors hover:bg-blue-100"
                >
                  <Edit className="h-4 w-4" />
                  {t('common.postAd.updateAd')}
                </button>
              ) : product?.status === 'draft' ? (
                <button
                  onClick={() => handleContinuePosting(product)}
                  className="rounded-lg border border-green-600 bg-green-50 p-2 text-sm text-green-700 hover:bg-green-100"
                >
                  {t('common.postAd.continuePostingAd')}
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
