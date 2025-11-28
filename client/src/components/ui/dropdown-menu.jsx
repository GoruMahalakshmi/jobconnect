import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const DropdownMenu = ({ children }) => <>{children}</>;
const DropdownMenuTrigger = ({ asChild, children }) => {
  const [open, setOpen] = useState(false);
  const child = Array.isArray(children) ? children[0] : children;
  const onClick = (e) => {
    child.props?.onClick?.(e);
    window.__dropdownOpen = !window.__dropdownOpen;
    setOpen(window.__dropdownOpen);
  };
  return asChild ? ({ ...child, props: { ...child.props, onClick } }) : <button onClick={onClick}>{children}</button>;
};
const DropdownMenuContent = ({ children, align = "start", className }) => (
  window.__dropdownOpen ? (
    <div className={cn("absolute right-0 mt-2 min-w-[12rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md", className)}>
      {children}
    </div>
  ) : null
);
const DropdownMenuItem = ({ children, onClick, asChild }) => {
  const Comp = asChild ? ({ children }) => children : "div";
  return <Comp onClick={onClick} className="cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground">{children}</Comp>;
};
const DropdownMenuSeparator = () => <div className="my-1 h-px bg-muted" />;

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator };
