interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function DashboardHeader({
  heading,
  text,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="grid gap-4">
        <h1 className="font-heading text-2xl md:text-3xl text-primary dark:text-foreground">
          {heading}
        </h1>
        {text && <p className="text-base text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>
  )
}
