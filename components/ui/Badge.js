import { cn } from "@/lib/utils";

const variants = {
  green:  "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  red:    "bg-red-100 text-red-600",
  gray:   "bg-gray-100 text-gray-600",
  blue:   "bg-blue-100 text-blue-700",
};

export default function Badge({ children, variant = "gray", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
