import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
export const formatPrice = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
export const formatMoney = (n: number, currency = "usd") => new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(n);
export const formatDate = (d?: string | Date | null) =>
  d ? new Date(String(d).length === 10 ? d + "T00:00:00" : d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";
export const initials = (name?: string) => (name || "?").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
export const todayISO = () => new Date().toISOString().slice(0, 10);
