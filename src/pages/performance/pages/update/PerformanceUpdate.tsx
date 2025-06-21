import * as yup from 'yup'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { APPROVED, CANCELLED, NEW } from '@/constants/performanceStatus'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Fragment } from 'react/jsx-runtime'
import { performanceSchema } from '@/utils/validation'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import performanceApi from '@/apis/performance.api'
import { useMutation, useQuery } from '@tanstack/react-query'
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
import InputNumber from '@/components/input-number'
import httpStatusCode from '@/constants/httpStatusCode'
import { toast } from 'sonner'
import RevenueTagsPrice from '@/pages/performance/components/revenue-tags-price'
import PATH from '@/constants/path'

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
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
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
      commission_cost: '0',
      customer_care_cost: '0',
      customer_cost: '0',
      diplomatic_cost: '0',
      operating_cost: '0',
      reserve_cost: '0'
    }
  })
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
  const updatePerformanceMutation = useMutation({
    mutationFn: performanceApi.updatePerformance
  })
  const performanceDetail = performanceData?.data?.data
  const revenuesInput = performanceDetail?.revenueInput
  const revenuesOutput = performanceDetail?.revenueOutput
  useEffect(() => {
    if (performanceDetail) {
      setValue('name', performanceDetail.performance.name || '')
      setValue('status', performanceDetail.performance.status)
      setValue('note', performanceDetail.performance.note || '')
      setValue('operating_cost', performanceDetail?.performance?.operating_cost.toString() || '0')
      setValue('customer_care_cost', performanceDetail?.performance?.customer_care_cost.toString() || '0')
      setValue('customer_cost', performanceDetail?.performance?.customer_cost.toString() || '0')
      setValue('diplomatic_cost', performanceDetail?.performance?.diplomatic_cost.toString() || '0')
      setValue('reserve_cost', performanceDetail?.performance?.reserve_cost.toString() || '0')
      setValue('commission_cost', performanceDetail?.performance?.commission_cost.toString() || '0')
      setValue('customer_id', performanceDetail?.performance?.customer_id.toString() || '0')
    }
  }, [performanceDetail, setValue])

  const revenueInputOneTime = useMemo(() => revenuesInput?.filter((item) => item.type === 'OneTime'), [revenuesInput])
  const revenueInputEveryMonth = useMemo(
    () => revenuesInput?.filter((item) => item.type === 'EveryMonth'),
    [revenuesInput]
  )
  const revenueOutputOneTime = useMemo(
    () => revenuesOutput?.filter((item) => item.type === 'OneTime'),
    [revenuesOutput]
  )

  const revenueOutputEveryMonth = useMemo(
    () => revenuesOutput?.filter((item) => item.type === 'EveryMonth'),
    [revenuesOutput]
  )
  const revenueInputPriceOneTime = useMemo(
    () =>
      revenueInputOneTime?.reduce((result, current) => {
        return result + Number(current.price) * current.quantity
      }, 0),
    [revenueInputOneTime]
  ) // chi phi dau vao 1 lan
  const revenueOutputPriceOneTime = useMemo(
    () =>
      revenueOutputOneTime?.reduce((result, current) => {
        return result + Number(current.price) * current.quantity
      }, 0),
    [revenueOutputOneTime]
  ) // chi phi dau ra 1 lan

  const revenueInputPriceEveryMonth = useMemo(
    () =>
      revenueInputEveryMonth?.reduce((result, current) => {
        return result + Number(current.price) * current.quantity
      }, 0),
    [revenueInputEveryMonth]
  ) // chi phi dau vao hang thang

  const revenueOuputPriceEveryMonth = useMemo(
    () =>
      revenueOutputEveryMonth?.reduce((result, current) => {
        return result + Number(current.price) * current.quantity
      }, 0),
    [revenueOutputEveryMonth]
  ) // chi phi dau ra hang thang

  const revenueOutputPrice = useMemo(
    () => Number(revenueOutputPriceOneTime) + Number(revenueOuputPriceEveryMonth),
    [revenueOutputPriceOneTime, revenueOuputPriceEveryMonth]
  ) // tong chi phi dau ra

  const revenuePrice = useMemo(
    () => Number(revenueInputPriceEveryMonth) + Number(revenueInputPriceOneTime),
    [revenueInputPriceEveryMonth, revenueInputPriceOneTime]
  ) // doanh thu
  const revenueOperatingCostPrice = useMemo(
    () => revenuePrice * Number(performanceDetail?.performance.operating_cost),
    [performanceDetail?.performance.operating_cost, revenuePrice]
  ) // chi phi van hanh
  const revenueCustomerCareCostPrice = useMemo(
    () => revenuePrice * Number(performanceDetail?.performance.customer_care_cost),
    [revenuePrice, performanceDetail?.performance.customer_care_cost]
  ) // chi phi CSKH
  const revenueManagerCompany = useMemo(
    () => revenueOperatingCostPrice + revenueCustomerCareCostPrice,
    [revenueOperatingCostPrice, revenueCustomerCareCostPrice]
  ) // chi phi quan ly cong ty
  const revenueCommissionCostPrice = useMemo(
    () => revenuePrice * Number(performanceDetail?.performance?.commission_cost),
    [revenuePrice, performanceDetail?.performance?.commission_cost]
  ) // chi phi hoa hong
  const revenueDiplomaticCostPrice = useMemo(
    () => revenuePrice * Number(performanceDetail?.performance?.diplomatic_cost),
    [revenuePrice, performanceDetail?.performance?.diplomatic_cost]
  ) // chi phi ngoai giao
  const revenueCustomerCostPrice = useMemo(
    () => revenuePrice * Number(performanceDetail?.performance?.customer_cost),
    [revenuePrice, performanceDetail?.performance?.customer_cost]
  ) // chi phi khach hang
  const revenueReserveCostPrice = useMemo(
    () => revenuePrice * Number(performanceDetail?.performance?.reserve_cost),
    [revenuePrice, performanceDetail?.performance?.reserve_cost]
  ) // chi phi du phong
  const revenueCommissionDiplomaticCustomerReserve = useMemo(
    () => revenueCommissionCostPrice + revenueDiplomaticCostPrice + revenueCustomerCostPrice + revenueReserveCostPrice,
    [revenueCommissionCostPrice, revenueDiplomaticCostPrice, revenueCustomerCostPrice, revenueReserveCostPrice]
  ) // Chi phí hoa hồng, thưởng, NG, xử lý
  const costOfSales = useMemo(
    () => revenueCommissionDiplomaticCustomerReserve + revenueOutputPrice,
    [revenueCommissionDiplomaticCustomerReserve, revenueOutputPrice]
  ) // Giá vốn bán hàng

  const revenueTax = useMemo(
    () => revenuePrice - costOfSales - revenueCommissionCostPrice,
    [revenuePrice, costOfSales, revenueCommissionCostPrice]
  ) // Chi phí đóng thuế TNCN

  const revenueTotal = useMemo(
    () => revenueManagerCompany + costOfSales + revenueTax,
    [revenueManagerCompany, costOfSales, revenueTax]
  ) // Tổng chi phí

  const profit = useMemo(() => revenuePrice - revenueTotal, [revenuePrice, revenueTotal]) // Lợi nhuận

  const ratioProfit = useMemo(() => (profit / revenuePrice) * 100, [profit, revenuePrice]) // Tỉ lệ lợi nhuận

  const ratioCostOfSalesRevenuePrice = useMemo(() => (costOfSales / revenuePrice) * 100, [costOfSales, revenuePrice]) // Giá vốn bán hàng/ Doanh thu

  const handleSubmitForm = handleSubmit(async (data) => {
    try {
      const payloadOptions = {
        operating_cost: Number(data.operating_cost),
        customer_care_cost: Number(data.customer_care_cost),
        commission_cost: Number(data.commission_cost),
        diplomatic_cost: Number(data.diplomatic_cost),
        reserve_cost: Number(data.reserve_cost),
        customer_cost: Number(data.customer_cost)
      }

      const payload = {
        ...data,
        ...payloadOptions,
        customer_id: Number(data.customer_id),
        assign_at: new Date()?.toISOString(),
        id: Number(performanceId)
      }

      for (const key in payload) {
        if (
          payload[key as keyof typeof payload] === undefined ||
          payload[key as keyof typeof payload] === '' ||
          payload[key as keyof typeof payload] === null
        ) {
          delete payload[key as keyof typeof payload]
        }
      }
      const res = await updatePerformanceMutation.mutateAsync(payload)
      toast.success(res.data.message)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.status === httpStatusCode.UnprocessableEntity) {
        const formError = error.response?.data?.errors
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData]['msg'],
              type: 'Server'
            })
          })
        }
      }
    }
  })

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
            <form onSubmit={handleSubmitForm} noValidate>
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
                    <Controller
                      control={control}
                      name='customer_id'
                      render={({ field }) => (
                        <AddTagCustomer
                          labelRequired={true}
                          {...field}
                          onChange={field.onChange}
                          name={performanceDetail?.performance?.customer.name}
                          errorMessage={errors.customer_id?.message}
                        />
                      )}
                    />
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
              </Card>

              <div className='mb-6'>
                <Card className='overflow-x-auto'>
                  <CardContent className='grid gap-3'>
                    <div className='flex items-center flex-wrap justify-between mb-4 gap-3'>
                      <h1 className='font-bold text-xl'>A. Doanh thu (trước VAT)</h1>
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() =>
                          navigate(PATH.REVENUE_CREATE, {
                            state: {
                              revenueDirection: 'In',
                              performanceId
                            }
                          })
                        }
                      >
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
                                <DropdownMenuItem onClick={() => navigate(`/revenue/update/${item.id}?direction=In`)}>
                                  {t('Edit')}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )}
                    />

                    <div className='grid grid-cols-12 gap-4'>
                      <div className='mn:col-span-12 lg:col-span-6'>
                        <RevenueTagsPrice label='Chi phí một lần:' price={revenueInputPriceOneTime as number} />
                      </div>
                      <div className='mn:col-span-12 lg:col-span-6'>
                        <RevenueTagsPrice label='Chi phí mỗi tháng:' price={revenueInputPriceEveryMonth as number} />
                      </div>
                    </div>
                    <div className='grid gap-3'>
                      <RevenueTagsPrice label='Doanh thu:' price={revenuePrice as number} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className='mb-6'>
                <Card className='overflow-x-auto'>
                  <CardContent className='grid gap-3'>
                    <div className='flex items-center flex-wrap justify-between mb-4 gap-3'>
                      <h1 className='mb-2 font-bold text-xl'>B. Chi phí</h1>
                      <Button
                        variant='outline'
                        type='button'
                        onClick={() =>
                          navigate(PATH.REVENUE_CREATE, {
                            state: {
                              revenueDirection: 'Out',
                              performanceId
                            }
                          })
                        }
                      >
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
                                <DropdownMenuItem onClick={() => navigate(`/revenue/update/${item.id}?direction=Out`)}>
                                  {t('Edit')}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )}
                    />
                    <div className='grid gap-3'>
                      <div className='grid grid-cols-12 gap-4'>
                        <div className='mn:col-span-12 lg:col-span-6'>
                          <Controller
                            control={control}
                            name='operating_cost'
                            render={({ field }) => (
                              <InputNumber
                                type='text'
                                placeholder='Nhập % chi phí vận hành'
                                labelValue='Chi phí vận hành (%)'
                                {...field}
                                onChange={field.onChange}
                                errorMessage={errors.operating_cost?.message}
                                labelRequired
                              />
                            )}
                          />
                        </div>
                        <div className='mn:col-span-12 lg:col-span-6'>
                          <Controller
                            control={control}
                            name='customer_care_cost'
                            render={({ field }) => (
                              <InputNumber
                                type='text'
                                placeholder='Nhập % chi phí CSKH'
                                labelValue='Chi phí CSKH (%)'
                                {...field}
                                onChange={field.onChange}
                                errorMessage={errors.customer_care_cost?.message}
                                labelRequired
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='grid gap-3'>
                      <div className='grid grid-cols-12 gap-4'>
                        <div className='mn:col-span-12 lg:col-span-6'>
                          <Controller
                            control={control}
                            name='commission_cost'
                            render={({ field }) => (
                              <InputNumber
                                type='text'
                                placeholder='Nhập % chi phí hoa hồng'
                                labelValue='Chi phí hoa hồng (%)'
                                {...field}
                                onChange={field.onChange}
                                errorMessage={errors.commission_cost?.message}
                                labelRequired
                              />
                            )}
                          />
                        </div>
                        <div className='mn:col-span-12 lg:col-span-6'>
                          <Controller
                            control={control}
                            name='diplomatic_cost'
                            render={({ field }) => (
                              <InputNumber
                                type='text'
                                placeholder='Nhập % chi phí ngoại giao'
                                labelValue='Chi phí ngoại giao (%)'
                                {...field}
                                onChange={field.onChange}
                                errorMessage={errors.diplomatic_cost?.message}
                                labelRequired
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='grid gap-3'>
                      <div className='grid grid-cols-12 gap-4'>
                        <div className='mn:col-span-12 lg:col-span-6'>
                          <Controller
                            control={control}
                            name='reserve_cost'
                            render={({ field }) => (
                              <InputNumber
                                type='text'
                                placeholder='Nhập % chi phí dự phòng'
                                labelValue='Chi phí dự phòng (%)'
                                {...field}
                                onChange={field.onChange}
                                errorMessage={errors.reserve_cost?.message}
                                labelRequired
                              />
                            )}
                          />
                        </div>
                        <div className='mn:col-span-12 lg:col-span-6'>
                          <Controller
                            control={control}
                            name='customer_cost'
                            render={({ field }) => (
                              <InputNumber
                                type='text'
                                placeholder='Nhập % chi phí khách hàng'
                                labelValue='Chi phí khách hàng (%)'
                                {...field}
                                onChange={field.onChange}
                                errorMessage={errors.customer_cost?.message}
                                labelRequired
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='grid gap-3'>
                      <RevenueTagsPrice label='1. Chi phí quản lý công ty:' price={revenueManagerCompany as number} />
                    </div>
                    <div className='grid grid-cols-12 gap-4'>
                      <div className='mn:col-span-12 lg:col-span-6'>
                        <RevenueTagsPrice label='1.1 Chi phí vận hành:' price={revenueOperatingCostPrice as number} />
                      </div>
                      <div className='mn:col-span-12 lg:col-span-6'>
                        <RevenueTagsPrice label='1.2 Chi phí CSKH:' price={revenueCustomerCareCostPrice as number} />
                      </div>
                    </div>

                    <div className='grid gap-3'>
                      <RevenueTagsPrice label='2. Giá vốn bán hàng:' price={costOfSales as number} />
                    </div>

                    <div className='grid grid-cols-12 gap-4'>
                      <div className='mn:col-span-12 lg:col-span-6'>
                        <RevenueTagsPrice label='2.1 Chi phí đầu vào:' price={revenueOutputPrice as number} />
                      </div>
                      <div className='mn:col-span-12 lg:col-span-6'>
                        <RevenueTagsPrice
                          label='2.2 Chi phí hoa hồng, thưởng, ngoại giao, xử lý:'
                          price={revenueCommissionDiplomaticCustomerReserve as number}
                        />
                      </div>
                    </div>

                    <div className='grid grid-cols-12 gap-4'>
                      <div className='mn:col-span-12 lg:col-span-6'>
                        <RevenueTagsPrice
                          label='2.2.1 Chi phí hoa hồng:'
                          price={revenueCommissionCostPrice as number}
                        />
                      </div>
                      <div className='mn:col-span-12 lg:col-span-6'>
                        <RevenueTagsPrice
                          label='2.2.2 Chi phí ngoại giao:'
                          price={revenueDiplomaticCostPrice as number}
                        />
                      </div>
                    </div>

                    <div className='grid grid-cols-12 gap-4'>
                      <div className='mn:col-span-12 lg:col-span-6'>
                        <RevenueTagsPrice
                          label='2.2.3 Chi phí cho khách hàng:'
                          price={revenueCustomerCostPrice as number}
                        />
                      </div>
                      <div className='mn:col-span-12 lg:col-span-6'>
                        <RevenueTagsPrice label='2.2.4 Chi phí dự phòng:' price={revenueReserveCostPrice as number} />
                      </div>
                    </div>
                    <div className='grid gap-3'>
                      <RevenueTagsPrice label='3. Chi phí đóng thuế TNCN:' price={revenueTax as number} />
                    </div>
                    <div className='grid gap-3'>
                      <RevenueTagsPrice label='Tổng chi phí:' price={revenueTotal as number} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardContent className='grid gap-3'>
                    <div className='flex items-start flex-wrap justify-between mb-4 gap-3'>
                      <h1 className='font-bold text-xl'>C. Chỉ số</h1>
                    </div>
                    <div className='grid grid-cols-12 gap-4'>
                      <div className='mn:col-span-12 lg:col-span-4'>
                        <RevenueTagsPrice label='Lợi nhuận:' price={profit as number} />
                      </div>
                      <div className='mn:col-span-12 lg:col-span-4'>
                        <div className='py-2 px-4 rounded-md border border-color-[rgba(240,240,240,1)]'>
                          <strong>Tỉ lệ lợi nhuận:</strong>
                          <strong className='text-gray-500'> {ratioProfit + '%'}</strong>
                        </div>
                      </div>
                      <div className='mn:col-span-12 lg:col-span-4'>
                        <div className='py-2 px-4 rounded-md border border-color-[rgba(240,240,240,1)]'>
                          <strong>Giá vốn bán hàng/ Doanh thu:</strong>
                          <strong className='text-gray-500'> {Math.round(ratioCostOfSalesRevenuePrice) + '%'}</strong>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <CardFooter className='mt-6 p-0'>
                <Button>{t('Save')}</Button>
              </CardFooter>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
