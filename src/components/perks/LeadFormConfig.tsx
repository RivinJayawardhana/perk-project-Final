"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus } from "lucide-react";

interface FormField {
  id: string;
  name: string;
  type: "text" | "email" | "phone" | "number" | "textarea" | "checkbox";
  label: string;
  required: boolean;
  placeholder?: string;
}

interface LeadFormConfigProps {
  initialFields?: FormField[];
  onSave: (fields: FormField[]) => void;
  isLoading?: boolean;
}

export function LeadFormConfig({ initialFields = [], onSave, isLoading = false }: LeadFormConfigProps) {
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [newField, setNewField] = useState({
    name: "",
    type: "text" as FormField["type"],
    label: "",
    required: false,
    placeholder: "",
  });

  const addField = () => {
    if (!newField.name || !newField.label) return;

    const field: FormField = {
      id: Date.now().toString(),
      ...newField,
    };

    setFields([...fields, field]);
    setNewField({
      name: "",
      type: "text",
      label: "",
      required: false,
      placeholder: "",
    });
  };

  const handleAddFieldClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addField();
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(
      fields.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const toggleRequired = (id: string) => {
    updateField(id, { required: !fields.find((f) => f.id === id)?.required });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Configure Lead Form Fields</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Define the fields users will fill out when they click "Get Deal"
        </p>
      </div>

      {/* Add new field section */}
      <Card className="p-6 bg-blue-50">
        <h4 className="font-medium mb-4">Add New Field</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="field-label" className="text-sm mb-2 block">
              Field Label
            </Label>
            <Input
              id="field-label"
              placeholder="e.g., Full Name"
              value={newField.label}
              onChange={(e) =>
                setNewField({ ...newField, label: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="field-name" className="text-sm mb-2 block">
              Field Name (internal)
            </Label>
            <Input
              id="field-name"
              placeholder="e.g., full_name"
              value={newField.name}
              onChange={(e) =>
                setNewField({ ...newField, name: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="field-type" className="text-sm mb-2 block">
              Field Type
            </Label>
            <Select
              value={newField.type}
              onValueChange={(value: any) =>
                setNewField({ ...newField, type: value })
              }
            >
              <SelectTrigger>
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
            <Label htmlFor="field-placeholder" className="text-sm mb-2 block">
              Placeholder (optional)
            </Label>
            <Input
              id="field-placeholder"
              placeholder="e.g., Enter your full name"
              value={newField.placeholder}
              onChange={(e) =>
                setNewField({ ...newField, placeholder: e.target.value })
              }
            />
          </div>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <Checkbox
            id="field-required"
            checked={newField.required}
            onCheckedChange={(checked) =>
              setNewField({ ...newField, required: checked as boolean })
            }
          />
          <Label htmlFor="field-required" className="text-sm cursor-pointer">
            Required Field
          </Label>
        </div>
        <Button
          onClick={handleAddFieldClick}
          type="button"
          disabled={!newField.name || !newField.label}
          className="w-full md:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Field
        </Button>
      </Card>

      {/* Display configured fields */}
      {fields.length > 0 && (
        <Card className="p-6">
          <h4 className="font-medium mb-4">Configured Fields ({fields.length})</h4>
          <div className="space-y-3">
            {fields.map((field) => (
              <div
                key={field.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{field.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {field.type}
                    {field.required && " • Required"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeField(field.id);
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Button
        onClick={() => onSave(fields)}
        type="button"
        disabled={fields.length === 0 || isLoading}
        className="w-full"
      >
        {isLoading ? "Saving..." : "Save Lead Form Configuration"}
      </Button>
    </div>
  );
}
