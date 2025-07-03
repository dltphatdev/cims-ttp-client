import * as yup from 'yup'
import InputMain from '@/components/input-main'
import InputNumber from '@/components/input-number'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Helmet } from 'react-helmet-async'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { Fragment } from 'react/jsx-runtime'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { PERSONAL } from '@/constants/customerType'
import { DEACTIVATED } from '@/constants/customerStatus'
import { UNVERIFIED, VERIFIED } from '@/constants/customerVerify'
import { FEMALE, MALE } from '@/constants/gender'
import { yupResolver } from '@hookform/resolvers/yup'
import { customerSchema } from '@/utils/validation'
import GenderSelect from '@/components/gender-select'
import DateSelect from '@/components/date-select'
import FileUploadMultiple from '@/components/file-upload-multiple'
import { useMutation, useQuery } from '@tanstack/react-query'
import customerApi from '@/apis/customer.api'
import httpStatusCode from '@/constants/httpStatusCode'
import { toast } from 'sonner'
import { formatedDate, formatedTime } from '@/utils/common'
import type { TQueryConfig } from '@/types/query-config'
import { useQueryParams } from '@/hooks/use-query-params'
import { isUndefined, omit, omitBy } from 'lodash'
import TableMain from '@/components/table-main'
import { ACTIVITY_HEADER_TABLE } from '@/constants/table'
import { TableCell, TableRow } from '@/components/ui/table'
import FormattedDate from '@/components/formatted-date'
import clsx from 'clsx'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Ellipsis } from 'lucide-react'
import { LIMIT, PAGE } from '@/constants/pagination'
import AddTags from '@/components/add-tags'

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
  'consultantors',
  'website',
  'surrogate',
  'address_personal',
  'phone',
  'email',
  'contact_name',
  'status',
  'verify',
  'attachments',
  'note',
  'date_of_birth',
  'gender',
  'cccd'
])

type FormData = yup.InferType<typeof formData>

