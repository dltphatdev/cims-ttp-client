import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { GetUsersParams } from '@/types/user'
import { useQueryParams } from '@/hooks/use-query-params'
import { isUndefined, omitBy } from 'lodash'
import userApi from '@/apis/user.api'
import { useQuery } from '@tanstack/react-query'

interface Props {
  onExportId?: (value: number) => void
}

export default function AddTagUser({ onExportId }: Props) {
  const { t } = useTranslation('admin')
  const [selectedList, setSelectedList] = useState<string[]>([])
  const [open, setOpen] = useState<boolean>(false)
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
    setSelectedList([name])
    setOpen(false)
    onExportId?.(id)
  }

  const handleRemove = (name: string) => {
    setSelectedList((prev) => prev.filter((item) => item !== name))
  }

  const users = userData?.data?.data?.users
  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium text-gray-900 flex items-center gap-1'>
        {t('Consultant')} <span className='text-red-500'>*</span>
      </label>
      <div className='flex items-center flex-wrap gap-2'>
        {selectedList.map((name) => (
          <Badge
            key={name}
            variant='secondary'
            className='text-blue-800 bg-gray-100 border-2 border-gray-200  px-3 py-2 rounded-md flex items-center gap-1'
          >
            {name}
            <button
              onClick={() => handleRemove(name)}
              className='ml-2 text-gray-500 hover:text-red-500'
              aria-label='Remove'
              type='button'
            >
              <X size={14} />
            </button>
          </Badge>
        ))}

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
            <ScrollArea className='h-40'>
              <div className='grid gap-2'>
                {users &&
                  users.map((user) => (
                    <Button
                      key={user.id}
                      variant='outline'
                      className='justify-start'
                      onClick={() => handleSelect({ id: user.id, name: user.fullname as string })}
                      disabled={selectedList.includes(user.fullname as string)}
                    >
                      {user.fullname}
                    </Button>
                  ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
