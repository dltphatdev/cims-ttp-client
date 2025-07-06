import httpStatusCode from '@/constants/httpStatusCode'
import type { ErrorResponseApi } from '@/types/common'
import type { UserRole } from '@/types/user'
import axios, { AxiosError } from 'axios'

export function isAxiosError<TypeError>(error: unknown): error is AxiosError<TypeError> {
  return axios.isAxiosError(error)
}

export function isAxiosUnauthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosError(error) && error.response?.status === httpStatusCode.Unauthorized
}

export function isAxiosExpiredTokenError<ExpiredTokenError>(error: unknown): error is AxiosError<ExpiredTokenError> {
  return (
    isAxiosUnauthorizedError<ErrorResponseApi<{ name: string; message: string }>>(error) &&
    error.response?.data?.data?.name === 'EXPIRED_TOKEN'
  )
}

export function formatedTime(isoDate?: string) {
  const date = isoDate ? new Date(isoDate) : null
  return date
    ? date.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Ho_Chi_Minh'
      })
    : ''
}

export function formatedDate(isoDate?: string) {
  const date = isoDate ? new Date(isoDate) : null
  return date
    ? date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'Asia/Ho_Chi_Minh'
      })
    : ''
}

export const getAvatarUrl = (nameAvatar?: string) =>
  nameAvatar ? `${import.meta.env.VITE_SERVER_URL}image/${nameAvatar}` : '/images/empty.png'

export const getFilesUrl = (filename?: string) =>
  filename ? `${import.meta.env.VITE_SERVER_URL}files/${filename}` : ''

export function formatNumberCurrency(currency: number) {
  return Intl.NumberFormat('de-DE').format(currency)
}

export function isSuperAdminRole(role: UserRole) {
  return role === 'SuperAdmin' ? true : false
}

export function isSupperAdminAndSaleAdmin(role: UserRole) {
  return role === 'SuperAdmin' || role === 'Admin' ? true : false
}
