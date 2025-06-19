import React, { useEffect, useRef, useState } from 'react';
import { CategoryType } from '../type';

interface AnimatedCategoryIconProps {
  categories: CategoryType[];
  size?: number;
}

const AnimatedCategoryIcon: React.FC<AnimatedCategoryIconProps> = ({
  categories,
  size = 32,
}) => {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setAnimating(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % categories?.length);
        setAnimating(false);
      }, 350); // match transition duration
    }, 2000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index, categories?.length]);

  if (!categories || categories?.length === 0) return null;

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={{ width: size, height: size }}
    >
      <img
        src={categories[index]?.iconUrl || './all-product.gif'}
        alt="category icon"
        className={`absolute left-0 top-0 transition-transform duration-300 ease-in-out ${
          animating
            ? '-translate-y-full opacity-0'
            : 'translate-y-0 opacity-100'
        }`}
        style={{ width: size, height: size }}
        key={index}
      />
      <img
        src={
          categories[(index + 1) % categories?.length]?.iconUrl ||
          './all-product.gif'
        }
        alt="category icon next"
        className={`absolute left-0 top-0 transition-transform duration-300 ease-in-out ${
          animating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
        style={{ width: size, height: size }}
        key={index + 1}
      />
    </div>
  );
};

export default AnimatedCategoryIcon;
