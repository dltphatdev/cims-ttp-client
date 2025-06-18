import performanceApi from '@/apis/performance.api'
import FormattedDate from '@/components/formatted-date'
import SearchMain from '@/components/search-main'
import TableMain from '@/components/table-main'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { TableCell, TableRow } from '@/components/ui/table'
import { LIMIT, PAGE } from '@/constants/pagination'
import PATH from '@/constants/path'
import { PERFORMANCE_HEADER_TABLE } from '@/constants/table'
import { useQueryParams } from '@/hooks/use-query-params'
import type { GetPerformancesParams } from '@/types/performance'
import { formatNumberCurrency } from '@/utils/common'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { isUndefined, omitBy } from 'lodash'
import { Ellipsis, Plus } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Fragment } from 'react/jsx-runtime'

export default function PerformanceRead() {
  const navigate = useNavigate()
  const { t } = useTranslation('admin')
  const queryParams: GetPerformancesParams = useQueryParams()
  const queryConfig: GetPerformancesParams = omitBy(
    {
      page: queryParams.page,
      limit: queryParams.limit,
      name: queryParams.name as string[]
    },
    isUndefined
  )
  const { data: performanceData } = useQuery({
    queryKey: ['performances', queryConfig],
    queryFn: () => performanceApi.getPerformances(queryConfig)
  })

  const performances = performanceData?.data?.data?.performances
  const pagination = performanceData?.data?.data

  console.log(performances)
  return (
    <Fragment>
      <Helmet>
        <title>Hiệu quả - TTP Telecom</title>
        <meta name='keywords' content='Hiệu quả - TTP Telecom' />
        <meta name='description' content='Hiệu quả - TTP Telecom' />
      </Helmet>
      <div className='@container/main'>
        <div className='py-4 md:gap-6 md:py-6'>
          <div className='px-4 lg:px-6'>
            <div className='flex items-start flex-wrap justify-between mb-4 gap-3'>
              <SearchMain
                queryConfig={queryConfig}
                payloadField={{
                  text: 'name'
                }}
              />
              <Button variant='outline' onClick={() => navigate(PATH.PERFORMANCE_CREATE)}>
                <Plus /> {t('Create new')}
              </Button>
            </div>
            <TableMain
              headers={PERFORMANCE_HEADER_TABLE}
              page={pagination?.page.toString() || PAGE}
              page_size={pagination?.limit.toString() || LIMIT}
              data={performances}
              renderRow={(item, index) => {
                const revenue = item.revenues.reduce(
                  (result, current) => result + Number(current.price) * current.quantity,
                  0
                )
                const operatingCost = revenue && item.operating_cost ? revenue * item.operating_cost : 0
                const customerCareCost = revenue && item.customer_care_cost ? revenue * item.customer_care_cost : 0
                const commissionCost = revenue && item.commission_cost ? revenue * item.commission_cost : 0
                const diplomaticCost = revenue && item.diplomatic_cost ? revenue * item.diplomatic_cost : 0
                const reserveCost = revenue && item.reserve_cost ? revenue * item.reserve_cost : 0
                const customerCost = revenue && item.customer_cost ? revenue * item.customer_cost : 0
                const profit =
                  revenue -
                  operatingCost -
                  customerCareCost -
                  commissionCost -
                  diplomaticCost -
                  reserveCost -
                  customerCost
                const ratioProfit = profit / revenue
                return (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.customer.name}</TableCell>
                    <TableCell>{formatNumberCurrency(revenue) || 0} đ</TableCell>
                    <TableCell>{formatNumberCurrency(profit) || 0} đ</TableCell>
                    <TableCell>{ratioProfit || 0}%</TableCell>
                    <TableCell>{item.creator.fullname}</TableCell>
                    <TableCell>
                      <FormattedDate isoDate={item.created_at as string} />
                    </TableCell>
                    <TableCell>
                      <span
                        className={clsx('w-[150px] border-0 shadow-none focus:hidden', {
                          'text-(--color-green-custom)': item.status === 'Approved',
                          '!text-red-500': item.status === 'Cancelled',
                          '!text-yellow-500': item.status === 'New'
                        })}
                      >
                        {item.status === 'Approved'
                          ? t('Approved')
                          : item.status === 'New'
                            ? t('New')
                            : item.status === 'Cancelled'
                              ? t('Cancelled')
                              : ''}
                      </span>
                    </TableCell>
                    <TableCell className='ml-auto text-end'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className='border-2 border-gray-200' variant='ghost' size='sm'>
                            <Ellipsis className='w-4 h-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem onClick={() => navigate(`update/${item.id}`)}>{t('Edit')}</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              }}
            />
          </div>
        </div>
      </div>
    </Fragment>
  )
}
