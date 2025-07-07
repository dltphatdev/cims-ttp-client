import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import clsx from 'clsx'
import { Eye, Trash2, UploadCloud, GripVertical, File } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Link } from 'react-router-dom'
import { getFilesUrl } from '@/utils/common'

interface Props {
  onChange?: (file?: File[]) => void
  defaultFiles?: {
    filename: string
  }[]
  labelRequired?: boolean
  resetSignal?: boolean
  viewFileUploaded?: boolean
}

function SortableFileItem({ file, id, onRemove }: { file: File; id: string; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }
  return (
    <div ref={setNodeRef} style={style} className='flex justify-between items-center border-b py-2 text-sm'>
      <div className='flex items-center gap-2 truncate'>
        <span {...attributes} {...listeners} className='cursor-move text-gray-500'>
          <GripVertical className='w-4 h-4' />
        </span>
        <span className='truncate flex items-center gap-1'>
          <File width={15} /> {file.name}
        </span>
      </div>
      <Button variant='ghost' size='icon' onClick={onRemove}>
        <Trash2 className='w-4 h-4 text-red-500' />
      </Button>
    </div>
  )
}

export default function FileUploadMultiple({
  onChange,
  defaultFiles,
  labelRequired = false,
  resetSignal,
  viewFileUploaded
}: Props) {
  const { t } = useTranslation('admin')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [dialogOpen, setDialogOpen] = useState<null | 'server' | 'local'>(null)
  const sensors = useSensors(useSensor(PointerSensor))
  const resetRef = useRef<boolean | undefined>(undefined)
  const initFiles = defaultFiles || []

  useEffect(() => {
    if (resetSignal === resetRef.current) return
    resetRef.current = resetSignal
    setFiles([])
    onChange?.([])
  }, [resetSignal, onChange])

  const handleClick = () => fileInputRef.current?.click()

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = e.target.files
    if (!fileFromLocal) return
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ]

    const MAX_FILE_SIZE = Number(import.meta.env.VITE_MAX_FILE_ATTACHMENT)
    const validFiles: File[] = []
    const invalidFiles: string[] = []

    Array.from(fileFromLocal).forEach((file) => {
      if (file.size <= MAX_FILE_SIZE && allowedTypes.includes(file.type)) {
        validFiles.push(file)
      } else {
        invalidFiles.push(file.name)
      }
    })

    if (invalidFiles.length > 0) {
      toast.error(t('Maximum file size 15MB. Format: .docs | .pp | .pdf | .xlsx'))
    }

    if (validFiles.length > 0) {
      onChange?.(validFiles)
      setFiles(validFiles)
    }
  }

  const removeFile = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index))

  const clearAll = () => setFiles([])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!active || !over || active.id === over.id) return
    const oldIndex = files.findIndex((file) => file.name === active.id)
    const newIndex = files.findIndex((file) => file.name === over.id)
    setFiles((files) => arrayMove(files, oldIndex, newIndex))
  }

  return (
    <div className='flex flex-col space-y-4 mn:w-full lg:w-fit mb-2'>
      <Label htmlFor='note' className='text-sm font-medium light:text-gray-700'>
        Files upload: {labelRequired === true && <span className='text-red-500'>*</span>}
      </Label>
      <Button type='button' variant='outline' onClick={handleClick} className='flex items-center gap-2'>
        <UploadCloud className='w-4 h-4' />
        {t('Select file')}
      </Button>
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleChangeFile}
        className='hidden'
        multiple
        onClick={(e) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(e.target as any).value = null
        }}
      />
      <div className='mb-1'>
        {t('Maximum file size upload:')} <strong className='text-red-500'>15 MB</strong>
      </div>
      <strong>{t('Allow file: .docs | .pp | .pdf | .xlsx')}</strong>

      {viewFileUploaded && (
        <Dialog open={dialogOpen === 'server'} onOpenChange={(v) => setDialogOpen(v ? 'server' : null)}>
          <DialogTrigger asChild>
            <Button
              type='button'
              className={clsx({
                'hover:cursor-not-allowed opacity-80': initFiles?.length === 0
              })}
              disabled={initFiles?.length === 0}
            >
              <Eye /> {t('View file uploaded')} ({initFiles?.length})
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-lg w-full p-6'>
            <DialogHeader>
              <DialogTitle>{t('List file')}</DialogTitle>
            </DialogHeader>
            <div className='mt-4 max-h-[300px] overflow-y-auto space-y-2 pr-1'>
              {initFiles?.map((file) => (
                <div key={file.filename} className='flex justify-between items-center border-b py-2 text-sm'>
                  <Link
                    to={getFilesUrl(file.filename)}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='truncate line-clamp-1 flex items-center gap-1 hover:underline text-blue-600'
                  >
                    <File width={15} /> <span>{file.filename}</span>
                  </Link>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={dialogOpen === 'local'} onOpenChange={(v) => setDialogOpen(v ? 'local' : null)}>
        <DialogTrigger asChild>
          <Button
            type='button'
            className={clsx({
              'hover:cursor-not-allowed opacity-80': files.length === 0
            })}
            disabled={files.length === 0}
          >
            <Eye /> {t('View file choosen')} ({files.length})
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-lg w-full p-6'>
          <DialogHeader>
            <DialogTitle>{t('List file')}</DialogTitle>
          </DialogHeader>
          <div className='mt-4 max-h-[300px] overflow-y-auto space-y-2 pr-1'>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={files.map((f) => f.name)} strategy={verticalListSortingStrategy}>
                {files.map((file, index) => (
                  <SortableFileItem key={index} id={file.name} file={file} onRemove={() => removeFile(index)} />
                ))}
              </SortableContext>
            </DndContext>
          </div>
          <div className='flex justify-end pt-4'>
            {files.length > 0 && (
              <Button variant='destructive' onClick={clearAll}>
                {t('Delete all')}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
