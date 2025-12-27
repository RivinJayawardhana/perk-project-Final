import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const CATEGORY_OPTIONS = [
  { label: "B2B Services", value: "B2B Services", subcategories: ["Legal", "Accounting", "Consulting"] },
  { label: "SaaS/AI Tools", value: "SaaS & AI Tools", subcategories: ["Productivity", "Analytics", "Marketing"] },
  { label: "Lifestyle", value: "Lifestyle & Coworking", subcategories: ["Coworking", "Wellness"] },
];

const DEAL_TYPE_OPTIONS = [
  "Free trial / Trial",
  "Discount",
  "Credits included",
  "Free consultation",
  "Free perks / Add-ons",
  "Bundle deal",
  "Exclusive deal",
  "Intro / First-time offer",
];

const BEST_FOR_OPTIONS = [
  "Solopreneurs",
  "Startups",
  "SMEs",
  "Agencies",
  "Enterprises",
  "Remote teams",
];

interface PerksFiltersProps {
  selectedCategory: string | null;
  setSelectedCategory: (cat: string) => void;
  selectedSubcategories: string[];
  setSelectedSubcategories: React.Dispatch<React.SetStateAction<string[]>>;
  dealType: string[];
  setDealType: React.Dispatch<React.SetStateAction<string[]>>;
  bestFor: string[];
  setBestFor: React.Dispatch<React.SetStateAction<string[]>>;
}

export function PerksFilters({
  selectedCategory,
  setSelectedCategory,
  selectedSubcategories,
  setSelectedSubcategories,
  dealType,
  setDealType,
  bestFor,
  setBestFor,
}: PerksFiltersProps) {
  const categoryObj = CATEGORY_OPTIONS.find((c) => c.value === selectedCategory);
  return (
    <div className="space-y-6">
      <div>
        <div className="font-semibold mb-2">Category</div>
        <div className="flex flex-col gap-2">
          {CATEGORY_OPTIONS.map((cat) => (
            <label key={cat.value} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedCategory === cat.value}
                onCheckedChange={() => setSelectedCategory(cat.value)}
              />
              <span>{cat.label}</span>
            </label>
          ))}
        </div>
      </div>
      {categoryObj && (
        <div>
          <div className="font-semibold mb-2">Subcategory</div>
          <div className="flex flex-col gap-2">
            {categoryObj.subcategories.map((sub) => (
              <label key={sub} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={selectedSubcategories.includes(sub)}
                  onCheckedChange={() =>
                    setSelectedSubcategories((prev: string[]) =>
                      prev.includes(sub)
                        ? prev.filter((s: string) => s !== sub)
                        : [...prev, sub]
                    )
                  }
                />
                <span>{sub}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      <div>
        <div className="font-semibold mb-2">Deal Type</div>
        <div className="flex flex-col gap-2">
          {DEAL_TYPE_OPTIONS.map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={dealType.includes(option)}
                onCheckedChange={() =>
                  setDealType((prev: string[]) =>
                    prev.includes(option)
                      ? prev.filter((v: string) => v !== option)
                      : [...prev, option]
                  )
                }
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <div className="font-semibold mb-2">Best For</div>
        <div className="flex flex-col gap-2">
          {BEST_FOR_OPTIONS.map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={bestFor.includes(option)}
                onCheckedChange={() =>
                  setBestFor((prev: string[]) =>
                    prev.includes(option)
                      ? prev.filter((v: string) => v !== option)
                      : [...prev, option]
                  )
                }
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
