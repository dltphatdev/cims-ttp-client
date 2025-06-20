export type TypeRevenue = 'OneTime' | 'EveryMonth'
export type RevenueDirection = 'In' | 'Out'

export interface Revenue {
  id: number
  name: string
  description: string
  unit_caculate: string
  type: TypeRevenue | string
  performance_id: number
  price: string
  quantity: number
  direction: RevenueDirection | string
  created_at: string
  updated_at: string
}

export interface CreateRevenueReqBody {
  name: string
  description: string
  unit_caculate: string
  type: TypeRevenue
  performance_id: number
  price: number
  quantity: number
  direction: RevenueDirection
}

export interface UpdateRevenueReqBody {
  id: number
  name?: string
  description?: string
  unit_caculate?: string
  type?: TypeRevenue | string
  price?: number
  quantity?: number
}

export interface GetDetailRevenueParams {
  direction?: RevenueDirection
}
