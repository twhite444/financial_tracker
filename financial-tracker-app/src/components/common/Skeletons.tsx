export function CardSkeleton() {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="glass-card p-4 mb-2 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded ml-auto"></div>
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
      <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
      <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-32 flex-1 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      {/* Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          {[...Array(3)].map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          {[...Array(3)].map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
