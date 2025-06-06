import { useTranslation } from 'react-i18next'

const AuthSidebar = () => {
  const { t } = useTranslation()
  return (
    <div className='flex-1 bg-(--color-green-custom) mn:hidden lg:flex flex-col justify-between p-8 text-white relative'>
      {/* Logo */}
      <div className='flex items-center'>
        <img src='/images/logo-login.svg' alt='Logo' />
      </div>

      {/* Main Content */}
      <div className='flex-1 flex items-center'>
        <div className='max-w-md'>
          <h1 className='text-4xl font-bold leading-tight mb-4 capitalize'>
            {t('Customer Information Management System')}
          </h1>
        </div>
      </div>

      {/* Footer */}
      <div className='text-sm opacity-70'>Copyright © 2023 TTPGroup. All Rights Reserved.</div>
    </div>
  )
}

export default AuthSidebar
