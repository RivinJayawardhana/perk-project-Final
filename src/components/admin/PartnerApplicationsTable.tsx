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

interface PartnerApplication {
  id: string;
  company: string;
  contact: string;
  email: string;
  website: string;
  offer: string;
  created_at: string;
}

function PartnerDetailModal({
  application,
  onClose,
}: {
  application: PartnerApplication;
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
              application.company
            )} w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold`}
          >
            {getInitials(application.company)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{application.company}</h2>
            <p className="text-sm text-muted-foreground">{application.contact}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">👤</span>
                <span className="text-sm font-medium">{application.contact}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">📧</span>
                <span className="text-sm">{application.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🌐</span>
                <a 
                  href={application.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {application.website.replace('https://', '').replace('http://', '')}
                </a>
              </div>
            </div>
          </div>

          {/* Offer Description */}
          <div>
            <h3 className="font-semibold text-sm mb-2">Offer Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {application.offer}
            </p>
          </div>

          {/* Application Details */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Application Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg">📅</span>
                <span className="text-muted-foreground">Submitted:</span>
                <span className="font-medium">{formatDate(application.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface PartnerApplication {
  id: string;
  company: string;
  contact: string;
  email: string;
  website: string;
  offer: string;
  created_at: string;
}

export function PartnerApplicationsTable() {
  const [applications, setApplications] = useState<PartnerApplication[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<PartnerApplication | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/partner");
      if (!response.ok) throw new Error("Failed to fetch applications");
      const data = await response.json();
      setApplications(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch applications");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredApplications = applications.filter((application) => {
    const matchesSearch =
      application.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/partner/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete application");
      
      setApplications(applications.filter((app) => app.id !== id));
      toast({ title: "Application deleted successfully" });
    } catch (err) {
      toast({
        title: "Failed to delete application",
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
          <p className="text-muted-foreground">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-destructive">Error loading applications</p>
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
            placeholder="Search applications..."
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
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Company</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Contact</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Email</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Website</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Offer</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Date</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                        {application.company.charAt(0).toUpperCase()}
                      </div>
                      <p className="font-medium text-foreground">{application.company}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground">{application.contact}</td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{application.email}</td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    <a href={application.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {application.website.replace('https://', '').replace('http://', '').substring(0, 30)}
                    </a>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {application.offer.substring(0, 50)}...
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {new Date(application.created_at).toLocaleDateString('en-US', {
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
                        <DropdownMenuItem onClick={() => setSelectedApplication(application)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(application.id)}
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
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedApplication && (
        <PartnerDetailModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
}
