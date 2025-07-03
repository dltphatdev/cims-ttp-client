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
import customerApi from '@/apis/customer.api'
import type { GetCustomersParams } from '@/types/customer'

interface Props {
  onChange?: (value: string) => void
  value?: string
  name?: string
  labelRequired?: boolean
  errorMessage?: string
}

export default function AddTagCustomer({ onChange, errorMessage, name, value, labelRequired = false }: Props) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const defaultValue = value ? { id: value, name } : null
  const hasInitialized = useRef(false)
  const { t } = useTranslation('admin')
  const [confirmAction, setConfirmAction] = useState<null | 'add' | 'remove'>(null)
  const [pendingCustomer, setPendingCustomer] = useState<{ id: string; name: string } | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState(defaultValue || null)
  const [open, setOpen] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    if (!value) {
      setSelectedCustomer(null)
      return
    }

    if (!hasInitialized.current && defaultValue?.id && defaultValue?.name) {
      setSelectedCustomer(defaultValue)
      hasInitialized.current = true
    }
  }, [defaultValue, value])

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
  const { data: customersData } = useQuery({
    queryKey: ['customers', queryConfig],
    queryFn: () => customerApi.getCustomers(queryConfig)
  })

  const handleSelect = ({ name, id }: { name: string; id: string }) => {
    setPendingCustomer({ name, id })
    setConfirmAction('add')
  }

  const handleRemove = () => setConfirmAction('remove')

  const customers = customersData?.data?.data?.customers

  const filteredCustomers = useMemo(
    () => customers?.filter((customer) => customer.name?.toLowerCase().includes(searchValue.toLowerCase())),
    [searchValue, customers]
  )

  const handleAlertDialogSuccessAction = () => {
    if (confirmAction === 'add' && pendingCustomer) {
      setSelectedCustomer(pendingCustomer)
      setOpen(false)
      onChange?.(pendingCustomer.id)
    } else if (confirmAction === 'remove') {
      setSelectedCustomer(null)
      onChange?.('')
    }
    setPendingCustomer(null)
    setConfirmAction(null)
  }

  const handleAlertDialogCancelAction = () => setConfirmAction(null)
  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium text-gray-900 flex items-center gap-1'>
        {t('Customer')} {labelRequired === true && <span className='text-red-500'>*</span>}
      </label>
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
                {filteredCustomers && filteredCustomers.length > 0 ? (
                  filteredCustomers.map((item) => (
                    <Button
                      key={item.id}
                      variant='outline'
                      className='justify-start'
                      onClick={() => handleSelect({ id: item.id.toString(), name: item.name as string })}
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
                  <AlertTriangle className=' w-6 h-6' />{' '}
                  {confirmAction === 'add' ? 'Thông báo thao tác thêm khách hàng' : 'Thông báo thao tác xoá khách hàng'}
                </div>
              </AlertDialogTitle>
            </AlertDialogHeader>
            <p className='text-sm text-muted-foreground px-1'>
              Bạn có chắc chắn muốn {confirmAction === 'add' ? 'thêm' : 'xóa'} khách hàng này không?
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
