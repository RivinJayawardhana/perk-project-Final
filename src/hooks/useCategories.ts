import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  subcategories_count?: number
  created_at: string
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories')
      if (!res.ok) throw new Error('Failed to fetch categories')
      return res.json()
    },
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (category: Partial<Category>) => {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      })
      if (!res.ok) throw new Error('Failed to create category')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (payload: { id: string; data: Partial<Category> }) => {
      const res = await fetch(`/api/categories/${payload.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload.data),
      })
      if (!res.ok) throw new Error('Failed to update category')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete category')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useSubcategories(categoryId: string) {
  return useQuery({
    queryKey: ['subcategories', categoryId],
    queryFn: async () => {
      const res = await fetch(`/api/categories/${categoryId}/subcategories`)
      if (!res.ok) throw new Error('Failed to fetch subcategories')
      return res.json()
    },
    enabled: !!categoryId,
  })
}

export function useCreateSubcategory(categoryId: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (subcategory: any) => {
      const res = await fetch(`/api/categories/${categoryId}/subcategories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subcategory),
      })
      if (!res.ok) throw new Error('Failed to create subcategory')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories', categoryId] })
    },
  })
}
