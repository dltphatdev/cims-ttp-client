// import TableMain from '@/components/table-main'
// import { Button } from '@/components/ui/button'
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { TableCell, TableRow } from '@/components/ui/table'
// import { Ellipsis } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { Fragment } from 'react/jsx-runtime'

// const data = [
//   {
//     title: 'Hẹn tư vấn demo',
//     customer: 'Công ty TNHH ABC',
//     creator: 'Nguyễn Nhược Phi',
//     created_at: '14:17:00 12/12/2024',
//     start: '14:17:00 12/12/2024',
//     end: '14:17:00 12/12/2024',
//     status: 'Hoàn thành'
//   },
//   {
//     title: 'Hẹn tư vấn demo',
//     customer: 'Công ty TNHH ABC',
//     creator: 'Nguyễn Nhược Phi',
//     created_at: '14:17:00 12/12/2024',
//     start: '14:17:00 12/12/2024',
//     end: '14:17:00 12/12/2024',
//     status: 'Đang thực hiện'
//   },
//   {
//     title: 'Hẹn tư vấn demo',
//     customer: 'Công ty TNHH ABC',
//     creator: 'Nguyễn Nhược Phi',
//     created_at: '14:17:00 12/12/2024',
//     start: '14:17:00 12/12/2024',
//     end: '14:17:00 12/12/2024',
//     status: 'Hủy'
//   }
// ]

export default function ActivitiesRead() {
  return (
    <Fragment>
      <Helmet>
        <title>Hoạt động - TTP Telecom</title>
        <meta name='keywords' content='Hoạt động - TTP Telecom' />
        <meta name='description' content='Hoạt động - TTP Telecom' />
      </Helmet>
      <div className='@container/main'>
        <div className='py-4 md:gap-6 md:py-6'>
          <div className='px-4 lg:px-6'>
            {/* <TableMain
              headers={[
                'STT',
                'Tiêu đề',
                'Khách hàng',
                'Người tạo',
                'Ngày tạo',
                'Bắt đầu',
                'Kết thúc',
                'Trạng thái',
                'Hành động'
              ]}
              data={data}
              renderRow={(item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.customer}</TableCell>
                  <TableCell>{item.creator}</TableCell>
                  <TableCell>{item.created_at}</TableCell>
                  <TableCell>{item.start}</TableCell>
                  <TableCell>{item.end}</TableCell>
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
            /> */}
          </div>
        </div>
      </div>
    </Fragment>
  )
}
