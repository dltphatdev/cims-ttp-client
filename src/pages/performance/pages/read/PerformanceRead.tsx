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
import { AppContext } from '@/contexts/app-context'
import { useQueryParams } from '@/hooks/use-query-params'
import type { GetPerformancesParams } from '@/types/performance'
import type { UserRole } from '@/types/user'
import { formatNumberCurrency, isSupperAdminAndSaleAdmin } from '@/utils/common'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { isUndefined, omitBy } from 'lodash'
import { Ellipsis, Plus } from 'lucide-react'
import { useContext, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Fragment } from 'react/jsx-runtime'

export default function PerformanceRead() {
  const { profile } = useContext(AppContext)
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

  const extendedPerformances = useMemo(() => {
    if (performances)
      return performances
        .map((item) => ({
          ...item,
          revenueInput: item.revenues.filter((i) => i.direction === 'In'),
          revenueOutput: item.revenues.filter((i) => i.direction === 'Out')
        }))
        .filter((item) => {
          const profileId = profile?.id
          const profileRole = profile?.role
          const isCreator = item.creator_id === profileId
          const isRule = isSupperAdminAndSaleAdmin(profileRole as UserRole)
          return isCreator || isRule ? item : undefined
        })
  }, [performances, profile?.role, profile?.id])
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
              totalPage={
                extendedPerformances && extendedPerformances?.length > 0 ? (pagination?.totalPages as number) : 0
              }
              headerClassNames={['', '', '', '', '', '', '', '', '', 'text-right']}
              headers={PERFORMANCE_HEADER_TABLE}
              page={pagination?.page.toString() || PAGE}
              page_size={pagination?.limit.toString() || LIMIT}
              data={extendedPerformances}
              renderRow={(item, index) => {
                const revenuePrice = item.revenueInput.reduce(
                  (result, current) => result + Number(current.price) * current.quantity,
                  0
                ) // doanh thu
                const revenueOperatingCostPrice = item.operating_cost * revenuePrice
                const revenueCustomerCareCostPrice = item.customer_care_cost * revenuePrice
                const revenueManagerCompany = revenueOperatingCostPrice + revenueCustomerCareCostPrice // 1
                const revenueOutputPrice = item.revenueOutput.reduce(
                  (result, current) => result + Number(current.price) * current.quantity,
                  0
                )
                const revenueCommissionCostPrice = revenuePrice * item.commission_cost
                const revenueDiplomaticCostPrice = revenuePrice * item.diplomatic_cost
                const revenueCustomerCostPrice = revenuePrice * item.customer_cost
                const revenueReserveCostPrice = revenuePrice * item.reserve_cost
                const revenueCommissionDiplomaticCustomerReserve =
                  revenueCommissionCostPrice +
                  revenueDiplomaticCostPrice +
                  revenueCustomerCostPrice +
                  revenueReserveCostPrice
                const costOfSales = revenueCommissionDiplomaticCustomerReserve + revenueOutputPrice // 2
                const revenueTax = revenuePrice - costOfSales - revenueCommissionCostPrice // 3
                const profit = revenuePrice - revenueManagerCompany - costOfSales - revenueTax
                const ratioProfit = profit / revenuePrice
                return (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.customer.name}</TableCell>
                    <TableCell>{formatNumberCurrency(revenuePrice) || 0} đ</TableCell>
                    <TableCell>{formatNumberCurrency(profit) || 0} đ</TableCell>
                    <TableCell>{ratioProfit * 100 || 0}%</TableCell>
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
