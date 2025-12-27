"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { useSubcategories, useCreateSubcategory, useUpdateSubcategory, useDeleteSubcategory } from "@/hooks/useSubcategories";
import { useCategories } from "@/hooks/useCategories";
import { useToast } from "@/hooks/use-toast";

interface Subcategory {
  id: string;
  name: string;
  category_id: string;
  slug?: string;
  created_at: string;
  categories?: {
    id: string;
    name: string;
  };
}

export default function Subcategories() {
  const { data: subcategories = [], isLoading } = useSubcategories();
  const { data: categories = [] } = useCategories();
  const { mutate: createSubcategory, isPending: isCreating } = useCreateSubcategory();
  const { mutate: updateSubcategory, isPending: isUpdating } = useUpdateSubcategory("");
  const { mutate: deleteSubcategory, isPending: isDeleting } = useDeleteSubcategory();
  const { toast } = useToast();

  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [newSubcategorySlug, setNewSubcategorySlug] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  };

  const handleAddSubcategory = () => {
    if (!newSubcategoryName.trim()) {
      toast({
        title: "Error",
        description: "Subcategory name is required",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCategoryId) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }

    createSubcategory(
      {
        name: newSubcategoryName,
        category_id: selectedCategoryId,
        slug: newSubcategorySlug || generateSlug(newSubcategoryName),
      },
      {
        onSuccess: () => {
          toast({ title: "Subcategory created successfully" });
          setNewSubcategoryName("");
          setNewSubcategorySlug("");
          setSelectedCategoryId(categories[0]?.id || "");
          setOpenDialog(false);
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.message || "Failed to create subcategory",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleUpdateSubcategory = () => {
    if (!editingSubcategory || !newSubcategoryName.trim()) {
      toast({
        title: "Error",
        description: "Subcategory name is required",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCategoryId) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }

    updateSubcategory(
      {
        id: editingSubcategory.id,
        data: {
          name: newSubcategoryName,
          category_id: selectedCategoryId,
          slug: newSubcategorySlug || generateSlug(newSubcategoryName),
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Subcategory updated successfully" });
          setEditingSubcategory(null);
          setNewSubcategoryName("");
          setNewSubcategorySlug("");
          setSelectedCategoryId(categories[0]?.id || "");
          setOpenDialog(false);
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.message || "Failed to update subcategory",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleDeleteSubcategory = (id: string) => {
    deleteSubcategory(id, {
      onSuccess: () => {
        toast({ title: "Subcategory deleted successfully" });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Failed to delete subcategory",
          variant: "destructive",
        });
      },
    });
  };

  const handleEditSubcategory = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setNewSubcategoryName(subcategory.name);
    setNewSubcategorySlug(subcategory.slug || "");
    setSelectedCategoryId(subcategory.category_id);
    setOpenDialog(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading subcategories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Subcategories</h1>
        <p className="text-muted-foreground">Manage subcategories for perks</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-end mb-4">
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button
                className="bg-amber-400 hover:bg-amber-500 text-black gap-2"
                onClick={() => {
                  setEditingSubcategory(null);
                  setNewSubcategoryName("");
                  setNewSubcategorySlug("");
                  setSelectedCategoryId(categories[0]?.id || "");
                }}
              >
                <Plus className="w-4 h-4" />
                Add Subcategory
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingSubcategory ? "Edit Subcategory" : "Add New Subcategory"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Parent Category *
                  </label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 bg-background"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category: any) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Subcategory Name *
                  </label>
                  <Input
                    placeholder="e.g., Close More Deals"
                    value={newSubcategoryName}
                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Slug (auto-generated)
                  </label>
                  <Input
                    placeholder="close-deals"
                    value={newSubcategorySlug || generateSlug(newSubcategoryName)}
                    onChange={(e) => setNewSubcategorySlug(e.target.value)}
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
                    onClick={
                      editingSubcategory
                        ? handleUpdateSubcategory
                        : handleAddSubcategory
                    }
                    className="bg-amber-400 hover:bg-amber-500 text-black"
                    disabled={isCreating || isUpdating}
                  >
                    {isCreating || isUpdating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {editingSubcategory ? "Updating..." : "Creating..."}
                      </>
                    ) : editingSubcategory ? (
                      "Update"
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
                  Parent Category
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Slug
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
              {subcategories.map((subcategory: Subcategory) => (
                <tr key={subcategory.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 text-sm font-medium">{subcategory.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {subcategory.categories?.name || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {subcategory.slug || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(subcategory.created_at).toLocaleDateString('en-US', { 
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
                        onClick={() => handleEditSubcategory(subcategory)}
                        disabled={isUpdating}
                      >
                        <Edit2 className="w-4 h-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSubcategory(subcategory.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
