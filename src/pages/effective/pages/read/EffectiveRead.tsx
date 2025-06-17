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
//     title: 'HQ Digiworld',
//     customer: 'DGW Group',
//     revenue: '2.544.400.000 đ',
//     profit: '2.544.400.000 đ',
//     profit_ratio: '14,96%',
//     creator: 'Nguyễn Nhược Phi',
//     created_at: '14:17:00 12/12/2024'
//   }
// ]

export default function EffectiveRead() {
  return (
    <Fragment>
      <Helmet>
        <title>Hiệu quả - TTP Telecom</title>
        <meta name='keywords' content='Hiệu quả - TTP Telecom' />
        <meta name='description' content='Hiệu quả - TTP Telecom' />
      </Helmet>
      <div className='@container/main'>
        <div className='py-4 md:gap-6 md:py-6'>
          <div className='px-4 lg:px-6'>
            {/* <TableMain
            headers={[
              'STT',
              'Tiêu đề',
              'Khách hàng',
              'Doanh thu',
              'Lợi nhuận',
              'Tỉ lệ lợi nhuận',
              'Người tạo',
              'Ngày tạo',
              'Trạng thái',
              'Hành động'
            ]}
            data={data}
            renderRow={(item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.customer}</TableCell>
                <TableCell>{item.revenue}</TableCell>
                <TableCell>{item.profit}</TableCell>
                <TableCell>{item.profit_ratio}</TableCell>
                <TableCell>{item.creator}</TableCell>
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
          /> */}
          </div>
        </div>
      </div>
    </Fragment>
  )
}
