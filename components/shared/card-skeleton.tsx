import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CardSkeleton() {
  return (
    <Card>
      <CardHeader className="gap-4">
        <Skeleton className="h-10 w-4/5" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-10 w-4/5" />
        <Skeleton className="h-10 w-4/5" />
        {/* <Skeleton className="h-10 w-4/5" /> */}
        {/* <Skeleton className="h-10 w-4/5" /> */}
      </CardContent>
      <CardFooter>
        <Skeleton className="h-20 w-full" />
      </CardFooter>
    </Card>
  )
}
