"use client";
import { useParams } from "next/navigation";
import { ErrorState, PageHeader, PageLoader } from "@/components/states";
import { ServiceForm } from "@/components/dashboard/service-form";
import { useApi } from "@/lib/hooks";
import type { Service } from "@/lib/constants";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, refetch } = useApi<Service>(`/vendor/services/${id}`);
  if (loading) return <PageLoader />;
  if (error) return <ErrorState message={error.status === 404 || error.status === 400 ? "This service doesn’t exist." : error.status === 403 ? "You can only edit your own services." : error.message} onRetry={error.status >= 500 ? refetch : undefined} />;
  return <><PageHeader title="Edit service" text="Saving sends the service back for admin review." /><ServiceForm initial={data!} /></>;
}
