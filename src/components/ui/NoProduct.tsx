import { Loader, ShoppingCart } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { motion, useTransform, useMotionValue } from 'framer-motion';

const NoProductModel = lazy(() =>
  import('../model/Scene').then((mod) => ({ default: mod.CartModel }))
);

function NoProduct() {
  const x = useMotionValue(0);

  const xNumeric = useTransform(x, (latest) => latest);

  const iconOpacity = useTransform(
    xNumeric,
    [-100, -50, 50, 100],
    [1, 0, 0, 1]
  );

  return (
    <div className="relative h-[90vh] w-full overflow-hidden bg-gradient-to-b from-white to-blue-50">
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-start pt-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-2 text-3xl font-bold text-blue-600"
        >
          Oops! Our shelves are empty!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-4 text-xl text-blue-400"
        >
          Looks like our cart is on a shopping spree...
        </motion.p>
      </div>

      <div className="absolute inset-0 z-40 flex items-center justify-center">
        <Suspense
          fallback={
            <div className="flex h-screen w-full items-center justify-center">
              <Loader className="h-12 w-12 animate-spin text-blue-600" />
            </div>
          }
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: 'loop',
              ease: 'linear',
            }}
            style={{ x }}
            className="h-[70vh] w-full"
          >
            <NoProductModel />
          </motion.div>
        </Suspense>
      </div>

      <motion.div
        style={{ opacity: iconOpacity }}
        className="absolute inset-0 z-30 flex items-center justify-center text-center"
      >
        <div>
          <ShoppingCart className="h-12 w-12 text-blue-500" />
          <p className="text-center text-sm font-semibold text-blue-500">
            Out Of Stock
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-0 right-0 z-10 text-center"
      >
        <p className="text-lg font-semibold text-blue-500">
          Don't worry, we're restocking faster than you can say "Add to cart"!
        </p>
      </motion.div>
    </div>
  );
}

export default NoProduct;
