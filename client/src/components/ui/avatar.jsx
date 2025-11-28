import { cn } from "@/lib/utils";

const Avatar = ({ className, children }) => (
  <div className={cn("inline-flex items-center justify-center rounded-full bg-muted", className)}>{children}</div>
);

const AvatarFallback = ({ className, children }) => (
  <div className={cn("flex items-center justify-center rounded-full", className)}>{children}</div>
);

export { Avatar, AvatarFallback };
