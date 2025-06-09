import type { TQueryConfig } from '@/hooks/use-query-config'
import type { SuccessResponseApi } from '@/types/common.type'
import type { GetListUser, User, UserCreateReqBody, UserSuccessResponeApi } from '@/types/user.type'
import http from '@/utils/http'

export const URL_LOGIN = 'user/login'
export const URL_LOGOUT = 'user/logout'
export const URL_REFRESH_TOKEN = 'user/refresh-token'
export interface BodyUpdateProfile extends Omit<User, 'created_at' | 'updated_at' | 'email'> {
  password?: string
}

const userApi = {
  login(body: { email: string; password: string }) {
    return http.post<UserSuccessResponeApi>(URL_LOGIN, body)
  },
  logout(body: { refresh_token: string }) {
    return http.post<{ message: string }>(URL_LOGOUT, body)
  },
  getUsers(params: TQueryConfig) {
    return http.get<SuccessResponseApi<GetListUser>>('user', { params })
  },
  createUser(body: UserCreateReqBody) {
    return http.post<{ message: string }>('user/create', body)
  },
  getUserDetail(id: string) {
    return http.get<SuccessResponseApi<User>>(`user/detail/${id}`)
  },
  updateUser(body: BodyUpdateProfile) {
    return http.patch<SuccessResponseApi<User>>('user/update', body)
  }
}

export default userApi
