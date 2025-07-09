import * as yup from 'yup'
import InputMain from '@/components/input-main'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { customerSchema } from '@/utils/validation'
import { useTranslation } from 'react-i18next'
import { COMPANY } from '@/constants/customerType'
import { DEACTIVATED } from '@/constants/customerStatus'
import { UNVERIFIED } from '@/constants/customerVerify'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { useContext, useState } from 'react'
import { AppContext } from '@/contexts/app-context'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import customerApi from '@/apis/customer.api'
import httpStatusCode from '@/constants/httpStatusCode'
import FileUploadMultiple from '@/components/file-upload-multiple'
import InputNumber from '@/components/input-number'
import AddTags from '@/components/add-tags'
import { omit } from 'lodash'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import PATH from '@/constants/path'

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
  'cccd',
  'consultantors'
])

type FormData = yup.InferType<typeof formData>

const FormCustomerCompany = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('admin')
  const [files, setFiles] = useState<File[]>()
  const { profile } = useContext(AppContext)
  const {
    register,
    handleSubmit,
    setError,
    watch,
    reset,
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
      cccd: '',
      consultantors: []
    },
    resolver: yupResolver(formData) as Resolver<FormData>
  })

  const filesAttachment = watch('attachments')
  const consultantors = watch('consultantors')
  const createCustomerCompanyMutation = useMutation({
    mutationFn: customerApi.createCustomerCompany
  })
  const uploadFileAttachmentMutation = useMutation({
    mutationFn: customerApi.uploadFiles
  })

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
        consultantor_ids: consultantors.map((item) => item.id)
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
      const res = await createCustomerCompanyMutation.mutateAsync(omit(payload, ['consultantors']))
      toast.success(res.data.message)
      navigate(PATH.CUSTOMER)
      reset()
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
    <form onSubmit={handleSubmitForm} noValidate>
      <TabsContent value='Company'>
        <Card>
          <CardContent className='grid gap-3'>
            <div className='grid gap-3'>
              <InputMain
                register={register}
                name='name'
                labelRequired={true}
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
                    labelRequired={true}
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
                value={profile?.fullname}
              />
            </div>
            <div className='grid gap-3'>
              <Controller
                control={control}
                name='consultantors'
                render={({ field }) => (
                  <AddTags
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                    labelRequired
                    errorMessage={errors.consultantors?.message}
                  />
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
                        labelRequired
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
                        labelRequired
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
                    labelRequired
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
                    labelRequired
                    placeholder={t('Address company')}
                    errorMessage={errors.address_company?.message}
                  />
                </div>
              </div>
            </div>
            <div className='grid gap-3'>
              <FileUploadMultiple onChange={handleChangeFiles} />
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
            <Button disabled={createCustomerCompanyMutation.isPending}>{t('Save')}</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </form>
  )
}

export default FormCustomerCompany
