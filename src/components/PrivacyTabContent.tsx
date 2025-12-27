"use client";
import { useState, useEffect } from "react";
import { setMetaTags } from "@/lib/meta-tags";

interface Section {
  id: string;
  heading: string;
  slug: string;
  content: string;
}

interface ContentData {
  sections: Section[];
  seo?: {
    metaTitle: string;
    metaDescription: string;
  };
}

export default function PrivacyTabContent({ 
  initialPrivacy, 
  initialTerms 
}: { 
  initialPrivacy: ContentData | null; 
  initialTerms: ContentData | null;
}) {
  const [activeTab, setActiveTab] = useState<"privacy" | "terms">("privacy");

  useEffect(() => {
    const currentContent = activeTab === "privacy" ? initialPrivacy : initialTerms;
    if (currentContent?.seo) {
      setMetaTags(
        currentContent.seo.metaTitle,
        currentContent.seo.metaDescription
      );
    }
  }, [activeTab, initialPrivacy, initialTerms]);

  const currentContent = activeTab === "privacy" ? initialPrivacy : initialTerms;

  return (
    <main className="flex-1">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Tab Navigation */}
          <div className="grid grid-cols-2 gap-0 mb-8 rounded-lg overflow-hidden border border-[#e6b756]">
            {/* Terms of Service Tab */}
            <button
              onClick={() => setActiveTab("terms")}
              className={`py-3 font-semibold transition-all duration-300 ${
                activeTab === "terms"
                  ? "bg-[#e6b756] text-[#1a2233]"
                  : "bg-white text-[#1a2233] hover:bg-[#f5d488]"
              }`}
            >
              Terms of Service
            </button>

            {/* Privacy Policy Tab */}
            <button
              onClick={() => setActiveTab("privacy")}
              className={`py-3 font-semibold transition-all duration-300 border-l border-[#e6b756] ${
                activeTab === "privacy"
                  ? "bg-[#e6b756] text-[#1a2233]"
                  : "bg-white text-[#1a2233] hover:bg-[#f5d488]"
              }`}
            >
              Privacy Policy
            </button>
          </div>

          {/* Content Card */}
          {currentContent?.sections && currentContent.sections.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Content */}
              <div className="p-8 md:p-12">
                <div className="mb-8 pb-8 border-b border-gray-200">
                  <p className="text-sm font-semibold text-yellow-600 uppercase tracking-wider mb-2">
                    {activeTab === "privacy" ? "Privacy Policy" : "Terms of Service"}
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    {activeTab === "privacy" 
                      ? "Your Privacy Matters"
                      : "Our Terms & Conditions"
                    }
                  </h2>
                  <p className="text-lg text-gray-600">
                    {activeTab === "privacy"
                      ? "Learn how we collect, use, and protect your personal information"
                      : "Please review these terms carefully before using our services"
                    }
                  </p>
                </div>

                {/* Sections */}
                <div className="space-y-8">
                  {currentContent.sections.map((section, index) => (
                    <div key={section.id} className="scroll-mt-20">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-yellow-100">
                            <span className="text-yellow-600 font-bold">{index + 1}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {section.heading}
                          </h3>
                        </div>
                      </div>
                      <div className="ml-14 text-gray-700 leading-relaxed space-y-4 prose prose-sm max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: section.content }} />
                      </div>
                      {index < currentContent.sections.length - 1 && (
                        <div className="mt-8 pt-8 border-t border-gray-100" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer Info */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleDateString()} • If you have any questions, please contact us
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <p className="text-muted-foreground">
                No {activeTab === "privacy" ? "privacy policy" : "terms of service"} content available.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
