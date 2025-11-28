import { cn } from "@/lib/utils";

const variants = {
  default: "inline-flex items-center rounded-md border bg-secondary text-secondary-foreground px-2 py-1 text-xs",
  secondary: "inline-flex items-center rounded-md bg-muted text-muted-foreground px-2 py-1 text-xs",
  outline: "inline-flex items-center rounded-md border px-2 py-1 text-xs",
};

const Badge = ({ className, variant = "default", children }) => (
  <span className={cn(variants[variant] || variants.default, className)}>{children}</span>
);

export { Badge };
