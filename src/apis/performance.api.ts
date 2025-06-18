import type { SuccessResponseApi } from '@/types/common'
import type {
  CreatePerformanceReqBody,
  GetDetailPerformance,
  GetDetailPerformancesParams,
  GetPerformancesParams,
  Performances,
  UpdatePerformanceReqBody
} from '@/types/performance'
import http from '@/utils/http'

const URL = 'performance'

const performanceApi = {
  getPerformances(params: GetPerformancesParams) {
    return http.get<SuccessResponseApi<Performances>>(URL, { params })
  },
  getDetailPerformance({ id, params }: { id: string; params: GetDetailPerformancesParams }) {
    return http.get<SuccessResponseApi<GetDetailPerformance>>(`${URL}/detail/${id}`, { params })
  },
  createPerformance(body: CreatePerformanceReqBody) {
    return http.post<{ id: number; message: string }>(`${URL}/create`, body)
  },
  updatePerformance(body: UpdatePerformanceReqBody) {
    return http.patch<{ message: string }>(`${URL}/update`, body)
  }
}

export default performanceApi
