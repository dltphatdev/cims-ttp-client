import customerApi from '@/apis/customer.api'
import FormattedDate from '@/components/formatted-date'
import SearchMain from '@/components/search-main'
import TableMain from '@/components/table-main'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TableCell, TableRow } from '@/components/ui/table'
import { LIMIT, PAGE } from '@/constants/pagination'
import { CUSTOMER_HEADER_TABLE } from '@/constants/table'
import { useQueryParams } from '@/hooks/use-query-params'
import type { GetCustomersParams } from '@/types/customer'
import { useQuery } from '@tanstack/react-query'
import { isUndefined, omitBy } from 'lodash'
import { Ellipsis, Plus } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Fragment } from 'react/jsx-runtime'

export default function CustomerRead() {
  const { t } = useTranslation('admin')
  const queryParams: GetCustomersParams = useQueryParams()
  const queryConfig: GetCustomersParams = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || '10',
      name: queryParams.name as string[],
      phone: queryParams.phone as string[]
    },
    isUndefined
  )
  const { data: customerData } = useQuery({
    queryKey: ['customers', queryConfig],
    queryFn: () => customerApi.getCustomers(queryConfig)
  })
  const customers = customerData?.data?.data?.customers
  const pagination = customerData?.data?.data

  return (
    <Fragment>
      <Helmet>
        <title>Khách hàng - TTP Telecom</title>
        <meta name='keywords' content='Khách hàng - TTP Telecom' />
        <meta name='description' content='Khách hàng - TTP Telecom' />
      </Helmet>
      <div className='@container/main'>
        <div className='py-4 md:gap-6 md:py-6'>
          <div className='px-4 lg:px-6'>
            <div className='flex items-start flex-wrap justify-between mb-4 gap-3'>
              <SearchMain
                queryConfig={queryConfig}
                payloadField={{
                  text: 'name',
                  number: 'phone'
                }}
              />
              {/* <CreateAction path='' /> */}
              <Dialog>
                <form>
                  <DialogTrigger asChild>
                    <Button variant='outline'>
                      <Plus /> {t('Create new')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='sm:max-w-[425px] lg:max-w-[1200px]'>
                    <DialogHeader>
                      <DialogTitle>Edit profile</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here. Click save when you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4'>
                      <div className='grid gap-3'>
                        <Label htmlFor='name-1'>Name</Label>
                        <Input id='name-1' name='name' defaultValue='Pedro Duarte' />
                      </div>
                      <div className='grid gap-3'>
                        <Label htmlFor='username-1'>Username</Label>
                        <Input id='username-1' name='username' defaultValue='@peduarte' />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant='outline'>Cancel</Button>
                      </DialogClose>
                      <Button type='submit'>Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </form>
              </Dialog>
            </div>
            <TableMain
              page={pagination?.page.toString() || PAGE}
              page_size={pagination?.limit.toString() || LIMIT}
              headers={CUSTOMER_HEADER_TABLE}
              data={customers}
              renderRow={(item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type === 'Personal' ? item.cccd : item.tax_code}</TableCell>
                  <TableCell>
                    <span>{item.phone}</span>
                    <br />
                    <span>{item.type === 'Personal' ? item.address_personal : item.address_company}</span>
                  </TableCell>
                  <TableCell>
                    <div className='bg-[#E6F7FF] rounded-sm text-[#1890FF] w-fit px-2 py-1.5'>{item.type}</div>
                  </TableCell>
                  <TableCell>{item?.creator?.fullname || ''}</TableCell>
                  <TableCell>{item?.consultantor?.fullname || ''}</TableCell>
                  <TableCell>
                    <FormattedDate isoDate={item.created_at as string} />
                  </TableCell>
                  <TableCell>
                    <Select value='abc'>
                      <SelectTrigger className='w-[150px] border-0 shadow-none focus:hidden text-(--color-green-custom)'>
                        <SelectValue className=''>Đã xác minh</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Chưa xác minh'>Chưa xác minh</SelectItem>
                        <SelectItem value='Đã xác minh'>Đã xác minh</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className='ml-auto text-end'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className='border-2 border-gray-200' variant='ghost' size='sm'>
                          <Ellipsis className='w-4 h-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className='[&>svg]:hidden'>Phân bổ</DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem>Email</DropdownMenuItem>
                              <DropdownMenuItem>Message</DropdownMenuItem>
                              <DropdownMenuItem>More...</DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuItem>Thu hồi</DropdownMenuItem>
                        <DropdownMenuItem>Xác minh</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )}
            />
          </div>
        </div>
      </div>
    </Fragment>
  )
}
