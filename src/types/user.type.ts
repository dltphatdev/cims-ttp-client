import type { SuccessResponseApi } from '@/types/common.type'

export type UserRole = 'SuperAdmin' | 'Admin' | 'Sale'
export type UserVerifyStatus = 'Unverified' | 'Verified' | 'Banned'

export interface UserCreateReqBody {
  email: string
  password: string
}

export interface User {
  id: number
  email?: string
  fullname?: string
  verify: UserVerifyStatus
  avatar?: string
  address?: string
  phone?: string
  code?: string
  role?: UserRole
  date_of_birth?: string
  created_at?: string
  updated_at?: string
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

export interface BodyUpdateProfile {
  id: number
  date_of_birth?: string
  fullname?: string
  phone?: string
  address?: string
  code?: string
  password?: string
  role?: UserRole
  verify?: UserVerifyStatus
}
