import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  labelValue: string
  labelRequired?: boolean
  genders: {
    gender_type: string
    gender_value: string
  }[]
  onChange?: (value: string) => void
  value?: string
  errorMessage?: string
}

const GenderSelect = ({ labelValue, genders, errorMessage, onChange, value, labelRequired = false }: Props) => {
  const { t } = useTranslation('admin')
  const [gender, setGender] = useState<string>(value || '')
  const handleChange = (value: string) => {
    setGender(value)
    onChange?.(value)
  }
  return (
    <div className='space-y-3'>
      <Label className='text-sm font-medium'>
        {labelValue} {labelRequired === true && <span className='text-red-500'>*</span>}
      </Label>
      <Select value={value || gender} onValueChange={handleChange}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={t('Select gender')}>{value || gender}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {genders.map((item) => (
              <SelectItem key={item.gender_type} value={item.gender_type}>
                {item.gender_value}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {errorMessage && <p className='text-red-500 text-sm'>{errorMessage}</p>}
    </div>
  )
}

export default GenderSelect
