import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Props {
  path: string
}

export default function CreateAction({ path }: Props) {
  const { t } = useTranslation('admin')
  return (
    <div className=' py-2 px-3 bg-(--color-org) hover:bg-orange-500 light:text-white font-medium text-base rounded-lg'>
      <Link
        to={path}
        state={{ navTitle: t('Create user') }}
        className='text-white justify-center flex items-center gap-x-1'
      >
        <Plus />
        <span>{t('Create new')}</span>
      </Link>
    </div>
  )
}
