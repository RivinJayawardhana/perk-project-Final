import { useMutation, useQueryClient } from '@tanstack/react-query'

export interface ContactSubmission {
  name: string
  email: string
  message: string
}

export function useSubmitContact() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (submission: ContactSubmission) => {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      })
      if (!res.ok) throw new Error('Failed to submit contact form')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] })
    },
  })
}
