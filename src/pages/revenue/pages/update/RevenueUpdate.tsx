import * as yup from 'yup'
import InputMain from '@/components/input-main'
import InputNumber from '@/components/input-number'
import SelectType from '@/components/select-type'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { revenueSchema } from '@/utils/validation'
import { Helmet } from 'react-helmet-async'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Fragment } from 'react/jsx-runtime'
import { ONE_TIME } from '@/constants/revenue'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import revenueApi from '@/apis/revenue.api'
import type { GetDetailRevenueParams } from '@/types/revenue'
import { useQueryParams } from '@/hooks/use-query-params'
import { isUndefined, omitBy } from 'lodash'
import { useEffect } from 'react'
import httpStatusCode from '@/constants/httpStatusCode'
import { toast } from 'sonner'
import { filterPayload, formatedDate, formatedTime } from '@/utils/common'
import types from '@/pages/revenue/mocks/types.mock'
import TextAreaMain from '@/components/textarea-main'

const formData = revenueSchema.pick(['name', 'description', 'price', 'quantity', 'type', 'unit_caculate'])
type FormData = yup.InferType<typeof formData>

export default function RevenueUpdate() {
  const { t } = useTranslation('admin')
  const { revenueId } = useParams()
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
      description: '',
      price: '',
      quantity: '',
      type: ONE_TIME,
      unit_caculate: ''
    }
  })

  const queryParams: GetDetailRevenueParams = useQueryParams()
  const queryConfig: GetDetailRevenueParams = omitBy(
    {
      direction: queryParams.direction || 'In'
    },
    isUndefined
  )

  const { data: revenueData, refetch } = useQuery({
    queryKey: ['revenue', queryConfig, revenueId],
    queryFn: () => revenueApi.getDetailRevenue({ id: revenueId as string, params: queryConfig })
  })
  const updateRevenueMutation = useMutation({
    mutationFn: revenueApi.updateRevenue
  })
  const revenue = revenueData?.data.data
  useEffect(() => {
    if (revenue) {
      setValue('name', revenue.name || '')
      setValue('description', revenue.description || '')
      setValue('price', revenue.price || '')
      setValue('type', revenue.type || '')
      setValue('unit_caculate', revenue.unit_caculate || '')
      setValue('quantity', revenue.quantity.toString() || '')
    }
  }, [revenue, setValue])

  const handleSubmitForm = handleSubmit(async (data) => {
    try {
      const payload = {
        ...data,
        id: Number(revenueId),
        quantity: Number(data.quantity),
        price: Number(data.price)
      }
      const payloadData = filterPayload(payload)
      const res = await updateRevenueMutation.mutateAsync(payloadData)
      toast.success(res.data.message)
      refetch()
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
        <title>Cập nhật chi phí - TTP Telecom</title>
        <meta name='keywords' content='Cập nhật chi phí - TTP Telecom' />
        <meta name='description' content='Cập nhật chi phí - TTP Telecom' />
      </Helmet>
      <div className='@container/main'>
        <div className='py-4 md:gap-6 md:py-6'>
          <div className='px-4 lg:px-6'>
            <h1 className='mb-4 font-bold text-2xl'>Cập nhật chi phí</h1>
            <form onSubmit={handleSubmitForm} noValidate>
              <Card>
                <CardContent className='grid gap-3'>
                  <div className='grid gap-3'>
                    <InputMain
                      register={register}
                      name='name'
                      labelRequired={true}
                      labelValue={t('Revenue title')}
                      type='text'
                      placeholder={t('Revenue title')}
                      errorMessage={errors.name?.message}
                    />
                  </div>
                  <div className='grid gap-3'>
                    <Controller
                      control={control}
                      name='type'
                      render={({ field }) => (
                        <SelectType
                          {...field}
                          onChange={field.onChange}
                          types={types}
                          labelValue={t('Type')}
                          errorMessage={errors.type?.message as string}
                          labelRequired={true}
                        />
                      )}
                    />
                  </div>
                  <div className='grid gap-3'>
                    <TextAreaMain
                      name='description'
                      labelRequired
                      register={register}
                      errorMessage={errors.description?.message}
                      placeholder={t('Description')}
                      labelValue={t('Description')}
                    />
                  </div>
                  <div className='grid gap-3'>
                    <InputMain
                      register={register}
                      name='unit_caculate'
                      labelRequired={true}
                      labelValue={t('Caculate unit')}
                      type='text'
                      placeholder={t('Caculate unit')}
                      errorMessage={errors.unit_caculate?.message}
                    />
                  </div>
                  <div className='grid gap-3'>
                    <Controller
                      control={control}
                      name='price'
                      render={({ field }) => (
                        <InputNumber
                          type='text'
                          placeholder={t('Price')}
                          labelValue={t('Price')}
                          {...field}
                          onChange={field.onChange}
                          errorMessage={errors.price?.message}
                          labelRequired
                        />
                      )}
                    />
                  </div>
                  <div className='grid gap-3'>
                    <Controller
                      control={control}
                      name='quantity'
                      render={({ field }) => (
                        <InputNumber
                          type='text'
                          placeholder={t('Quantity')}
                          labelValue={t('Quantity')}
                          {...field}
                          onChange={field.onChange}
                          errorMessage={errors.quantity?.message}
                          labelRequired
                        />
                      )}
                    />
                  </div>
                  <div className='grid gap-3'>
                    <div className='grid grid-cols-12 gap-4'>
                      <div className='mn:col-span-12 lg:col-span-6'>
                        <div className='select-none'>
                          <InputMain
                            value={`${formatedTime(revenue?.created_at as string)} ${formatedDate(revenue?.created_at as string)}`}
                            labelValue={t('Created at')}
                            type='text'
                            disabled={true}
                          />
                        </div>
                      </div>
                      <div className='mn:col-span-12 lg:col-span-6'>
                        <div className='select-none'>
                          <InputMain
                            value={`${formatedTime(revenue?.updated_at as string)} ${formatedDate(revenue?.updated_at as string)}`}
                            labelValue={t('Updated at')}
                            type='text'
                            disabled={true}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button disabled={updateRevenueMutation.isPending}>{t('Save')}</Button>
                </CardFooter>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
