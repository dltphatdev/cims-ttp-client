import * as yup from 'yup'
import { Helmet } from 'react-helmet-async'
import { Fragment } from 'react/jsx-runtime'
import { activitySchema } from '@/utils/validation'
import { useTranslation } from 'react-i18next'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { NEW } from '@/constants/activity'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import InputMain from '@/components/input-main'
import { useContext } from 'react'
import { AppContext } from '@/contexts/app-context'
import InputNumber from '@/components/input-number'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import DateTimePicker from '@/components/date-time-picker'
import { Button } from '@/components/ui/button'
import StatusSelect from '@/components/status-select'
import { useMutation } from '@tanstack/react-query'
import activityApi from '@/apis/activity.api'
import httpStatusCode from '@/constants/httpStatusCode'
import { toast } from 'sonner'
import { filterPayload, isSupperAdminAndSaleAdmin } from '@/utils/common'
import type { UserRole } from '@/types/user'
import { useNavigate } from 'react-router-dom'
import PATH from '@/constants/path'
import statuses from '@/pages/activities/mocks/status.mock'
import AddTagCustomer from '@/components/add-tag-customer'

const formData = activitySchema.pick([
  'name',
  'customer_id',
  'contact_name',
  'address',
  'phone',
  'status',
  'time_start',
  'time_end',
  'assign_at',
  'content'
])
type FormData = yup.InferType<typeof formData>

export default function ActivitiesCreate() {
  const navigate = useNavigate()
  const { t } = useTranslation('admin')
  const { profile } = useContext(AppContext)
  const {
    register,
    handleSubmit,
    setError,
    watch,
    reset,
    control,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(formData) as Resolver<FormData>,
    defaultValues: {
      name: '',
      customer_id: '',
      contact_name: '',
      address: '',
      phone: '',
      status: NEW,
      time_start: new Date(),
      time_end: new Date(),
      assign_at: '',
      content: ''
    }
  })
  const customerId = watch('customer_id')
  const timeStart = watch('time_start')
  const timeEnd = watch('time_end')

  const createActivityMutation = useMutation({
    mutationFn: activityApi.createActivity
  })

  const handleSubmitForm = handleSubmit(async (data) => {
    try {
      const payload = customerId
        ? {
            ...data,
            customer_id: customerId ? Number(data.customer_id) : '',
            assign_at: customerId ? new Date().toISOString() : '',
            time_start: timeStart ? data.time_start.toISOString() : '',
            time_end: timeEnd ? data.time_end.toISOString() : ''
          }
        : {
            ...data,
            time_start: timeStart ? data.time_start.toISOString() : '',
            time_end: timeEnd ? data.time_end.toISOString() : ''
          }
      const payloadData = filterPayload(payload)
      try {
        const res = await createActivityMutation.mutateAsync(payloadData)
        reset()
        toast.success(res.data.message)
        navigate(PATH.ACTIVITIES)
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
        <title>Thêm hoạt động - TTP Telecom</title>
        <meta name='keywords' content='Thêm hoạt động - TTP Telecom' />
        <meta name='description' content='Thêm hoạt động - TTP Telecom' />
      </Helmet>
      <div className='@container/main'>
        <div className='py-4 md:gap-6 md:py-6'>
          <div className='px-4 lg:px-6'>
            <h1 className='mb-4 font-bold text-2xl'>{t('Create activity')}</h1>
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
                    <Controller
                      control={control}
                      name='customer_id'
                      render={({ field }) => (
                        <AddTagCustomer
                          labelRequired={true}
                          value={field.value}
                          onChange={field.onChange}
                          errorMessage={errors.customer_id?.message}
                        />
                      )}
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
                            isHourMinuteSecond
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
                            isHourMinuteSecond
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
                      value={profile?.fullname}
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
                <Button disabled={createActivityMutation.isPending}>{t('Save')}</Button>
              </CardFooter>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
