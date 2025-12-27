import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface Perk {
  id?: string
  name: string
  description: string
  category: string
  discount: string
  expiry: string
  location?: string
  status?: string
  image_url?: string
  logo_url?: string
  deal_type?: string
  deal_url?: string
  best_for?: string
  subcategory?: string
  created_at?: string
  updated_at?: string
}

export function usePerks() {
  return useQuery({
    queryKey: ['perks'],
    queryFn: async () => {
      const res = await fetch('/api/perks')
      if (!res.ok) throw new Error('Failed to fetch perks')
      return res.json()
    },
  })
}

export function usePerk(id: string) {
  return useQuery({
    queryKey: ['perk', id],
    queryFn: async () => {
      const res = await fetch(`/api/perks/${id}`)
      if (!res.ok) throw new Error('Failed to fetch perk')
      return res.json()
    },
    enabled: !!id,
  })
}

export function useCreatePerk() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (perk: Partial<Perk>) => {
      const res = await fetch('/api/perks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(perk),
      })
      if (!res.ok) throw new Error('Failed to create perk')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perks'] })
    },
  })
}

export function useUpdatePerk(id: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (perk: Partial<Perk>) => {
      const res = await fetch(`/api/perks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(perk),
      })
      if (!res.ok) throw new Error('Failed to update perk')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perks'] })
      queryClient.invalidateQueries({ queryKey: ['perk', id] })
    },
  })
}

export function useDeletePerk() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/perks/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete perk')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perks'] })
    },
  })
}
