export default function MyAdsSkeleton() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 md:mb-20">
      {/* Header */}
      <div className="p-4 sm:p-10">
        <div className="mb-2 h-6 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
      </div>

      {/* Filter Tabs */}
      <div className="mb-8 flex flex-wrap gap-4 p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-10 w-24 animate-pulse rounded-full bg-gray-200"
          />
        ))}
      </div>

      {/* Content - List Layout */}
      <div className="mb-24 md:mb-0">
        <div className="space-y-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-200 bg-white">
              {/* Category Header */}
              <div className="bg-gray-50">
                <div className="bg-gray-200/50 p-4">
                  <div className="h-4 w-1/4 animate-pulse rounded bg-gray-300" />
                </div>
              </div>

              {/* Subcategory and Items */}
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j}>
                  {/* Subcategory Header */}
                  <div className="border-b p-4">
                    <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200" />
                  </div>

                  {/* Ad Items */}
                  <ul>
                    {Array.from({ length: 3 }).map((_, k) => (
                      <li key={k} className="border-b">
                        <div className="flex items-start gap-4 p-4">
                          {/* Image */}
                          <div className="h-24 w-24 animate-pulse rounded bg-gray-200" />

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                {/* Status Badge */}
                                <div className="mb-2 h-6 w-16 animate-pulse rounded-full bg-gray-200" />

                                {/* Title */}
                                <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />

                                {/* Price */}
                                <div className="mt-1 h-5 w-20 animate-pulse rounded bg-gray-200" />

                                {/* Last Updated */}
                                <div className="mt-1 h-4 w-32 animate-pulse rounded bg-gray-200" />

                                {/* Expiry */}
                                <div className="mt-2 h-4 w-28 animate-pulse rounded bg-gray-200" />
                              </div>

                              {/* Trash Button */}
                              <div className="h-8 w-8 animate-pulse rounded bg-gray-200" />
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-end px-4 pb-4">
                          <div className="h-8 w-24 animate-pulse rounded-lg bg-gray-200" />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
