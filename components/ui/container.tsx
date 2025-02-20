// components/ui/container.tsx
export function Container({ children }: { children: React.ReactNode }) {
    return <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
  }
  
  // components/ui/skeleton.tsx
  import { cn } from "@/lib/utils"
  
  function Skeleton({
    className,
    ...props
  }: React.HTMLAttributes<HTMLDivElement>) {
    return (
      <div
        className={cn("animate-pulse rounded-md bg-muted", className)}
        {...props}
      />
    )
  }
  
  export { Skeleton }