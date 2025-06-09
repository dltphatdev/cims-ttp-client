import ButtonMain from '@/components/button-main'
import DateSelect from '@/components/date-select'
import InputFileMain from '@/components/input-file-main'
import InputMain from '@/components/input-main'
import { Helmet } from 'react-helmet-async'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Fragment } from 'react/jsx-runtime'

export default function UserProfile() {
  const { t } = useTranslation()
  const { register, control, handleSubmit } = useForm()
  const handleSubmitForm = handleSubmit((data) => console.log(data))
  return (
    <Fragment>
      <Helmet>
        <title>Profile - TTP Telecom</title>
        <meta name='keywords' content='Profile - TTP Telecom' />
        <meta name='description' content='Profile - TTP Telecom' />
      </Helmet>
      <div className='@container/main'>
        <div className='py-4 md:gap-6 md:py-6'>
          <div className='px-4 lg:px-6'>
            <h1 className='mb-2 font-bold text-2xl'>{t('Profile')}</h1>
            <form onSubmit={handleSubmitForm}>
              <div className='grid grid-cols-12 mn:gap-2 lg:gap-4'>
                <div className='mn:col-span-12 lg:col-span-6'>
                  <InputMain register={register} labelValue={t('Fullname')} type='text' placeholder={t('Fullname')} />
                  <InputMain register={register} labelValue='Email' type='text' placeholder='Email' />
                  <InputMain register={register} labelValue={t('Created at')} type='text' disabled={true} />
                  {/* <SelectRole labelValue={t('Select role')} /> */}
                  <InputMain register={register} labelValue={t('Address')} type='text' placeholder={t('Address')} />
                  <InputMain register={register} labelValue={t('Phone')} type='number' placeholder={t('Phone')} />
                  <Controller
                    control={control}
                    name='date_of_birth'
                    render={({ field }) => (
                      <DateSelect
                        onChange={field.onChange}
                        value={field.value}
                        labelValue={t('Date of birth')}
                        // errorMessage={errors.date_of_birth?.message}
                      />
                    )}
                  />
                </div>
                <div className='mn:col-span-12 lg:col-span-6'>
                  <div className='flex flex-col items-center px-10 py-20 border border-gray-200 rounded-md'>
                    <div className='my-5 h-40 w-40'>
                      <img src='/images/empty.svg' className='w-full h-full object-cover rounded-full' alt='' />
                    </div>
                    <InputFileMain
                    // onChange={handleChangeFile}
                    />
                    <div className='mt-3 text-gray-400'>{t('Maximum size 1 MB')}</div>
                    <div className='mt-1 text-gray-400'>{t('Format: .JPG, .JPEG, .PNG')}</div>
                  </div>
                </div>
              </div>
              <ButtonMain classNameWrapper='mt-4'>{t('Save')}</ButtonMain>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
