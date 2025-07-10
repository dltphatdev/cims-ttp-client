import type { Activity } from '@/types/activity'
import type { TQueryConfig } from '@/types/query-config'
import type { UserRole } from '@/types/user'

export type CustomerType = 'Personal' | 'Company'
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
  created_at: string
  updated_at: string | null
  creator: {
    fullname: string
    id: number
  } | null
  consultantor: {
    user: {
      fullname: string
      id: number
      role: UserRole
    }
  }[]
  attachments: { filename: string }[]
  activityCustomers: Activity[]
}
export interface GetCustomerDetail {
  customer: Customer
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
  | 'creator_id'
>[]

export interface GetListCustomer {
  customers: Customers
  page: number
  limit: number
  totalPages: number
}

export interface CreateCustomerCompanyReqBody {
  name: string
  type?: CustomerType
  consultantor_ids?: number[]
  tax_code?: string
  cccd?: string
  website?: string
  surrogate?: string
  address_company?: string
  phone?: string
  email?: string
  contact_name?: string
  status?: CustomerStatus
  verify?: CustomerVerify
  attachments?: string[]
  note?: string
}

export interface CreateCustomerPersonalReqBody {
  name: string
  type?: CustomerType
  consultantor_ids?: number[]
  address_personal?: string
  phone?: string
  email?: string
  status?: CustomerStatus
  verify?: CustomerVerify
  attachments?: string[]
  note?: string
  date_of_birth?: Date | string
  gender?: CustomerGender
  cccd?: string
}

export interface UpdateCustomerCompanyReqBody
  extends Pick<
    CreateCustomerCompanyReqBody,
    | 'type'
    | 'consultantor_ids'
    | 'tax_code'
    | 'website'
    | 'surrogate'
    | 'address_company'
    | 'phone'
    | 'email'
    | 'contact_name'
    | 'status'
    | 'verify'
    | 'attachments'
    | 'note'
  > {
  id: number | string
  name?: string
}

export interface UpdateCustomerPersonalReqBody
  extends Pick<
    CreateCustomerPersonalReqBody,
    | 'type'
    | 'consultantor_ids'
    | 'address_personal'
    | 'phone'
    | 'email'
    | 'status'
    | 'verify'
    | 'attachments'
    | 'note'
    | 'date_of_birth'
    | 'gender'
  > {
  id: number | string
  name?: string
}
