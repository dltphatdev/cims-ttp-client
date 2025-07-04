import userApi from '@/apis/user.api'
import ButtonMain from '@/components/button-main'
import DateSelect from '@/components/date-select'
import InputMain from '@/components/input-main/InputMain'
import InputNumber from '@/components/input-number'
import httpStatusCode from '@/constants/httpStatusCode'
import { userSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Fragment } from 'react/jsx-runtime'
import { toast } from 'sonner'
import * as yup from 'yup'

const formData = userSchema.pick(['email', 'fullname', 'address', 'phone', 'code', 'date_of_birth', 'password'])
type FormData = yup.InferType<typeof formData>

export default function UserCreate() {
  const { t } = useTranslation('admin')
  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(formData),
    defaultValues: {
      email: '',
      password: import.meta.env.VITE_PASSWORD_DEFAULT,
      fullname: '',
      address: '',
      phone: '',
      code: '',
      date_of_birth: new Date(1990, 0, 1)
    }
  })
  const createUserMutation = useMutation({
    mutationFn: userApi.createUser
  })
  const handleSubmitForm = handleSubmit((data) => {
    try {
      const payload = {
        ...data,
        date_of_birth: data.date_of_birth?.toISOString()
      }
      for (const key in payload) {
        if (payload[key as keyof typeof payload] === undefined || payload[key as keyof typeof payload] === '') {
          delete payload[key as keyof typeof payload]
        }
      }
      createUserMutation.mutateAsync(payload, {
        onSuccess: (data) => {
          toast.success(data.data.message)
          reset()
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const formError = error.response?.data?.errors
      if (formError) {
        Object.keys(formError).forEach((key) => {
          setError(key as keyof FormData, {
            message: formError[key]['msg'],
            type: 'Server'
          })
        })
      }
    }
  })
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
            <h1 className='mb-2 font-bold text-2xl'>{t('Create member')}</h1>
            <form onSubmit={handleSubmitForm} noValidate>
              <div>
                <InputMain
                  register={register}
                  name='email'
                  labelRequired={true}
                  labelValue={t('Email')}
                  type='email'
                  placeholder={t('Email')}
                  errorMessage={errors.email?.message}
                />
                <InputMain
                  register={register}
                  name='fullname'
                  labelValue={t('Fullname')}
                  type='text'
                  placeholder={t('Fullname')}
                  errorMessage={errors.fullname?.message}
                />
                <InputMain
                  register={register}
                  labelValue={t('Address')}
                  name='address'
                  type='text'
                  placeholder={t('Address')}
                  errorMessage={errors.address?.message}
                />
                <InputMain
                  register={register}
                  labelValue={t('Code user')}
                  name='code'
                  type='text'
                  errorMessage={errors.code?.message}
                  placeholder={t('Code user')}
                />
                {/* <Controller
                  control={control}
                  name='role'
                  render={({ field }) => (
                    <SelectRole
                      {...field}
                      onChange={field.onChange}
                      roles={roles}
                      labelValue={t('Select role')}
                      errorMessage={errors.role?.message as string}
                    />
                  )}
                /> */}
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
              </div>
              <ButtonMain
                isLoading={createUserMutation.isPending}
                disabled={createUserMutation.isPending}
                classNameWrapper='mt-4'
              >
                {t('Save')}
              </ButtonMain>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
