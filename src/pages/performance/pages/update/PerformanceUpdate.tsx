import * as yup from 'yup'
import { Card, CardContent } from '@/components/ui/card'
import { APPROVED, CANCELLED, NEW } from '@/constants/performanceStatus'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Fragment } from 'react/jsx-runtime'
import { performanceSchema } from '@/utils/validation'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import performanceApi from '@/apis/performance.api'
import { useQuery } from '@tanstack/react-query'
import type { GetDetailPerformancesParams } from '@/types/performance'
import { useQueryParams } from '@/hooks/use-query-params'
import { isUndefined, omitBy } from 'lodash'
import { LIMIT, PAGE } from '@/constants/pagination'
import InputMain from '@/components/input-main'
import AddTagCustomer from '@/components/add-tag-customer'
import StatusSelect from '@/components/status-select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useEffect, useMemo } from 'react'
import { Ellipsis, Plus } from 'lucide-react'
import TableMain from '@/components/table-main'
import { REVENUE_INPUT_HEADER_TABLE, REVENUE_OUTPUT_HEADER_TABLE } from '@/constants/table'
import { TableCell, TableRow } from '@/components/ui/table'
import FormattedDate from '@/components/formatted-date'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { formatNumberCurrency } from '@/utils/common'

const formData = performanceSchema.pick([
  'name',
  'customer_id',
  'note',
  'status',
  'operating_cost',
  'customer_care_cost',
  'commission_cost',
  'diplomatic_cost',
  'reserve_cost',
  'customer_cost'
])
type FormData = yup.InferType<typeof formData>

const statuses = [
  {
    status_type: NEW,
    status_value: 'Mới'
  },
  {
    status_type: APPROVED,
    status_value: 'Đã duyệt'
  },
  {
    status_type: CANCELLED,
    status_value: 'Hủy'
  }
]

