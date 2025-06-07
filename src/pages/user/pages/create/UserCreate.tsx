import ButtonMain from '@/components/button-main'
import InputMain from '@/components/input-main/InputMain'

import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'

import { useTranslation } from 'react-i18next'
import { Fragment } from 'react/jsx-runtime'

export default function UserCreate() {
  const { t } = useTranslation()
  const { register, handleSubmit } = useForm()
  const handleSubmitForm = handleSubmit((data) => console.log(data))
  return (
    <Fragment>
      <Helmet>
        <title>Thêm thành viên - TTP Telecom</title>
        <meta name='keywords' content='Thêm thành viên - TTP Telecom' />
        <meta name='description' content='Thêm thành viên - TTP Telecom' />
      </Helmet>
      <div className='@container/main'>
        <div className='py-4 md:gap-6 md:py-6'>
          <div className='px-4 lg:px-6'>
            <form onSubmit={handleSubmitForm}>
              <div>
                <InputMain register={register} labelValue='Email' type='text' placeholder='Email' />
                <InputMain register={register} labelValue={t('Password')} type='password' placeholder={t('Password')} />
              </div>
              <ButtonMain classNameWrapper='mt-4'>{t('Save')}</ButtonMain>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
