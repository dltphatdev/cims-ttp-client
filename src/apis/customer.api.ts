import type { SuccessResponseApi } from '@/types/common'
import type { CreateCustomerReqBody, GetCustomersParams, GetListCustomer } from '@/types/customer'
import http from '@/utils/http'

const customerApi = {
  getCustomers(params: GetCustomersParams) {
    return http.get<SuccessResponseApi<GetListCustomer>>('customer', { params })
  },
  createCustomer(body: CreateCustomerReqBody) {
    return http.post<SuccessResponseApi<{ id: number }>>('customer/create', body)
  }
}

export default customerApi
