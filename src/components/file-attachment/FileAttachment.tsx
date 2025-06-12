import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UploadCloud, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const FileAttachment = () => {
  const { t } = useTranslation('admin')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleRemove = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  return (
    <div className='flex flex-col space-y-4 w-fit'>
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

      <Input type='file' ref={fileInputRef} onChange={handleFileChange} className='hidden' />
    </div>
  )
}

export default FileAttachment
