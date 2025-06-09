import { formatedDate, formatedTime } from '@/utils/common'

interface Props {
  isoDate: string
}

export default function FormattedDate({ isoDate }: Props) {
  return (
    <div>
      <span className='block text-gray-400'>{formatedTime(isoDate)}</span>
      <span className='block'>{formatedDate(isoDate)}</span>
    </div>
  )
}
