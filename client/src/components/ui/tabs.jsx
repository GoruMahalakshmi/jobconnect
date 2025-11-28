import { createContext, useContext, useState } from "react";

const TabsContext = createContext(undefined);

const Tabs = ({ defaultValue, children }) => {
  const [value, setValue] = useState(defaultValue);
  return <TabsContext.Provider value={{ value, setValue }}>{children}</TabsContext.Provider>;
};

const TabsList = ({ children, className }) => (
  <div className={`inline-grid gap-2 ${className || ""}`}>{children}</div>
);

const TabsTrigger = ({ value, children, ...props }) => {
  const ctx = useContext(TabsContext);
  const active = ctx.value === value;
  return (
    <button
      onClick={() => ctx.setValue(value)}
      className={`px-3 py-2 rounded-md border ${active ? "bg-secondary" : "bg-background"}`}
      {...props}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, children }) => {
  const ctx = useContext(TabsContext);
  if (ctx.value !== value) return null;
  return <div>{children}</div>;
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
