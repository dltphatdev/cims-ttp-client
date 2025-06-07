import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Lock, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import AuthButton from '@/components/auth-button'
import AuthInput from '@/components/auth-input'
import AuthSidebar from '@/components/auth-sidebar'
import SelectLang from '@/components/select-lang'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { getSchema } from '@/utils/validation'
import { Link } from 'react-router-dom'
import { ModeToggle } from '@/components/mode-toggle'
import { Fragment } from 'react'
import { Helmet } from 'react-helmet-async'

export default function Login() {
  const { t } = useTranslation('login')
  const schema = getSchema(t)
  const formData = schema.pick(['email', 'password', 'terms'])
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(formData),
    defaultValues: {
      email: '',
      password: '',
      terms: false
    }
  })

  const handleSubmitForm = handleSubmit((data) => {
    console.log(data)
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
                    <AuthButton>{t('Login')}</AuthButton>
                    {/* Terms Checkbox */}
                    <div className='flex items-start space-x-1 mb-3'>
                      <Controller
                        name='terms'
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id='terms'
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className='mt-1 light:border-(--color-org) data-[state=checked]:bg-(--color-org) data-[state=checked]:border-(--color-org)'
                          />
                        )}
                      />
                      <Label htmlFor='terms' className='light:text-gray-600 leading-relaxed text-sm block'>
                        {t('I have read and accept')} {''}
                        <Link to='' className='text-(--color-org) hover:text-orange-500'>
                          {t('terms of service')}
                        </Link>{' '}
                        và{' '}
                        <Link to='' className='text-(--color-org) hover:text-orange-500'>
                          {t('privacy policy')}
                        </Link>
                      </Label>
                    </div>
                    {errors.terms && <span className='text-red-600 text-sm'>{errors.terms.message}</span>}
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
