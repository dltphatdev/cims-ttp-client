import type { TQueryConfig } from '@/types/query-config'

export type ActivityStatus = 'New' | 'InProgress' | 'Completed' | 'Cancelled'

export interface GetListActivityParams extends Pick<TQueryConfig, 'limit' | 'page'> {
  name?: string | string[]
}

export interface CreateActivityReqBody {
  name: string
  contact_name: string
  address: string
  phone: string
  status?: ActivityStatus
  time_start: string
  time_end: string
  content?: string
}

export interface UpdateActivityReqBody {
  id: number
  name?: string
  contact_name?: string
  address?: string
  phone?: string
  status?: ActivityStatus
  time_start?: string
  time_end?: string
  content?: string
}

export interface Activity {
  id: number
  name: string
  address: string
  phone: string
  time_start: string
  time_end: string
  status: ActivityStatus
  contact_name: string
  creator_id: number
  content: string
  created_at: string
  updated_at: string
  creator: {
    fullname: string
  }
}

export interface GetListActivityRes {
  activities: Activity[]
  page: number
  limit: number
  totalPages: number
}
