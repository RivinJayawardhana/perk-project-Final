import { Upload } from "lucide-react";

interface ImageUploadProps {
  label: string;
  description?: string;
}

export function ImageUpload({ label, description }: ImageUploadProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-primary">{label}</label>
      <div className="border-2 border-dashed border-border rounded-lg p-8 hover:border-primary/50 transition-colors cursor-pointer bg-background">
        <div className="flex flex-col items-center justify-center text-center">
          <Upload className="w-8 h-8 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            Click to upload or drag and drop
          </p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
