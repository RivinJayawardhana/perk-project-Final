"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useRecaptcha } from "@/hooks/useRecaptcha";

interface FormField {
  id: string;
  name: string;
  type: "text" | "email" | "phone" | "number" | "textarea" | "checkbox";
  label: string;
  required: boolean;
  placeholder?: string;
}

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  perkName: string;
  formFields: FormField[];
  onSubmit: (formData: Record<string, any>) => Promise<void>;
  successMessage?: string;
}

export function LeadFormModal({
  isOpen,
  onClose,
  perkName,
  formFields,
  onSubmit,
  successMessage = "Thank you! We'll contact you soon.",
}: LeadFormModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { getToken } = useRecaptcha();

  useEffect(() => {
    // Load reCAPTCHA script when modal opens
    if (isOpen) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
      if (!document.querySelector(`script[src="${script.src}"]`)) {
        document.head.appendChild(script);
      }
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    formFields.forEach((field) => {
      const value = formData[field.name];

      if (field.required && (!value || value.toString().trim() === "")) {
        newErrors[field.name] = `${field.label} is required`;
      }

      if (value && field.type === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.name] = "Please enter a valid email address";
        }
      }

      if (value && field.type === "phone") {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value) || value.replace(/\D/g, "").length < 10) {
          newErrors[field.name] = "Please enter a valid phone number";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Get reCAPTCHA token (optional for development)
      let token: string = 'dev-token';
      if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        const captchaToken = await getToken('lead_form');
        if (!captchaToken) {
          throw new Error('reCAPTCHA verification failed');
        }
        token = captchaToken;
      }

      await onSubmit({ ...formData, recaptchaToken: token });
      setIsSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error("Form submission error:", error);
      setErrors({ submit: error instanceof Error ? error.message : "Failed to submit form. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({});
    setErrors({});
    setIsSuccess(false);
    onClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-md mx-4 sm:mx-auto p-4 sm:p-6">
        <DialogHeader className="text-left">
          <DialogTitle className="text-lg sm:text-xl">Get {perkName}</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Fill out the form below to claim this deal
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="text-center py-6 sm:py-8">
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">✓</div>
            <p className="text-base sm:text-lg font-semibold text-green-600 mb-2">
              Success!
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {formFields.map((field) => (
              <div key={field.id} className="space-y-1.5 sm:space-y-2">
                <Label htmlFor={field.name} className="text-xs sm:text-sm font-medium block">
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>

                {field.type === "textarea" ? (
                  <Textarea
                    id={field.name}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                    className={`text-sm resize-none ${errors[field.name] ? "border-destructive" : ""}`}
                    rows={3}
                  />
                ) : field.type === "checkbox" ? (
                  <div className="flex items-center gap-2 pt-1">
                    <Checkbox
                      id={field.name}
                      name={field.name}
                      checked={formData[field.name] || false}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.name]: checked,
                        }))
                      }
                      className="mt-1"
                    />
                    <Label htmlFor={field.name} className="text-xs sm:text-sm cursor-pointer font-normal">
                      {field.label}
                    </Label>
                  </div>
                ) : (
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                    className={`text-sm ${errors[field.name] ? "border-destructive" : ""}`}
                  />
                )}

                {errors[field.name] && (
                  <p className="text-xs text-destructive mt-1">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}

            {errors.submit && (
              <div className="p-2 sm:p-3 bg-destructive/10 text-destructive text-xs sm:text-sm rounded-md">
                {errors.submit}
              </div>
            )}

            <div className="flex gap-2 pt-3 sm:pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 text-xs sm:text-sm py-2 sm:py-2.5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 text-xs sm:text-sm py-2 sm:py-2.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                    <span className="hidden sm:inline">Submitting...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>

            <p className="text-xs text-[#999] text-center">
              This site is protected by reCAPTCHA and the Google{" "}
              <a href="https://policies.google.com/privacy" className="underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and{" "}
              <a href="https://policies.google.com/terms" className="underline" target="_blank" rel="noopener noreferrer">Terms of Service</a> apply.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
