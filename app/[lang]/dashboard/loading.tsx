import { DashboardShell } from "@/components/dashboard/shell";
import { CardSkeleton } from "@/components/shared/card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <Skeleton className="h-8 w-1/5" />
      <Skeleton className="h-6 w-2/5" />
      <div className="grid gap-10">
        <CardSkeleton />
      </div>
    </DashboardShell>
  )
}
