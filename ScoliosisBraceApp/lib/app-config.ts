export const appRoutes = {
  home: '/',
  login: '/auth/login',
  signUp: '/auth/sign-up',
  signUpSuccess: '/auth/sign-up-success',
  forgotPassword: '/auth/forgot-password',
  updatePassword: '/auth/update-password',
  protected: '/protected',
} as const

export const appConfig = {
  adminId: process.env.ADMIN_ID ?? '',
} as const

export function isAdminUser(userId?: string | null) {
  return Boolean(userId && appConfig.adminId && userId === appConfig.adminId)
}

export function getAuthRedirectUrl(path: string) {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${path}`
  }

  return path
}
