import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props extends React.ComponentPropsWithoutRef<'textarea'> {
  isLabel?: boolean
  labelRequired?: boolean
  classNameWrapper?: string
  errorMessage?: string
  classNameErrorMessage?: string
  classNameLabel?: string
  labelValue?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>
  rules?: RegisterOptions
}

export default function TextAreaMain({
  isLabel = true,
  labelRequired = false,
  classNameWrapper = 'grid gap-3',
  errorMessage,
  classNameErrorMessage = 'text-red-600',
  classNameLabel = 'text-sm font-medium light:text-gray-700',
  labelValue,
  register,
  name,
  rules,
  ...rest
}: Props) {
  const registerResult = register && name ? register(name, rules) : null
  return (
    <div className={classNameWrapper}>
      {isLabel && (
        <Label htmlFor={name} className={classNameLabel}>
          {labelValue} {labelRequired && <span className='text-red-500'>*</span>}
        </Label>
      )}
      <Textarea {...registerResult} {...rest} />
      {errorMessage && <span className={classNameErrorMessage}>{errorMessage}</span>}
    </div>
  )
}
