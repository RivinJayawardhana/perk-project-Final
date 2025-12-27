import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Journal {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image_url?: string;
  author?: string;
  category?: string;
  tags?: string[];
  status: "draft" | "published";
  is_featured: boolean;
  publish_date?: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  og_image_url?: string;
  canonical_url?: string;
  read_time?: string;
  created_at: string;
  updated_at: string;
}

// Get all journals
export const useJournals = (status: "draft" | "published" = "published", limit = 10) => {
  return useQuery({
    queryKey: ["journals", status, limit],
    queryFn: async () => {
      const res = await fetch(
        `/api/journals?status=${status}&limit=${limit}`
      );
      if (!res.ok) throw new Error("Failed to fetch journals");
      return res.json() as Promise<Journal[]>;
    },
  });
};

// Get single journal by id or slug
export const useJournal = (idOrSlug: string) => {
  return useQuery({
    queryKey: ["journal", idOrSlug],
    queryFn: async () => {
      const res = await fetch(`/api/journals/${idOrSlug}`);
      if (!res.ok) throw new Error("Failed to fetch journal");
      return res.json() as Promise<Journal>;
    },
    enabled: !!idOrSlug,
  });
};

// Create journal
export const useCreateJournal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Journal>) => {
      const res = await fetch("/api/journals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to create journal (${res.status})`);
      }
      return res.json() as Promise<Journal>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
    },
  });
};

// Update journal
export const useUpdateJournal = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Journal>) => {
      const res = await fetch(`/api/journals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to update journal (${res.status})`);
      }
      return res.json() as Promise<Journal>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
      queryClient.invalidateQueries({ queryKey: ["journal"] });
    },
  });
};

// Delete journal
export const useDeleteJournal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/journals/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to delete journal (${res.status})`);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
    },
  });
};
