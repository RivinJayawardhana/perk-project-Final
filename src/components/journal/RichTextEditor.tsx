"use client";

import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import ImageExtension from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
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
  Minus,
  Strikethrough,
  Type,
  Eraser,
  X,
  Palette,
  Image,
  Underline as UnderlineIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Start typing...",
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [currentHeading, setCurrentHeading] = useState<string>("paragraph");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Ensure lists are explicitly configured if using custom prose styles
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      ImageExtension.configure({
        allowBase64: true,
        inline: false,
      }),
      Underline,
      LinkExtension.configure({
        openOnClick: false,
        // This adds a specific class to links for highlighting
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer font-medium',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      if (editor.isActive("heading", { level: 1 })) setCurrentHeading("1");
      else if (editor.isActive("heading", { level: 2 })) setCurrentHeading("2");
      else if (editor.isActive("heading", { level: 3 })) setCurrentHeading("3");
      else setCurrentHeading("paragraph");
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const handleHeadingChange = (val: string) => {
    if (val === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = parseInt(val) as 1 | 2 | 3;
      editor.chain().focus().toggleHeading({ level }).run();
    }
    setCurrentHeading(val);
  };

  const handleOpenLinkDialog = () => {
    const { $from, $to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween($from.pos, $to.pos);
    
    if (selectedText && selectedText.trim()) {
      setLinkText(selectedText);
    }
    setIsLinkOpen(true);
  };

  const handleAddLink = () => {
    if (linkUrl) {
      if (linkText) {
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: linkUrl })
          .insertContent(linkText)
          .run();
      } else {
        editor
          .chain()
          .focus()
          .setLink({ href: linkUrl })
          .run();
      }
      setLinkUrl("");
      setLinkText("");
      setIsLinkOpen(false);
    }
  };

  const handleAddImage = () => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        editor.chain().focus().setImage({ src }).run();
        setImageFile(null);
        setIsImageOpen(false);
      };
      reader.readAsDataURL(imageFile);
    }
  };

  const ToolbarIconButton = ({
    onClick,
    active,
    icon: Icon,
    title,
    disabled = false,
  }: {
    onClick: () => void;
    active: boolean;
    icon: any;
    title: string;
    disabled?: boolean;
  }) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      onClick();
    };

    return (
      <button
        type="button"
        onMouseDown={handleClick}
        title={title}
        disabled={disabled}
        className={`inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded transition-colors ${
          active
            ? "bg-gray-200 text-gray-900"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
      >
        {typeof Icon === "string" || typeof Icon === "function" ? (
          typeof Icon === "function" ? Icon() : <span>{Icon}</span>
        ) : (
          <Icon className="w-4 h-4" />
        )}
      </button>
    );
  };

  return (
    <div className="rounded-lg overflow-hidden bg-white shadow-sm border border-gray-200">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5">
        <div className="flex items-center justify-between mb-2.5 pb-2.5 border-b border-gray-300">
          <button 
            type="button"
            className="text-xs text-gray-700 px-3 py-1.5 border border-gray-300 rounded bg-white hover:bg-gray-50 flex items-center gap-1.5 font-medium"
          >
            <span className="text-sm">📎</span> Add Media
          </button>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-gray-700">Visual</span>
            <span className="text-xs text-gray-500 cursor-pointer">Text</span>
          </div>
        </div>

        <div className="flex items-center gap-0.5 flex-wrap mb-1.5">
          <Select value={currentHeading} onValueChange={handleHeadingChange}>
            <SelectTrigger className="w-28 h-7 text-xs border-0 bg-white hover:bg-gray-50 text-gray-700 font-medium focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paragraph">Paragraph</SelectItem>
              <SelectItem value="1">Heading 1</SelectItem>
              <SelectItem value="2">Heading 2</SelectItem>
              <SelectItem value="3">Heading 3</SelectItem>
            </SelectContent>
          </Select>

          <div className="h-5 w-px bg-gray-300 mx-0.5" />

          <ToolbarIconButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            icon={Bold}
            title="Bold"
          />
          <ToolbarIconButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            icon={Italic}
            title="Italic"
          />
          <ToolbarIconButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            icon={UnderlineIcon}
            title="Underline"
          />
          <ToolbarIconButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            icon={Strikethrough}
            title="Strikethrough"
          />

          <div className="h-5 w-px bg-gray-300 mx-0.5" />

          <ToolbarIconButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            icon={List}
            title="Bullet List"
          />
          <ToolbarIconButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            icon={ListOrdered}
            title="Ordered List"
          />

          <div className="h-5 w-px bg-gray-300 mx-0.5" />

          <ToolbarIconButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            icon={Quote}
            title="Blockquote"
          />

          <div className="h-5 w-px bg-gray-300 mx-0.5" />

          <ToolbarIconButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
            icon={AlignLeft}
            title="Align Left"
          />
          <ToolbarIconButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
            icon={AlignCenter}
            title="Align Center"
          />
          <ToolbarIconButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
            icon={AlignRight}
            title="Align Right"
          />

          <div className="h-5 w-px bg-gray-300 mx-0.5" />

          <div className="flex items-center gap-1 ml-1">
            <input
              type="color"
              onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
              title="Text Color"
              className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
            />
          </div>

          <div className="ml-auto flex items-center gap-0.5">
            <ToolbarIconButton
              onClick={() => editor.chain().focus().undo().run()}
              active={false}
              icon={() => <span className="text-sm font-bold">↶</span>}
              title="Undo"
              disabled={!editor.can().undo()}
            />
            <ToolbarIconButton
              onClick={() => editor.chain().focus().redo().run()}
              active={false}
              icon={() => <span className="text-sm font-bold">↷</span>}
              title="Redo"
              disabled={!editor.can().redo()}
            />
          </div>
        </div>

        <div className="flex items-center gap-0.5 flex-wrap">
          <Dialog open={isLinkOpen} onOpenChange={setIsLinkOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                onClick={handleOpenLinkDialog}
                className={`w-8 h-8 inline-flex items-center justify-center rounded hover:bg-gray-100 ${editor.isActive("link") ? "bg-gray-200" : ""}`}
              >
                <Link className="w-4 h-4" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Insert Link</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input value={linkText} onChange={(e) => setLinkText(e.target.value)} placeholder="Display Text" />
                <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.com" />
                <div className="flex gap-2 justify-end">
                  <Button onClick={() => setIsLinkOpen(false)} variant="outline">Cancel</Button>
                  <Button onClick={handleAddLink}>Insert Link</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
            <DialogTrigger asChild>
              <button type="button" className="w-8 h-8 inline-flex items-center justify-center rounded hover:bg-gray-100">
                <Image className="w-4 h-4" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Insert Image</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                <Button onClick={handleAddImage} disabled={!imageFile} className="w-full">Upload Image</Button>
              </div>
            </DialogContent>
          </Dialog>

          <ToolbarIconButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive("codeBlock")}
            icon={Type}
            title="Code Block"
          />
          
          <ToolbarIconButton
            onClick={() => editor.chain().focus().clearNodes().run()}
            active={false}
            icon={Eraser}
            title="Clear Formatting"
          />
        </div>
      </div>

      <div className="bg-white p-4 min-h-[400px]">
        {/* Updated className to remove blue focus border */}
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:ring-0 [&_.ProseMirror-focused]:outline-none [&_.ProseMirror]:min-h-[400px] [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-blue-600 [&_a]:underline [&_a]:font-medium"
        />
      </div>
    </div>
  );
}