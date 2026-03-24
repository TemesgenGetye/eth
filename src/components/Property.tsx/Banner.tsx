import { categories } from '../../Data/Catagorie';

export default function Banners({ id }: { id: string }) {
  const filterdCategory = categories[0]?.children?.filter(
    (item) => item._id === id.split(':')[1],
  );
  const images = filterdCategory?.[0]?.images;

  return (
    <div className="mb-6 mt-4 grid grid-cols-1 gap-3 sm:mb-8 sm:mt-5 sm:gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-4 rounded-xl bg-blue-50 p-4 transition-transform duration-200 hover:scale-[1.01] sm:flex-row sm:items-center sm:gap-5 sm:p-5 md:p-6 md:hover:scale-105">
        <div className="mx-auto shrink-0 sm:mx-0 sm:mr-0">
          <div className="grid w-28 grid-cols-2 gap-1.5 sm:w-32 sm:gap-2">
            <img
              src={
                images?.[0] ??
                'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              }
              className="h-10 w-full rounded-lg object-cover transition-transform hover:scale-105 sm:h-12 sm:w-16"
              alt=""
            />
            <img
              src="/all-product.gif"
              className="h-10 w-full rounded-lg object-cover transition-transform hover:scale-105 sm:h-12 sm:w-16"
              alt=""
            />
            <img
              src="/all-product.gif"
              className="h-10 w-full rounded-lg object-cover transition-transform hover:scale-105 sm:h-12 sm:w-16"
              alt=""
            />
            <img
              src={
                images?.[3] ??
                'https://images.unsplash.com/photo-1494145904049-0dca59b4bbad?q=80&w=3388&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              }
              className="h-10 w-full rounded-lg object-cover transition-transform hover:scale-105 sm:h-12 sm:w-16"
              alt=""
            />
          </div>
        </div>
        <div className="min-w-0 flex-1 text-center sm:text-start">
          <h2 className="mb-1.5 text-base font-semibold leading-snug sm:mb-2 sm:text-lg">
            Introducing New Products
          </h2>
          <p className="mb-3 text-xs text-gray-600 sm:mb-4 sm:text-sm md:text-base">
            Get access to the latest releases
          </p>
          <button
            type="button"
            className="mx-auto flex items-center justify-center text-sm text-blue-600 hover:text-blue-700 sm:mx-0"
          >
            Explore Now
            <svg
              className="ms-1 h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-xl bg-blue-50 p-4 transition-transform duration-200 hover:scale-[1.01] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5 md:p-6 md:hover:scale-105">
        <div className="min-w-0 flex-1 text-center sm:text-start">
          <div className="mb-1.5 flex flex-wrap items-center justify-center gap-2 sm:justify-start sm:gap-2">
            <h2 className="text-base font-semibold leading-snug sm:text-lg">
              Discover Agents and Agencies!
            </h2>
            <span className="shrink-0 rounded bg-red-500 px-2 py-0.5 text-xs text-white">
              NEW
            </span>
          </div>
          <p className="mb-3 text-xs text-gray-600 sm:mb-4 sm:text-sm md:text-base">
            Connect with our partners to find your ideal home!
          </p>
          <button
            type="button"
            className="mx-auto flex items-center justify-center text-sm text-blue-600 hover:text-blue-700 sm:mx-0"
          >
            Browse Now
            <svg
              className="ms-1 h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        <div className="flex shrink-0 justify-center -space-x-3 sm:justify-end sm:ps-2 md:-space-x-4">
          <img
            src={
              images?.[0] ??
              'https://plus.unsplash.com/premium_photo-1680281936362-aff258ecd143?q=80&w=3400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            }
            className="relative z-[1] h-11 w-11 rounded-full border-2 border-white object-cover sm:h-12 sm:w-12"
            alt=""
          />
          <img
            src="/logo.png"
            className="relative z-0 h-11 w-11 rounded-full border-2 border-white object-cover sm:h-12 sm:w-12"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
