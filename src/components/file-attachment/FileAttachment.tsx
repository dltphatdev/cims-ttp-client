import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import CONFIG from '@/constants/config'
import { UploadCloud, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface Props {
  onChange?: (file?: File) => void
}

const FileAttachment = ({ onChange }: Props) => {
  const { t } = useTranslation('admin')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemove = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = e.target.files?.[0]
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    if (
      fileFromLocal &&
      (fileFromLocal.size >= CONFIG.MAX_FILE_ATTACHMENT || !allowedTypes.includes(fileFromLocal.type))
    ) {
      toast.error(t('Maximum file size 15MB. Format: .docs | .pp | .pdf | .xlsx'))
    } else {
      onChange?.(fileFromLocal)
    }
  }

  return (
    <div className='flex flex-col space-y-4 w-fit mb-2'>
      <Label htmlFor='note' className='text-sm font-medium light:text-gray-700'>
        File upload <span className='text-red-500'>*</span>
      </Label>
      {file ? (
        <div className='flex items-center justify-between rounded-md border px-4 py-2 bg-muted'>
          <span className='text-sm truncate max-w-[200px]'>{file.name}</span>
          <Button variant='ghost' size='icon' onClick={handleRemove}>
            <X className='w-4 h-4' />
          </Button>
        </div>
      ) : (
        <Button type='button' variant='outline' onClick={handleClick} className='flex items-center gap-2'>
          <UploadCloud className='w-4 h-4' />
          {t('Select file')}
        </Button>
      )}

      <Input type='file' ref={fileInputRef} onChange={handleChangeFile} className='hidden' />
      <div className='mb-1'>
        {t('Maximum file size upload:')} <strong className='text-red-500'>15 MB</strong>
      </div>
      <strong>{t('Allow file: .docs | .pp | .pdf | .xlsx')}</strong>
    </div>
  )
}

export default FileAttachment
