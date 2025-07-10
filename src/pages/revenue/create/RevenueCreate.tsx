import * as yup from 'yup'
import InputMain from '@/components/input-main'
import InputNumber from '@/components/input-number'
import SelectType from '@/components/select-type'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { EVERY_MONTH, ONE_TIME } from '@/constants/revenue'
import { revenueSchema } from '@/utils/validation'
import { Helmet } from 'react-helmet-async'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { Fragment } from 'react/jsx-runtime'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import revenueApi from '@/apis/revenue.api'
import httpStatusCode from '@/constants/httpStatusCode'
import type { TypeRevenue } from '@/types/revenue'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const types = [
  {
    key_type: ONE_TIME,
    key_value: 'Một lần'
  },
  {
    key_type: EVERY_MONTH,
    key_value: 'Hàng tháng'
  }
]

const formData = revenueSchema.pick(['name', 'description', 'price', 'quantity', 'type', 'unit_caculate'])
type FormData = yup.InferType<typeof formData>

const RevenueCreate = () => {
  const { t } = useTranslation('admin')
  const { state } = useLocation()
  const performanceId = state.performanceId
  const revenueDirection = state.revenueDirection
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    reset,
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

  const createRevenueMutation = useMutation({
    mutationFn: revenueApi.createRevenue
  })
  const handleSubmitForm = handleSubmit(async (data) => {
    try {
      const payload = {
        ...data,
        direction: revenueDirection,
        performance_id: Number(performanceId),
        quantity: Number(data.quantity),
        price: Number(data.price),
        type: data.type as TypeRevenue
      }
      const res = await createRevenueMutation.mutateAsync(payload)
      toast.success(res.data.message)
      reset()
      navigate(`/performance/update/${performanceId}`)
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
        <title>Thêm mới chi phí - TTP Telecom</title>
        <meta name='keywords' content='Thêm mới chi phí - TTP Telecom' />
        <meta name='description' content='Thêm mới chi phí - TTP Telecom' />
      </Helmet>
      <div className='@container/main'>
        <div className='py-4 md:gap-6 md:py-6'>
          <div className='px-4 lg:px-6'>
            <h1 className='mb-4 font-bold text-2xl'>Thêm chi phí</h1>
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
                    <Label htmlFor='description' className='text-sm font-medium light:text-gray-700'>
                      {t('Description')} <span className='text-red-500'>*</span>
                    </Label>
                    <Textarea {...register('description')} placeholder={t('Description')} />
                    {errors?.description && <span className='text-red-600'>{errors?.description?.message}</span>}
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
                </CardContent>
                <CardFooter>
                  <Button>{t('Save')}</Button>
                </CardFooter>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default RevenueCreate
