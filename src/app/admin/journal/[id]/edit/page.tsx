"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/journal/RichTextEditor";
import { ImageUpload } from "@/components/journal/ImageUpload";
import { useJournal, useUpdateJournal } from "@/hooks/useJournals";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

interface EditPostProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditPost({ params }: EditPostProps) {
  const router = useRouter();
  const { toast } = useToast();
  const resolvedParams = React.use(params);
  const { data: journal, isLoading: isLoadingJournal } = useJournal(resolvedParams.id);
  const updateJournalMutation = useUpdateJournal(journal?.id || "");
  
  const [tab, setTab] = useState<"content" | "seo">("content");
  const [isClient, setIsClient] = useState(false);
  const [contentValue, setContentValue] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [readTime, setReadTime] = useState("5 min read");
  const [isFeatured, setIsFeatured] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    featured_image_url: "",
    author: "Admin",
    category: "",
    publish_date: new Date().toISOString().split("T")[0],
    meta_title: "",
    meta_description: "",
    keywords: "",
    og_image_url: "",
    canonical_url: "",
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Populate form when journal loads
  useEffect(() => {
    if (journal && isClient) {
      setFormData({
        title: journal.title || "",
        slug: journal.slug || "",
        excerpt: journal.excerpt || "",
        featured_image_url: journal.featured_image_url || "",
        author: journal.author || "Admin",
        category: journal.category || "",
        publish_date: journal.publish_date?.split("T")[0] || new Date().toISOString().split("T")[0],
        meta_title: journal.meta_title || "",
        meta_description: journal.meta_description || "",
        keywords: journal.keywords || "",
        og_image_url: journal.og_image_url || "",
        canonical_url: journal.canonical_url || "",
      });
      setContentValue(journal.content || "");
      setTags(journal.tags || []);
      setReadTime(journal.read_time || "5 min read");
      setIsFeatured(journal.is_featured || false);
    }
  }, [journal, isClient]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.slug || !contentValue) {
      toast({
        title: "Validation Error",
        description: "Please fill in title, slug, and content",
        variant: "destructive",
      });
      return;
    }

