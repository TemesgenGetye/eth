import { ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CategoryType, Subcategory } from './type';
import { cleanString } from '../services/utils';

interface CategoryProps {
  category: CategoryType;
  key: number;
}

export default function Category({ category }: CategoryProps) {
  const navigate = useNavigate();
  return (
    <div key={category?.id}>
      <button
        className="mb-4 flex items-center font-semibold text-gray-900 hover:text-gray-700"
        onClick={() => {
          navigate('/' + cleanString(category?.name));
        }}
      >
        <span className="mr-2">
          <img
            src={category?.iconUrl || './all-product.gif'}
            alt="icon icon"
            className="h-5 w-5"
          />
        </span>
        {category.name}
      </button>
      <ul className="space-y-2">
        {category?.subcategories
          ?.slice(0, 3) // must be 4
          ?.map((subcategory: Subcategory) => (
            <li key={subcategory?.id}>
              <Link
                to={`/${cleanString(category?.name)}/${cleanString(subcategory?.name)}`}
                className="flex items-center text-sm text-gray-600 hover:text-blue-600"
              >
                {subcategory?.name}
              </Link>
            </li>
          ))}
      </ul>
      {category?.subcategories?.length > 0 && (
        <Link
          to={`/category/${cleanString(category?.name)}`}
          className="mt-3 inline-flex items-center text-xs text-blue-600 hover:text-blue-700"
        >
          View all {category?.name}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
