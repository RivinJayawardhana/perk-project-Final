"use client";

import { useState } from "react";
import { Search, Filter, MoreHorizontal, Eye, Pencil, Trash2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePerks, useDeletePerk } from "@/hooks/usePerks";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface Perk {
  id: string;
  name: string;
  description: string;
  category: string;
  discount: string;
  expiry: string;
  image_url: string;
  logo_url: string;
  deal_type?: string;
  best_for?: string;
  status?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export function PerksTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: perks, isLoading, error } = usePerks();
  const { mutate: deletePerk, isPending: isDeleting } = useDeletePerk();
  const { toast } = useToast();

  const filteredPerks = (perks || []).filter((perk: Perk) => {
    const matchesSearch = 
      perk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      perk.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleDelete = (id: string) => {
    deletePerk(id, {
      onSuccess: () => {
        toast({ title: "Perk deleted successfully" });
      },
      onError: () => {
        toast({ 
          title: "Failed to delete perk",
          variant: "destructive"
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading perks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-destructive">Error loading perks</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search perks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Link href="/admin/perks/add">
          <Button className="bg-primary hover:bg-primary/90">
            + Add Perk
          </Button>
        </Link>
      </div>

      <div className="bg-card rounded-lg border overflow-x-auto overflow-y-auto max-h-[600px]">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Perk</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Category</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Deal</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Location</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Valid Until</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredPerks.length > 0 ? (
              filteredPerks.map((perk: Perk) => (
                <tr key={perk.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                        {perk.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{perk.name}</p>
                        <p className="text-sm text-muted-foreground">{perk.description?.substring(0, 30)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground">{perk.category}</td>
                  <td className="px-4 py-4">
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-0">
                      {perk.discount}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {perk.location || "Global"}
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {perk.expiry ? new Date(perk.expiry).toLocaleDateString('en-US', { 
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : 'none'}
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {perk.status || "Active"}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/perks/${perk.id}`}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(perk.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {isDeleting ? "Deleting..." : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No perks found. Create your first perk to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
