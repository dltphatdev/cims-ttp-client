import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import clsx from 'clsx'
import type { LucideProps } from 'lucide-react'
import type { ForwardRefExoticComponent, InputHTMLAttributes } from 'react'
import type { RegisterOptions, UseFormRegister, UseFormSetValue } from 'react-hook-form'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameErrorMessage?: string
  labelValue?: string
  labelIcon?: ForwardRefExoticComponent<LucideProps>
  labelIconClassname?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>
  rules?: RegisterOptions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue?: UseFormSetValue<any>
}

export default function InputMain({
  labelValue,
  classNameErrorMessage = 'text-red-600 text-sm',
  register,
  rules,
  name,
  errorMessage,
  disabled,
  ...rest
}: Props) {
  const registerResult = register && name ? register(name, rules) : null
  return (
    <div className='space-y-2 mn:mb-2 lg:mb-4'>
      <Label htmlFor={name} className='text-sm font-medium light:text-gray-700'>
        {labelValue} <span className='text-red-500'>*</span>
      </Label>
      <div className='relative z-2'>
        <Input
          className={clsx('h-12 border-gray-200', {
            'bg-gray-100 cursor-not-allowed focus:outline-none': disabled
          })}
          disabled={disabled}
          {...registerResult}
          {...rest}
        />
      </div>
      {errorMessage && <span className={classNameErrorMessage}>{errorMessage}</span>}
    </div>
  )
}
