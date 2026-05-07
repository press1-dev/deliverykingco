export function ShopSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-white/5 bg-[#121214]">
      {/* Image Skeleton */}
      <div className="aspect-square w-full animate-pulse bg-white/5" />
      
      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col p-6 space-y-4">
        <div className="h-2 w-16 animate-pulse rounded bg-white/5" />
        <div className="h-4 w-full animate-pulse rounded bg-white/5" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-white/5" />
        
        <div className="mt-4 flex items-center justify-between">
          <div className="h-6 w-20 animate-pulse rounded bg-white/5" />
          <div className="h-10 w-10 animate-pulse rounded-lg bg-white/5" />
        </div>
      </div>
    </div>
  );
}

export function ShopSidebarSkeleton() {
  return (
    <div className="space-y-10">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-6">
          <div className="h-3 w-32 animate-pulse rounded bg-white/5" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="h-4 w-4 animate-pulse rounded bg-white/5" />
                <div className="h-3 w-24 animate-pulse rounded bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
