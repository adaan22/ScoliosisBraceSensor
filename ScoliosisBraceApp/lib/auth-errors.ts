const rateLimitMessage =
  'Too many email requests were sent. Wait a few minutes before trying again, or ask an admin to confirm the account from Supabase.'

export function getAuthErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return 'An error occurred'
  }

  const message = error.message.trim()
  const normalized = message.toLowerCase()

  if (normalized.includes('rate limit') || normalized.includes('email rate limit')) {
    return rateLimitMessage
  }

  return message || 'An error occurred'
}
