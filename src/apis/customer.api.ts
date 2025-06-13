import type { SuccessResponseApi } from '@/types/common'
import type { CreateCustomerReqBody, GetCustomersParams, GetListCustomer } from '@/types/customer'
import http from '@/utils/http'

const customerApi = {
  getCustomers(params: GetCustomersParams) {
    return http.get<SuccessResponseApi<GetListCustomer>>('customer', { params })
  },
  createCustomer(body: CreateCustomerReqBody) {
    return http.post<{ id: number; message: string }>('customer/create', body)
  },
  uploadFile(body: FormData) {
    return http.post<
      SuccessResponseApi<{
        url: string
        filename: string
        type: 'image' | 'video' | 'file'
      }>
    >('customer/upload-file', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default customerApi