    if (!journal) {
      toast({
        title: "Error",
        description: "Journal not found",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateJournalMutation.mutateAsync({
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: contentValue,
        featured_image_url: formData.featured_image_url,
        author: formData.author,
        category: formData.category,
        tags,
        status: "published",
        publish_date: formData.publish_date,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        keywords: formData.keywords,
        og_image_url: formData.og_image_url,
        canonical_url: formData.canonical_url,
        read_time: readTime,
        is_featured: isFeatured,
      });

      toast({
        title: "Success",
        description: "Journal updated and published successfully!",
      });

      router.push("/admin/journal");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update journal",
        variant: "destructive",
      });
    }
  };

  const handleSaveDraft = async () => {
    if (!formData.title || !formData.slug || !contentValue) {
      toast({
        title: "Validation Error",
        description: "Please fill in title, slug, and content",
        variant: "destructive",
      });
      return;
    }

    if (!journal) {
      toast({
        title: "Error",
        description: "Journal not found",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateJournalMutation.mutateAsync({
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: contentValue,
        featured_image_url: formData.featured_image_url,
        author: formData.author,
        category: formData.category,
        tags,
        status: "draft",
        publish_date: formData.publish_date,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        keywords: formData.keywords,
        og_image_url: formData.og_image_url,
        canonical_url: formData.canonical_url,
        read_time: readTime,
        is_featured: isFeatured,
      });

      toast({
        title: "Success",
        description: "Journal saved as draft!",
      });

      router.push("/admin/journal");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save draft",
        variant: "destructive",
      });
    }
  };

  // Loading state
  if (!isClient || isLoadingJournal) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading journal...</p>
        </div>
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-destructive mb-4">Journal not found</p>
          <Button onClick={() => router.push("/admin/journal")}>
            Back to Journals
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-6 text-gray-500">
        <span
          className="text-2xl font-bold text-[#23272f] cursor-pointer hover:text-[#e6b756]"
          onClick={() => router.back()}
        >
          &#8592;
        </span>
        <span className="text-sm cursor-pointer hover:text-[#e6b756]" onClick={() => router.back()}>Back</span>
        <h1 className="text-2xl font-bold ml-4 text-[#23272f]">Edit Post</h1>
      </div>

      <div className="flex gap-8">
        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex gap-4 mb-4">
              <Button
                variant={tab === "content" ? "default" : "ghost"}
                className="px-4 py-2"
                onClick={() => setTab("content")}
              >
                Content
              </Button>
              <Button
                variant={tab === "seo" ? "default" : "ghost"}
                className="px-4 py-2"
                onClick={() => setTab("seo")}
              >
                SEO
              </Button>
            </div>

            {tab === "content" && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Title *
                  </label>
                  <Input
                    placeholder="Enter post title"
                    value={formData.title}
                    onChange={handleTitleChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Slug
                  </label>
                  <Input
                    placeholder="post-url-slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    URL: /journal/{formData.slug}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Excerpt
                  </label>
                  <Textarea
                    placeholder="Brief summary for listings and previews"
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Content *
                  </label>
                  <RichTextEditor
                    value={contentValue}
                    onChange={setContentValue}
                    placeholder="Write your post content here..."
                  />
                </div>
              </>
            )}

            {tab === "seo" && (
              <div className="bg-white rounded-xl shadow-sm">
                <h2 className="text-xl font-bold mb-4">SEO Settings</h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Meta Title
                  </label>
                  <Input
                    placeholder="SEO title (max 60 chars)"
                    maxLength={60}
                    value={formData.meta_title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        meta_title: e.target.value,
                      })
                    }
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    {formData.meta_title.length}/60 characters
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Meta Description
                  </label>
                  <Textarea
                    placeholder="SEO description (max 160 chars)"
                    maxLength={160}
                    value={formData.meta_description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        meta_description: e.target.value,
                      })
                    }
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    {formData.meta_description.length}/160 characters
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Keywords
                  </label>
                  <Input
                    placeholder="keyword1, keyword2, keyword3"
                    value={formData.keywords}
                    onChange={(e) =>
                      setFormData({ ...formData, keywords: e.target.value })
                    }
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    OG Image URL
                  </label>
                  <Input
                    placeholder="Social share image URL"
                    value={formData.og_image_url}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        og_image_url: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Canonical URL
                  </label>
                  <Input
                    placeholder="https://yoursite.com/journal/post-slug"
                    value={formData.canonical_url}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        canonical_url: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-96 flex flex-col gap-6">
          <div className="flex gap-2 justify-end mb-6">
            <Button
              variant="outline"
              className="px-6 py-2 rounded-full"
              onClick={handleSaveDraft}
              disabled={updateJournalMutation.isPending}
            >
              Save Draft
            </Button>
            <Button
              className="bg-[#e6b756] text-[#1a2233] px-6 py-2 rounded-full hover:bg-[#d4a645]"
              onClick={handlePublish}
              disabled={updateJournalMutation.isPending}
            >
              {updateJournalMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="font-semibold mb-4">Featured Image</div>
            <ImageUpload
              value={formData.featured_image_url}
              onChange={(url) =>
                setFormData({ ...formData, featured_image_url: url })
              }
              onRemove={() =>
                setFormData({ ...formData, featured_image_url: "" })
              }
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="font-semibold mb-2">Details</div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Author</label>
              <Input
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Category
              </label>
              <Input
                placeholder="e.g., Remote Work, Technology"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Publish Date
              </label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.publish_date}
                onChange={(e) =>
                  setFormData({ ...formData, publish_date: e.target.value })
                }
              />
            </div>

            <div className="mb-3 flex items-center justify-between">
              <label className="block text-sm font-medium">Featured</label>
              <Switch
                checked={isFeatured}
                onCheckedChange={setIsFeatured}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Read Time
              </label>
              <Input
                placeholder="e.g., 5 min read"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Tags</label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTag}
                  className="px-4"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#e6b756] text-[#1a2233] px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
