import type {
  Activity,
  CreateActivityReqBody,
  GetListActivityParams,
  GetListActivityRes,
  UpdateActivityReqBody
} from '@/types/activity'
import type { SuccessResponseApi } from '@/types/common'
import http from '@/utils/http'

const URL = 'activity'

const activityApi = {
  createActivity(body: CreateActivityReqBody) {
    return http.post<{ message: string }>(`${URL}/create`, body)
  },
  updateActivity(body: UpdateActivityReqBody) {
    return http.put<{ message: string }>(`${URL}/update`, body)
  },
  getDetailActivity(id: string) {
    return http.get<SuccessResponseApi<Activity>>(`${URL}/detail/${id}`)
  },
  getListActivity(params: GetListActivityParams) {
    return http.get<SuccessResponseApi<GetListActivityRes>>(URL, { params })
  }
}

export default activityApi
