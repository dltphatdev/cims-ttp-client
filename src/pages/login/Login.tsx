import { useForm, type Resolver } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Lock, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import AuthButton from '@/components/auth-button'
import AuthInput from '@/components/auth-input'
import AuthSidebar from '@/components/auth-sidebar'
import SelectLang from '@/components/select-lang'
import { Card, CardContent } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import { ModeToggle } from '@/components/mode-toggle'
import { Fragment, useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { useMutation } from '@tanstack/react-query'
import userApi from '@/apis/user.api'
import { AppContext } from '@/contexts/app-context'
import PATH from '@/constants/path'
import httpStatusCode from '@/constants/httpStatusCode'
import * as yup from 'yup'
import { schema } from '@/utils/validation'

const formData = schema.pick(['email', 'password'])
type FormData = yup.InferType<typeof formData>

export default function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const { t } = useTranslation('login')
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: yupResolver(formData) as Resolver<FormData>
  })
  const loginMutation = useMutation({
    mutationFn: (body: FormData) => userApi.login(body)
  })

  const handleSubmitForm = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate(PATH.HOME)
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
  })

  return (
    <Fragment>
      <Helmet>
        <title>Login - TTP Telecom</title>
        <meta name='keywords' content='Login - TTP Telecom' />
        <meta name='description' content='Login - TTP Telecom' />
      </Helmet>
      <div className='min-h-screen dark:bg-[oklch(0.145 0 0)] light:bg-gray-50'>
        <div className='min-h-screen flex'>
          <AuthSidebar />

          <div className='flex-1 flex items-center justify-center mn:p-4 lg:p-8 light:bg-gray-50'>
            <div className='w-full max-w-md'>
              <div className='flex justify-end mn:mb-4 lg:mb-8'>
                <SelectLang />
                <div className='ml-2'>
                  <ModeToggle />
                </div>
              </div>
              <Card className='border-0 shadow-xl'>
                <CardContent className='mn:p-4 lg:p-8'>
                  <h3 className='mn:text-xl lg:text-2xl font-semibold light:text-gray-800 lg:mb-8 mn:mb-5 text-center'>
                    {t('Manager login')}
                  </h3>

                  <form className='space-y-6' onSubmit={handleSubmitForm} noValidate>
                    {/* Email Field */}
                    <AuthInput
                      labelValue='Email'
                      name='email'
                      type='email'
                      placeholder={t('Enter your email')}
                      labelIcon={Mail}
                      register={register}
                      errorMessage={errors?.email?.message as string}
                      setValue={setValue}
                    />
                    {/* Password Field */}
                    <AuthInput
                      labelValue={t('Password')}
                      name='password'
                      type='password'
                      register={register}
                      errorMessage={errors?.password?.message as string}
                      placeholder={t('Enter your password')}
                      labelIcon={Lock}
                      setValue={setValue}
                    />
                    {/* Login Button */}
                    <AuthButton isLoading={loginMutation.isPending} disabled={loginMutation.isPending}>
                      {t('Login')}
                    </AuthButton>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
