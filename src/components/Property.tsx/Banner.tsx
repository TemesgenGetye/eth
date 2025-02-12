// src/components/Banners.jsx
export default function Banners() {
  return (
    <div className="mb-8 mt-5 grid gap-4 md:grid-cols-2">
      <div className="flex items-center rounded-lg bg-blue-50 p-6 transition-transform duration-200 hover:scale-105">
        <div className="mr-6 flex-shrink-0">
          <div className="grid w-32 grid-cols-2 gap-2 ">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className="h-12 w-16 rounded-lg transition-transform hover:scale-105"
              alt="Project 1"
            />
            <img
              src="https://images.unsplash.com/photo-1534237710431-e2fc698436d0?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className="h-12 w-16 rounded-lg transition-transform hover:scale-105"
              alt="Project 2"
            />
            <img
              src="https://plus.unsplash.com/premium_photo-1680281936362-aff258ecd143?q=80&w=3400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className="h-12 w-16 rounded-lg transition-transform hover:scale-105"
              alt="Project 3"
            />
            <img
              src="https://images.unsplash.com/photo-1494145904049-0dca59b4bbad?q=80&w=3388&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className="h-12 w-16 rounded-lg transition-transform hover:scale-105"
              alt="Project 4"
            />
          </div>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold">
            Introducing New Projects
          </h2>
          <p className="mb-4  text-sm text-gray-500">
            Get access to the latest property developments
          </p>
          <button className="flex items-center text-sm text-blue-600 hover:text-blue-700">
            Explore Now
            <svg
              className="ml-1 h-4 w-4"
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

      <div className="flex items-center rounded-lg bg-blue-50 p-6 transition-transform duration-200 hover:scale-105">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <h2 className="text-lg font-semibold">
              Discover Agents and Agencies!
            </h2>
            <span className="rounded bg-red-500 px-2 py-1 text-xs text-white">
              NEW
            </span>
          </div>
          <p className="mb-4 text-sm text-gray-500">
            Connect with our partners to find your ideal home!
          </p>
          <button className="flex items-center text-sm text-blue-600 hover:text-blue-700">
            Browse Now
            <svg
              className="ml-1 h-4 w-4"
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
        <div className="flex -space-x-4">
          <img
            src="https://plus.unsplash.com/premium_photo-1680281936362-aff258ecd143?q=80&w=3400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="h-12 w-12 rounded-full border-2 border-white"
            alt="Agent 1"
          />
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="h-12 w-12 rounded-full border-2 border-white"
            alt="Agent 2"
          />
        </div>
      </div>
    </div>
  );
}
