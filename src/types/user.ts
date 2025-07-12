import type { SuccessResponseApi } from '@/types/common'
import type { TQueryConfig } from '@/types/query-config'

export interface GetUsersParams extends Pick<TQueryConfig, 'limit' | 'page'> {
  fullname?: string[]
  phone?: string[]
}

export type UserRole = 'SuperAdmin' | 'Admin' | 'Sale' | 'None' | 'Technician'
export type UserVerifyStatus = 'Unverified' | 'Verified' | 'Banned'

export interface UserCreateReqBody {
  email: string
  fullname?: string
  address?: string
  phone?: string
  code?: string
  date_of_birth?: string
  role?: UserRole
}

export interface User {
  id: number
  email: string
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
}

export interface ResetPasswordReqBody {
  id: number
  password: string
}

export interface BodyUserProfile extends Omit<BodyUpdateProfile, 'password' | 'verify' | 'role' | 'id'> {
  avatar?: string
}

export interface ChangePasswordUserReqBody {
  old_password?: string
  password?: string
}
