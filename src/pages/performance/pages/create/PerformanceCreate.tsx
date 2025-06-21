import * as yup from 'yup'
import { performanceSchema } from '@/utils/validation'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Fragment } from 'react/jsx-runtime'
import { APPROVED, CANCELLED, NEW } from '@/constants/performanceStatus'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import InputMain from '@/components/input-main'
import { useContext } from 'react'
import { AppContext } from '@/contexts/app-context'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import AddTagCustomer from '@/components/add-tag-customer'
import StatusSelect from '@/components/status-select'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import performanceApi from '@/apis/performance.api'
import httpStatusCode from '@/constants/httpStatusCode'
import { toast } from 'sonner'

const formData = performanceSchema.pick(['name', 'customer_id', 'note', 'status'])
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

export default function PerformanceCreate() {
  const { t } = useTranslation('admin')
  const { profile } = useContext(AppContext)
  const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    control,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(formData) as Resolver<FormData>,
    defaultValues: {
      name: '',
      customer_id: '',
      note: '',
      status: NEW
    }
  })
  const customerId = watch('customer_id')

  const createPerformanceMutation = useMutation({
    mutationFn: performanceApi.createPerformance
  })

  const handleSubmitForm = handleSubmit(async (data) => {
    try {
      const payload = {
        ...data,
        customer_id: Number(customerId),
        assign_at: new Date()?.toISOString()
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
      const res = await createPerformanceMutation.mutateAsync(payload)
      reset()
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
        <title>Thêm mới hiệu quả - TTP Telecom</title>
        <meta name='keywords' content='Thêm mới hiệu quả - TTP Telecom' />
        <meta name='description' content='Thêm mới hiệu quả - TTP Telecom' />
      </Helmet>
      <div className='@container/main'>
        <div className='py-4 md:gap-6 md:py-6'>
          <div className='px-4 lg:px-6'>
            <h1 className='mb-2 font-bold text-2xl'>{t('Create performance')}</h1>
            <form onSubmit={handleSubmitForm}>
              <Card>
                <CardContent className='grid gap-3'>
                  <div className='grid gap-3'>
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
                      value={profile?.fullname}
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
