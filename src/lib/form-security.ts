import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Verify reCAPTCHA v3 token with Google
 */
export async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.warn('RECAPTCHA_SECRET_KEY not configured')
    return false
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    })

    const data = await response.json()
    
    // Consider it verified if score is above 0.5 (adjust as needed)
    // reCAPTCHA v3 returns a score between 0 and 1
    return data.success && (data.score || 0) > 0.5
  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    return false
  }
}

/**
 * Check rate limit for a given IP and endpoint
 * Returns true if the submission should be allowed (under limit)
 */
export async function checkRateLimit(
  ip: string,
  endpoint: string,
  maxRequests: number = 5,
  windowMinutes: number = 60
): Promise<boolean> {
  try {
    // Get the time window start
    const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString()

    console.log(`Rate limit check - IP: ${ip}, Endpoint: ${endpoint}, Window: ${windowMinutes}min, Max: ${maxRequests}`)

    // Count recent submissions from this IP on this endpoint
    const { data, error, count } = await supabase
      .from('submission_logs')
      .select('*', { count: 'exact' })
      .eq('ip', ip)
      .eq('endpoint', endpoint)
      .gte('created_at', windowStart)

    if (error) {
      console.error('Rate limit check error:', error)
      // On error, allow the request to proceed (fail open)
      return true
    }

    const submissionCount = count || 0
    console.log(`Rate limit - Found ${submissionCount} submissions in window (max: ${maxRequests})`)
    
    const isAllowed = submissionCount < maxRequests
    console.log(`Rate limit result: ${isAllowed ? 'ALLOWED' : 'BLOCKED'}`)
    
    return isAllowed
  } catch (error) {
    console.error('Rate limit check error:', error)
    // On error, allow the request to proceed (fail open)
    return true
  }
}

/**
 * Log a submission for rate limiting purposes
 */
export async function logSubmission(ip: string, endpoint: string): Promise<void> {
  try {
    await supabase.from('submission_logs').insert({
      ip,
      endpoint,
    })
  } catch (error) {
    console.error('Error logging submission:', error)
    // Don't throw - logging failure shouldn't block the request
  }
}

/**
 * Get client IP from request
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  
  let ip = 'unknown'
  
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    ip = forwardedFor.split(',')[0].trim()
  } else if (realIp) {
    ip = realIp
  }
  
  console.log(`Detected client IP: ${ip} (from-forwarded-for: ${forwardedFor}, x-real-ip: ${realIp})`)
  return ip
}
