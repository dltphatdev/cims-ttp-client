import userApi from '@/apis/user.api'
import ButtonMain from '@/components/button-main'
import DateSelect from '@/components/date-select'
import InputMain from '@/components/input-main'
import SelectRole from '@/components/select-role'
import SelectVerify from '@/components/select-verify'
import httpStatusCode from '@/constants/httpStatusCode'
import { ADMIN, SALE, SUPERADMIN } from '@/constants/role'
import { UNVERIFIED } from '@/constants/verify'
import { formatedDate, formatedTime } from '@/utils/common'
import { getUserSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Fragment } from 'react/jsx-runtime'
import { toast } from 'sonner'

interface FormData {
  fullname?: string
  phone?: string
  address?: string
  code?: string
  date_of_birth?: Date
  role?: 'SuperAdmin' | 'Admin' | 'Sale'
  verify?: 'Verified' | 'Unverified' | 'Banned'
  password?: string
}

export default function UserUpdate() {
  const roles = [
    {
      role_type: ADMIN,
      role_value: 'Admin'
    },
    {
      role_type: SALE,
      role_value: 'Sale'
    }
  ]
  const { t } = useTranslation()
  const schema = getUserSchema(t)
  const userUpdateSchema = schema.pick([
    'fullname',
    'address',
    'code',
    'date_of_birth',
    'role',
    'password',
    'phone',
    'verify'
  ])
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setError,
    setValue
  } = useForm({
    defaultValues: {
      fullname: '',
      address: '',
      code: '',
      verify: UNVERIFIED,
      role: SALE,
      password: '',
      phone: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(userUpdateSchema)
  })
  const { userId } = useParams()
  const { data: userData } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userApi.getUserDetail(userId as string)
  })
  const updateUser = useMutation({
    mutationFn: userApi.updateUser
  })

  const handleSubmitForm = handleSubmit(async (data) => {
    try {
      const body = {
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        id: Number(userId)
      }

      const payload = Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(body).filter(([_, value]) => value !== '' && value !== undefined)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) as any
      console.log(payload)
      // const res = await updateUser.mutateAsync(payload, {
      //   onSuccess: (data) => {
      //     toast.success('Alert', {
      //       description: data.data.message,
      //       action: {
      //         label: 'Đóng',
      //         onClick: () => true
      //       },
      //       duration: 4000,
      //       position: 'top-right'
      //     })
      //   },
      //   onError: (error: any) => {
      //     if (error.status === httpStatusCode.UnprocessableEntity) {
      //       const formError = error.response?.data?.errors
      //       if (formError) {
      //         Object.keys(formError).forEach((key) => {
      //           setError(key as keyof FormData, {
      //             message: formError[key as keyof FormData]['msg'],
      //             type: 'Server'
      //           })
      //         })
      //       }
      //     }
      //   }
      // })
      // toast.success(res.data.message)
    } catch (error: any) {
      const formError = error.response?.data?.errors
      if (formError) {
        Object.keys(formError).forEach((key) => {
          setError(key as keyof FormData, {
            message: formError[key]['msg']['message'],
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
      setValue('role', user.role || SALE)
      setValue('verify', user.verify || UNVERIFIED)
      setValue('date_of_birth', user.date_of_birth ? new Date(user.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [user, setValue])
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
            <h1 className='mb-2 font-bold text-2xl'>{t('Profile')}</h1>
            <form onSubmit={handleSubmitForm} noValidate>
              <div className=''>
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
                <InputMain
                  register={register}
                  labelValue={t('Password')}
                  type='password'
                  name='password'
                  placeholder={t('Password')}
                  errorMessage={errors.password?.message}
                />
                <InputMain
                  value={`${formatedTime(user?.created_at as string)} ${formatedDate(user?.created_at as string)}`}
                  register={register}
                  labelValue={t('Created at')}
                  type='text'
                  disabled={true}
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
                  name='verify'
                  render={({ field }) => (
                    <SelectVerify
                      {...field}
                      onChange={field.onChange}
                      labelValue={t('Verified user')}
                      errorMessage={errors.role?.message as string}
                    />
                  )}
                />
                <InputMain
                  register={register}
                  labelValue={t('Phone')}
                  type='number'
                  placeholder={t('Phone')}
                  name='phone'
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
              <ButtonMain type='submit' classNameWrapper='mt-4'>
                {t('Save')}
              </ButtonMain>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
