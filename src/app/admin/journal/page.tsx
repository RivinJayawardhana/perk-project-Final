"use client";

import { AllJournals } from "@/components/admin/AllJournals";

export default function AdminJournalPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Journal Management</h1>
        <p className="text-muted-foreground mt-2">
          Create, edit, and manage all your journal posts
        </p>
      </div>
      <AllJournals />
    </div>
  );
}
