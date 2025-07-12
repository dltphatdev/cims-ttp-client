import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useEffect, useState } from 'react'
import { vi } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Calendar as CalendarLucide } from 'lucide-react'
import { format } from 'date-fns'
import { Label } from '@/components/ui/label'

interface Props {
  onChange?: (value: Date) => void
  value?: Date
  errorMessage?: string
  labelRequired?: boolean
  labelValue?: string
  isHourMinuteSecond?: boolean
}

const DateTimePicker = ({
  errorMessage,
  labelRequired = false,
  onChange,
  value,
  labelValue,
  isHourMinuteSecond = false
}: Props) => {
  const now = new Date()
  const initTimeString = '0'
  const initTimeNumber = 0
  const maxLengthTime = 2
  const [initLabelTime, setInitLabelTime] = useState<string>('00:00:00 dd/mm/YYYY')
  const [date, setDate] = useState<Date>(value || now)
  const [hours, setHours] = useState<string>(() =>
    String(value?.getHours() ?? initTimeNumber).padStart(maxLengthTime, initTimeString)
  )
  const [minutes, setMinutes] = useState<string>(() =>
    String(value?.getMinutes() ?? initTimeNumber).padStart(maxLengthTime, initTimeString)
  )
  const [seconds, setSeconds] = useState<string>(() =>
    String(value?.getSeconds() ?? initTimeNumber).padStart(maxLengthTime, initTimeString)
  )

  useEffect(() => {
    if (value) {
      setDate(value)
      setHours(String(value.getHours()).padStart(maxLengthTime, initTimeString))
      setMinutes(String(value.getMinutes()).padStart(maxLengthTime, initTimeString))
      setSeconds(String(value.getSeconds()).padStart(maxLengthTime, initTimeString))
    }
  }, [value])

  useEffect(() => {
    if (date) {
      const formatString = isHourMinuteSecond ? 'HH:mm:ss dd-MM-yyyy' : 'dd-MM-yyyy'
      setInitLabelTime(format(new Date(date), formatString))
    }
  }, [date, isHourMinuteSecond])

  const handleTimeChange = (type: 'h' | 'm' | 's', value: string) => {
    const updatedDate = new Date(date)
    if (type === 'h') {
      updatedDate.setHours(Number(value))
      setHours(value)
    }
    if (type === 'm') {
      updatedDate.setMinutes(Number(value))
      setMinutes(value)
    }
    if (type === 's') {
      updatedDate.setSeconds(Number(value))
      setSeconds(value)
    }
    setDate(updatedDate)
    onChange?.(updatedDate)
  }

  const handleDateChange = (d: Date) => {
    if (d) {
      const updated = new Date(d)
      if (isHourMinuteSecond) {
        updated.setHours(+hours)
        updated.setMinutes(+minutes)
        updated.setSeconds(+seconds)
      }
      setDate(updated)
      onChange?.(updated)
    }
  }

  return (
    <div className='flex flex-col gap-3'>
      <Label className='text-sm font-medium light:text-gray-700'>
        {labelValue} {labelRequired === true && <span className='text-red-500'>*</span>}
      </Label>
      <Popover>
        <PopoverTrigger asChild className='justify-start'>
          <Button variant='outline'>
            <CalendarLucide /> {labelValue} <span className='text-gray-500'>( {initLabelTime} )</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto flex flex-col gap-4'>
          <Calendar
            captionLayout='dropdown'
            locale={vi}
            mode='single'
            required
            selected={date}
            onSelect={handleDateChange}
            fromYear={1990}
            toYear={new Date().getFullYear()}
          />
          {isHourMinuteSecond && (
            <div className='flex gap-2 justify-center'>
              <select
                value={hours}
                onChange={(e) => handleTimeChange('h', e.target.value)}
                className='border px-2 py-1 rounded'
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i}>{String(i).padStart(2, '0')}</option>
                ))}
              </select>
              :
              <select
                value={minutes}
                onChange={(e) => handleTimeChange('m', e.target.value)}
                className='border px-2 py-1 rounded'
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <option key={i}>{String(i).padStart(2, '0')}</option>
                ))}
              </select>
              :
              <select
                value={seconds}
                onChange={(e) => handleTimeChange('s', e.target.value)}
                className='border px-2 py-1 rounded'
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <option key={i}>{String(i).padStart(2, '0')}</option>
                ))}
              </select>
            </div>
          )}
          {errorMessage && <p className='text-red-500 text-sm'>{errorMessage}</p>}
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DateTimePicker
