import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTranslation } from 'react-i18next'

interface Props {
  labelValue: string
}

export default function SelectRole({ labelValue }: Props) {
  const { t } = useTranslation()
  return (
    <div className='space-y-3'>
      <Label className='text-sm font-medium light:text-gray-700'>
        {labelValue} <span className='text-red-500'>*</span>
      </Label>
      <Select>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={t('Select role')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value='apple'>Supper Admin</SelectItem>
            <SelectItem value='banana'>Admin</SelectItem>
            <SelectItem value='blueberry'>Sale</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
