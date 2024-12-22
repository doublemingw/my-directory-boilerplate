import { cn } from "@/lib/utils";

interface FeaturePageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string;
  text?: string;
}

export function FeaturePageHeader({
  heading,
  text,
  className,
  children,
  ...props
}: FeaturePageHeaderProps) {
  return (
    <>
      <div className={cn("flex items-center justify-between space-x-4", className)} {...props}>
        <div className="flex-1 space-y-4">
          <h2 className="font-heading text-4xl text-primary dark:text-foreground">
            {heading}
          </h2>
          {text && (
            <p className="text-balance text-muted-foreground">
              {text}
            </p>
          )}
        </div>
        <div className="shrink-0 flex justify-end">
          {children}
        </div>
      </div>
    </>
  );
}
