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

interface PartnerContent {
  seo?: SEOData;
  hero: {
    subtitle: string;
    title: string;
    description: string;
    buttonText: string;
  };
  benefits: {
    subtitle: string;
    title: string;
    cards: Array<{ title: string; description: string }>;
  };
  process: {
    subtitle: string;
    title: string;
    steps: Array<{ step: string; title: string; description: string }>;
  };
  form: {
    subtitle: string;
    title: string;
    description: string;
  };
}

type SectionType = "seo" | "hero" | "benefits" | "process" | "form";

export default function EditPartnerPage() {
  const { toast } = useToast();
  const [content, setContent] = useState<PartnerContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionType>("seo");

  const sections: { id: SectionType; label: string }[] = [
    { id: "seo", label: "SEO" },
    { id: "hero", label: "Hero" },
    { id: "benefits", label: "Benefits" },
    { id: "process", label: "Process" },
    { id: "form", label: "Form" },
  ];

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/partner-content");
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
      const res = await fetch("/api/partner-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (!res.ok) throw new Error("Failed to save content");

      // Trigger immediate cache revalidation
      await fetch("/api/revalidate?path=/partner", { method: "POST" });

      toast({
        title: "Success",
        description: "Partner page updated successfully!",
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
          <p className="text-[#6b6f76]">Loading partner page content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Selection Tabs */}
      <div className="border-b border-[#e5e7eb] bg-white rounded-t-xl">
        <div className="flex gap-0">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${
                activeSection === section.id
                  ? "text-[#23272f] border-b-[#23272f]"
                  : "text-[#9ca3af] border-b-transparent hover:text-[#6b7280]"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Section Content */}
      {activeSection === "seo" && (
        <div className="bg-white rounded-b-xl shadow-sm p-6 border border-t-0">
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
                placeholder="e.g., Partner With VentureNext - Reach Founders & Remote Teams"
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
                placeholder="e.g., Become a VentureNext partner..."
                rows={2}
              />
              <p className="text-xs text-[#6b7280] mt-1">Recommended: 120-160 characters</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section Content */}
      {activeSection === "hero" && (
        <div className="bg-white rounded-b-xl shadow-sm p-6 border border-t-0">
          <h2 className="text-2xl font-bold text-[#23272f] mb-6 font-display">Hero Section</h2>

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
                placeholder="e.g., Partner with us"
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
                placeholder="e.g., Reach the founders building tomorrow"
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
                placeholder="Hero section description"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#23272f] mb-2">Button Text</label>
              <Input
                value={content.hero.buttonText}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, buttonText: e.target.value },
                  })
                }
                placeholder="e.g., Become a Partner →"
              />
            </div>
          </div>
        </div>
      )}

      {/* Benefits Section Content */}
      {activeSection === "benefits" && (
        <div className="bg-white rounded-b-xl shadow-sm p-6 border border-t-0">
          <h2 className="text-2xl font-bold text-[#23272f] mb-6 font-display">Benefits Section</h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-[#23272f] mb-2">Subtitle</label>
              <Input
                value={content.benefits.subtitle}
                onChange={(e) =>
                  setContent({
                    ...content,
                    benefits: { ...content.benefits, subtitle: e.target.value },
                  })
                }
                placeholder="e.g., Why partner with us"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#23272f] mb-2">Title</label>
              <Input
                value={content.benefits.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    benefits: { ...content.benefits, title: e.target.value },
                  })
                }
                placeholder="e.g., Benefits for your brand"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-[#23272f] mb-4">Benefit Cards</h3>
            {content.benefits.cards.map((card, idx) => (
              <div key={idx} className="bg-[#f5f3f0] p-4 rounded-lg mb-3 border">
                <Input
                  value={card.title}
                  onChange={(e) => {
                    const cards = [...content.benefits.cards];
                    cards[idx].title = e.target.value;
                    setContent({
                      ...content,
                      benefits: { ...content.benefits, cards },
                    });
                  }}
                  placeholder="Benefit title"
                  className="mb-2"
                />
                <Textarea
                  value={card.description}
                  onChange={(e) => {
                    const cards = [...content.benefits.cards];
                    cards[idx].description = e.target.value;
                    setContent({
                      ...content,
                      benefits: { ...content.benefits, cards },
                    });
                  }}
                  placeholder="Benefit description"
                  rows={2}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Process Section Content */}
      {activeSection === "process" && (
        <div className="bg-white rounded-b-xl shadow-sm p-6 border border-t-0">
          <h2 className="text-2xl font-bold text-[#23272f] mb-6 font-display">Process Section</h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-[#23272f] mb-2">Subtitle</label>
              <Input
                value={content.process.subtitle}
                onChange={(e) =>
                  setContent({
                    ...content,
                    process: { ...content.process, subtitle: e.target.value },
                  })
                }
                placeholder="e.g., How it works"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#23272f] mb-2">Title</label>
              <Input
                value={content.process.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    process: { ...content.process, title: e.target.value },
                  })
                }
                placeholder="e.g., Simple partnership process"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-[#23272f] mb-4">Process Steps</h3>
            {content.process.steps.map((step, idx) => (
              <div key={idx} className="bg-[#f5f3f0] p-4 rounded-lg mb-3 border">
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="block text-xs font-medium text-[#23272f] mb-1">Step Number</label>
                    <Input
                      value={step.step}
                      onChange={(e) => {
                        const steps = [...content.process.steps];
                        steps[idx].step = e.target.value;
                        setContent({
                          ...content,
                          process: { ...content.process, steps },
                        });
                      }}
                      placeholder="e.g., 01"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#23272f] mb-1">Title</label>
                    <Input
                      value={step.title}
                      onChange={(e) => {
                        const steps = [...content.process.steps];
                        steps[idx].title = e.target.value;
                        setContent({
                          ...content,
                          process: { ...content.process, steps },
                        });
                      }}
                      placeholder="e.g., Apply"
                    />
                  </div>
                </div>
                <Textarea
                  value={step.description}
                  onChange={(e) => {
                    const steps = [...content.process.steps];
                    steps[idx].description = e.target.value;
                    setContent({
                      ...content,
                      process: { ...content.process, steps },
                    });
                  }}
                  placeholder="Step description"
                  rows={2}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Section Content */}
      {activeSection === "form" && (
        <div className="bg-white rounded-b-xl shadow-sm p-6 border border-t-0">
          <h2 className="text-2xl font-bold text-[#23272f] mb-6 font-display">Form Section</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#23272f] mb-2">Subtitle</label>
              <Input
                value={content.form.subtitle}
                onChange={(e) =>
                  setContent({
                    ...content,
                    form: { ...content.form, subtitle: e.target.value },
                  })
                }
                placeholder="e.g., Get started"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#23272f] mb-2">Title</label>
              <Input
                value={content.form.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    form: { ...content.form, title: e.target.value },
                  })
                }
                placeholder="e.g., Apply to become a partner"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#23272f] mb-2">Description</label>
              <Textarea
                value={content.form.description}
                onChange={(e) =>
                  setContent({
                    ...content,
                    form: { ...content.form, description: e.target.value },
                  })
                }
                placeholder="Form section description"
                rows={3}
              />
            </div>
          </div>
        </div>
      )}

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
