import * as React from "react";
import { cn } from "@/lib/utils";

const ToastProvider = ({ children }) => <div>{children}</div>;

const ToastViewport = (props) => (
  <div className={cn("fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4", props.className)} {...props} />
);

const Toast = ({ className, open = true, onOpenChange, ...props }) => (
  open ? <div className={cn("rounded-md border bg-background text-foreground shadow-lg p-4", className)} {...props} /> : null
);

const ToastTitle = ({ className, ...props }) => <div className={cn("text-sm font-semibold", className)} {...props} />;
const ToastDescription = ({ className, ...props }) => <div className={cn("text-sm text-muted-foreground", className)} {...props} />;
const ToastClose = ({ className, onClick, ...props }) => (
  <button className={cn("ml-auto text-sm", className)} onClick={onClick} {...props}>Close</button>
);

export { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport };
