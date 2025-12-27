import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface Subcategory {
  id: string
  name: string
  category_id: string
  slug?: string
  created_at: string
  categories?: {
    id: string
    name: string
    slug: string
  }
}

export function useSubcategories() {
  return useQuery({
    queryKey: ['subcategories'],
    queryFn: async () => {
      const res = await fetch('/api/subcategories')
      if (!res.ok) throw new Error('Failed to fetch subcategories')
      return res.json()
    },
  })
}

export function useSubcategory(id: string) {
  return useQuery({
    queryKey: ['subcategories', id],
    queryFn: async () => {
      const res = await fetch(`/api/subcategories/${id}`)
      if (!res.ok) throw new Error('Failed to fetch subcategory')
      return res.json()
    },
    enabled: !!id,
  })
}

export function useCreateSubcategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (subcategory: Partial<Subcategory>) => {
      const res = await fetch('/api/subcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subcategory),
      })
      if (!res.ok) throw new Error('Failed to create subcategory')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] })
    },
  })
}

export function useUpdateSubcategory(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { id: string; data: Partial<Subcategory> }) => {
      const res = await fetch(`/api/subcategories/${payload.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload.data),
      })
      if (!res.ok) throw new Error('Failed to update subcategory')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] })
    },
  })
}

export function useDeleteSubcategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/subcategories/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete subcategory')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] })
    },
  })
}
