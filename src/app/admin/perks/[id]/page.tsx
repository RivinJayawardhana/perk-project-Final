"use client";

import { useParams } from "next/navigation";
import EditPerk from "@/components/admin/EditPerk";

export default function EditPerkPage() {
  const params = useParams();
  const id = (params?.id as string) || "";

  if (!id) return <div>Loading...</div>;

  return <EditPerk perkId={id} />;
}
