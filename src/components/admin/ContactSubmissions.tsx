"use client";

import { ContactSubmissionsTable } from "@/components/admin/ContactSubmissionsTable";

export default function ContactSubmissions() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Contact Submissions</h1>
        <p className="text-muted-foreground">View and manage contact form submissions</p>
      </div>
      <ContactSubmissionsTable />
    </div>
  );
}
