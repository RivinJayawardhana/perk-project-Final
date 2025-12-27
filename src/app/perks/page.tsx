"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePerks } from "@/hooks/usePerks";
import { useCategories } from "@/hooks/useCategories";
import { useSubcategories } from "@/hooks/useSubcategories";
import { LeadFormModal } from "@/components/perks/LeadFormModal";
import { useLeadForm } from "@/hooks/useLeadForms";
import { useSubmitLead } from "@/hooks/useLeadForms";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { setMetaTags } from "@/lib/meta-tags";

interface PerksPageContent {
  hero: {
    subtitle?: string;
    title: string;
    description: string;
  };
}

interface DisplayPerk {
  id: string;
  company: string;
  logo: string;
  image: string;
  category: string;
  subcategory?: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  location: string;
  dealTypes: string[];
  bestFor: string[];
  featured?: boolean;
  deal_type?: string;
  deal_url?: string;
}

// Transform API perk data to display format
const transformPerkData = (apiPerk: any): DisplayPerk => {
  return {
    id: apiPerk.id,
    company: apiPerk.name || "Unknown",
    logo: apiPerk.logo_url || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%23e5e7eb' width='40' height='40'/%3E%3C/svg%3E",
    image: apiPerk.image_url || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
    category: apiPerk.category || "Uncategorized",
    subcategory: apiPerk.subcategory || undefined,
    title: apiPerk.discount || "Special Offer",
    description: apiPerk.description || "Great deal for founders",
    discount: apiPerk.discount || "Special",
    validUntil: apiPerk.expiry ? new Date(apiPerk.expiry).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "No expiry",
    location: apiPerk.location || "Global",
    dealTypes: apiPerk.deal_type ? apiPerk.deal_type.split(", ").filter((t: string) => t) : [],
    bestFor: apiPerk.best_for ? apiPerk.best_for.split(", ").filter((b: string) => b) : [],
    featured: false,
    deal_type: apiPerk.deal_type,
    deal_url: apiPerk.deal_url,
  };
};

// Static filter options - will be replaced with dynamic options
const dealTypeLabels = ["Free trial", "Discount", "Credits included", "Free consultation", "Free perks / Add-ons", "Bundle deal", "Exclusive deal", "Intro/First-time offer"];
const locationLabels = ["Malaysia", "Singapore", "Global"];
const bestForLabels = ["Solopreneurs", "Startups", "SMEs", "Agencies", "Enterprises"];

