import { useCallback } from 'react'

/**
 * Hook to handle reCAPTCHA v3 token generation
 * Requires NEXT_PUBLIC_RECAPTCHA_SITE_KEY to be set in environment
 */
export function useRecaptcha() {
  const waitForRecaptcha = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false

    // Wait up to 5 seconds for grecaptcha to load
    for (let i = 0; i < 50; i++) {
      if ((window as any).grecaptcha) {
        return true
      }
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    return false
  }, [])

  const getToken = useCallback(async (action: string = 'submit'): Promise<string | null> => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

    if (!siteKey) {
      return null
    }

    try {
      // Wait for reCAPTCHA script to load
      const isLoaded = await waitForRecaptcha()
      if (!isLoaded) {
        return null
      }

      // Generate token
      const token = await (window as any).grecaptcha.execute(siteKey, { action })
      return token
    } catch (error) {
      return null
    }
  }, [waitForRecaptcha])

  return { getToken }
}
