import { cn } from "@/lib/utils";

export default function Card({ children, className, padding = true }) {
  return (
    <div
      className={cn(
        "bg-white border border-gray-200 rounded-xl",
        padding && "p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className }) {
  return (
    <h2 className={cn("font-semibold text-gray-900 mb-1", className)}>
      {children}
    </h2>
  );
}

export function CardSub({ children, className }) {
  return (
    <p className={cn("text-sm text-gray-400 mb-4", className)}>
      {children}
    </p>
  );
}
