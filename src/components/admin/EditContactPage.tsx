"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ContactPageContent {
  hero: {
    subtitle: string;
    title: string;
    description: string;
  };
  contactInfo?: {
    email: string;
    phone: string;
    location: string;
  };
  seo?: {
    metaTitle: string;
    metaDescription: string;
  };
}

export default function EditContactPage() {
  const { toast } = useToast();
  const [content, setContent] = useState<ContactPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      console.log("[EditContactPage] Fetching content...");
      const res = await fetch("/api/contact-content");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      console.log("[EditContactPage] Fetched data:", data);
      
      // Ensure contactInfo always has defaults
      if (!data.contactInfo) {
        data.contactInfo = {
          email: "",
          phone: "",
          location: "",
        };
      }
      
      setContent(data);
    } catch (error: any) {
      console.error("[EditContactPage] Fetch error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;

    try {
      setSaving(true);
      console.log("[EditContactPage] Saving content:", content);
      
      const res = await fetch("/api/contact-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      const responseData = await res.json();
      console.log("[EditContactPage] API Response:", responseData);

      if (!res.ok) {
        throw new Error(responseData.error || "Failed to save content");
      }

      console.log("[EditContactPage] Save successful, triggering revalidation...");
      // Trigger immediate cache revalidation
      const revalidateRes = await fetch("/api/revalidate?path=/contact", { method: "POST" });
      console.log("[EditContactPage] Revalidate response:", revalidateRes.status);

      toast({
        title: "Success",
        description: "Contact page updated successfully!",
      });
      
      // Refetch to confirm save
      await fetchContent();
    } catch (error: any) {
      console.error("[EditContactPage] Save error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !content) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-[#e6b756]" />
          <p className="text-[#6b6f76]">Loading contact page content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border">
        <h2 className="text-2xl font-bold text-[#23272f] mb-6">SEO Settings</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#23272f] mb-2">Meta Title</label>
            <Input
              value={content.seo?.metaTitle || ""}
              onChange={(e) =>
                setContent({
                  ...content,
                  seo: { ...content.seo, metaTitle: e.target.value } as any,
                })
              }
              placeholder="e.g., Contact VentureNext - Get in Touch"
            />
            <p className="text-xs text-[#6b7280] mt-1">Recommended: 30-60 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#23272f] mb-2">Meta Description</label>
            <Textarea
              value={content.seo?.metaDescription || ""}
              onChange={(e) =>
                setContent({
                  ...content,
                  seo: { ...content.seo, metaDescription: e.target.value } as any,
                })
              }
              placeholder="e.g., Have questions? Contact our team..."
              rows={2}
            />
            <p className="text-xs text-[#6b7280] mt-1">Recommended: 120-160 characters</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border">        <h2 className="text-2xl font-bold text-[#23272f] mb-6 font-display">Hero Section</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#23272f] mb-2">Subtitle</label>
            <Input
              value={content.hero.subtitle}
              onChange={(e) =>
                setContent({
                  ...content,
                  hero: { ...content.hero, subtitle: e.target.value },
                })
              }
              placeholder="e.g., Contact us"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#23272f] mb-2">Title</label>
            <Input
              value={content.hero.title}
              onChange={(e) =>
                setContent({
                  ...content,
                  hero: { ...content.hero, title: e.target.value },
                })
              }
              placeholder="e.g., We'd love to hear from you"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#23272f] mb-2">Description</label>
            <Textarea
              value={content.hero.description}
              onChange={(e) =>
                setContent({
                  ...content,
                  hero: { ...content.hero, description: e.target.value },
                })
              }
              placeholder="e.g., Whether you have a question about perks, partnerships, or anything else—our team is ready to help."
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6">
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          disabled={saving}
        >
          Cancel
        </Button>

        <Button
          className="bg-[#e6b756] text-[#1a2233]"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
}
