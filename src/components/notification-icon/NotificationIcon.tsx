import { Bell } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'

const notifications = [
  { id: 1, message: 'Đơn hàng #1234 đã được xác nhận' },
  { id: 2, message: 'Bạn có 1 tin nhắn mới' },
  { id: 3, message: 'Khuyến mãi 50% chỉ hôm nay!' },
  { id: 4, message: 'Thông báo bảo trì hệ thống vào 10h' }
]

export default function NotificationIcon() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className='relative cursor-pointer'>
          <Bell className='w-5 h-5 text-black' />
          <span className='absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1'>
            {notifications.length}
          </span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-80 p-0'>
        <DropdownMenuLabel className='p-4 text-sm font-medium'>Thông báo</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <ScrollArea className='h-45'>
          <div>
            {notifications.length === 0 ? (
              <div className='p-4 text-sm text-gray-500'>Không có thông báo nào</div>
            ) : (
              notifications.map((item) => (
                <div key={item.id} className='px-4 py-3 text-sm hover:bg-gray-100 border-b last:border-none'>
                  {item.message}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
