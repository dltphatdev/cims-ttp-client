import PATH from '@/constants/path'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const NotFound = () => {
  const { t } = useTranslation()
  return (
    <main className='grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8'>
      <div className='text-center'>
        <h1 className='mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl'>
          404 - {t('No results found')}
        </h1>
        <p className='mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8'>
          {t('Sorry, we couldn’t find the page you’re looking for')}
        </p>
        <div className='mt-10 flex items-center justify-center gap-x-6'>
          <Link
            to={PATH.HOME}
            className='rounded-md bg-(--color-org) px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-(--color-org) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-org)'
          >
            {t('Back to home')}
          </Link>
        </div>
      </div>
    </main>
  )
}

export default NotFound
