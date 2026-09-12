export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-sand animate-pulse">
      <div className="h-40 bg-sand" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-sand rounded w-1/3" />
        <div className="h-4 bg-sand rounded w-3/4" />
        <div className="h-3 bg-sand rounded w-1/2" />
        <div className="h-3 bg-sand rounded w-2/3" />
      </div>
    </div>
  )
}

export function GridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => <CardSkeleton key={i} />)}
    </div>
  )
}