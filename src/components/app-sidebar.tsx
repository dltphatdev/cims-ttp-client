import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'
import { Link } from 'react-router-dom'
import NavItem from '@/components/nav-item'
import PATH from '@/constants/path'
import { CircleDollarSign, FileCheck2, UserRound, UsersRound } from 'lucide-react'

const data = [
  {
    label: 'Operate',
    items: [
      {
        title: 'Activities',
        url: PATH.ACTIVITIES,
        icon: <FileCheck2 />
      },
      {
        title: 'Customer',
        url: PATH.CUSTOMER,
        icon: <UsersRound />
      },
      {
        title: 'Effective',
        url: PATH.EFFECTIVE,
        icon: <CircleDollarSign />
      }
    ]
  },
  {
    label: 'System',
    items: [
      {
        title: 'Member',
        url: PATH.USER,
        icon: <UserRound />
      }
    ]
  }
]

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <Link to='' className='block'>
          <img className='w-100' src='/images/logo-admin.svg' alt='Logo' />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {data.map((nav, index) => (
          <NavItem key={index} data={nav.items} sideBarLabel={nav.label} />
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
