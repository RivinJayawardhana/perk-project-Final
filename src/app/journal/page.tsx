"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useJournals } from "@/hooks/useJournals";

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    "Remote Work": "bg-blue-100 text-blue-800",
    "Lifestyle": "bg-green-100 text-green-800",
    "Technology": "bg-purple-100 text-purple-800",
    "Business": "bg-orange-100 text-orange-800",
    "Funding": "bg-red-100 text-red-800",
    "Productivity": "bg-yellow-100 text-yellow-800",
    "Marketing": "bg-pink-100 text-pink-800",
    "Leadership": "bg-indigo-100 text-indigo-800",
    "Growth": "bg-emerald-100 text-emerald-800",
  };
  return colors[category] || "bg-gray-100 text-gray-800";
};

export default function JournalPage() {
  // Fetch up to 50 published journals dynamically
  const { data: journals = [], isLoading } = useJournals("published", 50);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 12;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Logic for Dynamic Articles
  const featuredPost = journals.find((j) => j.is_featured) || journals[0]; // Find featured post or use first
  const allArticles = journals.filter((j) => j.id !== featuredPost?.id); // Exclude featured from grid
  
  const totalPages = Math.ceil(allArticles.length / articlesPerPage);

  const getCurrentArticles = () => {
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    return allArticles.slice(startIndex, endIndex);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="bg-[#fcfaf7] min-h-screen">
          <section className="py-12 sm:py-16 bg-[#f5f3f0]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[#6b6f76]">
              Loading articles...
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  // Handle empty state if no journals exist in the database
  if (journals.length === 0) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#f5f3f0]">
          <h2 className="text-2xl font-bold text-slate-900">No articles found</h2>
          <p className="text-gray-600 mt-2">Check back later for new stories.</p>
        </div>
        <Footer />
      </>
    );
  }

  const currentArticles = getCurrentArticles();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        {/* Dynamic Featured Article Section */}
        {featuredPost && (
          <section className="bg-[#faf8f6] py-12 sm:py-16 lg:py-20 border-b">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
                <Link href={`/journal/${featuredPost.id}`} className="block relative">
                  <img
                    src={featuredPost.featured_image_url || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23e5e7eb' width='600' height='400'/%3E%3C/svg%3E"}
                    alt={featuredPost.title}
                    className="rounded-xl object-cover w-full h-64 sm:h-72 md:h-80 lg:h-96 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-400 text-black">
                      Featured
                    </span>
                  </div>
                </Link>

                <div className="space-y-4 sm:space-y-5">
                  <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold">
                      {featuredPost.category || "Uncategorized"}
                    </span>
                    <span className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                      <Clock className="w-3 sm:w-4 h-3 sm:h-4" />
                      {featuredPost.read_time || "5 min read"}
                    </span>
                  </div>
                  
                  <Link href={`/journal/${featuredPost.id}`} className="block hover:text-amber-500 transition-colors">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-slate-900 cursor-pointer">
                      {featuredPost.title}
                    </h1>
                  </Link>
                  
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-2 pt-2 sm:pt-4">
                    <span className="text-xs sm:text-sm text-gray-600">
                      By <span className="font-semibold text-slate-900">{featuredPost.author || "Admin"}</span>
                    </span>
                    <span className="text-xs text-gray-400">
                      • {formatDate(featuredPost.publish_date)}
                    </span>
                  </div>
                  
                  <Link href={`/journal/${featuredPost.id}`}>
                    <span className="inline-block text-amber-500 hover:text-amber-600 font-semibold text-base sm:text-lg cursor-pointer">
                      Read article →
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Dynamic Grid Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-[#f5f3f0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 sm:mb-12">Latest Articles</h2>

            {allArticles.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
                  {currentArticles.map((article: any) => (
                    <Link key={article.id} href={`/journal/${article.id}`}>
                      <div className="group cursor-pointer h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        <div className="p-4 sm:p-5 flex flex-col flex-grow">
                          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                            <span className="truncate">{article.author || "Admin"}</span>
                            <span className="flex items-center gap-1 flex-shrink-0">
                              <Clock className="w-3 h-3" />
                              {article.read_time || "5 min read"}
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3">
                            {article.excerpt}
                          </p>

                          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 group-hover:text-amber-500 transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                        </div>

                        <div className="relative overflow-hidden">
                          <img
                            src={article.featured_image_url || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250'%3E%3Crect fill='%23e5e7eb' width='400' height='250'/%3E%3C/svg%3E"}
                            alt={article.title}
                            className="w-full h-40 sm:h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                            <span className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${getCategoryColor(article.category)}`}>
                              {article.category || "General"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-8 border-t">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-slate-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm w-full sm:w-auto"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>

                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`w-9 sm:w-10 h-9 sm:h-10 rounded-lg font-semibold transition-colors text-sm ${
                            currentPage === page
                              ? "bg-amber-400 text-black"
                              : "border border-gray-300 text-slate-900 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-slate-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm w-full sm:w-auto"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-gray-500">No additional articles available.</p>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}