import TableMain from '@/components/table-main'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { TableCell, TableRow } from '@/components/ui/table'
import { Ellipsis, Plus } from 'lucide-react'
import activityApi from '@/apis/activity.api'
import { useQueryParams } from '@/hooks/use-query-params'
import type { GetListActivityParams } from '@/types/activity'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isUndefined, omitBy } from 'lodash'
import { Helmet } from 'react-helmet-async'
import { Fragment } from 'react/jsx-runtime'
import { ACTIVITY_HEADER_TABLE } from '@/constants/table'
import FormattedDate from '@/components/formatted-date'
import { LIMIT, PAGE } from '@/constants/pagination'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import SearchMain from '@/components/search-main'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PATH from '@/constants/path'
import AddTagCustomerDialog from '@/components/add-tag-customer-dialog'
import httpStatusCode from '@/constants/httpStatusCode'
import { toast } from 'sonner'

export default function ActivitiesRead() {
  const { t } = useTranslation('admin')
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [openTagCustomer, setOpenTagCustomer] = useState(false)
  const [selectedActivityId, setSelectedActivityId] = useState<number | undefined>()
  const queryParams: GetListActivityParams = useQueryParams()
  const queryConfig: GetListActivityParams = omitBy(
    {
      page: queryParams.page,
      limit: queryParams.limit,
      name: queryParams.name as string[]
    },
    isUndefined
  )
  const { data: activitiesData, refetch } = useQuery({
    queryKey: ['activities', queryConfig],
    queryFn: () => activityApi.getListActivity(queryConfig)
  })
  const updateActivityMutation = useMutation({
    mutationFn: activityApi.updateActivity
  })
  const activities = activitiesData?.data.data.activities
  const pagination = activitiesData?.data.data

  const handleAllocation = async (activityId: number, customerId: number) => {
    try {
      const res = await updateActivityMutation.mutateAsync({
        customer_id: customerId,
        id: activityId
      })
      toast.success(res.data.message)
      queryClient.invalidateQueries({ queryKey: ['activity', activityId] })

      refetch()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.status === httpStatusCode.UnprocessableEntity) {
        const formError = error.response?.data?.errors
        if (formError) {
          Object.keys(formError).forEach((key) => {
            toast.error(formError[key as keyof typeof formError]?.msg || 'Có lỗi xảy ra')
          })
        }
      }
    }
  }

  return (
    <Fragment>
      <Helmet>
        <title>Hoạt động - TTP Telecom</title>
        <meta name='keywords' content='Hoạt động - TTP Telecom' />
        <meta name='description' content='Hoạt động - TTP Telecom' />
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
              <Button variant='outline' type='button' onClick={() => navigate(PATH.ACTIVITIES_CREATE)}>
                <Plus /> {t('Create new')}
              </Button>
            </div>
            <TableMain
              headers={ACTIVITY_HEADER_TABLE}
              data={activities}
              page={pagination?.page.toString() || PAGE}
              page_size={pagination?.limit.toString() || LIMIT}
              renderRow={(item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.customer.name}</TableCell>
                  <TableCell>{item.creator.fullname}</TableCell>
                  <TableCell>
                    <FormattedDate isoDate={item.created_at as string} />
                  </TableCell>
                  <TableCell>
                    <FormattedDate isoDate={item.time_start as string} />
                  </TableCell>
                  <TableCell>
                    <FormattedDate isoDate={item.time_end as string} />
                  </TableCell>
                  <TableCell>
                    <span
                      className={clsx('w-[150px] border-0 shadow-none focus:hidden ', {
                        'text-(--color-green-custom)': item.status === 'Completed',
                        '!text-red-500': item.status === 'Cancelled',
                        '!text-yellow-500': item.status === 'New',
                        '!text-orange-500': item.status === 'InProgress'
                      })}
                    >
                      {item.status === 'New'
                        ? t('New')
                        : item.status === 'InProgress'
                          ? t('InProgress')
                          : item.status === 'Completed'
                            ? t('Completed')
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
                        <DropdownMenuItem onClick={() => navigate(`/activities/update/${item.id}`)}>
                          {t('Edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedActivityId(item.id)
                            setOpenTagCustomer(true)
                          }}
                        >
                          {t('Allocation')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )}
            />
          </div>
        </div>
      </div>
      <AddTagCustomerDialog
        openPopup={openTagCustomer}
        setOpenPopup={setOpenTagCustomer}
        onExportId={(id) => {
          if (selectedActivityId && id) handleAllocation(selectedActivityId, id)
        }}
      />
    </Fragment>
  )
}
