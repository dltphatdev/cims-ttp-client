import type { TQueryConfig } from '@/types/query-config'
import type { Revenue } from '@/types/revenue'

type PerformanceStatus = 'New' | 'Approved' | 'Cancelled'

export interface GetPerformancesParams extends Pick<TQueryConfig, 'limit' | 'page'> {
  name?: string | string[]
}

export interface CreatePerformanceReqBody {
  name: string
  customer_id: number | string
  note?: string
  status?: PerformanceStatus
  assign_at?: string
}

export interface Performance {
  id: number
  name: string
  customer_id: number
  creator_id: number
  note?: string
  status: PerformanceStatus
  operating_cost: number
  customer_care_cost: number
  commission_cost: number
  diplomatic_cost: number
  reserve_cost: number
  customer_cost: number
  created_at: string
  updated_at: string
  creator: {
    fullname: string
  }
  customer: {
    name: string
    id: number
  }
  revenues: Revenue[]
}

export interface Performances {
  performances: Performance[]
  page: number
  limit: number
  totalPages: number
}
