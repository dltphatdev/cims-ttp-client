import customerApi from '@/apis/customer.api'
import AddTagUser from '@/components/add-tag-user'
import DateSelect from '@/components/date-select'
import FileUploadMultiple from '@/components/file-upload-multiple'
import GenderSelect from '@/components/gender-select'
import InputMain from '@/components/input-main'
import InputNumber from '@/components/input-number'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { DEACTIVATED } from '@/constants/customerStatus'
import { PERSONAL } from '@/constants/customerType'
import { UNVERIFIED } from '@/constants/customerVerify'
import { FEMALE, MALE } from '@/constants/gender'
import httpStatusCode from '@/constants/httpStatusCode'
import { AppContext } from '@/contexts/app-context'
import { customerSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

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

const FormCustomerPersonal = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('admin')
  const [files, setFiles] = useState<File[]>()
  const { profile } = useContext(AppContext)
  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    control,
    reset,
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

  const createCustomerPersonalMutation = useMutation({
    mutationFn: customerApi.createCustomerPersonal
  })
  const uploadFileAttachmentMutation = useMutation({
    mutationFn: customerApi.uploadFiles
  })
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
            assign_at: new Date()?.toISOString()
          }
        : {
            ...data,
            date_of_birth: data.date_of_birth?.toISOString(),
            attachments: attachments as string[] | undefined
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
      const res = await createCustomerPersonalMutation.mutateAsync(payload)
      const idCustomerCreated = res.data.id
      navigate(`/customer/update-personal/${idCustomerCreated}`)
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
      <TabsContent value='Personal'>
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
                value={profile?.fullname}
              />
            </div>
            <div className='grid gap-3'>
              <AddTagUser onExportId={(id) => setValue('consultantor_id', id.toString())} />
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
              <FileUploadMultiple onChange={handleChangeFiles} />
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
      </TabsContent>
    </form>
  )
}

export default FormCustomerPersonal
