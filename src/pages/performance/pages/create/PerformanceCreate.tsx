import * as yup from 'yup'
import { performanceSchema } from '@/utils/validation'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Fragment } from 'react/jsx-runtime'
import { NEW } from '@/constants/performanceStatus'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import InputMain from '@/components/input-main'
import { useContext } from 'react'
import { AppContext } from '@/contexts/app-context'
import AddTagCustomer from '@/components/add-tag-customer'
import StatusSelect from '@/components/status-select'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import performanceApi from '@/apis/performance.api'
import httpStatusCode from '@/constants/httpStatusCode'
import { toast } from 'sonner'
import { filterPayload, isSupperAdminAndSaleAdmin } from '@/utils/common'
import type { UserRole } from '@/types/user'
import { useNavigate } from 'react-router-dom'
import PATH from '@/constants/path'
import statuses from '@/pages/performance/mocks/statuses.mock'
import TextAreaMain from '@/components/textarea-main'

const formData = performanceSchema.pick(['name', 'customer_id', 'note', 'status'])
type FormData = yup.InferType<typeof formData>

export default function PerformanceCreate() {
  const navigate = useNavigate()
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
      const payloadData = filterPayload(payload)
      const res = await createPerformanceMutation.mutateAsync(payloadData)
      toast.success(res.data.message)
      reset()
      navigate(PATH.PERFORMANCE)
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
                          name=''
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
                  <div className='grid gap-3'>
                    <TextAreaMain
                      name='note'
                      register={register}
                      errorMessage={errors.note?.message}
                      placeholder={t('Note')}
                      labelValue={t('Note')}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button disabled={createPerformanceMutation.isPending}>{t('Save')}</Button>
                </CardFooter>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
