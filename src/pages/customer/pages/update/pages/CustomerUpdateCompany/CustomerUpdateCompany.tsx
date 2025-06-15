import * as yup from 'yup'
import InputMain from '@/components/input-main'
import InputNumber from '@/components/input-number'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Helmet } from 'react-helmet-async'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Fragment } from 'react/jsx-runtime'
import { customerSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { MALE } from '@/constants/gender'
import { UNVERIFIED } from '@/constants/customerVerify'
import { DEACTIVATED } from '@/constants/customerStatus'
import { COMPANY } from '@/constants/customerType'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import customerApi from '@/apis/customer.api'
import FileUploadMultiple from '@/components/file-upload-multiple'
import AddTagUser from '@/components/add-tag-user'
import httpStatusCode from '@/constants/httpStatusCode'
import { toast } from 'sonner'

const formData = customerSchema.pick([
  'name',
  'type',
  'consultantor_id',
  'tax_code',
  'website',
  'surrogate',
  'address_company',
  'address_personal',
  'phone',
  'email',
  'contact_name',
  'status',
  'verify',
  'attachments',
  'note',
  'assign_at',
  'date_of_birth',
  'gender',
  'cccd'
])

type FormData = yup.InferType<typeof formData>

const CustomerUpdateCompany = () => {
  const { customerId } = useParams()
  const { t } = useTranslation('admin')
  const [files, setFiles] = useState<File[]>()
  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    control,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      type: COMPANY,
      consultantor_id: '',
      tax_code: '',
      website: '',
      surrogate: '',
      address_company: '',
      address_personal: '',
      phone: '',
      email: '',
      contact_name: '',
      status: DEACTIVATED,
      verify: UNVERIFIED,
      attachments: [],
      note: '',
      assign_at: '',
      date_of_birth: new Date(1990, 0, 1),
      gender: MALE,
      cccd: ''
    },
    resolver: yupResolver(formData) as Resolver<FormData>
  })

  const filesAttachment = watch('attachments')
  const consultantorId = watch('consultantor_id')

  const { data: customerData } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => customerApi.getCustomerDetail(customerId as string)
  })
  const uploadFileAttachmentMutation = useMutation({
    mutationFn: customerApi.uploadFiles
  })
  const updateCustomerCompanyMutation = useMutation({
    mutationFn: customerApi.updateCustomerCompany
  })
  const customer = customerData?.data?.data

  useEffect(() => {
    if (customer) {
      setValue('name', customer.name || '')
      setValue('tax_code', customer.tax_code || '')
      setValue('cccd', customer.cccd || '')
      setValue('phone', customer.phone || '')
      setValue('surrogate', customer.surrogate || '')
      setValue('email', customer.email || '')
      setValue('website', customer.website || '')
      setValue('address_company', customer.address_company || '')
      setValue('note', customer.note || '')
    }
  }, [customer, setValue])

  const handleSubmitForm = handleSubmit(async (data) => {
    try {
      let attachments = filesAttachment
      if (files) {
        const form = new FormData()
        Array.from(files).forEach((file) => {
          form.append('attachments', file)
        })
        const uploadResponeArray = await uploadFileAttachmentMutation.mutateAsync(form)
        attachments = uploadResponeArray.data.data?.map((file) => file.filename)
        setValue('attachments', attachments)
      }
      const payload = consultantorId
        ? {
            ...data,
            attachments: attachments as string[] | undefined,
            consultantor_id: Number(consultantorId),
            assign_at: new Date()?.toISOString(),
            id: Number(customerId)
          }
        : {
            ...data,
            attachments: attachments as string[] | undefined,
            id: Number(customerId)
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
      const res = await updateCustomerCompanyMutation.mutateAsync(payload)
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

  const handleChangeFiles = (files?: File[]) => setFiles(files)

  return (
    <Fragment>
      <Helmet>
        <title>Cập nhật khách hàng doanh nghiệp - TTP Telecom</title>
        <meta name='keywords' content='Cập nhật khách hàng doanh nghiệp - TTP Telecom' />
        <meta name='description' content='Cập nhật khách hàng doanh nghiệp - TTP Telecom' />
      </Helmet>
      <div className='@container/main'>
        <div className='py-4 md:gap-6 md:py-6'>
          <div className='px-4 lg:px-6'>
            <h1 className='mb-2 font-bold text-2xl'>{t('Update customer company')}</h1>
            <form onSubmit={handleSubmitForm} noValidate>
              <Card>
                <CardContent className='grid gap-3'>
                  <div className='grid gap-3'>
                    <InputMain
                      register={register}
                      name='name'
                      labelValue={t('Name customer')}
                      type='text'
                      placeholder={t('Name customer')}
                      errorMessage={errors.name?.message}
                    />
                  </div>
                  <div className='grid gap-3'>
                    <Controller
                      control={control}
                      name='cccd'
                      render={({ field }) => (
                        <InputNumber
                          type='text'
                          placeholder={t('CCCD')}
                          labelValue={t('CCCD')}
                          {...field}
                          onChange={field.onChange}
                          errorMessage={errors.cccd?.message}
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
                      value={customer?.creator?.fullname || ''}
                    />
                  </div>
                  <div className='grid gap-3'>
                    <AddTagUser
                      onExportId={(id) => {
                        if (id) setValue('consultantor_id', id.toString())
                      }}
                      defaultValue={
                        customer?.consultantor
                          ? {
                              name: customer.consultantor.fullname,
                              id: customer.consultantor.id
                            }
                          : undefined
                      }
                    />
                  </div>
                  <div className='grid gap-3'>
                    <div className='grid grid-cols-12 gap-4'>
                      <div className='mn:col-span-12 lg:col-span-6'>
                        <Controller
                          control={control}
                          name='tax_code'
                          render={({ field }) => (
                            <InputNumber
                              type='text'
                              placeholder={t('Tax code')}
                              labelValue={t('Tax code')}
                              {...field}
                              onChange={field.onChange}
                              errorMessage={errors.tax_code?.message}
                            />
                          )}
                        />
                      </div>
                      <div className='mn:col-span-12 lg:col-span-6'>
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
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='grid gap-3'>
                    <div className='grid grid-cols-12 gap-4'>
                      <div className='mn:col-span-12 lg:col-span-6'>
                        <InputMain
                          register={register}
                          name='surrogate'
                          labelValue={t('Surrogate')}
                          type='text'
                          placeholder={t('Surrogate')}
                          errorMessage={errors.surrogate?.message}
                        />
                      </div>
                      <div className='mn:col-span-12 lg:col-span-6'>
                        <InputMain
                          register={register}
                          name='email'
                          labelValue={t('Email')}
                          type='email'
                          placeholder={t('Email')}
                          errorMessage={errors.email?.message}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='grid gap-3'>
                    <div className='grid grid-cols-12 gap-4'>
                      <div className='mn:col-span-12 lg:col-span-6'>
                        <InputMain
                          register={register}
                          name='website'
                          labelValue={t('Website')}
                          type='text'
                          placeholder={t('Website')}
                          errorMessage={errors.website?.message}
                        />
                      </div>
                      <div className='mn:col-span-12 lg:col-span-6'>
                        <InputMain
                          register={register}
                          name='address_company'
                          labelValue={t('Address company')}
                          type='text'
                          placeholder={t('Address company')}
                          errorMessage={errors.tax_code?.message}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='grid gap-3'>
                    <FileUploadMultiple defaultFiles={customer?.attachments} onChange={handleChangeFiles} />
                  </div>
                  <div className='grid gap-3'>
                    <Label htmlFor='note' className='text-sm font-medium light:text-gray-700'>
                      {t('Note')} <span className='text-red-500'>*</span>
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

export default CustomerUpdateCompany
