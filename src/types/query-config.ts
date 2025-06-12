export interface QueryConfig {
  page?: number | string
  limit?: number | string
}

export type TQueryConfig = {
  [key in keyof QueryConfig]: string | string[]
}
