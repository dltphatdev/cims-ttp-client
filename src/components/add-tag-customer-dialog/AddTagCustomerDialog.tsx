import customerApi from '@/apis/customer.api'

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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useQueryParams } from '@/hooks/use-query-params'
import type { GetCustomersParams } from '@/types/customer'
import { useQuery } from '@tanstack/react-query'
import { isUndefined, omitBy } from 'lodash'
import { AlertTriangle, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  onExportId?: (value: number) => void
  defaultValue?: { id: number; name: string }
  openPopup: boolean
  setOpenPopup: (value: boolean) => void
}

const AddTagCustomerDialog = ({ onExportId, defaultValue, openPopup, setOpenPopup }: Props) => {
  const hasInitialized = useRef(false)
  const { t } = useTranslation('admin')
  const [confirmAction, setConfirmAction] = useState<null | 'add' | 'remove'>(null)
  const [pendingUser, setPendingUser] = useState<{ id: number; name: string } | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: number; name: string } | null>(defaultValue ?? null)
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    if (!hasInitialized.current && defaultValue?.id && defaultValue?.name) {
      setSelectedCustomer(defaultValue)
      onExportId?.(defaultValue.id)
      hasInitialized.current = true
    }
  }, [defaultValue, onExportId])

  const queryParams: GetCustomersParams = useQueryParams()
  const queryConfig: GetCustomersParams = omitBy(
    {
      page: queryParams.page,
      limit: queryParams.limit,
      name: queryParams.name as string[],
      phone: queryParams.phone as string[]
    },
    isUndefined
  )
  const { data: customerData } = useQuery({
    queryKey: ['customers', queryConfig],
    queryFn: () => customerApi.getCustomers(queryConfig)
  })

  const handleSelect = ({ name, id }: { name: string; id: number }) => {
    setPendingUser({ name, id })
    setConfirmAction('add')
  }

  const handleRemove = () => setConfirmAction('remove')

  const customers = customerData?.data?.data?.customers

  const filteredCustomer = useMemo(
    () => customers?.filter((item) => item.name?.toLowerCase().includes(searchValue.toLowerCase())),
    [searchValue, customers]
  )

  const handleAlertDialogSuccessAction = () => {
    if (confirmAction === 'add' && pendingUser) {
      setSelectedCustomer(pendingUser)
      onExportId?.(pendingUser.id)
      setOpenPopup(false)
    } else if (confirmAction === 'remove') {
      setSelectedCustomer(null)
      onExportId?.(0)
    }
    setPendingUser(null)
    setConfirmAction(null)
  }
  const handleAlertDialogCancelAction = () => setConfirmAction(null)
  return (
    <div className='space-y-2'>
      <div className='flex items-center flex-wrap gap-2'>
        {selectedCustomer && (
          <Badge
            variant='secondary'
            className='text-blue-800 bg-gray-100 border-2 border-gray-200 px-3 py-2 rounded-md flex items-center gap-1'
          >
            {selectedCustomer.name}
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

        <Dialog open={openPopup} onOpenChange={setOpenPopup}>
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>{t('Select customer')}</DialogTitle>
            </DialogHeader>
            <Input
              placeholder={t('Search customer') || 'Search customer...'}
              className='mb-2'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />

            <ScrollArea className='h-40'>
              <div className='grid gap-2'>
                {filteredCustomer && filteredCustomer.length > 0 ? (
                  filteredCustomer.map((item) => (
                    <Button
                      key={item.id}
                      variant='outline'
                      className='justify-start'
                      onClick={() => handleSelect({ id: item.id, name: item.name as string })}
                      disabled={selectedCustomer?.name === item.name}
                    >
                      {item.name}
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
        <AlertDialog open={confirmAction !== null} onOpenChange={(open) => !open && setConfirmAction(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                <div className='flex flex-wrap gap-2 text-red-500 items-center'>
                  <AlertTriangle className=' w-6 h-6' /> Thông báo thao tác {confirmAction === 'add' ? 'thêm' : 'xóa'}{' '}
                  khách hàng
                </div>
              </AlertDialogTitle>
            </AlertDialogHeader>
            <p className='text-sm text-muted-foreground px-1'>
              Bạn có chắc chắn muốn {confirmAction === 'add' ? 'thêm' : 'xóa'} khách hàng này không?
            </p>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleAlertDialogCancelAction}>{t('Cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleAlertDialogSuccessAction}>{t('OK')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

export default AddTagCustomerDialog
