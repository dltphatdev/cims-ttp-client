import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  labelValue: string
  roles: {
    role_type: string
    role_value: string
  }[]
  onChange?: (value: string) => void
  value?: string
  errorMessage?: string
  labelRequired?: boolean
}

export default function SelectRole({ labelValue, roles, onChange, value, errorMessage, labelRequired }: Props) {
  const { t } = useTranslation('admin')
  const [role, setRole] = useState<string>(value || '')
  const handleChange = (value: string) => {
    setRole(value)
    onChange?.(value)
  }
  const convertT = (key: string, defaultText?: string) => t(key, { defaultValue: defaultText ?? key })
  return (
    <div className='space-y-3'>
      <Label className='text-sm font-medium'>
        {labelValue} {labelRequired === true && <span className='text-red-500'>*</span>}
      </Label>
      <Select value={value || role} onValueChange={handleChange}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={t('Select role')}>{convertT(value || role)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {roles.map((item) => (
              <SelectItem key={item.role_type} value={item.role_type}>
                {convertT(item.role_value)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {errorMessage && <p className='text-red-500 text-sm'>{errorMessage}</p>}
    </div>
  )
}
