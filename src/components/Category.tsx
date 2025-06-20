import { useNavigate, Link } from 'react-router-dom';
import { CategoryType, Subcategory } from './type';
import { cleanString } from '../services/utils';

interface CategoryProps {
  category: CategoryType;
  key: number;
  variant?: 'card' | 'list';
}

export default function Category({
  category,
  variant = 'card',
}: CategoryProps) {
  const navigate = useNavigate();

  if (variant === 'list') {
    return (
      <div className="mb-8">
        <div className="mb-2 flex items-center">
          <img
            src={category?.iconUrl || './all-product.gif'}
            alt="icon icon"
            className="mr-2 h-6 w-6 object-contain"
          />
          <span className="text-lg font-semibold text-gray-900">
            {category.name}
          </span>
        </div>
        <ul className="mb-2 space-y-1">
          {category?.subcategories
            ?.slice(0, 4)
            ?.map((subcategory: Subcategory) => (
              <li key={subcategory?.id}>
                <Link
                  to={`/${cleanString(category?.name)}/${cleanString(subcategory?.name)}`}
                  className="text-base text-gray-800 hover:text-blue-700"
                >
                  {subcategory?.name}
                </Link>
              </li>
            ))}
        </ul>
        <Link
          to={`/category/${cleanString(category?.name)}`}
          className="group inline-flex items-center text-base font-medium text-blue-600 hover:text-blue-700"
        >
          All in {category.name}
          <span className="ml-1 transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    );
  }

  // Card variant (default)
  return (
    <div
      key={category?.id}
      className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-lg bg-white p-3 md:p-8 shadow-lg transition-shadow hover:shadow-md"
      onClick={() => {
        navigate('/' + cleanString(category?.name));
      }}
    >
      <img
        src={category?.iconUrl || './all-product.gif'}
        alt="icon icon"
        className="mb-4 h-6 w-6 object-contain md:h-14 md:w-14"
      />
      <span className="text-center text-sm font-medium text-gray-800 md:text-base">
        {category.name}
      </span>
    </div>
  );
}
