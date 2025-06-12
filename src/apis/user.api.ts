import type { SuccessResponseApi } from '@/types/common'
import type {
  BodyUpdateProfile,
  BodyUserProfile,
  ChangePasswordUserReqBody,
  GetListUser,
  GetUsersParams,
  User,
  UserCreateReqBody,
  UserSuccessResponeApi
} from '@/types/user'
import http from '@/utils/http'

export const URL_LOGIN = 'user/login'
export const URL_LOGOUT = 'user/logout'
export const URL_REFRESH_TOKEN = 'user/refresh-token'

const userApi = {
  login(body: { email: string; password: string }) {
    return http.post<UserSuccessResponeApi>(URL_LOGIN, body)
  },
  logout(body: { refresh_token: string }) {
    return http.post<{ message: string }>(URL_LOGOUT, body)
  },
  getUsers(params: GetUsersParams) {
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
  },
  updateProfile(body: BodyUserProfile) {
    return http.patch<SuccessResponseApi<User>>('user/profile', body)
  },
  getProfile() {
    return http.get<SuccessResponseApi<User>>('user/me')
  },
  uploadAvatar(body: FormData) {
    return http.post<
      SuccessResponseApi<{
        url: string
        filename: string
        type: 'image' | 'video' | 'file'
      }>
    >('user/upload-avatar', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  changePasswordUser(body: ChangePasswordUserReqBody) {
    return http.put<{ message: string }>('user/change-password', body)
  }
}

export default userApi
