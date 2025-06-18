import type { SuccessResponseApi } from '@/types/common'
import type { CreatePerformanceReqBody, GetPerformancesParams, Performances } from '@/types/performance'
import http from '@/utils/http'

const URL = 'performance'

const performanceApi = {
  getPerformances(params: GetPerformancesParams) {
    return http.get<SuccessResponseApi<Performances>>(URL, { params })
  },
  createPerformance(body: CreatePerformanceReqBody) {
    return http.post<{ id: number; message: string }>(`${URL}/create`, body)
  }
}

export default performanceApi
