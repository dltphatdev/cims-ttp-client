import type { TQueryConfig } from '@/types/query-config'

type CustomerType = 'Personal' | 'Company'
type CustomerVerify = 'Unverified' | 'Verified'
type CustomerStatus = 'Active' | 'Deactivated'
type CustomerGender = 'Male' | 'Female'

export interface GetCustomersParams extends Pick<TQueryConfig, 'limit' | 'page'> {
  name?: string | string[] | undefined
  phone?: string[]
}

export interface Customer {
  id: number
  name: string
  type: CustomerType
  gender: CustomerGender
  email: string | null
  phone: string | null
  address_company: string | null
  address_personal: string | null
  note: string | null
  attachment: string | null
  tax_code: string | null
  cccd: string | null
  website: string | null
  surrogate: string | null
  contact_name: string | null
  date_of_birth: string | null
  status: CustomerStatus
  verify: CustomerVerify
  assign_at: string | null
  creator_id: number
  consultantor_id: number | null
  created_at: string
  updated_at: string | null
  creator: {
    fullname: string
  } | null
  consultantor: {
    fullname: string
  } | null
}

type Customers = Pick<
  Customer,
  | 'id'
  | 'name'
  | 'type'
  | 'status'
  | 'verify'
  | 'tax_code'
  | 'cccd'
  | 'phone'
  | 'contact_name'
  | 'created_at'
  | 'creator'
  | 'consultantor'
  | 'address_company'
  | 'address_personal'
>[]

export interface GetListCustomer {
  customers: Customers
  page: number
  limit: number
  totalPages: number
}

export interface CreateCustomerReqBody {
  name: string
  type: CustomerType
  consultantor_id?: number
  tax_code?: string
  website?: string
  surrogate?: string
  address_company?: string
  address_personal?: string
  phone?: string
  email?: string
  contact_name?: string
  status?: CustomerStatus
  verify?: CustomerVerify
  attachment?: string
  note?: string
  assign_at?: string
  date_of_birth?: string
  gender?: CustomerGender
}
