import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Link, 
  Table, 
  Star,
  Twitter,
  Mail,
  Strikethrough,
  Minus,
  Type,
  Eraser,
  Omega,
  IndentDecrease,
  IndentIncrease,
  Undo,
  Redo,
  HelpCircle,
  Maximize,
  Image
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditorToolbarProps {
  onAction?: (action: string) => void;
}

export function EditorToolbar({ onAction }: EditorToolbarProps) {
  const handleAction = (action: string) => {
    onAction?.(action);
  };

  return (
    <div className="bg-muted/50 border border-border rounded-t-md p-2 space-y-2">
      {/* Top Row */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2 text-xs"
          onClick={() => handleAction("addMedia")}
        >
          <Image className="w-4 h-4" />
          Add Media
        </Button>
        
        <div className="ml-auto flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs px-3"
            onClick={() => handleAction("visual")}
          >
            Visual
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs px-3"
            onClick={() => handleAction("text")}
          >
            Text
          </Button>
        </div>
      </div>

      {/* Second Row */}
      <div className="flex items-center gap-1 flex-wrap border-t border-border pt-2">
        <Select defaultValue="paragraph">
          <SelectTrigger className="w-28 h-8 text-xs">
            <SelectValue placeholder="Paragraph" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paragraph">Paragraph</SelectItem>
            <SelectItem value="h1">Heading 1</SelectItem>
            <SelectItem value="h2">Heading 2</SelectItem>
            <SelectItem value="h3">Heading 3</SelectItem>
            <SelectItem value="h4">Heading 4</SelectItem>
            <SelectItem value="h5">Heading 5</SelectItem>
            <SelectItem value="h6">Heading 6</SelectItem>
            <SelectItem value="pre">Preformatted</SelectItem>
          </SelectContent>
        </Select>

        <div className="h-6 w-px bg-border mx-1" />

        <ToolbarButton icon={Bold} action="bold" onClick={handleAction} />
        <ToolbarButton icon={Italic} action="italic" onClick={handleAction} />
        <ToolbarButton icon={List} action="bulletList" onClick={handleAction} />
        <ToolbarButton icon={ListOrdered} action="numberedList" onClick={handleAction} />
        <ToolbarButton icon={Quote} action="blockquote" onClick={handleAction} />

        <div className="h-6 w-px bg-border mx-1" />

        <ToolbarButton icon={AlignLeft} action="alignLeft" onClick={handleAction} />
        <ToolbarButton icon={AlignCenter} action="alignCenter" onClick={handleAction} />
        <ToolbarButton icon={AlignRight} action="alignRight" onClick={handleAction} />
        <ToolbarButton icon={AlignJustify} action="alignJustify" onClick={handleAction} />

        <div className="h-6 w-px bg-border mx-1" />

        <ToolbarButton icon={Link} action="link" onClick={handleAction} />
        <ToolbarButton icon={Table} action="table" onClick={handleAction} />

        <div className="h-6 w-px bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="w-8 h-8"
          onClick={() => handleAction("star")}
        >
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="w-8 h-8"
          onClick={() => handleAction("twitter")}
        >
          <Twitter className="w-4 h-4 text-blue-500" />
        </Button>
        <ToolbarButton icon={Mail} action="mail" onClick={handleAction} />

        <div className="ml-auto">
          <ToolbarButton icon={Maximize} action="fullscreen" onClick={handleAction} />
        </div>
      </div>

      {/* Third Row */}
      <div className="flex items-center gap-1 flex-wrap border-t border-border pt-2">
        <ToolbarButton icon={Strikethrough} action="strikethrough" onClick={handleAction} title="Strikethrough" />
        <ToolbarButton icon={Minus} action="horizontalRule" onClick={handleAction} title="Horizontal line" />
        <ToolbarButton icon={Type} action="textColor" onClick={handleAction} title="Text color" />
        <ToolbarButton icon={Eraser} action="clearFormatting" onClick={handleAction} title="Clear formatting" />
        <ToolbarButton icon={Omega} action="specialChar" onClick={handleAction} title="Special character" />
        <ToolbarButton icon={IndentDecrease} action="outdent" onClick={handleAction} title="Decrease indent" />
        <ToolbarButton icon={IndentIncrease} action="indent" onClick={handleAction} title="Increase indent" />

        <div className="h-6 w-px bg-border mx-1" />

        <ToolbarButton icon={Undo} action="undo" onClick={handleAction} title="Undo" />
        <ToolbarButton icon={Redo} action="redo" onClick={handleAction} title="Redo" />

        <div className="h-6 w-px bg-border mx-1" />

        <ToolbarButton icon={HelpCircle} action="help" onClick={handleAction} title="Help" />
      </div>
    </div>
  );
}

interface ToolbarButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  action: string;
  onClick: (action: string) => void;
  title?: string;
}

function ToolbarButton({ icon: Icon, action, onClick, title }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="w-8 h-8"
      onClick={() => onClick(action)}
      title={title}
    >
      <Icon className="w-4 h-4" />
    </Button>
  );
}
