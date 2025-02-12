function DownloadApp() {
  return (
    <div className=" bg-white py-4">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-8">
          {/* Left section with app info */}
          <div className="flex items-center">
            <div className="mr-4 hidden sm:block">
              <div className="relative h-16 w-16 overflow-hidden rounded-xl shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=3540&auto=format&fit=crop"
                  alt="Dubizzle App"
                  className="h-full w-full transform object-cover transition hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Find amazing deals on the go
              </h2>
              <p className="text-sm font-medium text-blue-600">
                Download the app now
              </p>
            </div>
          </div>

          {/* Right section with download buttons */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="group flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-1 transition-all hover:border-blue-100 hover:bg-blue-50"
            >
              <img
                src="./app_store.png"
                alt="Download on App Store"
                className="h-10 w-10 object-contain"
              />
              <div className="flex flex-col">
                <span className="text-xs text-gray-600">Download on the</span>
                <span className="text-sm font-semibold text-gray-800">
                  App Store
                </span>
              </div>
            </a>
            <a
              href="#"
              className="group flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 transition-all hover:border-blue-100 hover:bg-blue-50"
            >
              <img
                src="./google_play.png"
                alt="Get it on Google Play"
                className="h-8 w-8 object-contain"
              />
              <div className="flex flex-col">
                <span className="text-xs text-gray-600">Get it on</span>
                <span className="text-sm font-semibold text-gray-800">
                  Google Play
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DownloadApp;
