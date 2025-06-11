import customerApi from '@/apis/customer.api'
import SearchFilterBar from '@/components/search-filter-bar'
import TableMain from '@/components/table-main'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TableCell, TableRow } from '@/components/ui/table'
import PATH from '@/constants/path'
import { CUSTOMER_HEADER_TABLE } from '@/constants/table'
import { useQueryParams } from '@/hooks/use-query-params'
import type { GetCustomersParams } from '@/types/customer'
import { useQuery } from '@tanstack/react-query'
import { isUndefined, omitBy } from 'lodash'
import { Ellipsis } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { Fragment } from 'react/jsx-runtime'

const data = [
  {
    fullname: 'NGUYỄN VĂN A',
    cccd: '072096002490',
    phone: '0967763096',
    address: '297 Gò Dầu, Tân Phú, HCM',
    type: 'Ca nhan',
    creator: 'Nguyễn Nhược Phi',
    sale: 'Anh Minh',
    created_at: '14:17:00 12/12/2024',
    status: 'Đã xác minh'
  }
]

export default function CustomerRead() {
  const queryParams: GetCustomersParams = useQueryParams()
  const queryConfig: GetCustomersParams = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || '10',
      fullname: queryParams.name as string[],
      phone: queryParams.phone as string[]
    },
    isUndefined
  )
  const { data: customerData } = useQuery({
    queryKey: ['users', queryConfig],
    queryFn: () => customerApi.getCustomers(queryConfig)
  })
  console.log(customerData)
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
            <SearchFilterBar path={PATH.CUSTOMER_CREATE} />
            <TableMain
              headers={CUSTOMER_HEADER_TABLE}
              data={data}
              renderRow={(item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.fullname}</TableCell>
                  <TableCell>{item.cccd}</TableCell>
                  <TableCell>
                    <span>{item.phone}</span>
                    <br />
                    <span>{item.address}</span>
                  </TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.creator}</TableCell>
                  <TableCell>{item.sale}</TableCell>
                  <TableCell>{item.created_at}</TableCell>
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
                        <DropdownMenuItem>Phân bổ</DropdownMenuItem>
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
