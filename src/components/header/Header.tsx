import { ModeToggle } from '@/components/mode-toggle'
// import NotificationIcon from '@/components/notification-icon'
import SelectLang from '@/components/select-lang'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

const Header = () => {
  return (
    <header className='group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear'>
      <div className='flex flex-wrap w-full items-center gap-1 px-4 lg:gap-2 lg:px-6'>
        <SidebarTrigger className='-ml-1 text-[rgba(255,176,27,1)]' />
        <Separator orientation='vertical' className='mx-2 data-[orientation=vertical]:h-4' />
        <div className='ml-auto flex items-center gap-2'>
          <div className='flex items-center justify-end'>
            {/* <NotificationIcon /> */}
            <div className='ml-4'>
              <SelectLang />
            </div>
            <div className='ml-2'>
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
