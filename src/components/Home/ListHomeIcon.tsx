import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function ListForHome({
  categories,
}: {
  categories: Record<
    string,
    {
      icon: JSX.Element;
      items: (string | { name: string; isNew?: boolean })[];
      viewAll: string;
    }
  >;
}) {
  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-6">
        <h2 className="mb-8 text-2xl font-semibold text-gray-800">
          Popular Categories
        </h2>
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3 lg:grid-cols-5">
          {Object.entries(categories).map(([name, category]) => (
            <div key={name}>
              <div className="mb-4 flex items-center space-x-2">
                {category.icon}
                <h3 className="font-semibold text-gray-900">{name}</h3>
              </div>
              <ul className="space-y-2">
                {category.items.map((item, index) => (
                  <li key={index}>
                    <Link
                      to="#"
                      className="flex items-center text-sm text-gray-600 hover:text-blue-600"
                    >
                      {typeof item === 'string' ? (
                        item
                      ) : (
                        <div className="flex items-center text-sm">
                          {item.name}
                          {item.isNew && (
                            <span className="ml-2 rounded-xl bg-blue-600 px-2 py-0.5 text-xs text-white">
                              NEW
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                to="#"
                className="mt-3 inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                {category.viewAll}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListForHome;
