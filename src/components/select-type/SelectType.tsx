import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  labelValue: string
  labelRequired?: boolean
  types: {
    key_type: string
    key_value: string
  }[]
  onChange?: (value: string) => void
  value?: string
  errorMessage?: string
}

export default function SelectType({ labelValue, types, errorMessage, onChange, value, labelRequired = false }: Props) {
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
          <SelectValue placeholder={t('Type')}>{convertT(value as string) || convertT(status)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {types.map((item) => (
              <SelectItem key={item.key_type} value={item.key_type}>
                {item.key_value}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {errorMessage && <p className='text-red-500 text-sm'>{errorMessage}</p>}
    </div>
  )
}
