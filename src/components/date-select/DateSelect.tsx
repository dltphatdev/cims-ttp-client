import { Label } from '@radix-ui/react-label'
import { range } from 'lodash'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  onChange?: (value: Date) => void
  value?: Date
  labelValue: string
  errorMessage?: string
  labelRequired?: boolean
}

export default function DateSelect({ errorMessage, onChange, value, labelValue, labelRequired = false }: Props) {
  const { t } = useTranslation('admin')
  const [date, setDate] = useState({
    date: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990
  })
  useEffect(() => {
    if (value) {
      setDate({
        date: value.getDate(),
        month: value.getMonth(),
        year: value.getFullYear()
      })
    }
  }, [value])
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value: valueFormSelect, name } = e.target
    const newDate = {
      date: value?.getDate() || date.date,
      month: value?.getMonth() || date.month,
      year: value?.getFullYear() || date.year,
      [name]: Number(valueFormSelect)
    }
    // Lấy số ngày tối đa của tháng được chọn
    const maxDays = new Date(newDate.year, newDate.month + 1, 0).getDate()
    // Nếu ngày hiện tại vượt quá max thì tự động điều chỉnh
    if (newDate.date > maxDays) {
      newDate.date = maxDays
    }
    setDate(newDate)
    onChange?.(new Date(newDate.year, newDate.month, newDate.date))
  }
  return (
    <div>
      <Label className='text-sm font-medium light:text-gray-700'>
        {labelValue} {labelRequired === true && <span className='text-red-500'>*</span>}
      </Label>
      <div className='mt-2 md:mt-4 flex flex-wrap'>
        <div className='w-full'>
          <div className='grid grid-cols-12 gap-3'>
            <select
              name='date'
              onChange={handleChange}
              className='h-12 mn:col-span-12 lg:col-span-4 rounded-sm border foreground:text-black dark:bg-black light:bg-white px-3'
              value={value?.getDate() || date.date}
            >
              <option disabled>{t('Day')}</option>
              {range(1, 32).map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              name='month'
              onChange={handleChange}
              className='h-12 mn:col-span-12 lg:col-span-4 rounded-sm border foreground:text-black dark:bg-black light:bg-white px-3'
              value={value?.getMonth() || date.month}
            >
              <option disabled>{t('Month')}</option>
              {range(0, 12).map((item) => (
                <option value={item} key={item}>
                  {item + 1}
                </option>
              ))}
            </select>
            <select
              name='year'
              onChange={handleChange}
              className='h-12 mn:col-span-12 lg:col-span-4 rounded-sm border foreground:text-black dark:bg-black light:bg-white px-3'
              value={value?.getFullYear() || date.year}
            >
              <option disabled>{t('Year')}</option>
              {range(1990, new Date().getFullYear() + 1).map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          {errorMessage && <span className='text-red-600'>{errorMessage}</span>}
        </div>
      </div>
    </div>
  )
}
