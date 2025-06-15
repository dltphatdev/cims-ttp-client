import userApi from '@/apis/user.api'
import ButtonMain from '@/components/button-main'
import DateSelect from '@/components/date-select'
import InputFileMain from '@/components/input-file-main'
import InputMain from '@/components/input-main'
import InputNumber from '@/components/input-number'
import httpStatusCode from '@/constants/httpStatusCode'
import { AppContext } from '@/contexts/app-context'
import { setProfileToLS } from '@/utils/auth'
import { getAvatarUrl } from '@/utils/common'
import { userSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Fragment } from 'react/jsx-runtime'
import { toast } from 'sonner'
import * as yup from 'yup'

const formData = userSchema.pick(['address', 'avatar', 'code', 'date_of_birth', 'fullname', 'phone'])
type FormData = yup.InferType<typeof formData>

export default function UserProfile() {
  const { t } = useTranslation('admin')
  const { setProfile } = useContext(AppContext)
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file])
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      fullname: '',
      phone: '',
      code: '',
      address: '',
      date_of_birth: new Date(1990, 0, 1),
      avatar: ''
    },
    resolver: yupResolver(formData) as Resolver<FormData>
  })
  const avatar = watch('avatar')
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile
  })
  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile
  })
  const uploadAvatarMutation = useMutation({
    mutationFn: userApi.uploadAvatar
  })
  const profile = profileData?.data.data

  useEffect(() => {
    setValue('fullname', profile?.fullname || '')
    setValue('address', profile?.address || '')
    setValue('code', profile?.code || '')
    setValue('avatar', profile?.avatar || '')
    setValue('phone', profile?.phone || '')
    setValue('date_of_birth', profile?.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
  }, [profile, setValue])

  const handleSubmitForm = handleSubmit(async (data) => {
    try {
      let avatarName = avatar
      if (file) {
        const form = new FormData()
        form.append('image', file)
        const uploadRes = await uploadAvatarMutation.mutateAsync(form)
        avatarName = uploadRes.data.data.filename
        setValue('avatar', avatarName)
      }
      const payload = {
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: avatarName
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
      const res = await updateProfileMutation.mutateAsync(payload)
      refetch()
      setProfile(res.data.data)
      setProfileToLS(res.data.data)
      toast.success(res.data.message)
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
                    labelValue={t('Code user')}
                    name='code'
                    type='text'
                    errorMessage={errors.code?.message}
                    placeholder={t('Code user')}
                  />
                  <InputMain
                    register={register}
                    labelValue={t('Address')}
                    name='address'
                    type='text'
                    placeholder={t('Address')}
                    errorMessage={errors.address?.message}
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
                </div>
                <div className='mn:col-span-12 lg:col-span-6'>
                  <div className='flex flex-col items-center px-10 py-20 border border-gray-200 rounded-md'>
                    <div className='my-5 h-40 w-40'>
                      <img
                        src={previewImage || getAvatarUrl(avatar)}
                        className='w-full h-full object-cover rounded-full'
                        alt=''
                      />
                    </div>
                    <InputFileMain onChange={handleChangeFile} />
                    <div className='mt-3 text-gray-400'>{t('Maximum size 1 MB')}</div>
                    <div className='mt-1 text-gray-400'>{t('Format: .JPG, .JPEG, .PNG')}</div>
                  </div>
                </div>
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
