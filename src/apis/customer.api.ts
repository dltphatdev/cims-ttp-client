import type { SuccessResponseApi } from '@/types/common'
import type {
  CreateCustomerCompanyReqBody,
  CreateCustomerPersonalReqBody,
  GetCustomersParams,
  GetListCustomer
} from '@/types/customer'
import http from '@/utils/http'

const customerApi = {
  getCustomers(params: GetCustomersParams) {
    return http.get<SuccessResponseApi<GetListCustomer>>('customer', { params })
  },
  createCustomerCompany(body: CreateCustomerCompanyReqBody) {
    return http.post<{ id: number; message: string }>('customer/create', body)
  },
  createCustomerPersonal(body: CreateCustomerPersonalReqBody) {
    return http.post<{ id: number; message: string }>('customer/create', body)
  },
  uploadFiles(body: FormData) {
    return http.post<
      SuccessResponseApi<
        {
          url: string
          filename: string
          type: 'image' | 'video' | 'file'
        }[]
      >
    >('customer/upload-files', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default customerApi
