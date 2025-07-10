import * as yup from 'yup'
import DateTimePicker from '@/components/date-time-picker'
import InputMain from '@/components/input-main'
import InputNumber from '@/components/input-number'
import StatusSelect from '@/components/status-select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Helmet } from 'react-helmet-async'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Fragment } from 'react/jsx-runtime'
import { activitySchema } from '@/utils/validation'
import { COMPLETED, IN_PROGRESS, NEW, CANCELLED } from '@/constants/activity'
import { yupResolver } from '@hookform/resolvers/yup'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import activityApi from '@/apis/activity.api'
import { useContext, useEffect } from 'react'
import { toast } from 'sonner'
import httpStatusCode from '@/constants/httpStatusCode'
import { isSupperAdminAndSaleAdmin } from '@/utils/common'
import { AppContext } from '@/contexts/app-context'
import type { UserRole } from '@/types/user'

const statuses = [
  {
    status_type: NEW,
    status_value: 'Mới'
  },
  {
    status_type: IN_PROGRESS,
    status_value: 'Đang thực hiện'
  },
  {
    status_type: COMPLETED,
    status_value: 'Hoàn thành'
  },
  {
    status_type: CANCELLED,
    status_value: 'Hủy'
  }
]

const formData = activitySchema.pick([
  'name',
  'contact_name',
  'address',
  'phone',
  'status',
  'time_start',
  'time_end',
  'content'
])
type FormData = yup.InferType<typeof formData>

export default function ActivitiesUpdate() {
  const { profile } = useContext(AppContext)
  const { t } = useTranslation('admin')
  const { activityId } = useParams()
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
      contact_name: '',
      address: '',
      phone: '',
      status: NEW,
      time_start: new Date(),
      time_end: new Date(),
      content: ''
    }
  })

  const { data: activity } = useQuery({
    queryKey: ['activity', activityId],
    queryFn: () => activityApi.getDetailActivity(activityId as string)
  })

  const updateActivityMutation = useMutation({
    mutationFn: activityApi.updateActivity
  })

  const activityDetail = activity?.data.data

  useEffect(() => {
    if (activityDetail) {
      setValue('name', activityDetail.name || '')
      setValue('contact_name', activityDetail.contact_name || '')
      setValue('address', activityDetail.address || '')
      setValue('phone', activityDetail.phone || '')
      // eslint-disable-next-line no-constant-binary-expression
      setValue('time_start', new Date(activityDetail?.time_start) || new Date())
      // eslint-disable-next-line no-constant-binary-expression
      setValue('time_end', new Date(activityDetail?.time_end) || new Date())
      setValue('content', activityDetail?.content || '')
      setValue('status', activityDetail?.status || NEW)
    }
  }, [activityDetail, setValue])

  const handleSubmitForm = handleSubmit(async (data) => {
    try {
      const payload = {
        ...data,
        id: Number(activityId),
        time_start: data.time_start.toISOString(),
        time_end: data.time_end.toISOString()
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
      const res = await updateActivityMutation.mutateAsync(payload)
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
        <title>Cập nhật hoạt động - TTP Telecom</title>
        <meta name='keywords' content='Cập nhật hoạt động - TTP Telecom' />
        <meta name='description' content='Cập nhật hoạt động - TTP Telecom' />
      </Helmet>
      <div className='@container/main'>
        <div className='py-4 md:gap-6 md:py-6'>
          <div className='px-4 lg:px-6'>
            <h1 className='mb-4 font-bold text-2xl'>{t('Update activity')}</h1>
            <form onSubmit={handleSubmitForm} noValidate>
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
                    <InputMain
                      register={register}
                      name='contact_name'
                      labelRequired={true}
                      labelValue={t('Contact name')}
                      type='text'
                      placeholder={t('Contact name')}
                      errorMessage={errors.contact_name?.message}
                    />
                  </div>
                  <div className='grid gap-3'>
                    <InputMain
                      register={register}
                      name='address'
                      labelRequired={true}
                      labelValue={t('Address')}
                      type='text'
                      placeholder={t('Address')}
                      errorMessage={errors.address?.message}
                    />
                  </div>
                  <div className='grid gap-3'>
                    <Controller
                      control={control}
                      name='phone'
                      render={({ field }) => (
                        <InputNumber
                          type='text'
                          placeholder={t('Phone')}
                          labelValue={t('Phone')}
                          {...field}
                          onChange={field.onChange}
                          errorMessage={errors.phone?.message}
                          labelRequired
                        />
                      )}
                    />
                  </div>
                  <div className='grid grid-cols-12 gap-4'>
                    <div className='mn:col-span-12 lg:col-span-6'>
                      <Controller
                        control={control}
                        name='time_start'
                        render={({ field }) => (
                          <DateTimePicker
                            onChange={field.onChange}
                            value={field.value as Date}
                            labelValue={t('Time start')}
                            labelRequired
                            errorMessage={errors.time_start?.message}
                          />
                        )}
                      />
                    </div>
                    <div className='mn:col-span-12 lg:col-span-6'>
                      <Controller
                        control={control}
                        name='time_end'
                        render={({ field }) => (
                          <DateTimePicker
                            onChange={field.onChange}
                            value={field.value as Date}
                            labelValue={t('Time end')}
                            labelRequired
                            errorMessage={errors.time_end?.message}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className='grid gap-3'>
                    <Label htmlFor='content' className='text-sm font-medium light:text-gray-700'>
                      {t('Content')}
                    </Label>
                    <Textarea {...register('content')} placeholder={t('Content')} />
                    {errors?.content && <span className='text-red-600'>{errors?.content?.message}</span>}
                  </div>
                  <div className='grid gap-3 select-none'>
                    <InputMain
                      labelValue={t('Creator')}
                      type='text'
                      placeholder={t('Creator')}
                      disabled={true}
                      value={activityDetail?.creator?.fullname || ''}
                    />
                  </div>
                  {isSupperAdminAndSaleAdmin(profile?.role as UserRole) && (
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
                  )}
                </CardContent>
              </Card>
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
