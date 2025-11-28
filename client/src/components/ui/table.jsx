const Table = ({ children }) => <table className="w-full text-sm">{children}</table>;
const TableHeader = ({ children }) => <thead className="bg-muted/50">{children}</thead>;
const TableBody = ({ children }) => <tbody>{children}</tbody>;
const TableRow = ({ children }) => <tr className="border-b last:border-b-0">{children}</tr>;
const TableHead = ({ children, className }) => <th className={`text-left p-3 font-medium ${className || ""}`}>{children}</th>;
const TableCell = ({ children, className }) => <td className={`p-3 ${className || ""}`}>{children}</td>;

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
