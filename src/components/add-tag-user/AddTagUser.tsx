import { useEffect, useMemo, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertTriangle, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { useQueryParams } from '@/hooks/use-query-params'
import { isUndefined, omitBy } from 'lodash'
import userApi from '@/apis/user.api'
import type { GetUsersParams } from '@/types/user'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction
} from '@/components/ui/alert-dialog'

interface Props {
  name?: string
  value?: string
  onChange?: (value: string) => void
  labelRequired?: boolean
  errorMessage?: string
}

export default function AddTagUser({ name = '', value, errorMessage, onChange, labelRequired = false }: Props) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const defaultValue = value ? { id: value, name } : null
  const hasInitialized = useRef(false)
  const { t } = useTranslation('admin')
  const [action, setAction] = useState<null | 'add' | 'remove'>(null)
  const [pendingUser, setPendingUser] = useState<{ id: string; name: string } | null>(null)
  const [selectedUser, setSelectedUser] = useState(defaultValue)
  const [open, setOpen] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState('')
  useEffect(() => {
    if (!value) {
      setSelectedUser(null)
      return
    }
    if (!hasInitialized.current && defaultValue?.id && defaultValue?.name) {
      setSelectedUser(defaultValue)
      hasInitialized.current = true
    }
  }, [defaultValue, value])

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
  const { data: userData } = useQuery({
    queryKey: ['users', queryConfig],
    queryFn: () => userApi.getUsers(queryConfig)
  })

  const handleSelect = ({ name, id }: { name: string; id: string }) => {
    setPendingUser({ name, id })
    setAction('add')
  }

  const handleRemove = () => setAction('remove')

  const users = userData?.data?.data?.users

  const filteredUsers = useMemo(
    () => users?.filter((user) => user.fullname?.toLowerCase().includes(searchValue.toLowerCase())),
    [searchValue, users]
  )

  const handleAlertDialogSuccessAction = () => {
    if (action === 'add' && pendingUser) {
      setSelectedUser(pendingUser)
      onChange?.(pendingUser.id)
      setOpen(false)
    } else if (action === 'remove') {
      setSelectedUser(null)
      onChange?.('')
    }
    setPendingUser(null)
    setAction(null)
  }

  const handleAlertDialogCancelAction = () => setAction(null)

  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium text-gray-900 flex items-center gap-1'>
        {t('Sale')} {labelRequired === true && <span className='text-red-500'>*</span>}
      </label>
      <div className='flex items-center flex-wrap gap-2'>
        {selectedUser && (
          <Badge
            variant='secondary'
            className='text-blue-800 bg-gray-100 border-2 border-gray-200 px-3 py-2 rounded-md flex items-center gap-1'
          >
            {selectedUser.name}
            <button
              onClick={handleRemove}
              className='ml-2 text-gray-500 hover:text-red-500'
              aria-label='Remove'
              type='button'
            >
              <X size={14} />
            </button>
          </Badge>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant='ghost'
              className='border border-dashed border-(--color-org) text-(--color-org) hover:bg-orange-50 px-3 py-1 text-sm font-medium rounded-md'
            >
              + Add (max 1)
            </Button>
          </DialogTrigger>

          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>{t('Select consultant')}</DialogTitle>
            </DialogHeader>
            <Input
              placeholder={t('Search')}
              className='mb-2'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />

            <ScrollArea className='h-40'>
              <div className='grid gap-2'>
                {filteredUsers && filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <Button
                      key={user.id}
                      variant='outline'
                      className='justify-start'
                      onClick={() => handleSelect({ id: user.id.toString(), name: user.fullname as string })}
                      disabled={selectedUser?.name === user.fullname}
                    >
                      {user.fullname}
                    </Button>
                  ))
                ) : (
                  <div className='text-sm text-gray-500 px-2'>{t('No data available')}</div>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Alert dialog confirm */}
        <AlertDialog open={action !== null} onOpenChange={(open) => !open && setAction(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                <div className='flex flex-wrap gap-2 text-red-500 items-center'>
                  <AlertTriangle className=' w-6 h-6' />{' '}
                  {action === 'add' ? 'Thông báo thao tác thêm người tư vấn' : 'Thông báo thao tác xoá người tư vấn'}
                </div>
              </AlertDialogTitle>
            </AlertDialogHeader>
            <p className='text-sm text-muted-foreground px-1'>
              Bạn có chắc chắn muốn {action === 'add' ? 'thêm' : 'xóa'} người tư vấn này không?
            </p>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleAlertDialogCancelAction}>{t('Cancelled')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleAlertDialogSuccessAction}>{t('Confirm')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {errorMessage && <span className='text-red-600'>{errorMessage}</span>}
    </div>
  )
}
