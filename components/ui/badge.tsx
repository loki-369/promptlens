import { cn } from "@/lib/utils";
import { difficultyClasses } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium border-border-strong bg-surface-2 text-text-muted",
        className
      )}
    >
      {children}
    </span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold",
        difficultyClasses(difficulty)
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {difficulty}
    </span>
  );
}
