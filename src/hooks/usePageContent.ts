import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface PageContent {
  id: string
  page_name: string
  content: string
  updated_at: string
}

export function usePageContent(pageName: string) {
  return useQuery({
    queryKey: ['page-content', pageName],
    queryFn: async () => {
      const res = await fetch(`/api/pages/${pageName}`)
      if (!res.ok) throw new Error('Failed to fetch page content')
      return res.json()
    },
    enabled: !!pageName,
  })
}

export function useUpdatePageContent(pageName: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (content: Partial<PageContent>) => {
      const res = await fetch(`/api/pages/${pageName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })
      if (!res.ok) throw new Error('Failed to update page content')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-content', pageName] })
    },
  })
}
