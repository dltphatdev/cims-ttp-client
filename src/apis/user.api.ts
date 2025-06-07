import type { SuccessResponseApi } from '@/types/common.type'
import type { GetListUser, UserCreateReqBody, UserSuccessResponeApi } from '@/types/user.type'
import http from '@/utils/http'

export const URL_LOGIN = 'user/login'
export const URL_LOGOUT = 'user/logout'
export const URL_REFRESH_TOKEN = 'user/refresh-token'

interface GetUserQuery {
  limit?: string
  page?: string
  fullname?: string
}

const userApi = {
  login(body: { email: string; password: string }) {
    return http.post<UserSuccessResponeApi>(URL_LOGIN, body)
  },
  logout(body: { refresh_token: string }) {
    return http.post<{ message: string }>(URL_LOGOUT, body)
  },
  getUsers(params: GetUserQuery) {
    return http.get<SuccessResponseApi<GetListUser>>('user', { params })
  },
  createUser(body: UserCreateReqBody) {
    return http.post<{ message: string }>('user/create', body)
  }
}

export default userApi
