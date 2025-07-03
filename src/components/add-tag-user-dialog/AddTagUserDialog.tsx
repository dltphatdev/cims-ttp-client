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
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import useDebounce from '@/hooks/use-debounce'
import { useQueryParams } from '@/hooks/use-query-params'
import type { GetUsersParams } from '@/types/user'
import { useQuery } from '@tanstack/react-query'
import { isUndefined, omitBy } from 'lodash'
import { AlertTriangle, Check, RotateCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const ADD_DIALOG_ACTION = 'add'

interface Tag {
  title: string
  id: number
}

interface Props {
  onChange?: (value: Tag[]) => void
  openPopup: boolean
  setOpenPopup: (value: boolean) => void
  classNameWrapper?: string
}

type DialogAction = 'add' | 'remove' | null

export default function AddTagUserDialog({ openPopup, setOpenPopup, onChange, classNameWrapper = 'space-y-2' }: Props) {
  const { t } = useTranslation('admin')
  const [tags, setTags] = useState<Tag[]>([])
  const [pendingTags, setPendingTags] = useState<Tag[]>([])
  const [choosenAction, setChoosenAction] = useState<boolean>(false)
  const [alertDialogAction, setAlertDialogAction] = useState<DialogAction>(null)
  const [search, setSearch] = useState<string>('')
  const debounceSearch = useDebounce(search, 1000)
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

  const handleChoosenTags = ({ id, title }: { id: number; title: string }) => {
    setPendingTags((prevState) => [...prevState, { id, title }])
  }

  const handleChoosenAction = () => {
    setChoosenAction(!choosenAction)
    if (pendingTags.length > 0) setAlertDialogAction(ADD_DIALOG_ACTION)
  }

  const handleResetChoosenTags = () => setPendingTags([])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)

  const handleAlertDialogSuccessAction = () => {
    if (alertDialogAction === ADD_DIALOG_ACTION) {
      setTags(pendingTags)
      onChange?.(pendingTags)
      setOpenPopup(!openPopup)
    }
    setPendingTags([])
    setAlertDialogAction(null)
  }

  // const handleRemove = (id: number) => () => {
  //   setAlertDialogAction(REMOVE_DIALOG_ACTION)
  //   setTagId(id)
  // }

  const handleAlertDialogCancelAction = () => setAlertDialogAction(null)
  console.log(filteredItems)
  return (
    <div className={classNameWrapper}>
      <div className='flex items-center flex-wrap gap-2'>
        <Dialog open={openPopup} onOpenChange={setOpenPopup}>
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
                {filteredItems &&
                  filteredItems.length > 0 &&
                  filteredItems.map((item) => {
                    const isAlreadyChoosenTags = pendingTags.some((pendingTag) => pendingTag.id === item.id)
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
                  })}
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
                  {alertDialogAction === ADD_DIALOG_ACTION
                    ? t('Notification of operation to add consultant')
                    : t('Notification of consultant deletion operation')}
                </div>
              </AlertDialogTitle>
            </AlertDialogHeader>
            <p className='text-sm text-muted-foreground px-1'>
              Bạn có chắc chắn muốn {alertDialogAction === ADD_DIALOG_ACTION ? 'thêm' : 'xóa'} người tư vấn này không?
            </p>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleAlertDialogCancelAction}>{t('Cancelled')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleAlertDialogSuccessAction}>{t('Confirm')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
