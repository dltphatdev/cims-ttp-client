import { Fragment, useRef } from 'react'
import CONFIG from '@/constants/config'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

interface Props {
  onChange?: (file?: File) => void
}

export default function InputFileMain({ onChange }: Props) {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = e.target.files?.[0]
    if (fileFromLocal && (fileFromLocal.size >= CONFIG.MAX_FILE_SIZE_UPLOAD || !fileFromLocal.type.includes('image'))) {
      toast.error('Error', {
        description: t('Maximum file size 1MB. Format: .JPG, .JPEG, .PNG'),
        action: {
          label: t('Close'),
          onClick: () => true
        },
        duration: 5000,
        position: 'top-right'
      })
    } else {
      onChange?.(fileFromLocal)
    }
  }

  const handleUpload = () => fileInputRef.current?.click()
  return (
    <Fragment>
      <input
        type='file'
        ref={fileInputRef}
        className='hidden'
        accept={CONFIG.ACCEPT_FILE_UPLOAD}
        onChange={handleChangeFile}
        onClick={(e) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(e.target as any).value = null
        }}
      />
      <button
        className='flex h-10 items-center justify-end border border-gray-400 bg-white px-6 text-sm shadow-sm text-gray-600 hover:cursor-pointer'
        type='button'
        onClick={handleUpload}
      >
        {t('Choosen image')}
      </button>
    </Fragment>
  )
}