export default function PerformanceUpdate() {
  const { t } = useTranslation('admin')
  const { performanceId } = useParams()

  const {
    register,
    // handleSubmit,
    // setError,
    // watch,
    setValue,
    control,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(formData) as Resolver<FormData>,
    defaultValues: {
      name: '',
      customer_id: '',
      note: '',
      status: NEW,
      commission_cost: '',
      customer_care_cost: '',
      customer_cost: '',
      diplomatic_cost: '',
      operating_cost: '',
      reserve_cost: ''
    }
  })
  // const customerId = watch('customer_id')
  const queryParams: GetDetailPerformancesParams = useQueryParams()
  const queryConfig: GetDetailPerformancesParams = omitBy(
    {
      input_page: queryParams.input_page || PAGE,
      output_page: queryParams.output_page || PAGE,
      input_limit: queryParams.input_limit || LIMIT,
      output_limit: queryParams.output_limit || LIMIT
    },
    isUndefined
  )

  const { data: performanceData } = useQuery({
    queryKey: ['performance', queryConfig, performanceId],
    queryFn: () => performanceApi.getDetailPerformance({ id: performanceId as string, params: queryConfig })
  })
  const performanceDetail = performanceData?.data?.data
  const revenuesInput = performanceDetail?.revenueInput
  const revenuesOutput = performanceDetail?.revenueOutput
  useEffect(() => {
    if (performanceDetail) {
      setValue('name', performanceDetail.performance.name || '')
      setValue('status', performanceDetail.performance.status)
      setValue('note', performanceDetail.performance.note || '')
    }
  }, [performanceDetail, setValue])

  const revenueInputOneTime = revenuesInput?.filter((item) => item.type === 'OneTime')
  const revenueInputEveryMonth = revenuesInput?.filter((item) => item.type === 'EveryMonth')
  const revenueInputPriceOneTime = useMemo(
    () =>
      revenueInputOneTime?.reduce((result, current) => {
        return result + Number(current.price) * current.quantity
      }, 0),
    [revenueInputOneTime]
  )
  const revenueInputPriceEveryMonth = useMemo(
    () =>
      revenueInputEveryMonth?.reduce((result, current) => {
        return result + Number(current.price) * current.quantity
      }, 0),
    [revenueInputEveryMonth]
  )
  return (
    <Fragment>
      <Helmet>
        <title>Cập nhật hiệu quả - TTP Telecom</title>
        <meta name='keywords' content='Cập nhật hiệu quả - TTP Telecom' />
        <meta name='description' content='Cập nhật hiệu quả - TTP Telecom' />
      </Helmet>
      <div className='@container/main'>
        <div className='py-4 md:gap-6 md:py-6'>
          <div className='px-4 lg:px-6'>
            <h1 className='mb-2 font-bold text-2xl'>{t('Update performance')}</h1>
            <form>
              <Card className='mb-6'>
                <CardContent className='grid gap-3'>
                  <div className='grid gap-1'>
                    <InputMain
                      register={register}
                      name='name'
                      labelRequired={true}
                      labelValue={t('Title')}
                      type='text'
                      placeholder={t('Title')}
                      errorMessage={errors.name?.message}
                    />
                  </div>
                  <div className='grid gap-3'>
                    <AddTagCustomer
                      onExportId={(id) => {
                        if (id) setValue('customer_id', id.toString())
                      }}
                      defaultValue={
                        performanceDetail?.performance?.customer
                          ? {
                              name: performanceDetail?.performance?.customer.name,
                              id: performanceDetail?.performance?.customer.id
                            }
                          : undefined
                      }
                    />
                    {errors?.customer_id && <span className='text-red-600'>{errors?.customer_id?.message}</span>}
                  </div>
                  <div className='grid gap-3 select-none'>
                    <InputMain
                      labelValue={t('Creator')}
                      type='text'
                      placeholder={t('Creator')}
                      disabled={true}
                      value={performanceDetail?.performance.creator.fullname || ''}
                    />
                  </div>
                  <div className='grid gap-3'>
                    <Controller
                      control={control}
                      name='status'
                      render={({ field }) => (
                        <StatusSelect
                          {...field}
                          onChange={field.onChange}
                          statuses={statuses}
                          labelValue={t('Select status')}
                          errorMessage={errors.status?.message as string}
                          labelRequired={true}
                        />
                      )}
                    />
                  </div>
                  <div className='grid gap-3'>
                    <Label htmlFor='note' className='text-sm font-medium light:text-gray-700'>
                      {t('Note')}
                    </Label>
                    <Textarea {...register('note')} placeholder={t('Note')} />
                    {errors?.note && <span className='text-red-600'>{errors?.note?.message}</span>}
                  </div>
                </CardContent>

                {/* <CardFooter>
                  <Button>{t('Save')}</Button>
                </CardFooter> */}
              </Card>
              <div className='mb-6'>
                <h1 className='mb-2 font-bold text-2xl'>{t('Revenue input')}</h1>
                <Card className='overflow-x-auto'>
                  <CardContent className='grid gap-3'>
                    <div className='flex items-start flex-wrap justify-end mb-4 gap-3'>
                      <Button variant='outline'>
                        <Plus /> {t('Create new')}
                      </Button>
                    </div>
                    <TableMain
                      pageKey='input_page'
                      headers={REVENUE_INPUT_HEADER_TABLE}
                      page={performanceDetail?.inputPage.toString() || PAGE}
                      page_size={performanceDetail?.inputLimit.toString() || LIMIT}
                      data={revenuesInput}
                      renderRow={(item, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>
                            <div className='bg-[#E6F7FF] rounded-sm text-[#1890FF] w-fit px-2 py-1.5'>
                              {t(item.type)}
                            </div>
                          </TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.unit_caculate}</TableCell>
                          <TableCell>{formatNumberCurrency(Number(item.price))} đ</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            <FormattedDate isoDate={item.created_at as string} />
                          </TableCell>
                          <TableCell className='ml-auto text-end'>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button className='border-2 border-gray-200' variant='ghost' size='sm'>
                                  <Ellipsis className='w-4 h-4' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end'>
                                <DropdownMenuItem>{t('Edit')}</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )}
                    />
                    <div className='grid grid-cols-12 gap-4'>
                      <div className='mn:col-span-12 lg:col-span-6'>
                        <div className='py-2 px-4 rounded-md border border-color-[rgba(240,240,240,1)]'>
                          <strong>1.1 Chi phí một lần:</strong>
                          <strong className='text-gray-500'>
                            {' '}
                            {formatNumberCurrency(revenueInputPriceOneTime as number)} đ
                          </strong>
                        </div>
                      </div>
                      <div className='mn:col-span-12 lg:col-span-6'>
                        <div className='py-2 px-4 rounded-md border border-color-[rgba(240,240,240,1)]'>
                          <strong>1.2 Chi phí mỗi tháng:</strong>
                          <strong className='text-gray-500'>
                            {' '}
                            {formatNumberCurrency(revenueInputPriceEveryMonth as number)} đ
                          </strong>
                        </div>
                      </div>
                    </div>
                    <div className='grid gap-3'>
                      <div className='py-2 px-4 rounded-md border border-color-[rgba(240,240,240,1)]'>
                        <strong>Doanh thu:</strong>
                        <strong className='text-gray-500'>
                          {' '}
                          {formatNumberCurrency(
                            Number(revenueInputPriceEveryMonth) + Number(revenueInputPriceOneTime)
                          )}{' '}
                          đ
                        </strong>
                      </div>
                    </div>
                    {/* <div className='grid grid-cols-12 gap-4'>
                      <div className='mn:col-span-12 lg:col-span-6'>
                        <div className='py-2 px-4 rounded-md border border-color-[rgba(240,240,240,1)]'>
                          <strong>1.2 Chi phí CSKH</strong>
                          <strong className='text-gray-500'> 1312312321313213123</strong>
                        </div>
                      </div>
                      <div className='mn:col-span-12 lg:col-span-6'>
                        <div className='py-2 px-4 rounded-md border border-color-[rgba(240,240,240,1)]'>
                          <strong>Tổng chi phí</strong>
                          <strong className='text-gray-500'> 1312312321313213123</strong>
                        </div>
                      </div>
                    </div> */}
                  </CardContent>
                </Card>
              </div>
              <div>
                <h1 className='mb-2 font-bold text-2xl'>{t('Revenue output')}</h1>
                <Card className='overflow-x-auto'>
                  <CardContent className='grid gap-3'>
                    <div className='flex items-start flex-wrap justify-end mb-4 gap-3'>
                      <Button variant='outline'>
                        <Plus /> {t('Create new')}
                      </Button>
                    </div>
                    <TableMain
                      pageKey='output_page'
                      headers={REVENUE_OUTPUT_HEADER_TABLE}
                      page={performanceDetail?.outputPage.toString() || PAGE}
                      page_size={performanceDetail?.outputLimit.toString() || LIMIT}
                      data={revenuesOutput}
                      renderRow={(item, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>
                            <div className='bg-[#E6F7FF] rounded-sm text-[#1890FF] w-fit px-2 py-1.5'>
                              {t(item.type)}
                            </div>
                          </TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.unit_caculate}</TableCell>
                          <TableCell>{formatNumberCurrency(Number(item.price))} đ</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            <FormattedDate isoDate={item.created_at as string} />
                          </TableCell>
                          <TableCell className='ml-auto text-end'>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button className='border-2 border-gray-200' variant='ghost' size='sm'>
                                  <Ellipsis className='w-4 h-4' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end'>
                                <DropdownMenuItem>{t('Edit')}</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
