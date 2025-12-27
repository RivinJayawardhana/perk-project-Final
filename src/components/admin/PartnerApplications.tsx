"use client";

import { PartnerApplicationsTable } from "@/components/admin/PartnerApplicationsTable";

export default function PartnerApplications() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Partner Applications</h1>
        <p className="text-muted-foreground">View and manage partner application submissions</p>
      </div>
      <PartnerApplicationsTable />
    </div>
  );
}
