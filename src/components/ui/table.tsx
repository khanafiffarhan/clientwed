import * as React from "react";
import { cn } from "@/lib/utils";

export const Table = ({ className, ...p }: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="w-full overflow-x-auto"><table className={cn("w-full caption-bottom text-sm", className)} {...p} /></div>
);
export const THead = (p: React.HTMLAttributes<HTMLTableSectionElement>) => <thead className="border-b bg-muted/50 [&_th]:text-left [&_th]:font-medium [&_th]:text-muted-foreground" {...p} />;
export const TBody = (p: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody className="[&_tr:last-child]:border-0" {...p} />;
export const TR = ({ className, ...p }: React.HTMLAttributes<HTMLTableRowElement>) => <tr className={cn("border-b transition-colors hover:bg-muted/30", className)} {...p} />;
export const TH = ({ className, ...p }: React.ThHTMLAttributes<HTMLTableCellElement>) => <th className={cn("h-11 px-4 align-middle whitespace-nowrap", className)} {...p} />;
export const TD = ({ className, ...p }: React.TdHTMLAttributes<HTMLTableCellElement>) => <td className={cn("px-4 py-3 align-middle", className)} {...p} />;
