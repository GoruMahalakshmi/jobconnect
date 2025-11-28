import { useMemo } from "react";

const Select = ({ value, onValueChange, children }) => {
  const options = useMemo(() => {
    const arr = [];
    const walker = (nodes) => {
      if (!nodes) return;
      (Array.isArray(nodes) ? nodes : [nodes]).forEach((n) => {
        if (n && n.type && n.type.displayName === "SelectItem") {
          arr.push({ value: n.props.value, label: n.props.children });
        } else if (n && n.props && n.props.children) walker(n.props.children);
      });
    };
    walker(children);
    return arr;
  }, [children]);
  return (
    <select className="h-9 px-3 rounded-md border bg-background" value={value} onChange={(e) => onValueChange?.(e.target.value)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
};

const SelectTrigger = ({ children, className }) => <div className={className}>{children}</div>;
const SelectValue = ({ placeholder }) => <span>{placeholder}</span>;
const SelectContent = ({ children }) => <>{children}</>;
const SelectItem = ({ children }) => {
  const Comp = () => null;
  Comp.displayName = "SelectItem";
  return <Comp>{children}</Comp>;
};
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
