"use client";

import { use } from "react";
import { useJournal } from "@/hooks/useJournals";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, Clock, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function JournalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { data: journal, isLoading, error } = useJournal(slug);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !journal) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#1a2233] mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
            <Link href="/journal">
              <button className="bg-[#e6b756] text-[#1a2233] px-6 py-2 rounded-full font-medium hover:bg-[#d4a645]">
                Back to Journal
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <article className="bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-[#f5f3f0] to-white">
          <div className="container mx-auto px-4 py-8 lg:py-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#e6b756] hover:text-[#d4a645] font-medium mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="max-w-3xl mx-auto">
              {/* Category Badge */}
              <div className="inline-block px-4 py-1 bg-[#e6b756] text-[#1a2233] rounded-full text-xs font-semibold mb-6 uppercase tracking-wide">
                {journal.category || "Article"}
              </div>

              {/* Title */}
              <h1 className="text-4xl lg:text-5xl font-bold text-[#1a2233] mb-6 leading-tight">
                {journal.title}
              </h1>

              {/* Article Metadata */}
              <div className="flex flex-col gap-6 py-6 border-t border-b border-gray-200">
                {/* Author and Role */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-[#1a2233]">{journal.author || "Admin"}</p>
                    <p className="text-sm text-gray-500">Content Creator</p>
                  </div>
                </div>

                {/* Date, Read Time, and Share */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">📅</span>
                      <span>{formatDate(journal.publish_date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{journal.read_time || "5 min read"}</span>
                    </div>
                  </div>

                  {/* Share Buttons */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 font-medium">Share</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const url = `${window.location.origin}/journal/${slug}`;
                          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                        }}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        title="Share on Facebook"
                      >
                        <Facebook className="w-5 h-5 text-[#1877F2]" />
                      </button>
                      <button
                        onClick={() => {
                          const url = `${window.location.origin}/journal/${slug}`;
                          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(journal.title)}`, '_blank');
                        }}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        title="Share on Twitter"
                      >
                        <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                      </button>
                      <button
                        onClick={() => {
                          const url = `${window.location.origin}/journal/${slug}`;
                          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
                        }}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        title="Share on LinkedIn"
                      >
                        <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Excerpt */}
          {journal.excerpt && (
            <div className="container mx-auto px-4 py-8 lg:py-12">
              <div className="max-w-3xl mx-auto">
                <p className="text-xl text-gray-700 italic mb-8 pb-8 border-b border-gray-200 leading-relaxed">
                  {journal.excerpt}
                </p>
              </div>
            </div>
          )}

          {/* Featured Image */}
          {journal.featured_image_url && (
            <div className="container mx-auto px-4 py-8 lg:py-12">
              <div className="max-w-3xl mx-auto overflow-hidden rounded-lg shadow-md">
                <img
                  src={journal.featured_image_url}
                  alt={journal.title}
                  className="w-full h-96 lg:h-96 object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="max-w-3xl mx-auto">

            {/* Main Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <div
                className="rich-text-content text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: journal.content }}
              />
            </div>

            {/* Divider */}
            <div className="my-12 border-t border-gray-200"></div>

            {/* Tags */}
            {journal.tags && journal.tags.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Tags</h3>
                <div className="flex flex-wrap gap-3">
                  {journal.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#1a2233] mb-2">Share this article</h3>
                  <p className="text-sm text-gray-600">Help others discover this content</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/journal/${slug}`;
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                    }}
                    className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                    title="Share on Facebook"
                  >
                    <Facebook className="w-6 h-6 text-[#1877F2]" />
                  </button>
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/journal/${slug}`;
                      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(journal.title)}`, '_blank');
                    }}
                    className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                    title="Share on Twitter"
                  >
                    <Twitter className="w-6 h-6 text-[#1DA1F2]" />
                  </button>
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/journal/${slug}`;
                      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
                    }}
                    className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                    title="Share on LinkedIn"
                  >
                    <Linkedin className="w-6 h-6 text-[#0A66C2]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
}
