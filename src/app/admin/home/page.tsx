"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/perks/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Loader2, Upload, X } from "lucide-react";

interface HomePageContent {
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

const DEFAULT_CONTENT: HomePageContent = {
  hero: {
    badge: "500+ exclusive perks for founders",
    title: "Perks that fuel your growth",
    description: "Exclusive deals on the tools, services, and experiences that help founders, freelancers, and remote teams thrive.",
    buttonText1: "Explore All Perks",
    buttonText2: "How It Works",
    heroImages: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80",
    ],
  },
  featuredDeals: {
    title: "Top picks this month",
  },
  howItWorks: {
    title: "How it works",
    subtitle: "Get exclusive perks in three simple steps",
    steps: [
      {
        title: "Discover perks",
        description: "Browse hundreds of exclusive deals curated for founders and remote teams.",
      },
      {
        title: "Unlock your discount",
        description: "Click to reveal the deal and get instant access to partner offers.",
      },
      {
        title: "Save & grow",
        description: "Apply your savings to fuel growth with premium tools and services.",
      },
    ],
  },
  insights: {
    title: "Insights for founders",
  },
  ctaCards: {
    card1: {
      title: "For Founders & Teams",
      description: "Access hundreds of exclusive perks to save money and grow your business faster.",
      buttonText: "Explore Perks",
    },
    card2: {
      title: "Become a Partner",
      description: "Reach thousands of decision-makers at startups and growing businesses.",
      buttonText: "Partner With Us",
    },
  },
  seo: {
    metaTitle: "VentureNext - Exclusive Perks for Founders & Remote Teams",
    metaDescription: "Discover 500+ exclusive perks and deals for founders, freelancers, and remote teams. Save money on premium tools and services.",
  },
};

