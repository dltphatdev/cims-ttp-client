import { useQueryParams } from '@/hooks/use-query-params'
import type { QueryConfig } from '@/types/query-config'
import { isUndefined, omitBy } from 'lodash'

export type TQueryConfig = {
  [key in keyof QueryConfig]: string | string[]
}

export default function useQueryConfig() {
  const queryParams: TQueryConfig = useQueryParams()
  const queryConfig: TQueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || '10',
      fullname: queryParams.fullname as string[],
      phone: queryParams.phone as string[]
    },
    isUndefined
  )
  return queryConfig
}
