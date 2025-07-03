import userApi from '@/apis/user.api'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import useDebounce from '@/hooks/use-debounce'
import { useQueryParams } from '@/hooks/use-query-params'
import type { GetUsersParams } from '@/types/user'
import { useQuery } from '@tanstack/react-query'
import { isUndefined, omitBy } from 'lodash'
import { AlertTriangle, Check, RotateCcw, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const ADD_DIALOG_ACTION = 'add'
const REMOVE_DIALOG_ACTION = 'remove'

interface Tag {
  title: string
  id: number
}

interface Props {
  onChange?: (value: Tag[]) => void
  labelRequired?: boolean
  errorMessage?: string
  classNameErrorMessage?: string
  classNameWrapper?: string
  value?: { title: string; id: number }[]
}

type DialogAction = 'add' | 'remove' | null

export default function AddTags({
  labelRequired,
  value,
  errorMessage,
  classNameWrapper = 'space-y-2',
  classNameErrorMessage = 'text-red-600 text-sm',
  onChange
}: Props) {
  const initTags = value?.map((item) => ({ id: item.id, title: item.title })) || []
  const { t } = useTranslation('admin')
  const [open, setOpen] = useState<boolean>(false)
  const [tags, setTags] = useState<Tag[]>(initTags)
  const [pendingTags, setPendingTags] = useState<Tag[]>([])
  const [choosenAction, setChoosenAction] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')
  const [alertDialogAction, setAlertDialogAction] = useState<DialogAction>(null)
  const [tagId, setTagId] = useState<number | null>(null)
  const debounceSearch = useDebounce(search, 1000)
  const hasInitialized = useRef(false)
  const queryParams: GetUsersParams = useQueryParams()
  const queryConfig: GetUsersParams = omitBy(
    {
      page: queryParams.page,
      limit: queryParams.limit,
      fullname: queryParams.fullname as string[],
      phone: queryParams.phone as string[]
    },
    isUndefined
  )

  const { data } = useQuery({
    queryKey: ['users', queryConfig],
    queryFn: () => userApi.getUsers(queryConfig)
  })

  const items = data?.data.data.users

  const filteredItems = useMemo(
    () => items?.filter((item) => item.fullname?.toLowerCase().includes(debounceSearch.toLowerCase())),
    [debounceSearch, items]
  )

  useEffect(() => {
    if (!hasInitialized.current && value && value.length > 0) {
      const idsValue = value.map((item) => item.id)
      const mappedData = items?.filter((item) => idsValue.includes(item.id))
      const mappedTags =
        mappedData?.map((item) => ({
          id: item.id,
          title: item.fullname as string
        })) ?? []
      setTags(mappedTags)
      hasInitialized.current = true
    }

    if (value?.length === 0) {
      setTags([])
      hasInitialized.current = false
    }
  }, [value, items])

  const handleChoosenAction = () => {
    setChoosenAction(!choosenAction)
    if (pendingTags.length > 0) setAlertDialogAction(ADD_DIALOG_ACTION)
  }

  const handleChoosenTags = ({ id, title }: { id: number; title: string }) => {
    setPendingTags((prevState) => [...prevState, { id, title }])
  }

  const handleResetChoosenTags = () => setPendingTags([])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)

  const handleAlertDialogSuccessAction = () => {
    if (alertDialogAction === ADD_DIALOG_ACTION) {
      const mergeTags = [...tags, ...pendingTags]
      setTags(mergeTags)
      onChange?.(mergeTags)
      setOpen(!open)
    } else if (alertDialogAction === REMOVE_DIALOG_ACTION) {
      if (tagId) setTags((prevState) => [...prevState].filter((item) => item.id !== tagId))
      const tagsFilter = tags.filter((tag) => tag.id !== tagId)
      onChange?.(tagsFilter)
    }
    setPendingTags([])
    setAlertDialogAction(null)
  }

  const handleAlertDialogCancelAction = () => setAlertDialogAction(null)

  const handleRemove = (id: number) => {
    setAlertDialogAction(REMOVE_DIALOG_ACTION)
    setTagId(id)
  }

  return (
    <div className={classNameWrapper}>
      <Label className='text-sm font-medium text-gray-900 flex items-center gap-1'>
        {t('Sale')} {labelRequired === true && <span className='text-red-500'>*</span>}
      </Label>
      <div className='flex items-center flex-wrap gap-2'>
        {tags &&
          tags.length > 0 &&
          tags.map((tag) => {
            return (
              <Badge
                key={tag.id}
                variant='secondary'
                className='text-blue-800 bg-gray-100 border-2 border-gray-200 px-3 py-2 rounded-md flex items-center gap-1'
              >
                {tag.title}
                <button
                  onClick={() => handleRemove(tag.id)}
                  className='ml-2 text-gray-500 hover:text-red-500'
                  aria-label='Remove'
                  type='button'
                >
                  <X size={14} />
                </button>
              </Badge>
            )
          })}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant='ghost'
              className='border border-dashed border-(--color-org) text-(--color-org) hover:bg-orange-50 px-3 py-1 text-sm font-medium rounded-md'
            >
              + Add sale
            </Button>
          </DialogTrigger>

          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>{t('Select consultant') + '  - đã chọn: ' + tags.length || 0}</DialogTitle>
            </DialogHeader>
            <Input placeholder={t('Search')} className='mb-2' value={search} onChange={handleSearch} />
            <div className='flex flex-wrap gap-x-2'>
              <Button
                variant='outline'
                className='hover:cursor-pointer'
                type='button'
                onClick={handleChoosenAction}
                disabled={pendingTags.length === 0}
              >
                <Check />
                {t('Choose')}
              </Button>
              <Button
                variant='outline'
                className='hover:cursor-pointer'
                type='button'
                onClick={handleResetChoosenTags}
                disabled={pendingTags.length === 0}
              >
                <RotateCcw />
                {t('Reset')}
              </Button>
            </div>

            <ScrollArea className='h-40'>
              <div className='grid gap-2'>
                {filteredItems && filteredItems.length > 0 ? (
                  filteredItems.map((item) => {
                    const isAlreadyChoosenTags =
                      tags.some((tag) => tag.id === item.id) ||
                      pendingTags.some((pendingTag) => pendingTag.id === item.id)
                    return (
                      <Button
                        type='button'
                        key={item.id}
                        variant='outline'
                        className='justify-start'
                        onClick={() =>
                          !isAlreadyChoosenTags && handleChoosenTags({ id: item.id, title: item.fullname as string })
                        }
                        disabled={isAlreadyChoosenTags}
                      >
                        {item.fullname}
                      </Button>
                    )
                  })
                ) : (
                  <div className='text-sm text-gray-500 px-2'>{t('No data available')}</div>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Alert dialog confirm */}
        <AlertDialog open={alertDialogAction !== null} onOpenChange={(open) => !open && setAlertDialogAction(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                <div className='flex flex-wrap gap-2 text-red-500 items-center'>
                  <AlertTriangle className=' w-6 h-6' />{' '}
                  {alertDialogAction === 'add'
                    ? t('Notification of operation to add consultant')
                    : t('Notification of consultant deletion operation')}
                </div>
              </AlertDialogTitle>
            </AlertDialogHeader>
            <p className='text-sm text-muted-foreground px-1'>
              Bạn có chắc chắn muốn {alertDialogAction === 'add' ? 'thêm' : 'xóa'} người tư vấn này không?
            </p>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleAlertDialogCancelAction}>{t('Cancelled')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleAlertDialogSuccessAction}>{t('Confirm')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {errorMessage && <span className={classNameErrorMessage}>{errorMessage}</span>}
    </div>
  )
}
