import { formatNumberCurrency } from '@/utils/common'

interface Props {
  label?: string
  price?: number
  unit?: string
  classNameRevenueTagsPrice?: string
  classNamePrice?: string
}

const RevenueTagsPrice = ({
  label,
  price = 0,
  unit = 'đ',
  classNamePrice = 'text-gray-500',
  classNameRevenueTagsPrice = 'py-2 px-4 rounded-md border border-color-[rgba(240,240,240,1)]'
}: Props) => {
  return (
    <div className={classNameRevenueTagsPrice}>
      {label && <strong>{label}</strong>}
      <strong className={classNamePrice}>
        {' '}
        {price ? formatNumberCurrency(price) : 0} {unit}
      </strong>
    </div>
  )
}

export default RevenueTagsPrice
