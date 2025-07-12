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
import { useNavigate, useParams } from 'react-router-dom'
import { Fragment } from 'react/jsx-runtime'
import { customerSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { MALE } from '@/constants/gender'
import { UNVERIFIED, VERIFIED } from '@/constants/customerVerify'
import { DEACTIVATED } from '@/constants/customerStatus'
import { COMPANY } from '@/constants/customerType'
import { useContext, useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import customerApi from '@/apis/customer.api'
import FileUploadMultiple from '@/components/file-upload-multiple'
import httpStatusCode from '@/constants/httpStatusCode'
import { toast } from 'sonner'
import { filterPayload, formatedDate, formatedTime, isSupperAdminAndSaleAdmin } from '@/utils/common'
import type { TQueryConfig } from '@/types/query-config'
import { isUndefined, omit, omitBy } from 'lodash'
import { useQueryParams } from '@/hooks/use-query-params'
import AddTags from '@/components/add-tags'
import { AppContext } from '@/contexts/app-context'
import type { UserRole } from '@/types/user'
import { ACTIVITY_HEADER_TABLE } from '@/constants/table'
import { PAGE } from '@/constants/pagination'
import { TableCell, TableRow } from '@/components/ui/table'
import FormattedDate from '@/components/formatted-date'
import clsx from 'clsx'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Ellipsis } from 'lucide-react'
import TableMain from '@/components/table-main'

const formData = customerSchema.pick([
  'name',
  'type',
  'tax_code',
  'website',
  'surrogate',
  'address_company',
  'phone',
  'email',
  'contact_name',
  'status',
  'verify',
  'attachments',
  'note',
  'gender',
  'cccd',
  'consultantors'
])

type FormData = yup.InferType<typeof formData>

const CustomerUpdateCompany = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { profile } = useContext(AppContext)
  const [resetFileUpload, setResetFileUpload] = useState(false)
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
      type: COMPANY,
      tax_code: '',
      website: '',
      surrogate: '',
      address_company: '',
      phone: '',
      email: '',
      contact_name: '',
      status: DEACTIVATED,
      verify: UNVERIFIED,
      attachments: [],
      note: '',
      gender: MALE,
      cccd: '',
      consultantors: []
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
  const { data: customerData } = useQuery({
    queryKey: ['customerCompanyUpdate', customerId, customerQueryConfig],
    queryFn: () => customerApi.getCustomerDetail({ id: customerId as string, params: customerQueryConfig })
  })
  const uploadFileAttachmentMutation = useMutation({
    mutationFn: customerApi.uploadFiles
  })
  const updateCustomerCompanyMutation = useMutation({
    mutationFn: customerApi.updateCustomerCompany
  })
  const customerDetail = customerData?.data?.data.customer
  const customers = customerDetail?.activityCustomers
  const pagination = customerData?.data?.data
  console.log(customerDetail)
  useEffect(() => {
    if (customerDetail) {
      setValue('name', customerDetail.name || '')
      setValue('tax_code', customerDetail.tax_code || '')
      setValue('cccd', customerDetail.cccd || '')
      setValue('phone', customerDetail.phone || '')
      setValue('surrogate', customerDetail.surrogate || '')
      setValue('email', customerDetail.email || '')
      setValue('website', customerDetail.website || '')
      setValue('address_company', customerDetail.address_company || '')
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
      if (files && files.length > 0) {
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
        attachments: attachments as string[] | undefined,
        consultantor_ids: consultantors.map((item) => item.id),
        id: Number(customerId)
      }
      const payloadData = filterPayload(payload)
      if (consultantors.length === 0) return
      try {
        const res = await updateCustomerCompanyMutation.mutateAsync(omit(payloadData, ['consultantors']))
        toast.success(res.data.message)
        queryClient.refetchQueries({
          queryKey: ['customerCompanyUpdate']
        })
        setResetFileUpload((prev) => !prev)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.status === httpStatusCode.UnprocessableEntity) {
          const formError = error.response?.data?.errors
          if (formError) {
            Object.keys(formError).forEach((key) => {
              if (key === 'consultantor_ids') {
                toast.error(formError['consultantor_ids']['msg'])
              }
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
            if (key === 'consultantor_ids') {
              toast.error(formError['consultantor_ids']['msg'])
            }
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
                          labelRequired={customerDetail?.verify === 'Unverified'}
                          onChange={field.onChange}
                          disabled={customerDetail?.verify === 'Verified'}
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

                  <div className='grid gap-3'>
                    <Controller
                      control={control}
                      name='consultantors'
                      render={({ field }) => (
                        <AddTags {...field} onChange={field.onChange} errorMessage={errors.consultantors?.message} />
                      )}
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
                              labelRequired={customerDetail?.verify === 'Unverified'}
                              disabled={customerDetail?.verify === 'Verified'}
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
                              labelRequired={customerDetail?.verify === 'Unverified'}
                              disabled={customerDetail?.verify === 'Verified'}
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
                          disabled={customerDetail?.verify === 'Verified'}
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
                          labelRequired={customerDetail?.verify === 'Unverified'}
                          disabled={customerDetail?.verify === 'Verified'}
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
                          labelValue='Website'
                          type='text'
                          placeholder='Website'
                          errorMessage={errors.website?.message}
                        />
                      </div>
                      <div className='mn:col-span-12 lg:col-span-6'>
                        <InputMain
                          register={register}
                          name='address_company'
                          labelValue={t('Address company')}
                          type='text'
                          labelRequired={customerDetail?.verify === 'Unverified'}
                          disabled={customerDetail?.verify === 'Verified'}
                          placeholder={t('Address company')}
                          errorMessage={errors.address_company?.message}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='grid gap-3'>
                    <FileUploadMultiple
                      resetSignal={resetFileUpload}
                      defaultFiles={customerDetail?.attachments}
                      onChange={handleChangeFiles}
                      viewFileUploaded
                    />
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
                    <Button disabled={updateCustomerCompanyMutation.isPending}>{t('Save')}</Button>
                    {isSupperAdminAndSaleAdmin(profile?.role as UserRole) &&
                      customerDetail?.verify === 'Unverified' &&
                      isVerifyCustomer === false && (
                        <Button type='button' className='text-base select-none' onClick={handleClickVerifyCustomer}>
                          {t('Verify')}
                        </Button>
                      )}
                  </div>
                </CardFooter>
              </Card>
            </form>
            <Card className='mt-4'>
              <TableMain
                classNameWrapper='px-4'
                headerClassNames={['', '', '', '', '', '', '', '', 'text-right']}
                headers={ACTIVITY_HEADER_TABLE}
                data={customers}
                page={pagination?.page_activities.toString() || PAGE}
                page_size={pagination?.totalPagesActivities.toString() || '0'}
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

export default CustomerUpdateCompany
