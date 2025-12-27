"use client";

import { useState, useRef } from "react";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { ImageUpload } from "@/components/perks/ImageUpload";
import { LeadCaptureForm } from "@/components/perks/LeadCaptureForm";
import { DealTypeAndBestForFields } from "@/components/perks/DealTypeAndBestForFields";
import { useCreatePerk } from "@/hooks/usePerks";
import { useCategories } from "@/hooks/useCategories";
import { useSubcategories } from "@/hooks/useSubcategories";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useCreateLeadForm } from "@/hooks/useLeadForms";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface FormField {
  id: string;
  name: string;
  label: string;
  type: "text" | "email" | "phone" | "number" | "textarea" | "checkbox";
  placeholder: string;
  required: boolean;
}

const defaultLeadFormFields: FormField[] = [
  { id: "1", name: "full_name", label: "Full Name", type: "text", placeholder: "Enter your name", required: true },
  { id: "2", name: "company", label: "Company", type: "text", placeholder: "Your company name", required: true },
  { id: "3", name: "email", label: "Email", type: "email", placeholder: "you@company.com", required: true },
  { id: "4", name: "phone", label: "Phone", type: "phone", placeholder: "Placeholder text", required: false },
  { id: "5", name: "budget", label: "Budget", type: "text", placeholder: "Enter value", required: true },
];

