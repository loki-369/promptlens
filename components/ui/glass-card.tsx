import { cn } from "@/lib/utils";

/** Flat surface card: solid fill, hairline border, no blur or gradient. */
export function GlassCard({
  children,
  className,
  strong,
}: {
  children: React.ReactNode;
  className?: string;
  strong?: boolean;
}) {
  return (
    <div className={cn("rounded-xl", strong ? "card-strong" : "card", className)}>
      {children}
    </div>
  );
}
