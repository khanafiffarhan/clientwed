import { ServiceDetails } from "@/components/service-details";

export default function Page({ params }: { params: { id: string } }) {
  return <ServiceDetails id={params.id} />;
}
