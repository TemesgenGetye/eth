import { Skeleton } from './ui/Skeleton';

export default function MyAdsSkeleton() {
  return (
    <div className="flex min-h-screen justify-center bg-gray-50">
      <div className="mx-auto w-[65rem]">
        <h1 className="mb-8 hidden p-6 text-2xl font-bold text-black md:block">
          <Skeleton className="h-8 w-32" />
        </h1>

        <div className="mb-8 flex flex-wrap gap-4 p-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>

        <div className="mb-24 md:mb-0">
          <div className="space-y-8">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="rounded-lg border border-gray-200 bg-white"
              >
                <div className="p-6">
                  <Skeleton className="h-6 w-1/4" />
                </div>
                <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="space-y-4">
                      <Skeleton className="h-48 w-full" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
