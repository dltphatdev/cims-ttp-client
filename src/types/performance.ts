import type { TQueryConfig } from '@/types/query-config'
import type { Revenue } from '@/types/revenue'

type PerformanceStatus = 'New' | 'Approved' | 'Cancelled'

export interface GetPerformancesParams extends Pick<TQueryConfig, 'limit' | 'page'> {
  name?: string | string[]
}

export type GetDetailPerformancesParams = {
  input_page?: string | number
  output_page?: string | number
  input_limit?: string | number
  output_limit?: string | number
}

export interface CreatePerformanceReqBody {
  name: string
  customer_id: number | string
  note?: string
  status?: PerformanceStatus
  assign_at?: string
}

export interface UpdatePerformanceReqBody {
  id: number | string
  name?: string
  customer_id: number | string
  note?: string
  status?: PerformanceStatus
  assign_at?: string
  operating_cost?: number | string
  customer_care_cost?: number | string
  commission_cost?: number
  diplomatic_cost?: number | string
  reserve_cost?: number | string
  customer_cost?: number | string
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

export interface GetDetailPerformance {
  performance: Performance
  revenueInput: Revenue[]
  revenueOutput: Revenue[]
  totalRevenueInput: number
  totalRevenueOutput: number
  inputPage: number
  outputPage: number
  inputLimit: number
  outputLimit: number
}
