"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/journal/RichTextEditor";

interface Section {
  id: string;
  heading: string;
  slug: string;
  content: string;
}

interface SEOData {
  metaTitle: string;
  metaDescription: string;
}

interface HeroData {
  subtitle: string;
  heading: string;
  description: string;
}

interface TermsContent {
  sections: Section[];
  seo: SEOData;
  hero?: HeroData;
}

export default function EditTermsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [seo, setSeo] = useState<SEOData>({ metaTitle: "", metaDescription: "" });
  const [hero, setHero] = useState<HeroData>({ subtitle: "Legal", heading: "Privacy & Terms", description: "Read our privacy policy and terms of service." });
  const [originalSections, setOriginalSections] = useState<Section[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/terms-content");
      if (!res.ok) throw new Error("Failed to fetch");
      const data: TermsContent = await res.json();
      setSections(data.sections || []);
      setSeo(data.seo || { metaTitle: "", metaDescription: "" });
      setHero(data.hero || { subtitle: "Legal", heading: "Privacy & Terms", description: "Read our privacy policy and terms of service." });
      setOriginalSections(data.sections || []);
    } catch (error) {
      console.error("Error fetching terms content:", error);
      toast({
        title: "Error loading content",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const addSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      heading: "New Section",
      slug: "",
      content: "",
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (id: string, updates: Partial<Section>) => {
    setSections(
      sections.map((section) =>
        section.id === id ? { ...section, ...updates } : section
      )
    );
  };

  const deleteSection = (id: string) => {
    setSections(sections.filter((section) => section.id !== id));
  };

  const saveContent = async () => {
    try {
      setIsSaving(true);
      const payload: TermsContent = {
        sections,
        seo,
        hero,
      };

      const res = await fetch("/api/terms-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");

      // Trigger immediate cache revalidation
      await fetch("/api/revalidate?path=/privacy", { method: "POST" });

      toast({
        title: "Success",
        description: "Terms of Service page updated successfully!",
      });

      setOriginalSections(sections);
    } catch (error) {
      console.error("Error saving terms content:", error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-[#e6b756]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#23272f]">Terms of Service</h1>
        <p className="text-[#6b7280] mt-2">Manage your Terms of Service page content and SEO settings</p>
      </div>

      {/* SEO Settings */}
      <Card className="p-6 border border-[#e5e7eb]">
        <h2 className="text-2xl font-bold text-[#23272f] mb-6">SEO Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#23272f] mb-2">
              Meta Title
            </label>
            <Input
              value={seo.metaTitle}
              onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
              placeholder="e.g., Terms of Service | VentureNext"
              className="w-full"
            />
            <p className="text-xs text-[#6b7280] mt-1">
              Recommended: 30-60 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#23272f] mb-2">
              Meta Description
            </label>
            <Textarea
              value={seo.metaDescription}
              onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
              placeholder="e.g., Read our Terms of Service to understand the rules and guidelines..."
              rows={2}
              className="w-full"
            />
            <p className="text-xs text-[#6b7280] mt-1">
              Recommended: 120-160 characters
            </p>
          </div>
        </div>
      </Card>

      {/* Hero Section */}
      <Card className="p-6 border border-[#e5e7eb]">
        <h2 className="text-2xl font-bold text-[#23272f] mb-6">Hero Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#23272f] mb-2">
              Subtitle
            </label>
            <Input
              value={hero.subtitle}
              onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
              placeholder="e.g., Legal"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#23272f] mb-2">
              Heading
            </label>
            <Input
              value={hero.heading}
              onChange={(e) => setHero({ ...hero, heading: e.target.value })}
              placeholder="e.g., Privacy & Terms"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#23272f] mb-2">
              Description
            </label>
            <Textarea
              value={hero.description}
              onChange={(e) => setHero({ ...hero, description: e.target.value })}
              placeholder="e.g., Read our privacy policy and terms of service."
              rows={2}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Terms Sections */}
      <Card className="p-6 border border-[#e5e7eb]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#23272f]">Terms Sections</h2>
          <Button
            onClick={addSection}
            className="bg-[#e6b756] hover:bg-[#d4a543] text-[#1a2233]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="p-4 bg-[#f5f3f0] rounded-lg border border-[#e5e7eb]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-[#23272f] mb-2">
                    Section Heading
                  </label>
                  <Input
                    value={section.heading}
                    onChange={(e) => {
                      updateSection(section.id, { heading: e.target.value });
                    }}
                    placeholder="e.g., Acceptance of Terms"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#23272f] mb-2">
                    Slug (URL-friendly)
                  </label>
                  <Input
                    value={section.slug}
                    onChange={(e) => {
                      updateSection(section.id, { slug: e.target.value });
                    }}
                    placeholder="e.g., acceptance-of-terms"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-[#23272f] mb-2">
                  Section Content
                </label>
                <RichTextEditor
                  value={section.content}
                  onChange={(content) =>
                    updateSection(section.id, { content })
                  }
                  placeholder="Enter section content..."
                />
              </div>

              <button
                onClick={() => deleteSection(section.id)}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Delete Section
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button
          onClick={fetchContent}
          variant="outline"
          disabled={isSaving}
        >
          Discard
        </Button>
        <Button
          onClick={saveContent}
          disabled={isSaving}
          className="bg-[#e6b756] hover:bg-[#d4a543] text-[#1a2233]"
        >
          {isSaving ? (
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