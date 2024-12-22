'use client';

import { Skeleton } from './ui/skeleton';

export default function CategoryListLoading() {
  return (
    <div className="md:mb-0 md:space-y-1 flex flex-wrap gap-2">
      <Skeleton className="h-10 w-20 md:w-full" />
      <Skeleton className="h-10 w-20 md:w-full" />
      <Skeleton className="h-10 w-20 md:w-full" />
      <Skeleton className="h-10 w-20 md:w-full" />
      <Skeleton className="h-10 w-20 md:w-full" />
      <Skeleton className="h-10 w-20 md:w-full" />
      <Skeleton className="h-10 w-20 md:w-full" />
      <Skeleton className="h-10 w-20 md:w-full" />
      <Skeleton className="h-10 w-20 md:w-full" />
      <Skeleton className="h-10 w-20 md:w-full" />
    </div>
  )
}
