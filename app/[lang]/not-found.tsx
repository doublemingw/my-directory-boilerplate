import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container min-h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="font-heading text-3xl">404 Not Found</h1>
      
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "default" }),
          "flex max-w-fit items-center justify-center rounded-full overflow-hidden px-6"
        )}
      >
        Go back Home
      </Link>
    </div>
  );
}
