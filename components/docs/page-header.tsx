import { cn } from "@/lib/utils";

import { Icons } from "@/components/shared/icons";
import Link from "next/link";

interface DocsPageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string;
  text?: string;
  showBreadcrumbs?: boolean;
}

export function DocsPageHeader({
  heading,
  text,
  showBreadcrumbs = true,
  className,
  ...props
}: DocsPageHeaderProps) {
  return (
    <>
      {showBreadcrumbs &&
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <div className="truncate">
            <Link href="/guides">Guides</Link>
          </div>
          <Icons.chevronRight className="size-4" />
          <div className="font-medium text-primary dark:text-primary-400">
            {heading}
          </div>
        </div>
      }

      <div className={cn("space-y-4", className)} {...props}>
        <h1 className="inline-block scroll-m-20 font-heading text-4xl">
          {heading}
        </h1>
        {text && (
          <p className="text-balance text-lg text-muted-foreground">{text}</p>
        )}
      </div>
    </>
  );
}