export default function AddPerk() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: categories } = useCategories();
  const { data: allSubcategories } = useSubcategories();
  const { mutate: createPerk, isPending } = useCreatePerk();
  const createLeadFormMutation = useCreateLeadForm();
  const { upload, isUploading } = useImageUpload();
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    perkTitle: "",
    discount: "",
    expiry: "",
    location: "Global",
    image_url: "",
    logo_url: "",
    deal_type: "affiliate",
    deal_url: "",
    best_for: "",
    status: "Active",
  });

  const [leadFormFields, setLeadFormFields] = useState<FormField[]>(defaultLeadFormFields);

  const [dealTypeSelection, setDealTypeSelection] = useState("affiliate");
  const [dealType, setDealType] = useState<string[]>([]);
  const [bestFor, setBestFor] = useState<string[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast({
      title: "Uploading...",
      description: "Please wait while your image is being uploaded",
    });

    const url = await upload(file, "banners");
    if (url) {
      setFormData((prev) => ({ ...prev, image_url: url }));
      toast({
        title: "Success",
        description: "Banner uploaded successfully!",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to upload banner image",
        variant: "destructive",
      });
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast({
      title: "Uploading...",
      description: "Please wait while your image is being uploaded",
    });

    const url = await upload(file, "logos");
    if (url) {
      setFormData((prev) => ({ ...prev, logo_url: url }));
      toast({
        title: "Success",
        description: "Logo uploaded successfully!",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to upload logo",
        variant: "destructive",
      });
    }
  };

  const handleClaimMethodChange = (value: string) => {
    setDealTypeSelection(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.discount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Map dealTypeSelection to the proper format
    const dealTypeMap: Record<string, string> = {
      affiliate: "affiliate_link",
      coupon: "coupon_code",
      lead: "lead_capture_form",
    };
    
    const selectedDealType = dealTypeMap[dealTypeSelection] || dealTypeSelection;

    createPerk(
      {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        discount: formData.discount,
        expiry: formData.expiry,
        location: formData.location,
        image_url: formData.image_url,
        logo_url: formData.logo_url,
        deal_type: dealType.join(", "),
        deal_url: dealTypeSelection === "lead" ? undefined : (formData.deal_url || undefined),
        best_for: bestFor.join(", "),
        status: formData.status,
      },
      {
        onSuccess: async (createdPerk: any) => {
          console.log("Created perk response:", createdPerk);
          // If lead capture form is selected, save the form configuration
          if (dealTypeSelection === "lead") {
            if (leadFormFields.length === 0) {
              toast({
                title: "Warning",
                description: "Lead form created but no fields configured. Add fields to the lead form.",
                variant: "destructive",
              });
              return;
            }

            try {
              const perkId = createdPerk?.id || createdPerk?.[0]?.id;
              if (!perkId) {
                throw new Error("Perk created but no ID returned from API");
              }
              await createLeadFormMutation.mutateAsync({
                perk_id: perkId,
                form_fields: leadFormFields,
                submit_button_text: "Submit",
                success_message: "Thank you! We'll contact you soon.",
              });
              
              toast({
                title: "Success",
                description: "Perk created with lead form successfully!",
              });
            } catch (error: any) {
              const errorMessage = error?.message || "Unknown error occurred";
              console.error("Failed to save lead form:", error);
              toast({
                title: "Warning",
                description: `Perk created but lead form failed: ${errorMessage}`,
                variant: "destructive",
              });
            }
          } else {
            toast({
              title: "Success",
              description: "Perk created successfully!",
            });
          }

          router.push("/admin/perks");
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.message || "Failed to create perk",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/admin/perks">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <span className="text-sm text-muted-foreground">Back</span>
      </div>

      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Add New Perk</h1>
        <p className="text-muted-foreground">Fill in the details below to create a new perk for founders</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* MEDIA SECTION */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Media</h2>
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-3 block">Banner Image</Label>
              {formData.image_url && (
                <div className="mb-3 relative w-full h-40 bg-muted rounded-lg overflow-hidden">
                  <img src={formData.image_url} alt="Banner" className="w-full h-full object-cover" />
                </div>
              )}
              <div 
                onClick={() => bannerInputRef.current?.click()}
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">Recommended: 1200 x 400px</p>
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Company Logo</Label>
              <div className="flex items-start gap-4">
                {formData.logo_url && (
                  <div className="relative w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img src={formData.logo_url} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <div 
                    onClick={() => logoInputRef.current?.click()}
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                  >
                    <Upload className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs font-medium text-foreground mb-1">Click to upload</p>
                    <p className="text-xs text-muted-foreground mb-2">Square image, min 100x100px</p>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* COMPANY DETAILS SECTION */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Company Details</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                  Company Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., CloudScale"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="border-amber-200">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Subcategory</Label>
              <Select value={formData.subcategory || ""} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, subcategory: value }))
              } disabled={!formData.category}>
                <SelectTrigger className={!formData.category ? "opacity-50" : ""}>
                  <SelectValue placeholder="Select subcategory (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {formData.category && allSubcategories && (
                    allSubcategories
                      .filter((sub: any) => {
                        const selectedCat = categories?.find((c: any) => c.name === formData.category);
                        return sub.category_id === selectedCat?.id;
                      })
                      .map((sub: any) => (
                        <SelectItem key={sub.id} value={sub.id}>
                          {sub.name}
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">Subcategories are managed in the Categories tab</p>
            </div>
          </div>
        </Card>

        {/* PERK DETAILS SECTION */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Perk Details</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="perkTitle" className="text-sm font-medium mb-2 block">
                  Perk Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="perkTitle"
                  placeholder="e.g., $200 credit"
                  value={formData.perkTitle}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">URL Slug</Label>
                <Input
                  placeholder="auto-generated from title"
                  value={(formData.perkTitle?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')) || ''}
                  disabled
                />
                <p className="text-xs text-muted-foreground mt-1">Auto-generated from title</p>
              </div>
            </div>
            <div>
              <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                Deal Badge Text
              </Label>
              <Input
                id="badge"
                placeholder="e.g., $200 credit, 40% off"
                value={formData.discount}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    discount: e.target.value,
                  }))
                }
              />
              <p className="text-xs text-muted-foreground mt-1">Short text shown on the card badge</p>
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-medium mb-2 block">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the perk and what founders get..."
                value={formData.description}
                onChange={handleInputChange}
                className="min-h-[120px]"
              />
            </div>
          </div>
        </Card>

        {/* AVAILABILITY SECTION */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Availability</h2>
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Available In <span className="text-destructive">*</span>
              </Label>
              <RadioGroup 
                value={formData.location} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="Malaysia" id="malaysia" />
                  <Label htmlFor="malaysia" className="font-normal cursor-pointer">Malaysia</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="Singapore" id="singapore" />
                  <Label htmlFor="singapore" className="font-normal cursor-pointer">Singapore</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="Global" id="global" />
                  <Label htmlFor="global" className="font-normal cursor-pointer">Global</Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground mt-3">Selecting "Global" will show the perk in both Malaysia and Singapore</p>
            </div>
            <div>
              <Label htmlFor="expiry" className="text-sm font-medium mb-2 block">
                📅 Valid Until
              </Label>
              <Input
                id="expiry"
                type="date"
                value={formData.expiry}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground mt-1">Optional - leave empty for no expiry</p>
            </div>
          </div>
        </Card>

        {/* DEAL TYPE SECTION - CHECKBOXES */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Deal Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'free-trial', label: 'Free trial', icon: '🆓' },
              { id: 'discount', label: 'Discount', icon: '💰' },
              { id: 'credits', label: 'Credits included', icon: '🎁' },
              { id: 'consultation', label: 'Free consultation', icon: '💬' },
              { id: 'perks', label: 'Free perks / Add-ons', icon: '⭐' },
              { id: 'bundle', label: 'Bundle deal', icon: '📦' },
              { id: 'exclusive', label: 'Exclusive deal', icon: '🔐' },
              { id: 'intro', label: 'Intro/First-time offer', icon: '🚀' },
            ].map((type) => (
              <label key={type.id} className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted cursor-pointer border border-muted">
                <Checkbox
                  checked={dealType.includes(type.label)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setDealType([...dealType, type.label]);
                    } else {
                      setDealType(dealType.filter(item => item !== type.label));
                    }
                  }}
                />
                <span className="text-xs">{type.icon} {type.label}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* BEST FOR SECTION - CHECKBOXES */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Best For</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { id: 'solopreneurs', label: 'Solopreneurs', icon: '👤' },
              { id: 'startups', label: 'Startups', icon: '🚀' },
              { id: 'smes', label: 'SMEs', icon: '🏢' },
              { id: 'agencies', label: 'Agencies', icon: '🤝' },
              { id: 'enterprises', label: 'Enterprises', icon: '🏭' },
              { id: 'remote', label: 'Remote teams', icon: '🌍' },
            ].map((target) => (
              <label key={target.id} className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted cursor-pointer border border-muted">
                <Checkbox
                  checked={bestFor.includes(target.label)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setBestFor([...bestFor, target.label]);
                    } else {
                      setBestFor(bestFor.filter(item => item !== target.label));
                    }
                  }}
                />
                <span className="text-xs">{target.icon} {target.label}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* HOW TO CLAIM SECTION */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">How to Claim</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">Claim Method</Label>
              <div className="grid grid-cols-3 gap-4">
                <label
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    dealTypeSelection === "affiliate"
                      ? "border-orange-400 bg-orange-50"
                      : "border-border"
                  }`}
                >
                  <RadioGroup value={dealTypeSelection} onValueChange={handleClaimMethodChange}>
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value="affiliate" className="mt-1" />
                      <div>
                        <p className="font-medium text-sm">🔗 Direct Link</p>
                        <p className="text-xs text-muted-foreground">Send to affiliate URL</p>
                      </div>
                    </div>
                  </RadioGroup>
                </label>
                <label
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    dealTypeSelection === "coupon"
                      ? "border-orange-400 bg-orange-50"
                      : "border-border"
                  }`}
                >
                  <RadioGroup value={dealTypeSelection} onValueChange={handleClaimMethodChange}>
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value="coupon" className="mt-1" />
                      <div>
                        <p className="font-medium text-sm">🎟️ Coupon Code</p>
                        <p className="text-xs text-muted-foreground">Code to use at checkout</p>
                      </div>
                    </div>
                  </RadioGroup>
                </label>
                <label
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    dealTypeSelection === "lead"
                      ? "border-orange-400 bg-orange-50"
                      : "border-border"
                  }`}
                >
                  <RadioGroup value={dealTypeSelection} onValueChange={handleClaimMethodChange}>
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value="lead" className="mt-1" />
                      <div>
                        <p className="font-medium text-sm">📋 Lead Capture</p>
                        <p className="text-xs text-muted-foreground">Collect user details</p>
                      </div>
                    </div>
                  </RadioGroup>
                </label>
              </div>
            </div>
            {dealTypeSelection !== "lead" && (
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  {dealTypeSelection === "affiliate" ? "Affiliate Link" : "Coupon Code"}
                </Label>
                <Input
                  placeholder={dealTypeSelection === "affiliate" ? "https://example.com/promo" : "e.g., SAVE50"}
                  value={formData.deal_url}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      deal_url: e.target.value,
                    }))
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {dealTypeSelection === "affiliate" ? "Enter the affiliate or partner URL" : "Enter the coupon/promo code"}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* LEAD CAPTURE FORM SECTION */}
        {dealTypeSelection === "lead" && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Lead Capture Form Configuration</h3>
            <LeadCaptureForm value={leadFormFields} onChange={setLeadFormFields} />
            <p className="text-xs text-muted-foreground mt-4">
              Configure fields to collect from users. These fields will appear when users click "Get Deal".
            </p>
          </Card>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 pt-4">
          <Link href="/admin/perks">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            className="bg-amber-400 hover:bg-amber-500 text-black"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Publish Perk"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
