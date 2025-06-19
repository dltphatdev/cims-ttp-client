import type { SuccessResponseApi } from '@/types/common'
import type { CreateRevenueReqBody, Revenue } from '@/types/revenue'
import http from '@/utils/http'
const URL = 'revenue'

const revenueApi = {
  createRevenue(body: CreateRevenueReqBody) {
    return http.post<SuccessResponseApi<Revenue>>(`${URL}/create`, body)
  }
}

export default revenueApi
