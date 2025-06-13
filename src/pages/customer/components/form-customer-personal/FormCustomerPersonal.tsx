import AddSale from '@/components/add-sale'
import DateSelect from '@/components/date-select'
import FileAttachment from '@/components/file-attachment'
import GenderSelect from '@/components/gender-select'
import InputMain from '@/components/input-main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { DEACTIVATED } from '@/constants/customerStatus'
import { COMPANY } from '@/constants/customerType'
import { UNVERIFIED } from '@/constants/customerVerify'
import { FEMALE, MALE } from '@/constants/gender'
import { AppContext } from '@/contexts/app-context'
import { customerSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { useContext, useMemo, useState } from 'react'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
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
  'attachment',
  'note',
  'assign_at',
  'date_of_birth',
  'gender'
])

type FormData = yup.InferType<typeof formData>
const FormCustomerPersonal = () => {
  const { t } = useTranslation('admin')
  const [file, setFile] = useState<File>()
  const { profile } = useContext(AppContext)
  const fileNameUpload = useMemo(() => (file ? file.name : ''), [file])
  const {
    register,
    handleSubmit,
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
      attachment: '',
      note: '',
      assign_at: '',
      date_of_birth: new Date(1990, 0, 1),
      gender: MALE
    },
    resolver: yupResolver(formData) as Resolver<FormData>
  })

  const handleSubmitForm = handleSubmit((data) => {
    console.log(data)
  })

  const handleChangeFile = (file?: File) => setFile(file)
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
              <AddSale />
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

export default FormCustomerPersonal
