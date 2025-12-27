"use client";

import { useLeads } from "@/hooks/useLeadForms";
import { usePerks } from "@/hooks/usePerks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, X, TrendingUp, FileText, Users } from "lucide-react";
import { useState } from "react";

interface Lead {
  id: string;
  perk_id: string;
  lead_form_id: string;
  form_data: Record<string, any>;
  email_address: string;
  submission_timestamp: string;
  email_sent: boolean;
  email_sent_at: string | null;
  perks?: {
    name: string;
  };
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 1);
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

function LeadDetailModal({
  lead,
  onClose,
}: {
  lead: Lead;
  onClose: () => void;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getFirstName = () => {
    return lead.form_data?.name || lead.form_data?.full_name || "Lead";
  };

  const getPhone = () => {
    return lead.form_data?.phone || lead.form_data?.phone_number || "N/A";
  };

  const getCompany = () => {
    return lead.form_data?.company || lead.form_data?.company_name || "N/A";
  };

  const getBudget = () => {
    return (
      lead.form_data?.budget ||
      lead.form_data?.estimated_budget ||
      "Not specified"
    );
  };

  const getTimeline = () => {
    return (
      lead.form_data?.timeline ||
      lead.form_data?.project_timeline ||
      "Not specified"
    );
  };

  const getMessage = () => {
    return (
      lead.form_data?.message ||
      lead.form_data?.inquiry ||
      lead.form_data?.comments ||
      ""
    );
  };

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
              getFirstName()
            )} w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold`}
          >
            {getInitials(getFirstName())}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{getFirstName()}</h2>
            <p className="text-sm text-muted-foreground">{getCompany()}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">📧</span>
                <span className="text-sm">{lead.email_address}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">📱</span>
                <span className="text-sm">{getPhone()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🏢</span>
                <span className="text-sm">{getCompany()}</span>
              </div>
            </div>
          </div>

          {/* Lead Details */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Lead Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg">💰</span>
                <span className="text-muted-foreground">Budget:</span>
                <span className="font-medium">{getBudget()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">⏱️</span>
                <span className="text-muted-foreground">Timeline:</span>
                <span className="font-medium">{getTimeline()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">📅</span>
                <span className="text-muted-foreground">Submitted:</span>
                <span className="font-medium">
                  {formatDate(lead.submission_timestamp)}
                </span>
              </div>
            </div>
          </div>

          {/* Message */}
          {getMessage() && (
            <div>
              <h3 className="font-semibold text-sm mb-2">Message</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {getMessage()}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  const { data: leads = [], isLoading } = useLeads();
  const { data: perks = [], isLoading: perksLoading } = usePerks();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filteredLeads = leads.filter((lead: Lead) => {
    const searchLower = searchTerm.toLowerCase();
    const name = lead.form_data?.name || lead.form_data?.full_name || "";
    const email = lead.email_address || "";
    const company = lead.form_data?.company || lead.form_data?.company_name || "";
    const phone = lead.form_data?.phone || lead.form_data?.phone_number || "";

    return (
      name.toLowerCase().includes(searchLower) ||
      email.toLowerCase().includes(searchLower) ||
      company.toLowerCase().includes(searchLower) ||
      phone.toLowerCase().includes(searchLower)
    );
  });

  const emailsSent = leads.filter((lead: Lead) => lead.email_sent).length;

  if (isLoading || perksLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to Perks Admin</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Perks */}
        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Perks</p>
              <p className="text-3xl font-bold text-blue-600">{perks.length}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        {/* Total Leads */}
        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200 dark:border-green-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Leads</p>
              <p className="text-3xl font-bold text-green-600">{leads.length}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        {/* Emails Sent */}
        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Emails Sent</p>
              <p className="text-3xl font-bold text-purple-600">{emailsSent}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        {/* Pending Emails */}
        <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-200 dark:border-orange-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Pending Emails</p>
              <p className="text-3xl font-bold text-orange-600">{leads.length - emailsSent}</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* All Leads Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">All Leads</h2>
        
        {leads.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No leads submitted yet</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                🔍
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-muted">
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                      Phone
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                      Company
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead: Lead) => {
                    const name = lead.form_data?.name || lead.form_data?.full_name || "N/A";
                    const phone = lead.form_data?.phone || lead.form_data?.phone_number || "N/A";
                    const company = lead.form_data?.company || lead.form_data?.company_name || "N/A";

                    return (
                      <tr
                        key={lead.id}
                        className="border-b border-muted hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`${getAvatarColor(
                                name
                              )} w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold`}
                            >
                              {getInitials(name)}
                            </div>
                            <span className="text-sm font-medium">{name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-muted-foreground">{lead.email_address}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-muted-foreground">{phone}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-muted-foreground">{company}</span>
                        </td>
                        <td className="py-4 px-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedLead(lead)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredLeads.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No leads found matching your search</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}
