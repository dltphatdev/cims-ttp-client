import type { SuccessResponseApi } from '@/types/common.type'
import type { GetCustomersParams, GetListCustomer } from '@/types/customer'
import http from '@/utils/http'

const customerApi = {
  getCustomers(params: GetCustomersParams) {
    return http.get<SuccessResponseApi<GetListCustomer>>('customer', { params })
  }
}

export default customerApi
