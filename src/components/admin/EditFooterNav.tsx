"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface FooterLink {
  label: string;
  url: string;
}

interface FooterSection {
  section: string;
  links: FooterLink[];
}

interface FooterData {
  socialLinks: SocialLink[];
  footerLinks: FooterSection[];
  copyrightText?: string;
  newsletter?: {
    title: string;
    subtitle: string;
  };
}

const ICON_OPTIONS = ["Facebook", "Instagram", "Linkedin", "Twitter", "Youtube", "TikTok"];

export default function EditFooterNav() {
  const { toast } = useToast();
  const [data, setData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Fetching footer content...");
      const res = await fetch("/api/footer-content");
      const footerData = await res.json();
      console.log("Fetched footer data:", footerData);
      
      // Ensure newsletter object exists
      if (!footerData.newsletter) {
        footerData.newsletter = {
          title: "Never Miss a Gift Moment",
          subtitle: "Get exclusive offers, new experience alerts, and gifting inspiration delivered to your inbox.",
        };
      }
      
      setData(footerData);
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load footer content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!data) return;

    try {
      setSaving(true);
      console.log("Sending data to API:", data);
      
      const res = await fetch("/api/footer-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();
      console.log("API Response:", responseData);

      if (!res.ok) {
        throw new Error(responseData.error || "Failed to save");
      }

      // Trigger immediate cache revalidation for all pages (footer appears on all)
      await Promise.all([
        fetch("/api/revalidate?path=/", { method: "POST" }),
        fetch("/api/revalidate?path=/about", { method: "POST" }),
        fetch("/api/revalidate?path=/perks", { method: "POST" }),
        fetch("/api/revalidate?path=/partner", { method: "POST" }),
        fetch("/api/revalidate?path=/contact", { method: "POST" }),
        fetch("/api/revalidate?path=/privacy", { method: "POST" }),
        fetch("/api/revalidate?path=/journal", { method: "POST" }),
      ]);

      toast({
        title: "Success",
        description: "Footer and nav content updated successfully!",
      });
      
      // Refresh the data to ensure it's synced with database
      await fetchData();
    } catch (error: any) {
      console.error("Save error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-[#e6b756]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#23272f]">Footer & Navigation</h1>
        <p className="text-[#6b7280] mt-2">Manage footer links and social media icons</p>
      </div>

      {/* Social Media Links Section */}
      <Card className="p-6 border border-[#e5e7eb]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#23272f]">Social Media Links</h2>
          <Button
            onClick={() => {
              setData({
                ...data,
                socialLinks: [
                  ...data.socialLinks,
                  { platform: "", url: "", icon: "Facebook" },
                ],
              });
            }}
            className="bg-[#e6b756] hover:bg-[#d4a543] text-[#1a2233]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Social Link
          </Button>
        </div>

        <div className="space-y-4">
          {data.socialLinks.map((link, idx) => (
            <div key={idx} className="p-4 bg-[#f5f3f0] rounded-lg border border-[#e5e7eb]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-[#23272f] mb-2">
                    Platform Name
                  </label>
                  <Input
                    value={link.platform}
                    onChange={(e) => {
                      const newLinks = [...data.socialLinks];
                      newLinks[idx].platform = e.target.value;
                      setData({ ...data, socialLinks: newLinks });
                    }}
                    placeholder="e.g., Facebook"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#23272f] mb-2">
                    Icon Type
                  </label>
                  <select
                    value={link.icon}
                    onChange={(e) => {
                      const newLinks = [...data.socialLinks];
                      newLinks[idx].icon = e.target.value;
                      setData({ ...data, socialLinks: newLinks });
                    }}
                    className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6b756]"
                  >
                    {ICON_OPTIONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#23272f] mb-2">
                    URL
                  </label>
                  <Input
                    value={link.url}
                    onChange={(e) => {
                      const newLinks = [...data.socialLinks];
                      newLinks[idx].url = e.target.value;
                      setData({ ...data, socialLinks: newLinks });
                    }}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  const newLinks = data.socialLinks.filter((_, i) => i !== idx);
                  setData({ ...data, socialLinks: newLinks });
                }}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Footer Links Section */}
      <Card className="p-6 border border-[#e5e7eb]">
        <h2 className="text-2xl font-bold text-[#23272f] mb-6">Footer Menu Links</h2>

        <div className="space-y-6">
          {data.footerLinks.map((section, sIdx) => (
            <div key={sIdx} className="p-4 bg-[#f5f3f0] rounded-lg border border-[#e5e7eb]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 mr-4">
                  <label className="block text-sm font-medium text-[#23272f] mb-2">
                    Section Title
                  </label>
                  <Input
                    value={section.section}
                    onChange={(e) => {
                      const newLinks = [...data.footerLinks];
                      newLinks[sIdx].section = e.target.value;
                      setData({ ...data, footerLinks: newLinks });
                    }}
                    placeholder="e.g., Product"
                  />
                </div>
              </div>

              <div className="space-y-3 ml-4 border-l-2 border-[#e6b756] pl-4">
                {section.links.map((link, lIdx) => (
                  <div key={lIdx} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-[#23272f] mb-1">
                        Label
                      </label>
                      <Input
                        value={link.label}
                        onChange={(e) => {
                          const newLinks = [...data.footerLinks];
                          newLinks[sIdx].links[lIdx].label = e.target.value;
                          setData({ ...data, footerLinks: newLinks });
                        }}
                        placeholder="Link label"
                      />
                    </div>

                    <div className="flex-1">
                      <label className="block text-xs font-medium text-[#23272f] mb-1">
                        URL
                      </label>
                      <Input
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = [...data.footerLinks];
                          newLinks[sIdx].links[lIdx].url = e.target.value;
                          setData({ ...data, footerLinks: newLinks });
                        }}
                        placeholder="/path or http://..."
                      />
                    </div>

                    <button
                      onClick={() => {
                        const newLinks = [...data.footerLinks];
                        newLinks[sIdx].links = newLinks[sIdx].links.filter(
                          (_, i) => i !== lIdx
                        );
                        setData({ ...data, footerLinks: newLinks });
                      }}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => {
                    const newLinks = [...data.footerLinks];
                    newLinks[sIdx].links.push({ label: "", url: "" });
                    setData({ ...data, footerLinks: newLinks });
                  }}
                  className="text-[#e6b756] hover:text-[#d4a543] text-sm font-medium flex items-center gap-1 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Link
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Copyright Text Section */}
      <Card className="p-6 border border-[#e5e7eb]">
        <h2 className="text-2xl font-bold text-[#23272f] mb-6">Copyright Text</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#23272f] mb-2">
              Copyright Text
            </label>
            <Input
              value={data.copyrightText || ""}
              onChange={(e) => {
                setData({ ...data, copyrightText: e.target.value });
              }}
              placeholder="e.g., © 2025 VentureNext. All rights reserved."
              className="w-full"
            />
            <p className="text-xs text-[#6b7280] mt-2">This text appears in the footer below the social links.</p>
          </div>
        </div>
      </Card>

      {/* Newsletter Section */}
      <Card className="p-6 border border-[#e5e7eb]">
        <h2 className="text-2xl font-bold text-[#23272f] mb-6">Newsletter Signup</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#23272f] mb-2">
              Newsletter Title
            </label>
            <Input
              value={data.newsletter?.title || ""}
              onChange={(e) => {
                setData({
                  ...data,
                  newsletter: {
                    ...data.newsletter,
                    title: e.target.value,
                    subtitle: data.newsletter?.subtitle || "",
                  },
                });
              }}
              placeholder="e.g., Never Miss a Gift Moment"
              className="w-full"
            />
            <p className="text-xs text-[#6b7280] mt-2">The main heading above the email input.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#23272f] mb-2">
              Newsletter Subtitle
            </label>
            <textarea
              value={data.newsletter?.subtitle || ""}
              onChange={(e) => {
                setData({
                  ...data,
                  newsletter: {
                    title: data.newsletter?.title || "",
                    subtitle: e.target.value,
                  },
                });
              }}
              placeholder="e.g., Get exclusive offers, new experience alerts, and gifting inspiration delivered to your inbox."
              className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6b756]"
              rows={3}
            />
            <p className="text-xs text-[#6b7280] mt-2">The descriptive text above the email input.</p>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => fetchData()}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#e6b756] hover:bg-[#d4a543] text-[#1a2233]"
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
