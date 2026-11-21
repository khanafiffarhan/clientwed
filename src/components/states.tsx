import { Loader2, AlertCircle, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const PageLoader = ({ label = "Loading…" }: { label?: string }) => (
  <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted-foreground" role="status">
    <Loader2 className="h-7 w-7 animate-spin text-primary" /><span className="text-sm">{label}</span>
  </div>
);
export const EmptyState = ({ title, text, action }: { title: string; text?: string; action?: React.ReactNode }) => (
  <div className="flex flex-col items-center rounded-lg border border-dashed bg-card/50 px-6 py-14 text-center">
    <Inbox className="mb-3 h-9 w-9 text-brass" />
    <h3 className="font-display text-xl font-semibold">{title}</h3>
    {text && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);
export const ErrorState = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="flex flex-col items-center rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-12 text-center" role="alert">
    <AlertCircle className="mb-3 h-9 w-9 text-destructive" />
    <h3 className="font-display text-xl font-semibold">Something went wrong</h3>
    <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
    {onRetry && <Button variant="outline" className="mt-5" onClick={onRetry}>Try again</Button>}
  </div>
);
export const StatCard = ({ label, value, icon: Icon, hint }: { label: string; value: React.ReactNode; icon?: any; hint?: string }) => (
  <Card><CardContent className="flex items-start justify-between p-5">
    <div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 font-display text-3xl font-semibold">{value}</p>{hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}</div>
    {Icon && <span className="rounded-full bg-secondary p-2.5 text-primary"><Icon className="h-5 w-5" /></span>}
  </CardContent></Card>
);
export const StatGridSkeleton = ({ n = 4 }: { n?: number }) => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: n }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-lg bg-muted" />)}</div>
);
export const PageHeader = ({ title, text, action }: { title: string; text?: string; action?: React.ReactNode }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
    <div><h1 className="text-3xl font-semibold">{title}</h1>{text && <p className="mt-1 text-muted-foreground">{text}</p>}</div>{action}
  </div>
);