export default function Perks() {
  const { data: apiPerks = [], isLoading } = usePerks();
  const { data: categoriesData = [] } = useCategories();
  const { data: subcategoriesData = [] } = useSubcategories();
  const { toast } = useToast();
  const submitLeadMutation = useSubmitLead();
  
  const [pageContent, setPageContent] = useState<PerksPageContent | null>(null);
  const [contentLoading, setContentLoading] = useState(true);
  const [mockPerks, setMockPerks] = useState<DisplayPerk[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<Array<{label: string, count: number}>>([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState<Record<string, Array<{label: string, count: number}>>>({});
  const [dealTypeOptions, setDealTypeOptions] = useState<Array<{label: string, count: number}>>([]);
  const [locationOptions, setLocationOptions] = useState<Array<{label: string, count: number}>>([]);
  const [bestForOptions, setBestForOptions] = useState<Array<{label: string, count: number}>>([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDealTypes, setSelectedDealTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedBestFor, setSelectedBestFor] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [filteredPerks, setFilteredPerks] = useState<DisplayPerk[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 12;
  
  // Lead form modal state
  const [leadFormModal, setLeadFormModal] = useState<{ isOpen: boolean; perkId: string | null }>({
    isOpen: false,
    perkId: null,
  });
  const { data: currentLeadForm } = useLeadForm(leadFormModal.perkId);
  
  const [couponModal, setCouponModal] = useState<{ isOpen: boolean; code: string }>({
    isOpen: false,
    code: "",
  });
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  
  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const res = await fetch("/api/perks-content");
        if (res.ok) {
          const data = await res.json();
          setPageContent(data);
          // Set meta tags when content loads
          if (data.seo) {
            setMetaTags(data.seo.metaTitle, data.seo.metaDescription);
          }
        }
      } catch (error) {
        console.error("Error fetching perks page content:", error);
      } finally {
        setContentLoading(false);
      }
    };

    fetchPageContent();
  }, []);

  // Transform API perks to display format when data loads
  useEffect(() => {
    if (apiPerks && apiPerks.length > 0) {
      const transformed = apiPerks.map(transformPerkData);
      setMockPerks(transformed);
      setFilteredPerks(transformed);
    }
  }, [apiPerks]);

  // Build dynamic category options from fetched data
  useEffect(() => {
    if (categoriesData && categoriesData.length > 0 && mockPerks.length > 0) {
      const options = categoriesData.map((cat: any) => {
        // Count perks in this category
        const count = mockPerks.filter(perk => perk.category === cat.name).length;
        return {
          label: cat.name,
          count: count
        };
      });
      setCategoryOptions(options);
    }
  }, [categoriesData, mockPerks]);

  // Build dynamic subcategory options grouped by category
  useEffect(() => {
    if (subcategoriesData && subcategoriesData.length > 0 && categoriesData && categoriesData.length > 0 && mockPerks.length > 0) {
      const grouped: Record<string, Array<{label: string, count: number}>> = {};
      
      // Group subcategories by category name
      categoriesData.forEach((cat: any) => {
        grouped[cat.name] = subcategoriesData
          .filter((sub: any) => sub.category_id === cat.id)
          .map((sub: any) => {
            // Count perks in this subcategory
            const count = mockPerks.filter(perk => perk.subcategory === sub.id || perk.subcategory === sub.name).length;
            return {
              label: sub.name,
              count: count
            };
          });
      });
      
      setSubcategoryOptions(grouped);
    }
  }, [subcategoriesData, categoriesData, mockPerks]);

  // Build dynamic deal type options
  useEffect(() => {
    if (mockPerks.length > 0) {
      const options = dealTypeLabels.map((label) => {
        const count = mockPerks.filter(perk => 
          perk.dealTypes.some(type => type.toLowerCase().includes(label.toLowerCase()))
        ).length;
        return { label, count };
      });
      setDealTypeOptions(options);
    }
  }, [mockPerks]);

  // Build dynamic location options
  useEffect(() => {
    if (mockPerks.length > 0) {
      const options = locationLabels.map((label) => {
        const count = mockPerks.filter(perk => perk.location === label).length;
        return { label, count };
      });
      setLocationOptions(options);
    }
  }, [mockPerks]);

  // Build dynamic best for options
  useEffect(() => {
    if (mockPerks.length > 0) {
      const options = bestForLabels.map((label) => {
        const count = mockPerks.filter(perk => 
          perk.bestFor.some(best => best.toLowerCase().includes(label.toLowerCase()))
        ).length;
        return { label, count };
      });
      setBestForOptions(options);
    }
  }, [mockPerks]);

  const handleFilter = () => {
    let filtered = mockPerks;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Deal Type filter
    if (selectedDealTypes.length > 0) {
      filtered = filtered.filter(p => 
        p.dealTypes.some(type => 
          selectedDealTypes.some(selected => 
            type.toLowerCase().includes(selected.toLowerCase()) || 
            selected.toLowerCase().includes(type.toLowerCase())
          )
        )
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    // Location filter
    if (selectedLocations.length > 0) {
      filtered = filtered.filter(p => selectedLocations.includes(p.location));
    }

    // Best For filter
    if (selectedBestFor.length > 0) {
      filtered = filtered.filter(p => 
        p.bestFor.some(best => 
          selectedBestFor.some(selected => 
            best.toLowerCase().includes(selected.toLowerCase()) || 
            selected.toLowerCase().includes(best.toLowerCase())
          )
        )
      );
    }

    // Subcategory filter (only if category is selected)
    if (selectedSubcategories.length > 0 && selectedCategories.length > 0) {
      filtered = filtered.filter(p => 
        p.subcategory && selectedSubcategories.includes(p.subcategory)
      );
    }

    setFilteredPerks(filtered);
    setCurrentPage(0); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedDealTypes([]);
    setSelectedCategories([]);
    setSelectedLocations([]);
    setSelectedBestFor([]);
    setSelectedSubcategories([]);
    setCurrentPage(0);
    setFilteredPerks(mockPerks);
  };

  // Update filtered perks when any filter changes
  useEffect(() => {
    handleFilter();
  }, [selectedDealTypes, selectedCategories, selectedLocations, selectedBestFor, selectedSubcategories, searchTerm, mockPerks]);

  const handleDealTypeChange = (dealType: string) => {
    setSelectedDealTypes(prev =>
      prev.includes(dealType)
        ? prev.filter(t => t !== dealType)
        : [...prev, dealType]
    );
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    // Clear subcategories when category changes
    if (!selectedCategories.includes(category)) {
      setSelectedSubcategories([]);
    }
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocations(prev =>
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const handleBestForChange = (bestFor: string) => {
    setSelectedBestFor(prev =>
      prev.includes(bestFor)
        ? prev.filter(b => b !== bestFor)
        : [...prev, bestFor]
    );
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategories(prev =>
      prev.includes(subcategory)
        ? prev.filter(s => s !== subcategory)
        : [...prev, subcategory]
    );
  };

  // Get active filters count
  const activeFiltersCount = 
    selectedDealTypes.length + 
    selectedCategories.length + 
    selectedLocations.length + 
    selectedBestFor.length + 
    selectedSubcategories.length;

  const handleGetDeal = (perk: DisplayPerk) => {
    // Update browser title with perk details
    const title = `${perk.company} | ${perk.category} | VentureNext`;
    document.title = title;
    
    // Check if perk is using lead form (no deal_url or deal_url is empty)
    const isLeadForm = !perk.deal_url || perk.deal_url.trim() === "";
    
    if (isLeadForm) {
      // Handle lead form
      setLeadFormModal({ isOpen: true, perkId: perk.id });
    } else if (perk.deal_url) {
      // Check if it's a URL (affiliate) or a code (coupon)
      const isUrl = perk.deal_url.startsWith("http://") || perk.deal_url.startsWith("https://");
      
      if (isUrl) {
        // Handle affiliate link - open in new tab without popup
        window.open(perk.deal_url, "_blank");
      } else {
        // Handle coupon code
        setCouponModal({
          isOpen: true,
          code: perk.deal_url,
        });
      }
    } else {
      toast({
        title: "Get Deal",
        description: "Deal information",
      });
    }
  };

  const handleLeadFormSubmit = async (formData: Record<string, any>) => {
    if (!leadFormModal.perkId || !currentLeadForm) return;

    try {
      await submitLeadMutation.mutateAsync({
        perk_id: leadFormModal.perkId,
        lead_form_id: currentLeadForm.id,
        form_data: formData,
        email_address: formData.email || "",
        recaptchaToken: formData.recaptchaToken || "",
      });
      
      toast({
        title: "Success!",
        description: "Your information has been submitted.",
      });
      
      // Reset title when modal closes
      document.title = "VentureNext - Exclusive Perks for Ambitious Founders";
      setLeadFormModal({ isOpen: false, perkId: null });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Header />
      <main className="bg-[#fcfaf7] min-h-screen">
{/* Hero Section - Dynamic */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#faf8f6]">
        <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          {pageContent?.hero?.subtitle && <div className="text-[#e6b756] font-semibold mb-2 text-sm sm:text-base font-display">{pageContent.hero.subtitle}</div>}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#23272f] mb-4 sm:mb-6 font-display">{pageContent?.hero?.title || "Browse Our Exclusive Perks"}</h1>
          <p className="text-sm sm:text-base md:text-lg text-[#6b6f76]">{pageContent?.hero?.description || "Discover exclusive deals and perks designed for startup teams and founders."}</p>
        </div>
      </section>
        
        {isLoading && (
          <section className="py-12 sm:py-16 bg-[#f5f3f0]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[#6b6f76]">
              Loading exclusive deals...
            </div>
          </section>
        )}

        {!isLoading && (
          <>
            {/* Perks Grid with Filters */}
            <section className="py-8 sm:py-12 bg-[#f5f3f0]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Filters Sidebar */}
                <aside className="w-full lg:w-80 bg-white rounded-2xl shadow-sm p-4 sm:p-6 h-fit hidden lg:block">
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <div className="font-bold text-base sm:text-lg text-[#23272f] font-display">
                      {filteredPerks.length} deals found
                    </div>
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={handleClearFilters}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>

                  {/* Search */}
                  <div className="mb-4 sm:mb-6">
                    <Input
                      placeholder="Search deals..."
                      value={searchTerm}
                      onChange={e => {
                        setSearchTerm(e.target.value);
                        setTimeout(handleFilter, 0);
                      }}
                      className="rounded-lg border-gray-200"
                    />
                  </div>

                  {/* Deal Type Section */}
                  <div className="mb-6 sm:mb-8">
                    <h3 className="font-semibold text-[#23272f] mb-3 sm:mb-4 text-sm sm:text-base font-display">Deal Type</h3>
                    <div className="space-y-3">
                      {dealTypeOptions.map((option) => (
                        <label key={option.label} className="flex items-center justify-between cursor-pointer group">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedDealTypes.includes(option.label)}
                              onCheckedChange={() => handleDealTypeChange(option.label)}
                              className="rounded border-gray-300 data-[state=checked]:bg-[#e6b756] data-[state=checked]:border-[#e6b756]"
                            />
                            <span className="text-sm text-[#6b6f76] group-hover:text-[#23272f]">
                              {option.label}
                            </span>
                          </div>
                          <span className="text-xs text-[#8a8e9a] bg-gray-100 px-2 py-0.5 rounded">
                            {option.count}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <hr className="my-6 border-gray-200" />

                  {/* Category Section */}
                  <div className="mb-6 sm:mb-8">
                    <h3 className="font-semibold text-[#23272f] mb-3 sm:mb-4 text-sm sm:text-base font-display">Category</h3>
                    <div className="space-y-3">
                      {categoryOptions.map((option) => (
                        <label key={option.label} className="flex items-center justify-between cursor-pointer group">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedCategories.includes(option.label)}
                              onCheckedChange={() => handleCategoryChange(option.label)}
                              className="rounded border-gray-300 data-[state=checked]:bg-[#e6b756] data-[state=checked]:border-[#e6b756]"
                            />
                            <span className="text-sm text-[#6b6f76] group-hover:text-[#23272f]">
                              {option.label}
                            </span>
                          </div>
                          <span className="text-xs text-[#8a8e9a] bg-gray-100 px-2 py-0.5 rounded">
                            {option.count}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Subcategory Section (only shown if category is selected) */}
                  {selectedCategories.length > 0 && selectedCategories.map(category => (
                    subcategoryOptions[category] && (
                      <div key={category} className="mb-6 ml-4 border-l border-gray-200 pl-4">
                        <h4 className="font-medium text-sm text-[#6b6f76] mb-3 font-display">Goals</h4>
                        <div className="space-y-2">
                          {subcategoryOptions[category].map((subOption) => (
                            <label key={subOption.label} className="flex items-center justify-between cursor-pointer group">
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={selectedSubcategories.includes(subOption.label)}
                                  onCheckedChange={() => handleSubcategoryChange(subOption.label)}
                                  className="rounded border-gray-300 data-[state=checked]:bg-[#e6b756] data-[state=checked]:border-[#e6b756]"
                                />
                                <span className="text-xs text-[#6b6f76] group-hover:text-[#23272f]">
                                  {subOption.label}
                                </span>
                              </div>
                              <span className="text-xs text-[#8a8e9a]">
                                {subOption.count}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )
                  ))}

                  {/* Location Section */}
                  <div className="mb-6 sm:mb-8">
                    <h3 className="font-semibold text-[#23272f] mb-3 sm:mb-4 text-sm sm:text-base font-display">Location</h3>
                    <div className="space-y-3">
                      {locationOptions.map((option) => (
                        <label key={option.label} className="flex items-center justify-between cursor-pointer group">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedLocations.includes(option.label)}
                              onCheckedChange={() => handleLocationChange(option.label)}
                              className="rounded border-gray-300 data-[state=checked]:bg-[#e6b756] data-[state=checked]:border-[#e6b756]"
                            />
                            <span className="text-sm text-[#6b6f76] group-hover:text-[#23272f]">
                              {option.label}
                            </span>
                          </div>
                          <span className="text-xs text-[#8a8e9a] bg-gray-100 px-2 py-0.5 rounded">
                            {option.count}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <hr className="my-6 border-gray-200" />

                  {/* Best For Section */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-[#23272f] mb-3 sm:mb-4 text-sm sm:text-base font-display">Best For</h3>
                    <div className="space-y-3">
                      {bestForOptions.map((option) => (
                        <label key={option.label} className="flex items-center justify-between cursor-pointer group">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedBestFor.includes(option.label)}
                              onCheckedChange={() => handleBestForChange(option.label)}
                              className="rounded border-gray-300 data-[state=checked]:bg-[#e6b756] data-[state=checked]:border-[#e6b756]"
                            />
                            <span className="text-sm text-[#6b6f76] group-hover:text-[#23272f]">
                              {option.label}
                            </span>
                          </div>
                          <span className="text-xs text-[#8a8e9a] bg-gray-100 px-2 py-0.5 rounded">
                            {option.count}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </aside>

                {/* Mobile Filters Button */}
                <div className="lg:hidden mb-4 w-full">
                  <Button className="w-full bg-white border border-gray-200 text-[#23272f] hover:bg-gray-50">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filters ({activeFiltersCount})
                  </Button>
                </div>

                {/* Perks Grid */}
                <div className="flex-1 w-full">
                  {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                          <div className="w-full h-40 sm:h-48 bg-gray-200 animate-pulse"></div>
                          <div className="p-3 sm:p-4 space-y-3">
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                            <div className="flex gap-2">
                              <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                              <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                        {filteredPerks.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE).map((perk) => (
                          <div key={perk.id} className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                            <div className="relative">
                              <img src={perk.image} alt={perk.title} className="w-full h-40 sm:h-48 object-cover" />
                              <span className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-[#e6b756] text-[#23272f] px-3 sm:px-4 py-1 sm:py-2 rounded-full font-bold text-sm sm:text-base font-display">
                                {perk.discount}
                              </span>
                            </div>
                            <div className="p-4 sm:p-5 flex flex-col h-full">
                              {/* Company & Category */}
                              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold font-display flex-shrink-0">
                                  {perk.company.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-xs sm:text-sm text-[#6b6f76]">{perk.company}</span>
                                  <span className="text-xs text-[#6b6f76]">{perk.category}{perk.subcategory ? ` • ${perk.subcategory}` : ""}</span>
                                </div>
                              </div>

                              {/* Title */}
                              <h3 className="font-semibold text-[#23272f] mb-2 text-sm sm:text-base font-display line-clamp-2">{perk.title}</h3>

                              {/* Description */}
                              <p className="text-[#6b6f76] text-xs sm:text-sm mb-4 sm:mb-6 flex-1">{perk.description}</p>

                              {/* Valid Until Date */}
                              {perk.validUntil && (
                                <div className="text-xs sm:text-sm text-[#6b6f76] mb-4 flex items-center gap-2">
                                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                                    <path d="M16 2v4M8 2v4M3 10h18"/>
                                  </svg>
                                  Valid until {perk.validUntil}
                                </div>
                              )}

                              {/* Get Deal Button */}
                              <Button 
                                onClick={() => handleGetDeal(perk)}
                                className="bg-[#e6b756] text-[#1a2233] font-semibold py-2.5 sm:py-3 rounded-full text-sm sm:text-base hover:bg-[#f5d488] transition-colors font-display w-full">
                                Get Deal
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination */}
                      {filteredPerks.length > ITEMS_PER_PAGE && (
                        <div className="flex justify-center items-center gap-4 mt-8 sm:mt-10">
                          <Button 
                            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                            disabled={currentPage === 0}
                            className="bg-white border border-[#e6b756] text-[#e6b756] font-semibold px-6 sm:px-8 py-2 rounded-full hover:bg-[#fffbe6] transition-colors font-display text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed">
                            Previous
                          </Button>
                          <span className="text-sm sm:text-base text-[#6b6f76] font-medium">
                            Page {currentPage + 1} of {Math.ceil(filteredPerks.length / ITEMS_PER_PAGE)}
                          </span>
                          <Button 
                            onClick={() => setCurrentPage(Math.min(Math.ceil(filteredPerks.length / ITEMS_PER_PAGE) - 1, currentPage + 1))}
                            disabled={currentPage >= Math.ceil(filteredPerks.length / ITEMS_PER_PAGE) - 1}
                            className="bg-[#e6b756] text-[#1a2233] font-semibold px-6 sm:px-8 py-2 rounded-full hover:bg-[#f5d488] transition-colors font-display text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed">
                            Next
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      
      {/* Lead Form Modal */}
      {leadFormModal.isOpen && (
        <LeadFormModal
          isOpen={leadFormModal.isOpen}
          onClose={() => {
            document.title = "VentureNext - Exclusive Perks for Ambitious Founders";
            setLeadFormModal({ isOpen: false, perkId: null });
          }}
          perkName={mockPerks.find((p) => p.id === leadFormModal.perkId)?.company || "Perk"}
          formFields={currentLeadForm?.form_fields && currentLeadForm.form_fields.length > 0 
            ? currentLeadForm.form_fields 
            : [
                { id: "1", name: "name", label: "Full Name", type: "text", required: true, placeholder: "Enter your name" },
                { id: "2", name: "email", label: "Email", type: "email", required: true, placeholder: "you@company.com" },
              ]}
          onSubmit={handleLeadFormSubmit}
        />
      )}
      
      {/* Coupon Code Modal */}
      {couponModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-[#181c23] mb-4">Coupon Code</h2>
            <div className="bg-[#f5f5f5] rounded-lg p-4 mb-4">
              <p className="text-sm text-[#6b6f76] mb-2">Use this code to claim your deal:</p>
              <p className="text-2xl font-bold text-[#e6b756] font-display break-all">{couponModal.code}</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(couponModal.code);
                  setCopiedCoupon(true);
                  setTimeout(() => setCopiedCoupon(false), 2000);
                }}
                className="flex-1 bg-[#e6b756] text-[#1a2233] font-semibold hover:bg-[#f5d488]"
              >
                {copiedCoupon ? "✓ Copied!" : "Copy Code"}
              </Button>
              <Button
                onClick={() => window.open(couponModal.code.startsWith('http') ? couponModal.code : '#', '_blank')}
                variant="outline"
                className="flex-1"
              >
                Open Link
              </Button>
            </div>
            <Button
              onClick={() => setCouponModal({ isOpen: false, code: "" })}
              variant="ghost"
              className="w-full mt-3"
            >
              Close
            </Button>
          </div>
        </div>
      )}
      
      <Footer />
    </>
  );
}