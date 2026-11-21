import Link from "next/link";

export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 ${className}`} aria-label="WedPlan home">
      <svg width="30" height="20" viewBox="0 0 30 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="8" stroke={light ? "#d9b878" : "hsl(38 48% 46%)"} strokeWidth="2" />
        <circle cx="20" cy="10" r="8" stroke={light ? "#f5efe4" : "hsl(158 27% 22%)"} strokeWidth="2" />
      </svg>
      <span className={`font-display text-2xl font-semibold tracking-tight ${light ? "text-white" : "text-primary"}`}>WedPlan</span>
    </Link>
  );
}
