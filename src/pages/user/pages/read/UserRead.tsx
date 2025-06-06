import CreateAction from '@/components/create-action'
import SearchMain from '@/components/search-main'
import TableMain from '@/components/table-main'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TableCell, TableRow } from '@/components/ui/table'
import PATH from '@/constants/path'
import { AppContext } from '@/contexts/app-context'
import { useQueryParams } from '@/hooks/use-query-params'
import { Ellipsis } from 'lucide-react'
import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { Fragment } from 'react/jsx-runtime'

const data = [
  {
    fullname: 'Nguyen Van A',
    email: 'ttp@gmail.com',
    role: 'Super admin',
    phone: '0987654321',
    created_at: '14:17:00 12/12/2024'
  }
]

export default function UserRead() {
  const queryParams: { page?: string; limit?: string; fullname?: string } = useQueryParams()
  const { profile } = useContext(AppContext)
  const checkActionCreateUser = () => {
    if (profile?.role === 'SuperAdmin' || profile?.role === 'Admin') {
      return <CreateAction path={PATH.USER_CREATE} />
    }
  }
  return (
    <Fragment>
      <Helmet>
        <title>Thành viên - TTP Telecom</title>
        <meta name='keywords' content='Thành viên - TTP Telecom' />
        <meta name='description' content='Thành viên - TTP Telecom' />
      </Helmet>
      <div className='@container/main'>
        <div className='py-4 md:gap-6 md:py-6'>
          <div className='px-4 lg:px-6'>
            <div className='flex items-start flex-wrap justify-between mb-4 gap-3'>
              <SearchMain />
              {checkActionCreateUser()}
            </div>
            <TableMain
              headers={['STT', 'Fullname', 'Email', 'Role', 'Phone', 'Created at', 'Status', 'Action']}
              data={data}
              renderRow={(item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.fullname}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell>{item.phone}</TableCell>
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
