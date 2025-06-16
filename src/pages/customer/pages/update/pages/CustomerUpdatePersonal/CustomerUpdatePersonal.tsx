import * as yup from 'yup'
import InputMain from '@/components/input-main'
import InputNumber from '@/components/input-number'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Helmet } from 'react-helmet-async'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { Fragment } from 'react/jsx-runtime'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { PERSONAL } from '@/constants/customerType'
import { DEACTIVATED } from '@/constants/customerStatus'
import { UNVERIFIED, VERIFIED } from '@/constants/customerVerify'
import { FEMALE, MALE } from '@/constants/gender'
import { yupResolver } from '@hookform/resolvers/yup'
import { customerSchema } from '@/utils/validation'
import AddTagUser from '@/components/add-tag-user'
import GenderSelect from '@/components/gender-select'
import DateSelect from '@/components/date-select'
import FileUploadMultiple from '@/components/file-upload-multiple'
import { useMutation, useQuery } from '@tanstack/react-query'
import customerApi from '@/apis/customer.api'
import httpStatusCode from '@/constants/httpStatusCode'
import { toast } from 'sonner'
import { formatedDate, formatedTime } from '@/utils/common'

const genders = [
  {
    gender_type: MALE,
    gender_value: 'Male'
  },
  {
    gender_type: FEMALE,
    gender_value: 'Female'
  }
]

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

const CustomerUpdatePersonal = () => {
  const { customerId } = useParams()
  const { t } = useTranslation('admin')
  const [files, setFiles] = useState<File[]>()
  const [isVerifyCustomer, setIsVerifyCustomer] = useState<boolean>(false)
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
      type: PERSONAL,
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
      gender: MALE
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
  const updateCustomerPersonalMutation = useMutation({
    mutationFn: customerApi.updateCustomePersonal
  })
  const customer = customerData?.data?.data

  useEffect(() => {
    if (customer) {
      setValue('name', customer.name || '')
      setValue('cccd', customer.cccd || '')
      setValue('email', customer.email || '')
      setValue('phone', customer.phone || '')
      setValue('gender', customer.gender || MALE)
      setValue('address_personal', customer.address_personal || '')
      setValue('date_of_birth', customer?.date_of_birth ? new Date(customer.date_of_birth) : new Date(1990, 0, 1))
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
            date_of_birth: data.date_of_birth?.toISOString(),
            attachments: attachments as string[] | undefined,
            consultantor_id: Number(consultantorId),
            assign_at: new Date()?.toISOString(),
            id: Number(customerId)
          }
        : {
            ...data,
            date_of_birth: data.date_of_birth?.toISOString(),
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
      const res = await updateCustomerPersonalMutation.mutateAsync(payload)
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

  const handleClickVerifyCustomer = () => {
    setIsVerifyCustomer(!isVerifyCustomer)
    setValue('verify', VERIFIED)
    toast.success(t('Verify is choosen'))
  }
  return (
    <Fragment>
      <Helmet>
        <title>Cập nhật khách hàng cá nhân - TTP Telecom</title>
        <meta name='keywords' content='Cập nhật khách hàng cá nhân - TTP Telecom' />
        <meta name='description' content='Cập nhật khách hàng cá nhân - TTP Telecom' />
      </Helmet>
      <div className='@container/main'>
        <div className='py-4 md:gap-6 md:py-6'>
          <div className='px-4 lg:px-6'>
            <h1 className='mb-2 font-bold text-2xl'>{t('Update customer personal')}</h1>
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
                  <div className='grid grid-cols-12 gap-4'>
                    <div className='mn:col-span-12 lg:col-span-6'>
                      <InputMain
                        labelValue={t('Creator')}
                        type='text'
                        placeholder={t('Creator')}
                        disabled={true}
                        value={customer?.creator?.fullname || ''}
                      />
                    </div>
                    <div className='mn:col-span-12 lg:col-span-6'>
                      <InputMain
                        labelValue={t('Status customer')}
                        type='text'
                        placeholder={t('Status customer')}
                        disabled={true}
                        value={customer?.verify === 'Verified' ? t('Verify') : t('Unverify')}
                      />
                    </div>
                  </div>
                  {/*  */}
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
                        <InputMain
                          register={register}
                          name='email'
                          labelValue={t('Email')}
                          type='email'
                          placeholder={t('Email')}
                          errorMessage={errors.email?.message}
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
                        <Controller
                          control={control}
                          name='gender'
                          render={({ field }) => (
                            <GenderSelect
                              {...field}
                              onChange={field.onChange}
                              genders={genders}
                              labelValue={t('Select gender')}
                              errorMessage={errors.gender?.message as string}
                            />
                          )}
                        />
                      </div>
                      <div className='mn:col-span-12 lg:col-span-6'>
                        <InputMain
                          register={register}
                          name='address_personal'
                          labelValue={t('Address personal')}
                          type='text'
                          placeholder={t('Address personal')}
                          errorMessage={errors.tax_code?.message}
                        />
                      </div>
                    </div>
                  </div>
                  <Controller
                    control={control}
                    name='date_of_birth'
                    render={({ field }) => (
                      <DateSelect
                        onChange={field.onChange}
                        value={field.value as Date}
                        labelValue={t('Date of birth')}
                        errorMessage={errors.date_of_birth?.message}
                      />
                    )}
                  />
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
                  <div className='grid gap-3'>
                    <div className='grid grid-cols-12 gap-4'>
                      <div className='mn:col-span-12 lg:col-span-6'>
                        <div className='select-none'>
                          <InputMain
                            value={`${formatedTime(customer?.created_at as string)} ${formatedDate(customer?.created_at as string)}`}
                            labelValue={t('Created at')}
                            type='text'
                            disabled={true}
                          />
                        </div>
                      </div>
                      <div className='mn:col-span-12 lg:col-span-6'>
                        <div className='select-none'>
                          <InputMain
                            value={`${formatedTime(customer?.updated_at as string)} ${formatedDate(customer?.updated_at as string)}`}
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
                  <div className='flex flex-wrap gap-2'>
                    <Button>{t('Save')}</Button>
                    {customer?.verify === 'Unverified' && isVerifyCustomer === false && (
                      <Button type='button' className='text-base select-none' onClick={handleClickVerifyCustomer}>
                        {t('Verify')}
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default CustomerUpdatePersonal
