import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  labelValue: string
  labelRequired?: boolean
  statuses: {
    status_type: string
    status_value: string
  }[]
  onChange?: (value: string) => void
  value?: string
  errorMessage?: string
}

const StatusSelect = ({ labelValue, statuses, errorMessage, onChange, value, labelRequired = false }: Props) => {
  const { t } = useTranslation('admin')
  const [status, setStatus] = useState<string>(value || '')
  const handleChange = (value: string) => {
    setStatus(value)
    onChange?.(value)
  }
  const convertT = (key: string, defaultText?: string) => t(key, { defaultValue: defaultText ?? key })
  return (
    <div className='space-y-3'>
      <Label className='text-sm font-medium'>
        {labelValue} {labelRequired === true && <span className='text-red-500'>*</span>}
      </Label>
      <Select value={value || status} onValueChange={handleChange}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={t('Select status')}>{convertT(value as string) || convertT(status)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {statuses.map((item) => (
              <SelectItem key={item.status_type} value={item.status_type}>
                {item.status_value}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {errorMessage && <p className='text-red-500 text-sm'>{errorMessage}</p>}
    </div>
  )
}

export default StatusSelect
