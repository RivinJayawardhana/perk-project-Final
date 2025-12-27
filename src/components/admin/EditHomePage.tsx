"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface HomeContent {
  hero: {
    badge: string;
    title: string;
    description: string;
    buttonText1: string;
    buttonText2: string;
    heroImages: string[];
  };
  featuredDeals: {
    title: string;
  };
  howItWorks: {
    title: string;
    subtitle: string;
    steps: Array<{ title: string; description: string }>;
  };
  insights: {
    title: string;
  };
  ctaCards: {
    card1: { title: string; description: string; buttonText: string };
    card2: { title: string; description: string; buttonText: string };
  };
  seo?: {
    metaTitle: string;
    metaDescription: string;
  };
}

export default function EditHomePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<HomeContent | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/home-content");
      if (!res.ok) throw new Error("Failed to fetch content");
      const data = await res.json();
      setContent(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load home content",
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
      const res = await fetch("/api/home-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (!res.ok) throw new Error("Failed to save content");

      toast({
        title: "Success",
        description: "Home page content updated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save content",
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
          <p className="text-[#6b6f76]">Loading home page content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* SEO Section */}
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
                  seo: {
                    metaTitle: e.target.value,
                    metaDescription: content.seo?.metaDescription || "",
                  },
                })
              }
              placeholder="e.g., VentureNext - Exclusive Perks for Founders"
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
                  seo: {
                    metaTitle: content.seo?.metaTitle || "",
                    metaDescription: e.target.value,
                  },
                })
              }
              placeholder="e.g., Discover 500+ exclusive perks and deals for founders..."
              rows={3}
            />
            <p className="text-xs text-[#6b7280] mt-1">Recommended: 120-160 characters</p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 border">
        <h2 className="text-2xl font-bold text-[#23272f] mb-6 font-display">Hero Section</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#23272f] mb-2">Badge Text</label>
            <Input
              value={content.hero.badge}
              onChange={(e) =>
                setContent({
                  ...content,
                  hero: { ...content.hero, badge: e.target.value },
                })
              }
              placeholder="e.g., 500+ exclusive perks for founders"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#23272f] mb-2">Main Title</label>
            <Input
              value={content.hero.title}
              onChange={(e) =>
                setContent({
                  ...content,
                  hero: { ...content.hero, title: e.target.value },
                })
              }
              placeholder="e.g., Perks that fuel your growth"
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
              placeholder="Main hero description text"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#23272f] mb-2">Button 1 Text</label>
              <Input
                value={content.hero.buttonText1}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, buttonText1: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#23272f] mb-2">Button 2 Text</label>
              <Input
                value={content.hero.buttonText2}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, buttonText2: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#23272f] mb-2">Hero Image URLs</label>
            {content.hero.heroImages.map((image, idx) => (
              <Input
                key={idx}
                value={image}
                onChange={(e) => {
                  const newImages = [...content.hero.heroImages];
                  newImages[idx] = e.target.value;
                  setContent({
                    ...content,
                    hero: { ...content.hero, heroImages: newImages },
                  });
                }}
                placeholder={`Hero image ${idx + 1} URL`}
                className="mb-2"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Featured Deals Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 border">
        <h2 className="text-2xl font-bold text-[#23272f] mb-6 font-display">Featured Deals Section</h2>

        <div>
          <label className="block text-sm font-medium text-[#23272f] mb-2">Section Title</label>
          <Input
            value={content.featuredDeals.title}
            onChange={(e) =>
              setContent({
                ...content,
                featuredDeals: { title: e.target.value },
              })
            }
            placeholder="e.g., Top picks this month"
          />
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 border">
        <h2 className="text-2xl font-bold text-[#23272f] mb-6 font-display">How It Works Section</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#23272f] mb-2">Section Title</label>
            <Input
              value={content.howItWorks.title}
              onChange={(e) =>
                setContent({
                  ...content,
                  howItWorks: { ...content.howItWorks, title: e.target.value },
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#23272f] mb-2">Subtitle</label>
            <Input
              value={content.howItWorks.subtitle}
              onChange={(e) =>
                setContent({
                  ...content,
                  howItWorks: { ...content.howItWorks, subtitle: e.target.value },
                })
              }
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-[#23272f] mb-4">Steps</h3>
            {content.howItWorks.steps.map((step, idx) => (
              <div key={idx} className="mb-4 p-4 bg-[#f5f3f0] rounded-lg">
                <label className="block text-sm font-medium text-[#23272f] mb-2">Step {idx + 1} Title</label>
                <Input
                  value={step.title}
                  onChange={(e) => {
                    const newSteps = [...content.howItWorks.steps];
                    newSteps[idx].title = e.target.value;
                    setContent({
                      ...content,
                      howItWorks: { ...content.howItWorks, steps: newSteps },
                    });
                  }}
                  className="mb-2"
                />

                <label className="block text-sm font-medium text-[#23272f] mb-2">Step {idx + 1} Description</label>
                <Textarea
                  value={step.description}
                  onChange={(e) => {
                    const newSteps = [...content.howItWorks.steps];
                    newSteps[idx].description = e.target.value;
                    setContent({
                      ...content,
                      howItWorks: { ...content.howItWorks, steps: newSteps },
                    });
                  }}
                  rows={2}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 border">
        <h2 className="text-2xl font-bold text-[#23272f] mb-6 font-display">Insights Section</h2>

        <div>
          <label className="block text-sm font-medium text-[#23272f] mb-2">Section Title</label>
          <Input
            value={content.insights.title}
            onChange={(e) =>
              setContent({
                ...content,
                insights: { title: e.target.value },
              })
            }
          />
        </div>
      </div>

      {/* CTA Cards Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 border">
        <h2 className="text-2xl font-bold text-[#23272f] mb-6 font-display">CTA Cards</h2>

        {/* Card 1 */}
        <div className="mb-6 p-4 bg-[#f5f3f0] rounded-lg">
          <h3 className="font-semibold text-[#23272f] mb-4">Card 1 (Dark - For Founders)</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-[#23272f] mb-2">Title</label>
              <Input
                value={content.ctaCards.card1.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    ctaCards: {
                      ...content.ctaCards,
                      card1: { ...content.ctaCards.card1, title: e.target.value },
                    },
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#23272f] mb-2">Description</label>
              <Textarea
                value={content.ctaCards.card1.description}
                onChange={(e) =>
                  setContent({
                    ...content,
                    ctaCards: {
                      ...content.ctaCards,
                      card1: { ...content.ctaCards.card1, description: e.target.value },
                    },
                  })
                }
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#23272f] mb-2">Button Text</label>
              <Input
                value={content.ctaCards.card1.buttonText}
                onChange={(e) =>
                  setContent({
                    ...content,
                    ctaCards: {
                      ...content.ctaCards,
                      card1: { ...content.ctaCards.card1, buttonText: e.target.value },
                    },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-4 bg-[#f5f3f0] rounded-lg">
          <h3 className="font-semibold text-[#23272f] mb-4">Card 2 (Light - Become a Partner)</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-[#23272f] mb-2">Title</label>
              <Input
                value={content.ctaCards.card2.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    ctaCards: {
                      ...content.ctaCards,
                      card2: { ...content.ctaCards.card2, title: e.target.value },
                    },
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#23272f] mb-2">Description</label>
              <Textarea
                value={content.ctaCards.card2.description}
                onChange={(e) =>
                  setContent({
                    ...content,
                    ctaCards: {
                      ...content.ctaCards,
                      card2: { ...content.ctaCards.card2, description: e.target.value },
                    },
                  })
                }
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#23272f] mb-2">Button Text</label>
              <Input
                value={content.ctaCards.card2.buttonText}
                onChange={(e) =>
                  setContent({
                    ...content,
                    ctaCards: {
                      ...content.ctaCards,
                      card2: { ...content.ctaCards.card2, buttonText: e.target.value },
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3 justify-end">
        <Button
          variant="outline"
          className="px-6 py-2 rounded-full"
          onClick={fetchContent}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button
          className="bg-[#e6b756] text-[#1a2233] px-6 py-2 rounded-full hover:bg-[#d4a645] font-semibold"
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
