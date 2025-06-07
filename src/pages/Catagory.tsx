import { Search } from 'lucide-react';
import Banners from '../components/Property.tsx/Banner';
import ListProductHorizontal from '../components/ui/ListProductHorizontal';
import PopularSubcatagory from '../components/ui/PopularSubcatagory';
import { useParams } from 'react-router-dom';
import SolidBento from '../components/ui/BentoGridProduct';
import useCategories from '../hooks/useCategories';
import { cleanString } from '../services/utils';

export default function CatagoryInfo() {
  const { cname } = useParams<{ cname: string }>();
  const { categories } = useCategories();

  const category = categories?.find(
    (category) => cleanString(category.name) === cname
  );
  const image = category?.imgUrl;

  return (
    <div className="min-h-screen rounded-lg  ">
      <div
        className="relative m-auto mt-3 w-[80%] items-center rounded-xl bg-cover bg-center py-16"
        style={{
          backgroundImage: `url(${image})`,
        }}
      >
        <div className="absolute inset-0 z-10 rounded-xl bg-black bg-opacity-50"></div>
        <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white shadow-2xl sm:text-5xl">
              Every one is on ETH
            </h1>
            <p className="mb-3 mt-3  text-lg text-gray-300 shadow-2xl shadow-black">
              The largest marketplace in the country
            </p>
          </div>
          {/* search from the catagory */}
          <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mt-8">
              <div className="mx-auto max-w-2xl">
                <div className="flex items-center rounded-lg bg-white p-1 shadow-lg">
                  <Search className="ml-3 h-6 w-6 text-gray-400" />
                  <input
                    type="text"
                    placeholder="What are you looking for?"
                    className="flex-1 border-0 px-4 py-2 focus:outline-none focus:ring-0"
                  />
                  <button className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 ">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <PopularSubcatagory id={cname || ''} />
        <Banners id={cname ?? ''} />
        {/* <PopularCategories /> */}
        <ListProductHorizontal cid={category?.id} />
        <SolidBento />
      </div>
    </div>
  );
}
