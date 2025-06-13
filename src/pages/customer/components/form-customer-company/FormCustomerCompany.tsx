import * as yup from 'yup'
import InputMain from '@/components/input-main'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { customerSchema } from '@/utils/validation'
import { useTranslation } from 'react-i18next'
import { COMPANY } from '@/constants/customerType'
import { DEACTIVATED } from '@/constants/customerStatus'
import { UNVERIFIED } from '@/constants/customerVerify'
import { MALE } from '@/constants/gender'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, type Resolver } from 'react-hook-form'
import { useContext, useMemo, useState } from 'react'
import { AppContext } from '@/contexts/app-context'
import AddTagUser from '@/components/add-tag-user'
import FileAttachment from '@/components/file-attachment'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import customerApi from '@/apis/customer.api'
import httpStatusCode from '@/constants/httpStatusCode'
import { useNavigate } from 'react-router-dom'

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
  'attachment',
  'note',
  'assign_at',
  'date_of_birth',
  'gender'
])

type FormData = yup.InferType<typeof formData>

const FormCustomerCompany = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('admin')
  const [file, setFile] = useState<File>()
  const { profile } = useContext(AppContext)
  const fileNameUpload = useMemo(() => (file ? file.name : ''), [file])
  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
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
      attachment: '',
      note: '',
      assign_at: '',
      date_of_birth: new Date(1990, 0, 1),
      gender: MALE
    },
    resolver: yupResolver(formData) as Resolver<FormData>
  })

  const fileAttachment = watch('attachment')
  const consultantorId = watch('consultantor_id')

  const createCustomerMutation = useMutation({
    mutationFn: customerApi.createCustomer
  })
  const uploadFileAttachmentMutation = useMutation({
    mutationFn: customerApi.uploadFile
  })

  const handleSubmitForm = handleSubmit(async (data) => {
    try {
      let attachmentName = fileAttachment
      if (file) {
        const form = new FormData()
        form.append('file', file)
        const uploadRes = await uploadFileAttachmentMutation.mutateAsync(form)
        attachmentName = uploadRes.data.data.filename
        setValue('attachment', attachmentName)
      }
      const payload = {
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        attachment: attachmentName,
        consultantor_id: Number(consultantorId)
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
      const res = await createCustomerMutation.mutateAsync(payload)
      const idCustomerCreated = res.data.id
      navigate(`/customer/update-company/${idCustomerCreated}`)
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

  const handleChangeFile = (file?: File) => setFile(file)

  return (
    <form onSubmit={handleSubmitForm} noValidate>
      <TabsContent value='Company'>
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
                  <InputMain
                    register={register}
                    name='phone'
                    labelValue={t('Phone')}
                    type='number'
                    placeholder={t('Phone')}
                    errorMessage={errors.phone?.message}
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
                    name='tax_code'
                    labelValue={t('Tax code')}
                    type='text'
                    placeholder={t('Tax code')}
                    errorMessage={errors.tax_code?.message}
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
              <FileAttachment onChange={handleChangeFile} />
              {fileNameUpload && (
                <div>
                  <strong>File name choosen:</strong> <span className='underline'>{fileNameUpload}</span>
                </div>
              )}
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

export default FormCustomerCompany
