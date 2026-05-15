export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  meta?: PaginationMeta
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface JwtPayload {
  sub: string
  email: string
  tenantId: string
  role: string
  iat: number
  exp: number
}

export interface TenantContext {
  tenantId: string
  slug: string
  plan: string
}

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}
