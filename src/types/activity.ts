import type { TQueryConfig } from '@/types/query-config'

export type ActivityStatus = 'New' | 'InProgress' | 'Completed' | 'Cancelled'

export interface GetListActivityParams extends Pick<TQueryConfig, 'limit' | 'page'> {
  name?: string | string[]
}

export interface CreateActivityReqBody {
  name: string
  customer_id: number
  contact_name: string
  address: string
  phone: string
  status: ActivityStatus
  time_start: string
  time_end: string
  content?: string
  assign_at?: string
}

export interface UpdateActivityReqBody {
  id: number
  name?: string
  customer_id?: number
  contact_name?: string
  address?: string
  phone?: string
  status?: ActivityStatus
  time_start?: string
  time_end?: string
  content?: string
  assign_at?: string
}

export interface Activity {
  id: number
  name: string
  customer_id: number
  address: string
  phone: string
  time_start: string
  time_end: string
  status: ActivityStatus
  contact_name: string
  created_at: string
  updated_at: string
  creator: {
    fullname: string
  }
  customer: {
    id: number
    name: string
  }
}

export interface GetListActivityRes {
  activities: Activity[]
  page: number
  limit: number
  totalPages: number
}
