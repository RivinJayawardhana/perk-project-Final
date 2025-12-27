"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface FormField {
  id: string;
  name: string;
  label: string;
  type: "text" | "email" | "phone" | "number" | "textarea" | "checkbox";
  placeholder: string;
  required: boolean;
}

const defaultFields: FormField[] = [
  { id: "1", name: "full_name", label: "Full Name", type: "text", placeholder: "Enter your name", required: true },
  { id: "2", name: "company", label: "Company", type: "text", placeholder: "Your company name", required: true },
  { id: "3", name: "email", label: "Email", type: "email", placeholder: "you@company.com", required: true },
  { id: "4", name: "phone", label: "Phone", type: "phone", placeholder: "Placeholder text", required: false },
  { id: "5", name: "budget", label: "Budget", type: "text", placeholder: "Enter value", required: true },
];

interface LeadCaptureFormProps {
  value?: FormField[];
  onChange?: (fields: FormField[]) => void;
}

export function LeadCaptureForm({ value, onChange }: LeadCaptureFormProps) {
  const [fields, setFields] = useState<FormField[]>(value || defaultFields);

  useEffect(() => {
    if (value && value.length > 0) {
      setFields(value);
    }
  }, [value]);

  const updateFields = (newFields: FormField[]) => {
    setFields(newFields);
    onChange?.(newFields);
  };

  const addField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      name: `field_${Date.now()}`,
      label: "New Field",
      type: "text",
      placeholder: "Enter value",
      required: false,
    };
    updateFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    updateFields(fields.filter((f) => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    updateFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Lead Capture Form Fields</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addField();
          }}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Field
        </Button>
      </div>

      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field.id} className="flex items-center gap-3 p-3 border rounded-lg bg-background">
            <div className="flex-1 grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs">Field Name</Label>
                <Input
                  value={field.name}
                  onChange={(e) => updateField(field.id, { name: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                  placeholder="e.g., email"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Type</Label>
                <Select
                  value={field.type}
                  onValueChange={(value) => updateField(field.id, { type: value as FormField["type"] })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="textarea">Textarea</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Placeholder</Label>
                <Input
                  value={field.placeholder}
                  onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                  placeholder="Placeholder text"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`required-${field.id}`}
                checked={field.required}
                onCheckedChange={(checked) =>
                  updateField(field.id, { required: checked as boolean })
                }
              />
              <label htmlFor={`required-${field.id}`} className="text-sm text-muted-foreground">
                Required
              </label>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeField(field.id);
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <p className="text-sm text-primary">
        Configure fields to collect from users. Common fields: Budget, Purchase Timeline, etc.
      </p>
    </div>
  );
}
