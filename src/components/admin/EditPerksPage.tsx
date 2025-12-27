"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface SEOData {
  metaTitle: string;
  metaDescription: string;
}

interface PerksPageContent {
  seo?: SEOData;
  hero: {
    title: string;
    description: string;
  };
}

export default function EditPerksPage() {
  const { toast } = useToast();
  const [content, setContent] = useState<PerksPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/perks-content");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setContent(data);
    } catch (error: any) {
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
      const res = await fetch("/api/perks-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (!res.ok) throw new Error("Failed to save content");

      // Trigger immediate cache revalidation
      await fetch("/api/revalidate?path=/perks", { method: "POST" });

      toast({
        title: "Success",
        description: "Perks page updated successfully!",
      });
    } catch (error: any) {
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
          <p className="text-[#6b6f76]">Loading perks page content...</p>
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
              placeholder="e.g., Exclusive Perks for Founders | VentureNext"
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
              placeholder="e.g., Discover 500+ exclusive perks..."
              rows={2}
            />
            <p className="text-xs text-[#6b7280] mt-1">Recommended: 120-160 characters</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border">
        <h2 className="text-2xl font-bold text-[#23272f] mb-6 font-display">Hero Section</h2>

        <div className="space-y-4">
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
              placeholder="e.g., Discover your next perk"
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
              placeholder="e.g., Browse 500+ exclusive deals..."
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
