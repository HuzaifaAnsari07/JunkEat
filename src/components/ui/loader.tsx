import { cn } from "@/lib/utils";

export const Loader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-4", className)}
      {...props}
    >
      <div className="loader-donut" />
      <p className="text-muted-foreground animate-pulse">Loading...</p>
    </div>
  );
};
