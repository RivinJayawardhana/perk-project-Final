"use client";

import { PerksTable } from "@/components/perks/PerksTable";

export default function AllPerks() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">All Perks</h1>
        <p className="text-muted-foreground">Manage and organize all founder perks</p>
      </div>
      <PerksTable />
    </div>
  );
}
