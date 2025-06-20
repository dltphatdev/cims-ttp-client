import type { SuccessResponseApi } from '@/types/common'
import type { CreateRevenueReqBody, GetDetailRevenueParams, Revenue, UpdateRevenueReqBody } from '@/types/revenue'
import http from '@/utils/http'
const URL = 'revenue'

const revenueApi = {
  createRevenue(body: CreateRevenueReqBody) {
    return http.post<SuccessResponseApi<Revenue>>(`${URL}/create`, body)
  },
  updateRevenue(body: UpdateRevenueReqBody) {
    return http.patch<{ message: string }>(`${URL}/update`, body)
  },
  getDetailRevenue({ id, params }: { id: string; params: GetDetailRevenueParams }) {
    return http.get<SuccessResponseApi<Revenue>>(`${URL}/detail/${id}`, { params })
  }
}

export default revenueApi
