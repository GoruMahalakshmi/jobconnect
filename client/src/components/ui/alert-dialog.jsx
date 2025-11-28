import { useState } from "react";

const AlertDialog = ({ children }) => <>{children}</>;

const AlertDialogTrigger = ({ asChild, children }) => {
  const [open, setOpen] = useState(false);
  const child = Array.isArray(children) ? children[0] : children;
  const onClick = (e) => {
    child.props?.onClick?.(e);
    setOpen(true);
    window.__alertOpen = true;
  };
  return asChild ? (
    { ...child, props: { ...child.props, onClick } }
  ) : (
    <button onClick={onClick}>{children}</button>
  );
};

const AlertDialogContent = ({ children }) => (window.__alertOpen ? <div className="fixed inset-0 z-50 grid place-items-center bg-black/40"><div className="bg-background border rounded-lg shadow-lg p-6" onClick={(e) => e.stopPropagation()}>{children}</div></div> : null);
const AlertDialogHeader = ({ children }) => <div className="space-y-1 mb-4">{children}</div>;
const AlertDialogTitle = ({ children }) => <h2 className="text-xl font-semibold">{children}</h2>;
const AlertDialogDescription = ({ children }) => <p className="text-sm text-muted-foreground">{children}</p>;
const AlertDialogFooter = ({ children }) => <div className="mt-4 flex justify-end gap-2">{children}</div>;
const AlertDialogCancel = ({ children, onClick }) => <button className="px-3 py-2 rounded-md border" onClick={() => { window.__alertOpen = false; onClick?.(); }}>{children}</button>;
const AlertDialogAction = ({ children, onClick, className }) => <button className={`px-3 py-2 rounded-md bg-destructive text-destructive-foreground ${className || ""}`} onClick={() => { onClick?.(); window.__alertOpen = false; }}>{children}</button>;

export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger };
