import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface JournalPost {
  id: string
  title: string
  content: string
  author?: string
  slug?: string
  created_at: string
  updated_at: string
}

export function useJournalPosts() {
  return useQuery({
    queryKey: ['journal-posts'],
    queryFn: async () => {
      const res = await fetch('/api/journal')
      if (!res.ok) throw new Error('Failed to fetch journal posts')
      return res.json()
    },
  })
}

export function useJournalPost(id: string) {
  return useQuery({
    queryKey: ['journal-post', id],
    queryFn: async () => {
      const res = await fetch(`/api/journal/${id}`)
      if (!res.ok) throw new Error('Failed to fetch journal post')
      return res.json()
    },
    enabled: !!id,
  })
}

export function useCreateJournalPost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (post: Partial<JournalPost>) => {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      })
      if (!res.ok) throw new Error('Failed to create journal post')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-posts'] })
    },
  })
}

export function useUpdateJournalPost(id: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (post: Partial<JournalPost>) => {
      const res = await fetch(`/api/journal/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      })
      if (!res.ok) throw new Error('Failed to update journal post')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-posts'] })
      queryClient.invalidateQueries({ queryKey: ['journal-post', id] })
    },
  })
}

export function useDeleteJournalPost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/journal/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete journal post')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-posts'] })
    },
  })
}
