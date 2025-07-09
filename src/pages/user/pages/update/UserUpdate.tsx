import userApi from '@/apis/user.api'
import ButtonMain from '@/components/button-main'
import DateSelect from '@/components/date-select'
import InputMain from '@/components/input-main'
import InputNumber from '@/components/input-number'
import SelectRole from '@/components/select-role'
import { Button } from '@/components/ui/button'
import httpStatusCode from '@/constants/httpStatusCode'
import { ADMIN, NONE, SALE, TECHNICIAN } from '@/constants/role'
import { AppContext } from '@/contexts/app-context'
import type { UserRole } from '@/types/user'
import { formatedDate, formatedTime, isSuperAdminRole } from '@/utils/common'
import { userSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Fragment } from 'react/jsx-runtime'
import { toast } from 'sonner'
import * as yup from 'yup'

const formData = userSchema.pick(['fullname', 'address', 'code', 'date_of_birth', 'phone', 'role'])

type FormData = yup.InferType<typeof formData>

const roles = [
  {
    role_type: ADMIN,
    role_value: 'Sale Admin'
  },
  {
    role_type: SALE,
    role_value: 'Sale'
  },
  {
    role_type: NONE,
    role_value: 'None Role'
  },
  {
    role_type: TECHNICIAN,
    role_value: 'Technician'
  }
]

export default function UserUpdate() {
  const { profile } = useContext(AppContext)
  const { t } = useTranslation('admin')
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setError,
    setValue
  } = useForm<FormData>({
    defaultValues: {
      fullname: '',
      address: '',
      code: '',
      role: NONE,
      phone: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(formData) as Resolver<FormData>
  })
  const { userId } = useParams()
  const { data: userData, refetch } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userApi.getUserDetail(userId as string)
  })

  const updateUserMutation = useMutation({
    mutationFn: userApi.updateUser
  })

  const resetPasswordMutation = useMutation({
    mutationFn: userApi.resetPassword
  })

  const handleSubmitForm = handleSubmit(async (data) => {
    try {
      const payload = {
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        id: Number(userId)
      }
      for (const key in payload) {
        if (payload[key as keyof typeof payload] === undefined || payload[key as keyof typeof payload] === '') {
          delete payload[key as keyof typeof payload]
        }
      }
      updateUserMutation.mutate(payload, {
        onSuccess: (data) => {
          toast.success(data.data.message)
          refetch()
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

  const user = userData?.data?.data

  useEffect(() => {
    if (user) {
      setValue('fullname', user.fullname || '')
      setValue('phone', user.phone || '')
      setValue('address', user.address || '')
      setValue('code', user.code || '')
      setValue('role', user.role || NONE)
      setValue('date_of_birth', user.date_of_birth ? new Date(user.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [user, setValue])

  const handleClickResetPassword = () => {
    const payload = { password: import.meta.env.VITE_PASSWORD_DEFAULT, id: Number(userId) }
    resetPasswordMutation.mutate(payload, {
      onSuccess: (data) => toast.success(data.data.message),
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
  }
  return (
    <Fragment>
      <Helmet>
        <title>Cập nhật thành viên - TTP Telecom</title>
        <meta name='keywords' content='Cập nhật thành viên - TTP Telecom' />
        <meta name='description' content='Cập nhật thành viên - TTP Telecom' />
      </Helmet>
      <div className='@container/main'>
        <div className='py-4 md:gap-6 md:py-6'>
          <div className='px-4 lg:px-6'>
            <h1 className='mb-2 font-bold text-2xl'>{t('Update member')}</h1>
            <form onSubmit={handleSubmitForm} noValidate>
              <div>
                <div className='select-none'>
                  <InputMain value={user?.email || ''} labelValue={t('Email')} type='email' disabled={true} />
                </div>
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
                <Controller
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
                />
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
                <div className='select-none mt-4'>
                  <InputMain
                    value={`${formatedTime(user?.created_at as string)} ${formatedDate(user?.created_at as string)}`}
                    labelValue={t('Created at')}
                    type='text'
                    disabled={true}
                  />
                </div>
                <div className='select-none'>
                  <InputMain
                    value={`${formatedTime(user?.updated_at as string)} ${formatedDate(user?.updated_at as string)}`}
                    labelValue={t('Updated at')}
                    type='text'
                    disabled={true}
                  />
                </div>
              </div>
              <div className='flex flex-wrap gap-1 items-center'>
                <ButtonMain
                  isLoading={updateUserMutation.isPending}
                  disabled={updateUserMutation.isPending}
                  type='submit'
                  classNameWrapper='mt-4'
                >
                  {t('Save')}
                </ButtonMain>
                {isSuperAdminRole(profile?.role as UserRole) && (
                  <Button
                    type='button'
                    className='mt-4 text-base select-none'
                    onClick={handleClickResetPassword}
                    disabled={resetPasswordMutation.isPending}
                  >
                    {t('Reset password')}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
