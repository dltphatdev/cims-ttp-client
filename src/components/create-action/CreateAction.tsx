import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

interface Props {
  path: string
}

export default function CreateAction({ path }: Props) {
  return (
    <div className=' py-2 px-3 bg-(--color-org) hover:bg-orange-500 light:text-white font-medium text-base rounded-lg'>
      <Link to={path} className='text-white justify-center flex items-center gap-x-1'>
        <Plus />
        <span>Tạo mới</span>
      </Link>
    </div>
  )
}
