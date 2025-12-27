import { Link2, Tag, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface PerkType {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

const perkTypes: PerkType[] = [
  {
    id: "affiliate",
    icon: Link2,
    title: "Affiliate Link",
    description: "Direct URL to claim",
  },
  {
    id: "coupon",
    icon: Tag,
    title: "Coupon Code",
    description: "Code to use at checkout",
  },
  {
    id: "lead",
    icon: FileText,
    title: "Lead Capture",
    description: "Collect user details",
  },
];

interface PerkTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function PerkTypeSelector({ value, onChange }: PerkTypeSelectorProps) {
  return (
    <div className="flex gap-4">
      {perkTypes.map((type) => (
        <button
          key={type.id}
          type="button"
          onClick={() => onChange(type.id)}
          className={cn(
            "flex-1 flex items-center gap-3 p-4 rounded-lg border-2 transition-all",
            value === type.id
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/30"
          )}
        >
          <div
            className={cn(
              "w-4 h-4 rounded-full border-2 flex items-center justify-center",
              value === type.id ? "border-primary" : "border-muted-foreground"
            )}
          >
            {value === type.id && (
              <div className="w-2 h-2 rounded-full bg-primary" />
            )}
          </div>
          <type.icon className={cn(
            "w-5 h-5",
            value === type.id ? "text-primary" : "text-muted-foreground"
          )} />
          <div className="text-left">
            <p className={cn(
              "font-medium text-sm",
              value === type.id ? "text-foreground" : "text-foreground"
            )}>
              {type.title}
            </p>
            <p className="text-xs text-muted-foreground">{type.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
