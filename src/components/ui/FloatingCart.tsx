import { lazy } from 'react';
import { Link } from 'react-router-dom';

const FloatingCartModel = lazy(() =>
  import('../model/Scene').then((mod) => ({ default: mod.CartModelSmall }))
);

function FloatingCart() {
  return (
    <Link
      to="/cart"
      className="fixed -left-28 top-[40%] z-50 m-auto h-60 w-60 overflow-hidden transition-all duration-700 hover:-left-16"
    >
      <FloatingCartModel />
    </Link>
  );
}

export default FloatingCart;
