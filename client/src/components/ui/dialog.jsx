const Dialog = ({ open, onOpenChange, children }) => open ? <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" onClick={() => onOpenChange?.(false)}>{children}</div> : null;
const DialogContent = ({ children, className }) => <div className={`bg-background border rounded-lg shadow-lg p-6 ${className || ""}`} onClick={(e) => e.stopPropagation()}>{children}</div>;
const DialogHeader = ({ children }) => <div className="space-y-1 mb-4">{children}</div>;
const DialogFooter = ({ children }) => <div className="mt-4 flex justify-end gap-2">{children}</div>;
const DialogTitle = ({ children }) => <h2 className="text-xl font-semibold">{children}</h2>;
const DialogDescription = ({ children }) => <p className="text-sm text-muted-foreground">{children}</p>;

export { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };
