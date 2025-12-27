import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface DealTypeAndBestForFieldsProps {
  dealType: string[];
  setDealType: React.Dispatch<React.SetStateAction<string[]>>;
  bestFor: string[];
  setBestFor: React.Dispatch<React.SetStateAction<string[]>>;
}

export function DealTypeAndBestForFields({ dealType, setDealType, bestFor, setBestFor }: DealTypeAndBestForFieldsProps) {
  const dealTypeOptions = [
    "Free trial / Trial",
    "Discount",
    "Credits included",
    "Free consultation",
    "Free perks / Add-ons",
    "Bundle deal",
    "Exclusive deal",
    "Intro / First-time offer",
  ];
  const bestForOptions = [
    "Solopreneurs",
    "Startups",
    "SMEs",
    "Agencies",
    "Enterprises",
    "Remote teams",
  ];

  return (
    <div className="space-y-6">
      <div>
        <Label className="font-semibold mb-2 block">Deal Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {dealTypeOptions.map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={dealType.includes(option)}
                onCheckedChange={() => {
                  setDealType((prev: string[]) =>
                    prev.includes(option)
                      ? prev.filter((v: string) => v !== option)
                      : [...prev, option]
                  );
                }}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <Label className="font-semibold mb-2 block">Best For</Label>
        <div className="grid grid-cols-2 gap-2">
          {bestForOptions.map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={bestFor.includes(option)}
                onCheckedChange={() => {
                  setBestFor((prev: string[]) =>
                    prev.includes(option)
                      ? prev.filter((v: string) => v !== option)
                      : [...prev, option]
                  );
                }}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
