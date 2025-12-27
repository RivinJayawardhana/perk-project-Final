"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { useCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from "@/hooks/useCategories";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  subcategories_count?: number;
  created_at: string;
}

export default function Categories() {
  const { data: categories = [], isLoading } = useCategories();
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory("");
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();
  const { toast } = useToast();

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  };

  const handleNewCategoryNameChange = (value: string) => {
    setNewCategoryName(value);
    setNewCategorySlug(generateSlug(value));
  };

  const handleEditNameChange = (value: string) => {
    setEditName(value);
    setEditSlug(generateSlug(value));
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    createCategory(
      { name: newCategoryName, slug: newCategorySlug },
      {
        onSuccess: () => {
          toast({ title: "Category created successfully" });
          setNewCategoryName("");
          setNewCategorySlug("");
          setOpenDialog(false);
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.message || "Failed to create category",
            variant: "destructive",
          });
        },
      }
    );
  };;

  const handleDeleteCategoryClick = (id: string) => {
    deleteCategory(id, {
      onSuccess: () => {
        toast({ title: "Category deleted successfully" });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Failed to delete category",
          variant: "destructive",
        });
      },
    });
  };

  const handleEditClick = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditSlug(category.slug);
    setOpenEditDialog(true);
  };

  const handleUpdateCategory = () => {
    if (!editName.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      updateCategory(
        {
          id: editingId,
          data: {
            name: editName,
            slug: editSlug,
          },
        },
        {
          onSuccess: () => {
            toast({ title: "Category updated successfully" });
            setOpenEditDialog(false);
            setEditingId(null);
          },
          onError: (error: any) => {
            toast({
              title: "Error",
              description: error.message || "Failed to update category",
              variant: "destructive",
            });
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Categories</h1>
        <p className="text-muted-foreground">Manage perk categories</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-end mb-4">
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button
                className="bg-amber-400 hover:bg-amber-500 text-black gap-2"
                onClick={() => {
                  setNewCategoryName("");
                  setNewCategorySlug("");
                }}
              >
                <Plus className="w-4 h-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium block">
                    Category Name *
                  </label>
                  <Input
                    placeholder="e.g., SaaS Tools"
                    value={newCategoryName}
                    onChange={(e) => handleNewCategoryNameChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium block">
                    Slug
                  </label>
                  <Input
                    placeholder="auto-generated"
                    value={newCategorySlug}
                    onChange={(e) => setNewCategorySlug(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddCategory}
                    className="bg-amber-400 hover:bg-amber-500 text-black"
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Add"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg overflow-x-auto overflow-y-auto max-h-[600px]">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Subcategories
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.length > 0 ? (
                categories.map((category: Category) => (
                  <tr key={category.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 text-sm font-medium">{category.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {category.slug || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {category.subcategories_count || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(category.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(category)}
                          disabled={isUpdating}
                        >
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleDeleteCategoryClick(category.id)
                          }
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    No categories yet. Create your first category!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Category Dialog */}
        <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium block">
                  Category Name *
                </label>
                <Input
                  placeholder="e.g., SaaS Tools"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div className="spacehandleEditNameChangeY-2">
                <label className="text-sm font-medium block">
                  Slug
                </label>
                <Input
                  placeholder="auto-generated"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                />
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setOpenEditDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateCategory}
                  className="bg-amber-400 hover:bg-amber-500 text-black"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
