import type { SuccessResponseApi } from '@/types/common.type'

type UserRole = 'SuperAdmin' | 'Admin' | 'Sale'
type UserVerifyStatus = 'Unverified' | 'Verified' | 'Banned'

export interface UserCreateReqBody {
  email: string
  password: string
}

export interface User {
  id: number
  email: string
  fullname: string
  verify: UserVerifyStatus
  avatar: string | null
  address: string | null
  phone: string | null
  code: string | null
  role: UserRole
  date_of_birth: string | null
  created_at: string | null
  updated_at: string | null
}

export interface GetListUser {
  users: User[]
  page: number
  limit: number
  totalPages: number
}

export type UserSuccessResponeApi = SuccessResponseApi<{
  access_token: string
  refresh_token: string
  expires_access_token: number
  expires_refresh_token: number
  user: User
}>

export type RefreshTokenReponse = SuccessResponseApi<{
  access_token: string
  refresh_token: string
  user: User
}>