export default function EditHomePage() {
  const { toast } = useToast();
  const { upload, isUploading } = useImageUpload();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<HomePageContent>(DEFAULT_CONTENT);
  const imageInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Load content on mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch("/api/home-content");
        if (response.ok) {
          const data = await response.json();
          setContent(data);
        } else {
          setContent(DEFAULT_CONTENT);
        }
      } catch (error) {
        console.error("Failed to load home content:", error);
        setContent(DEFAULT_CONTENT);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  const handleHeroImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await upload(file, "hero-images");
      if (url) {
        const newImages = [...content.hero.heroImages];
        newImages[idx] = url;
        setContent({
          ...content,
          hero: { ...content.hero, heroImages: newImages },
        });
        toast({
          title: "Success",
          description: "Image uploaded successfully!",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/home-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (response.ok) {
        // Trigger immediate cache revalidation
        await fetch("/api/revalidate?path=/", { method: "POST" });
        
        toast({
          title: "Success",
          description: "Homepage content updated successfully!",
        });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save homepage content",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Homepage Editor
        </h1>
        <p className="text-muted-foreground mt-2">
          Edit all homepage sections and content
        </p>
      </div>

      <Tabs defaultValue="seo" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="howItWorks">How It Works</TabsTrigger>
          <TabsTrigger value="sections">Other Sections</TabsTrigger>
          <TabsTrigger value="cta">CTA Cards</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* SEO SECTION */}
        <TabsContent value="seo" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">SEO Settings</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Meta Title
                </label>
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
                <label className="block text-sm font-medium mb-2">
                  Meta Description
                </label>
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
          </Card>
        </TabsContent>

        {/* HERO SECTION */}
        <TabsContent value="hero" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Hero Section</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Badge Text
                  </label>
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
                  <label className="block text-sm font-medium mb-2">
                    Main Title (H1)
                  </label>
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
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Button 1 Text
                    </label>
                    <Input
                      value={content.hero.buttonText1}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: {
                            ...content.hero,
                            buttonText1: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g., Explore All Perks"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Button 2 Text
                    </label>
                    <Input
                      value={content.hero.buttonText2}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: {
                            ...content.hero,
                            buttonText2: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g., How It Works"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-4">
                    Hero Images (6)
                  </label>
                  <div className="space-y-4">
                    {content.hero.heroImages.map((image, idx) => (
                      <div key={idx}>
                        <label className="block text-xs font-medium mb-2">
                          Image {idx + 1}
                        </label>
                        <div className="space-y-3">
                          {/* Image Preview */}
                          {image && (
                            <div className="relative h-32 w-full bg-muted rounded-lg overflow-hidden">
                              <img
                                src={image}
                                alt={`Hero ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={() => {
                                  const newImages = [...content.hero.heroImages];
                                  newImages[idx] = "";
                                  setContent({
                                    ...content,
                                    hero: { ...content.hero, heroImages: newImages },
                                  });
                                }}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded hover:bg-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}

                          {/* Upload Button */}
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => imageInputRefs.current[idx]?.click()}
                              disabled={isUploading}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-muted-foreground/50 transition-colors disabled:opacity-50"
                            >
                              {isUploading ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4" />
                                  Upload Image
                                </>
                              )}
                            </button>
                          </div>

                          <input
                            ref={(el) => {
                              imageInputRefs.current[idx] = el;
                            }}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleHeroImageUpload(e, idx)}
                            className="hidden"
                            disabled={isUploading}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
        </TabsContent>

        {/* HOW IT WORKS SECTION */}
        <TabsContent value="howItWorks" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">How It Works Section</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Section Title
                  </label>
                  <Input
                    value={content.howItWorks.title}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        howItWorks: {
                          ...content.howItWorks,
                          title: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g., How it works"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Subtitle
                  </label>
                  <Input
                    value={content.howItWorks.subtitle}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        howItWorks: {
                          ...content.howItWorks,
                          subtitle: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g., Get exclusive perks in three simple steps"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Steps</h3>
                  {content.howItWorks.steps.map((step, idx) => (
                    <div key={idx} className="border-l-2 border-primary pl-4 py-2">
                      <label className="block text-sm font-medium mb-2">
                        Step {idx + 1} Title
                      </label>
                      <Input
                        value={step.title}
                        onChange={(e) => {
                          const newSteps = [...content.howItWorks.steps];
                          newSteps[idx].title = e.target.value;
                          setContent({
                            ...content,
                            howItWorks: {
                              ...content.howItWorks,
                              steps: newSteps,
                            },
                          });
                        }}
                        className="mb-2"
                      />
                      <label className="block text-sm font-medium mb-2">
                        Step {idx + 1} Description
                      </label>
                      <Textarea
                        value={step.description}
                        onChange={(e) => {
                          const newSteps = [...content.howItWorks.steps];
                          newSteps[idx].description = e.target.value;
                          setContent({
                            ...content,
                            howItWorks: {
                              ...content.howItWorks,
                              steps: newSteps,
                            },
                          });
                        }}
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
        </TabsContent>

        {/* OTHER SECTIONS */}
        <TabsContent value="sections" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Featured Deals Section</h2>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Section Title
                </label>
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
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Insights Section</h2>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Section Title
                </label>
                <Input
                  value={content.insights.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      insights: { title: e.target.value },
                    })
                  }
                  placeholder="e.g., Insights for founders"
                />
              </div>
            </Card>
        </TabsContent>

        {/* CTA CARDS SECTION */}
        <TabsContent value="cta" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">CTA Card 1 - For Founders</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title
                  </label>
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
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <Textarea
                    value={content.ctaCards.card1.description}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        ctaCards: {
                          ...content.ctaCards,
                          card1: {
                            ...content.ctaCards.card1,
                            description: e.target.value,
                          },
                        },
                      })
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Button Text
                  </label>
                  <Input
                    value={content.ctaCards.card1.buttonText}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        ctaCards: {
                          ...content.ctaCards,
                          card1: {
                            ...content.ctaCards.card1,
                            buttonText: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">CTA Card 2 - Partner</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title
                  </label>
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
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <Textarea
                    value={content.ctaCards.card2.description}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        ctaCards: {
                          ...content.ctaCards,
                          card2: {
                            ...content.ctaCards.card2,
                            description: e.target.value,
                          },
                        },
                      })
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Button Text
                  </label>
                  <Input
                    value={content.ctaCards.card2.buttonText}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        ctaCards: {
                          ...content.ctaCards,
                          card2: {
                            ...content.ctaCards.card2,
                            buttonText: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>
            </Card>
        </TabsContent>

        {/* PREVIEW */}
        <TabsContent value="preview" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Content Preview</h2>
              <pre className="bg-muted p-4 rounded overflow-auto max-h-96 text-xs">
                {JSON.stringify(content, null, 2)}
              </pre>
            </Card>
        </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90"
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
