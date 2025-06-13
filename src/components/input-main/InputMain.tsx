import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import clsx from 'clsx'
import { Eye, EyeOff, type LucideProps } from 'lucide-react'
import { useState, type ForwardRefExoticComponent, type InputHTMLAttributes } from 'react'
import type { RegisterOptions, UseFormRegister, UseFormSetValue } from 'react-hook-form'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  classNameWrapper?: string
  errorMessage?: string
  classNameErrorMessage?: string
  classNameLabel?: string
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
  classNameWrapper = 'space-y-2 mn:mb-2 lg:mb-3',
  classNameLabel = 'text-sm font-medium light:text-gray-700',
  classNameErrorMessage = 'text-red-600 text-sm',
  className = 'h-12 border-gray-200',
  register,
  rules,
  type,
  name,
  errorMessage,
  disabled,
  ...rest
}: Props) {
  const [openEye, setOpenEye] = useState<boolean>(false)
  const registerResult = register && name ? register(name, rules) : null
  const handleToggleEye = () => setOpenEye((prevState) => !prevState)
  const handleType = () => (type === 'password' && openEye ? 'text' : type)
  return (
    <div className={classNameWrapper}>
      <Label htmlFor={name} className={classNameLabel}>
        {labelValue} <span className='text-red-500'>*</span>
      </Label>
      <div className='relative z-2'>
        <Input
          type={handleType()}
          className={clsx(className, {
            'bg-gray-100 cursor-not-allowed focus:outline-none': disabled
          })}
          disabled={disabled}
          {...registerResult}
          {...rest}
        />
        <button
          type='button'
          onClick={handleToggleEye}
          className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
        >
          {type === 'password' && openEye && <EyeOff className='h-4 w-4' />}
          {type === 'password' && !openEye && <Eye className='h-4 w-4' />}
        </button>
      </div>
      {errorMessage && <span className={classNameErrorMessage}>{errorMessage}</span>}
    </div>
  )
}
