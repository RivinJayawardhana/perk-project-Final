import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface FormField {
  id: string;
  name: string;
  type: "text" | "email" | "phone" | "number" | "textarea" | "checkbox";
  label: string;
  required: boolean;
  placeholder?: string;
}

interface LeadForm {
  id: string;
  perk_id: string;
  form_fields: FormField[];
  submit_button_text: string;
  success_message: string;
  created_at: string;
  updated_at: string;
}

interface Lead {
  id: string;
  perk_id: string;
  lead_form_id: string;
  form_data: Record<string, any>;
  email_address: string;
  submission_timestamp: string;
  email_sent: boolean;
  email_sent_at: string | null;
}

// Get lead form for a specific perk
export const useLeadForm = (perkId: string | null) => {
  return useQuery<LeadForm | null>({
    queryKey: ["leadForm", perkId],
    queryFn: async () => {
      if (!perkId) return null;
      const res = await fetch(`/api/lead-forms?perk_id=${perkId}`);
      if (!res.ok) throw new Error("Failed to fetch lead form");
      return res.json();
    },
    enabled: !!perkId,
  });
};

// Get all lead forms
export const useLeadForms = () => {
  return useQuery<LeadForm[]>({
    queryKey: ["leadForms"],
    queryFn: async () => {
      const res = await fetch("/api/lead-forms");
      if (!res.ok) throw new Error("Failed to fetch lead forms");
      return res.json();
    },
  });
};

// Create or update lead form
export const useCreateLeadForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      perk_id: string;
      form_fields: FormField[];
      submit_button_text?: string;
      success_message?: string;
    }) => {
      const res = await fetch("/api/lead-forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to create lead form (${res.status})`);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadForms"] });
    },
  });
};

// Update lead form
export const useUpdateLeadForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: string;
      form_fields: FormField[];
      submit_button_text?: string;
      success_message?: string;
    }) => {
      const res = await fetch("/api/lead-forms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update lead form");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadForms"] });
    },
  });
};

// Delete lead form
export const useDeleteLeadForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/lead-forms?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete lead form");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadForms"] });
    },
  });
};

// Submit lead (frontend submission)
export const useSubmitLead = () => {
  return useMutation({
    mutationFn: async (data: {
      perk_id: string;
      lead_form_id: string;
      form_data: Record<string, any>;
      email_address?: string;
      recaptchaToken: string;
    }) => {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit lead");
      }
      return res.json();
    },
  });
};

// Get all leads
export const useLeads = (perkId?: string) => {
  return useQuery<Lead[]>({
    queryKey: ["leads", perkId],
    queryFn: async () => {
      let url = "/api/leads";
      if (perkId) {
        url += `?perk_id=${perkId}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch leads");
      return res.json();
    },
  });
};
