import { ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { categories } from '../../Data/Catagorie';

const getHomeCategories = (categories: any[]) => {
  const homeCategory = categories.find(
    (category) => category.name.en === 'Home'
  );
  if (!homeCategory) return [];

  return homeCategory.children.map((child) => ({
    _id: child._id,
    name: child.name.en,
    children: child.children || [],
    icon: child.icon,
  }));
};

function ListForHome() {
  const homeCategories = getHomeCategories(categories);
  const navigate = useNavigate();

  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-6">
        <div className="flex gap-2">
          <h2 className="mb-8 text-2xl font-semibold text-gray-800">
            All Categories
          </h2>
          <div>
            <img
              src="./all-product.gif"
              alt="icon icon"
              className="h-10 w-10"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-5 gap-y-3 md:grid-cols-3 lg:grid-cols-5">
          {homeCategories?.map(
            (category: { _id: string; name: string }, index: number) => (
              <div key={index}>
                <button
                  className="mb-4 flex items-center font-semibold text-gray-900 hover:text-gray-700"
                  onClick={() => {
                    navigate(
                      '/category/' +
                        category?.name
                          .toLowerCase()
                          .replace(/\s+/g, '-')
                          .replace(/[^a-z0-9-]/g, '')
                          .replace(/-+/g, '-')
                          .replace(/^-|-$/g, '') +
                        `:${category?._id}`
                    );
                  }}
                >
                  <span className="mr-2">
                    <img
                      src={category?.icon || './all-product.gif'}
                      alt="icon icon"
                      className="h-5 w-5"
                    />
                  </span>
                  {category.name}
                </button>
                <ul className="space-y-2">
                  {category.children
                    .slice(0, 2) // must be 4
                    .map((child, childIndex: number) => (
                      <li key={childIndex}>
                        <Link
                          to={`/product/${child._id}`}
                          className="flex items-center text-sm text-gray-600 hover:text-blue-600"
                        >
                          {child.name.en}
                        </Link>
                      </li>
                    ))}
                </ul>
                {category?.children?.length > 0 && (
                  <Link
                    to={`/category/${category.name
                      .toLowerCase()
                      .replace(/\s+/g, '-')
                      .replace(/[^a-z0-9-]/g, '')
                      .replace(/-+/g, '-')
                      .replace(/^-|-$/g, '')
                      .replace(/\//g, '')}:${category._id}`}
                    className="mt-3 inline-flex items-center text-xs text-blue-600 hover:text-blue-700"
                  >
                    View all {category?.name}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default ListForHome;
