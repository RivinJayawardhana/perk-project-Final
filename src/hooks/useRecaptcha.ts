import { useCallback } from 'react'

/**
 * Hook to handle reCAPTCHA v3 token generation
 * Requires NEXT_PUBLIC_RECAPTCHA_SITE_KEY to be set in environment
 */
export function useRecaptcha() {
  const getToken = useCallback(async (action: string = 'submit'): Promise<string | null> => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

    if (!siteKey) {
      console.warn('NEXT_PUBLIC_RECAPTCHA_SITE_KEY not configured')
      return null
    }

    try {
      // Ensure reCAPTCHA script is loaded
      if (typeof window !== 'undefined' && !(window as any).grecaptcha) {
        console.warn('reCAPTCHA script not loaded')
        return null
      }

      // Generate token
      const token = await (window as any).grecaptcha.execute(siteKey, { action })
      return token
    } catch (error) {
      console.error('reCAPTCHA error:', error)
      return null
    }
  }, [])

  return { getToken }
}
