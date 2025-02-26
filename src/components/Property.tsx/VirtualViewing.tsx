export default function VirtualViewing() {
  return (
    <div className="mb-8 overflow-hidden rounded-lg bg-gray-50 shadow-xl transition-transform duration-200 hover:scale-105">
      <div className="flex flex-col md:flex-row">
        <div className="p-6 md:w-1/2">
          <h2 className="mb-2 text-lg font-semibold">Virtual Viewing</h2>
          <p className="mb-6 text-sm text-gray-600">
            Find listings with videos and 360 tours. View properties from the
            comfort of your home
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button className="flex items-center text-sm text-red-600 hover:text-red-700">
              <svg
                className="mr-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              View listings with video tour
            </button>
            <button className="flex items-center text-sm text-blue-600 hover:text-blue-700">
              <svg
                className="mr-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
              </svg>
              View listings with 360 tour
            </button>
          </div>
        </div>
        <div className="md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1512654458600-cf5387bd9428?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className=" h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
            alt="Interior View"
          />
        </div>
      </div>
    </div>
  );
}
