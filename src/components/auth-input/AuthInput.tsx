import { createElement, useState, type ForwardRefExoticComponent, type InputHTMLAttributes } from 'react'
import { type UseFormRegister, type RegisterOptions, type UseFormSetValue } from 'react-hook-form'
import clsx from 'clsx'
import { Eye, EyeOff, X, type LucideProps } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

const AuthInput = ({
  labelValue,
  labelIcon,
  labelIconClassname = 'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4',
  classNameErrorMessage = 'text-red-600 text-sm',
  register,
  rules,
  setValue,
  type,
  name,
  errorMessage,
  ...rest
}: Props) => {
  const [openEye, setOpenEye] = useState<boolean>(false)
  const registerResult = register && name ? register(name, rules) : null
  const handleToggleEye = () => setOpenEye((prevState) => !prevState)
  const handleType = () => (type === 'password' && openEye ? 'text' : type)
  const handleResetValue = () => {
    if (setValue && name) {
      setValue(name, '')
    }
  }
  return (
    <div className='space-y-2'>
      <Label htmlFor='password' className='text-sm font-medium light:text-gray-700'>
        {labelValue} <span className='text-red-500'>*</span>
      </Label>
      <div className='relative z-2'>
        {labelIcon && createElement(labelIcon, { className: labelIconClassname })}
        <Input type={handleType()} className='pl-10 pr-10 h-12 border-gray-200' {...registerResult} {...rest} />
        <button
          type='button'
          onClick={handleResetValue}
          className={clsx('absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600', {
            'right-3': type !== 'password',
            'right-10': type === 'password'
          })}
        >
          <X className='h-4 w-4' />
        </button>
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

export default AuthInput
