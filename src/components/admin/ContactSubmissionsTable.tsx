"use client";

import { useState, useEffect } from "react";
import { Search, MoreHorizontal, Trash2, Loader2, X, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

function ContactDetailModal({
  submission,
  onClose,
}: {
  submission: ContactSubmission;
  onClose: () => void;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  function getInitials(name: string): string {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function getAvatarColor(name: string): string {
    const colors = [
      "bg-yellow-200",
      "bg-orange-200",
      "bg-pink-200",
      "bg-purple-200",
      "bg-blue-200",
      "bg-green-200",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-muted rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 mb-6">
          <div
            className={`${getAvatarColor(
              submission.name
            )} w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold`}
          >
            {getInitials(submission.name)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{submission.name}</h2>
            <p className="text-sm text-muted-foreground">{submission.subject}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">📧</span>
                <span className="text-sm">{submission.email}</span>
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <h3 className="font-semibold text-sm mb-2">Message</h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {submission.message}
            </p>
          </div>

          {/* Submission Details */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Submission Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg">📅</span>
                <span className="text-muted-foreground">Submitted:</span>
                <span className="font-medium">{formatDate(submission.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export function ContactSubmissionsTable() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/contact");
      if (!response.ok) throw new Error("Failed to fetch submissions");
      const data = await response.json();
      setSubmissions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch submissions");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/contact/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete submission");
      
      setSubmissions(submissions.filter((sub) => sub.id !== id));
      toast({ title: "Submission deleted successfully" });
    } catch (err) {
      toast({
        title: "Failed to delete submission",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-destructive">Error loading submissions</p>
          <p className="text-sm text-muted-foreground">{error}</p>
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
            placeholder="Search submissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-card rounded-lg border overflow-x-auto overflow-y-auto max-h-[600px]">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Name</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Email</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Subject</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Message</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Date</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                        {submission.name.charAt(0).toUpperCase()}
                      </div>
                      <p className="font-medium text-foreground">{submission.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{submission.email}</td>
                  <td className="px-4 py-4 text-sm text-foreground">{submission.subject}</td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {submission.message.substring(0, 50)}...
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {new Date(submission.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-4 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedSubmission(submission)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(submission.id)}
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
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No submissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedSubmission && (
        <ContactDetailModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </div>
  );
}
