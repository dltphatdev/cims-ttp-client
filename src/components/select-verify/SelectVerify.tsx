import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  labelValue: string
  onChange?: (value: string) => void
  value?: string
  errorMessage?: string
}

const SelectVerify = ({ labelValue, errorMessage, onChange, value }: Props) => {
  const { t } = useTranslation()
  const [verify, setVerify] = useState<string>('')
  const handleChange = (value: string) => {
    setVerify(value)
    onChange?.(value)
  }
  return (
    <div className='space-y-3'>
      <Label className='text-sm font-medium'>
        {labelValue} <span className='text-red-500'>*</span>
      </Label>
      <Select value={value || verify} onValueChange={handleChange}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={t('Verified user')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value='Verified'>{t('Verified')}</SelectItem>
            <SelectItem value='Unverified'>{t('Unverified')}</SelectItem>
            <SelectItem value='Banned'>{t('Banned')}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {errorMessage && <p className='text-red-500 text-sm'>{errorMessage}</p>}
    </div>
  )
}

export default SelectVerify
