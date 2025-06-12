import userApi from '@/apis/user.api'
import ButtonMain from '@/components/button-main'
import InputMain from '@/components/input-main'
import httpStatusCode from '@/constants/httpStatusCode'
import { changePasswordSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useForm, type Resolver } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Fragment } from 'react/jsx-runtime'
import { toast } from 'sonner'
import * as yup from 'yup'

const formData = changePasswordSchema.pick(['confirm_password', 'old_password', 'password'])
type FormData = yup.InferType<typeof formData>
type Body = Omit<FormData, 'confirm_password'>

export default function ChangePassword() {
  const { t } = useTranslation('admin')
  const {
    register,
    formState: { errors },
    reset,
    setError,
    handleSubmit
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      confirm_password: '',
      old_password: ''
    },
    resolver: yupResolver(formData) as Resolver<FormData>
  })
  const changePasswordMutation = useMutation({
    mutationFn: userApi.changePasswordUser
  })
  const handleSubmitForm = handleSubmit(async (data: Body) => {
    try {
      const result = await changePasswordMutation.mutateAsync(data)
      toast.success(result.data.message)
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
  return (
    <Fragment>
      <Helmet>
        <title>Thay đổi mật khẩu - TTP Telecom</title>
        <meta name='keywords' content='Thay đổi mật khẩu - TTP Telecom' />
        <meta name='description' content='Thay đổi mật khẩu - TTP Telecom' />
      </Helmet>
      <div className='@container/main'>
        <div className='py-4 md:gap-6 md:py-6'>
          <div className='px-4 lg:px-6'>
            <h1 className='mb-2 font-bold text-2xl'>{t('Change password')}</h1>
            <form onSubmit={handleSubmitForm}>
              <div>
                <InputMain
                  register={register}
                  labelValue={t('Old Password')}
                  type='password'
                  name='old_password'
                  errorMessage={errors?.old_password?.message as string}
                  placeholder={t('Old Password')}
                />
                <InputMain
                  register={register}
                  labelValue={t('Password')}
                  type='password'
                  name='password'
                  errorMessage={errors?.password?.message as string}
                  placeholder={t('Password')}
                />
                <InputMain
                  register={register}
                  labelValue={t('Confirm password')}
                  type='password'
                  name='confirm_password'
                  errorMessage={errors?.confirm_password?.message as string}
                  placeholder={t('Confirm password')}
                />
              </div>
              <ButtonMain
                isLoading={changePasswordMutation.isPending}
                disabled={changePasswordMutation.isPending}
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
