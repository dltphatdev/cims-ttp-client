import { useEffect, useMemo, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { useQueryParams } from '@/hooks/use-query-params'
import { isUndefined, omitBy } from 'lodash'
import userApi from '@/apis/user.api'
import type { GetUsersParams } from '@/types/user'
import { Input } from '@/components/ui/input'

interface Props {
  onExportId?: (value: number) => void
  defaultValue?: { id: number; name: string }
  labelRequired?: boolean
}

export default function AddTagUser({ onExportId, defaultValue, labelRequired = false }: Props) {
  const hasInitialized = useRef(false)
  const { t } = useTranslation('admin')
  const [selectedUser, setSelectedUser] = useState<{ id: number; name: string } | null>(defaultValue ?? null)
  const [open, setOpen] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    // Chỉ set giá trị và gọi onExportId khi mount lần đầu
    if (!hasInitialized.current && defaultValue?.id && defaultValue?.name) {
      setSelectedUser(defaultValue)
      onExportId?.(defaultValue.id)
      hasInitialized.current = true
    }
  }, [defaultValue, onExportId])

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

  const handleSelect = ({ name, id }: { name: string; id: number }) => {
    setSelectedUser({ name, id })
    setOpen(false)
    onExportId?.(id)
  }

  const handleRemove = () => {
    setSelectedUser(null)
    onExportId?.(0) // Nếu cần reset
  }

  const users = userData?.data?.data?.users
  const filteredUsers = useMemo(
    () => users?.filter((user) => user.fullname?.toLowerCase().includes(searchValue.toLowerCase())),
    [searchValue, users]
  )

  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium text-gray-900 flex items-center gap-1'>
        {t('Consultant')} {labelRequired === true && <span className='text-red-500'>*</span>}
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
              placeholder={t('Search consultant') || 'Search consultant...'}
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
                      onClick={() => handleSelect({ id: user.id, name: user.fullname as string })}
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
      </div>
    </div>
  )
}
