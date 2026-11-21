import { Badge } from "@/components/ui/badge";

const map: Record<string, "success" | "warning" | "danger" | "muted" | "secondary"> = {
  approved: "success", accepted: "success", paid: "success", active: "success",
  pending: "warning", rejected: "danger", failed: "danger", blocked: "danger",
  cancelled: "muted", inactive: "muted", free: "muted",
};
export const StatusBadge = ({ status }: { status: string }) => <Badge variant={map[status] || "secondary"} className="capitalize">{status}</Badge>;
