export type TypeRevenue = 'OneTime' | 'EveryMonth'
export type RevenueDirection = 'In' | 'Out'

export interface Revenue {
  id: number
  name: string
  description: string
  unit_caculate: string
  type: TypeRevenue
  performance_id: number
  price: string
  quantity: number
  direction: RevenueDirection
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
