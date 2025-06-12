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
import { useContext } from 'react'
import { AppContext } from '@/contexts/app-context'
import AddSale from '@/components/add-sale'
import FileAttachment from '@/components/file-attachment'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

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
  const { t } = useTranslation()
  const { profile } = useContext(AppContext)
  const {
    register,
    handleSubmit,
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

  const handleSubmitForm = handleSubmit((data) => console.log(data))

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
              <FileAttachment />
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
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </form>
  )
}

export default FormCustomerCompany
