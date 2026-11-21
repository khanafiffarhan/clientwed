import { RoleGuard } from "@/components/dashboard/role-guard";
export default function Layout({ children }: { children: React.ReactNode }) { return <RoleGuard role="customer">{children}</RoleGuard>; }
