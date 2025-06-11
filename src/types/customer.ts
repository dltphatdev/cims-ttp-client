import type { TQueryConfig } from '@/hooks/use-query-config'

type CustomerType = 'Personal' | 'Company'
type CustomerVerify = 'Unverified' | 'Verified'
type CustomerStatus = 'Active' | 'Deactivated'
type CustomerGender = 'Male' | 'Female'

export interface GetCustomersParams extends Pick<TQueryConfig, 'limit' | 'page' | 'phone'> {
  name?: string | string[] | undefined
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
>[]

export interface GetListCustomer {
  customers: Customers
  page: number
  limit: number
  totalPages: number
}
