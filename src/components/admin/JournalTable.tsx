"use client";

import { useState } from "react";
import { Search, MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useJournals, useDeleteJournal, Journal } from "@/hooks/useJournals";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export function JournalTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published">("all");
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);
  
  const { data: publishedJournals, isLoading: isLoadingPublished } = useJournals("published", 100);
  const { data: draftJournals, isLoading: isLoadingDraft } = useJournals("draft", 100);
  const { mutate: deleteJournal, isPending: isDeleting } = useDeleteJournal();
  const { toast } = useToast();

  // Combine journals based on filter
  const allJournals = [
    ...(statusFilter === "all" || statusFilter === "published" ? publishedJournals || [] : []),
    ...(statusFilter === "all" || statusFilter === "draft" ? draftJournals || [] : []),
  ];

  const filteredJournals = allJournals.filter((journal: Journal) => {
    const matchesSearch =
      journal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      journal.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      journal.author?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleDelete = (id: string) => {
    deleteJournal(id, {
      onSuccess: () => {
        toast({ title: "Journal deleted successfully" });
        setDeleteConfirm(null);
      },
      onError: () => {
        toast({
          title: "Failed to delete journal",
          variant: "destructive",
        });
      },
    });
  };

  const isLoading = isLoadingPublished || isLoadingDraft;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading journals...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search journals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
              className={statusFilter === "all" ? "bg-primary hover:bg-primary/90" : ""}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "published" ? "default" : "outline"}
              onClick={() => setStatusFilter("published")}
              className={statusFilter === "published" ? "bg-primary hover:bg-primary/90" : ""}
            >
              Published
            </Button>
            <Button
              variant={statusFilter === "draft" ? "default" : "outline"}
              onClick={() => setStatusFilter("draft")}
              className={statusFilter === "draft" ? "bg-primary hover:bg-primary/90" : ""}
            >
              Draft
            </Button>
          </div>
          <Link href="/admin/journal/new">
            <Button className="bg-primary hover:bg-primary/90">
              + New Journal
            </Button>
          </Link>
        </div>

        <div className="bg-card rounded-lg border overflow-x-auto overflow-y-auto max-h-[600px]">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                  Title
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                  Author
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                  Category
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                  Published
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                  Featured
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredJournals.length > 0 ? (
                filteredJournals.map((journal: Journal) => (
                  <tr key={journal.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3 max-w-xs">
                        <div className="w-9 h-9 rounded bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm flex-shrink-0">
                          {journal.title.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{journal.title}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {journal.excerpt?.substring(0, 30) || "No excerpt"}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground">
                      {journal.author || "Unknown"}
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground">
                      {journal.category || "Uncategorized"}
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        variant="outline"
                        className={
                          journal.status === "published"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }
                      >
                        {journal.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {journal.publish_date
                        ? new Date(journal.publish_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        variant="secondary"
                        className={
                          journal.is_featured
                            ? "bg-purple-100 text-purple-700 border-0"
                            : "bg-gray-100 text-gray-600 border-0"
                        }
                      >
                        {journal.is_featured ? "Yes" : "No"}
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
                            <Link href={`/admin/journal/${journal.slug}/edit`}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() =>
                              setDeleteConfirm({ id: journal.id, title: journal.title })
                            }
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    {allJournals.length === 0
                      ? "No journals yet. Create your first journal to get started!"
                      : "No journals match your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Journal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirm?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm.id)}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
