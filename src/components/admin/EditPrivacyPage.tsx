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

interface PrivacyContent {
  sections: Section[];
  seo: SEOData;
  hero?: HeroData;
}

export default function EditPrivacyPage() {
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
      const res = await fetch("/api/privacy-content");
      if (!res.ok) throw new Error("Failed to fetch");
      const data: PrivacyContent = await res.json();
      setSections(data.sections || []);
      setSeo(data.seo || { metaTitle: "", metaDescription: "" });
      setHero(data.hero || { subtitle: "Legal", heading: "Privacy & Terms", description: "Read our privacy policy and terms of service." });
      setOriginalSections(data.sections || []);
    } catch (error) {
      console.error("Error fetching privacy content:", error);
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
      const res = await fetch("/api/privacy-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sections, seo, hero }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save");
      }

      // Trigger immediate cache revalidation
      await fetch("/api/revalidate?path=/privacy", { method: "POST" });

      setOriginalSections(sections);
      toast({
        title: "Success",
        description: "Privacy policy updated successfully!",
      });
    } catch (error) {
      console.error("Error saving privacy content:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update privacy policy",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetChanges = () => {
    setSections(originalSections);
    toast({
      title: "Changes reset",
      description: "Content reverted to last saved version",
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Edit Privacy Policy Page</h1>
        <p className="text-muted-foreground">Manage sections, content, and SEO settings for your privacy policy page</p>
      </div>

      {/* SEO Settings */}
      <Card className="p-6 mb-8 border border-[#e5e7eb]">
        <h2 className="text-2xl font-bold text-[#23272f] mb-6">SEO Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#23272f] mb-2">
              Meta Title
            </label>
            <Input
              value={seo.metaTitle}
              onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
              placeholder="e.g., Privacy Policy | VentureNext"
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
              placeholder="e.g., Learn about how VentureNext collects, uses, and protects your personal information."
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
      <Card className="p-6 mb-8 border border-[#e5e7eb]">
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

      <div className="space-y-4 mb-6">
        {sections.map((section) => (
          <Card key={section.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{section.heading}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteSection(section.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Section Heading</label>
                <Input
                  value={section.heading}
                  onChange={(e) => updateSection(section.id, { heading: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Content</label>
                <RichTextEditor
                  value={section.content}
                  onChange={(content) => updateSection(section.id, { content })}
                  placeholder="Enter section content..."
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button onClick={addSection} className="gap-2 mb-8">
        <Plus className="w-4 h-4" />
        Add Section
      </Button>

      <div className="flex gap-3">
        <Button 
          variant="outline"
          onClick={resetChanges}
          disabled={isSaving}
        >
          Reset Changes
        </Button>
        <Button 
          className="bg-amber-400 hover:bg-amber-500 text-black"
          onClick={saveContent}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Publishing...
            </>
          ) : (
            "Publish Changes"
          )}
        </Button>
      </div>
    </div>
  );
}
