import userApi from '@/apis/user.api'
import ButtonMain from '@/components/button-main'
import InputMain from '@/components/input-main/InputMain'
import httpStatusCode from '@/constants/httpStatusCode'
import { schema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Fragment } from 'react/jsx-runtime'
import { toast } from 'sonner'
import * as yup from 'yup'

const formData = schema.pick(['email', 'password'])
type FormData = yup.InferType<typeof formData>

export default function UserCreate() {
  const { t } = useTranslation('admin')
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(formData),
    defaultValues: {
      email: '',
      password: ''
    }
  })
  const createUserMutation = useMutation({
    mutationFn: userApi.createUser
  })
  const handleSubmitForm = handleSubmit((data) => {
    createUserMutation.mutateAsync(data, {
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
                message: formError[key as keyof FormData]['msg']['message'],
                type: 'Server'
              })
            })
          }
        }
      }
    })
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
            <form onSubmit={handleSubmitForm}>
              <div>
                <InputMain
                  register={register}
                  labelValue='Email'
                  type='email'
                  name='email'
                  placeholder='Email'
                  errorMessage={errors?.email?.message as string}
                />
                <InputMain
                  register={register}
                  labelValue={t('Password')}
                  type='password'
                  name='password'
                  errorMessage={errors?.password?.message as string}
                  placeholder={t('Password')}
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
