import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { forwardRef, useEffect, useState, type InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  classNameWrapper?: string
  errorMessage?: string
  classNameErrorMessage?: string
  classNameLabel?: string
  labelValue?: string
  labelRequired?: boolean
  isPercent?: boolean
}

const InputNumber = forwardRef<HTMLInputElement, Props>(function InputNumberInner(
  {
    errorMessage,
    isPercent = false,
    labelRequired = false,
    classNameWrapper = 'space-y-2 mn:mb-2 lg:mb-3',
    classNameLabel = 'text-sm font-medium light:text-gray-700',
    classNameErrorMessage = 'text-red-600 text-sm',
    className = 'h-12 border-gray-200',
    labelValue,
    onChange,
    value = '',
    type,
    name,
    ...rest
  }: Props,
  ref
) {
  const [localValue, setLocalValue] = useState<string>(value as string)

  useEffect(() => {
    setLocalValue(value as string)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (isPercent) {
      const number = parseFloat(value)
      if (value === '') {
        setLocalValue('')
        onChange?.(e)
        return
      }
      if (!isNaN(number) && number >= 0 && number <= 100) {
        onChange?.(e)
        setLocalValue(value)
      } else if (number > 100) {
        setLocalValue('100')
        const customEvent = {
          ...e,
          target: {
            ...e.target,
            value: '100'
          }
        } as React.ChangeEvent<HTMLInputElement>
        onChange?.(customEvent)
      } else if (number < 0) {
        setLocalValue('0')
        const customEvent = {
          ...e,
          target: {
            ...e.target,
            value: '0'
          }
        } as React.ChangeEvent<HTMLInputElement>
        onChange?.(customEvent)
      }
    } else {
      if (/^\d+/.test(value) || value === '') {
        onChange?.(e)
        setLocalValue(value)
      }
    }
  }
  return (
    <div className={classNameWrapper}>
      <Label htmlFor={name} className={classNameLabel}>
        {labelValue} {labelRequired === true && <span className='text-red-500'>*</span>}
      </Label>
      <div>
        <Input
          ref={ref}
          className={className}
          type={type}
          onChange={handleChange}
          value={value || localValue}
          {...rest}
        />
      </div>
      {errorMessage && <span className={classNameErrorMessage}>{errorMessage}</span>}
    </div>
  )
})

export default InputNumber