const CustomerUpdatePersonal = () => {
  const navigate = useNavigate()
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
      website: '',
      surrogate: '',
      address_personal: '',
      phone: '',
      email: '',
      contact_name: '',
      status: DEACTIVATED,
      verify: UNVERIFIED,
      attachments: [],
      note: '',
      date_of_birth: new Date(1990, 0, 1),
      gender: MALE
    },
    resolver: yupResolver(formData) as Resolver<FormData>
  })

  const filesAttachment = watch('attachments')
  const consultantors = watch('consultantors')
  const queryParams: Pick<TQueryConfig, 'limit' | 'page'> = useQueryParams()
  const customerQueryConfig: Pick<TQueryConfig, 'limit' | 'page'> = omitBy(
    {
      page: queryParams.page,
      limit: queryParams.limit
    },
    isUndefined
  )
  const { data: customerData, refetch } = useQuery({
    queryKey: ['customer', customerId, customerQueryConfig],
    queryFn: () => customerApi.getCustomerDetail({ id: customerId as string, params: customerQueryConfig })
  })
  const uploadFileAttachmentMutation = useMutation({
    mutationFn: customerApi.uploadFiles
  })
  const updateCustomerPersonalMutation = useMutation({
    mutationFn: customerApi.updateCustomePersonal
  })
  const customerDetail = customerData?.data?.data.customer
  const customers = customerDetail?.activityCustomers
  const pagination = customerData?.data?.data

  useEffect(() => {
    if (customerDetail) {
      setValue('name', customerDetail.name || '')
      setValue('cccd', customerDetail.cccd || '')
      setValue('email', customerDetail.email || '')
      setValue('phone', customerDetail.phone || '')
      setValue('gender', customerDetail.gender || MALE)
      setValue('address_personal', customerDetail.address_personal || '')
      setValue(
        'date_of_birth',
        customerDetail?.date_of_birth ? new Date(customerDetail.date_of_birth) : new Date(1990, 0, 1)
      )
      setValue('note', customerDetail.note || '')
      setValue('verify', customerDetail.verify || UNVERIFIED)
      setValue(
        'consultantors',
        customerDetail.consultantor.map((item) => {
          const user = item.user
          return {
            id: user.id,
            title: user.fullname
          }
        }) || []
      )
    }
  }, [customerDetail, setValue])

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
      const payload = {
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        attachments: attachments as string[] | undefined,
        consultantor_ids: consultantors.map((item) => item.id),
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
      if (consultantors.length === 0) return
      const res = await updateCustomerPersonalMutation.mutateAsync(omit(payload, ['consultantors']))
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
                        value={customerDetail?.creator?.fullname || ''}
                      />
                    </div>
                    <div className='mn:col-span-12 lg:col-span-6'>
                      <InputMain
                        labelValue={t('Status customer')}
                        type='text'
                        placeholder={t('Status customer')}
                        disabled={true}
                        value={customerDetail?.verify === 'Verified' ? t('Verify') : t('Unverify')}
                      />
                    </div>
                  </div>
                  <Controller
                    control={control}
                    name='consultantors'
                    render={({ field }) => (
                      <AddTags {...field} onChange={field.onChange} errorMessage={errors.consultantors?.message} />
                    )}
                  />
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
                          errorMessage={errors.address_personal?.message}
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
                    <FileUploadMultiple defaultFiles={customerDetail?.attachments} onChange={handleChangeFiles} />
                  </div>
                  <div className='grid gap-3'>
                    <Label htmlFor='note' className='text-sm font-medium light:text-gray-700'>
                      {t('Note')}
                    </Label>
                    <Textarea {...register('note')} placeholder={t('Note')} />
                    {errors?.note && <span className='text-red-600'>{errors?.note?.message}</span>}
                  </div>
                  <div className='grid gap-3'>
                    <div className='grid grid-cols-12 gap-4'>
                      <div className='mn:col-span-12 lg:col-span-6'>
                        <div className='select-none'>
                          <InputMain
                            value={`${formatedTime(customerDetail?.created_at as string)} ${formatedDate(customerDetail?.created_at as string)}`}
                            labelValue={t('Created at')}
                            type='text'
                            disabled={true}
                          />
                        </div>
                      </div>
                      <div className='mn:col-span-12 lg:col-span-6'>
                        <div className='select-none'>
                          <InputMain
                            value={`${formatedTime(customerDetail?.updated_at as string)} ${formatedDate(customerDetail?.updated_at as string)}`}
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
                    <Button disabled={updateCustomerPersonalMutation.isPending}>{t('Save')}</Button>
                    {customerDetail?.verify === 'Unverified' && isVerifyCustomer === false && (
                      <Button type='button' className='text-base select-none' onClick={handleClickVerifyCustomer}>
                        {t('Verify')}
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </form>
            <Card className='mt-3'>
              <TableMain
                totalPage={pagination?.totalPagesActivities || 0}
                headerClassNames={['', '', '', '', '', '', '', '', 'text-right']}
                headers={ACTIVITY_HEADER_TABLE}
                data={customers}
                page={pagination?.page_activities.toString() || PAGE}
                page_size={pagination?.limit_activities.toString() || LIMIT}
                renderRow={(item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.customer.name}</TableCell>
                    <TableCell>{item.creator.fullname}</TableCell>
                    <TableCell>
                      <FormattedDate isoDate={item.created_at as string} />
                    </TableCell>
                    <TableCell>
                      <FormattedDate isoDate={item.time_start as string} />
                    </TableCell>
                    <TableCell>
                      <FormattedDate isoDate={item.time_end as string} />
                    </TableCell>
                    <TableCell>
                      <span
                        className={clsx('w-[150px] border-0 shadow-none focus:hidden ', {
                          'text-(--color-green-custom)': item.status === 'Completed',
                          '!text-red-500': item.status === 'Cancelled',
                          '!text-yellow-500': item.status === 'New',
                          '!text-orange-500': item.status === 'InProgress'
                        })}
                      >
                        {item.status === 'New'
                          ? t('New')
                          : item.status === 'InProgress'
                            ? t('InProgress')
                            : item.status === 'Completed'
                              ? t('Completed')
                              : item.status === 'Cancelled'
                                ? t('Cancelled')
                                : ''}
                      </span>
                    </TableCell>
                    <TableCell className='ml-auto text-end'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className='border-2 border-gray-200' variant='ghost' size='sm'>
                            <Ellipsis className='w-4 h-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem onClick={() => navigate(`/activities/update/${item.id}`)}>
                            {t('Edit')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )}
              />
            </Card>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default CustomerUpdatePersonal
