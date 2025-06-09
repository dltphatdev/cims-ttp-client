import httpStatusCode from '@/constants/httpStatusCode'
import STATUS from '@/constants/status'
import type { ErrorResponseApi } from '@/types/common.type'
import axios, { AxiosError } from 'axios'
import type { TFunction } from 'i18next'

export function isAxiosError<TypeError>(error: unknown): error is AxiosError<TypeError> {
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError<UnprocessableEntityError>(
  error: unknown
): error is AxiosError<UnprocessableEntityError> {
  return isAxiosError(error) && error.response?.status === httpStatusCode.UnprocessableEntity
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

export function formatedTime(isoDate: string) {
  const date = new Date(isoDate)
  return date.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh'
  })
}

export function formatedDate(isoDate: string) {
  const date = new Date(isoDate)
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh'
  })
}

export function checkVerifyStatus({ statusVerify, t }: { statusVerify: string; t: TFunction }) {
  if (statusVerify === STATUS.VERIFIED) {
    return t('Verified')
  } else if (statusVerify === STATUS.UNVERIFIED) {
    return t('Unverified')
  } else if (statusVerify === STATUS.BANNED) {
    return t('Banned')
  } else {
    return ''
  }
}

export default function checkRoleUser(role: string) {
  if (role === 'SuperAdmin' || role === 'Admin') {
    return true
  }
  return false
}
