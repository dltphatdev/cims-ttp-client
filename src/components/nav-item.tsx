import clsx from 'clsx'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

interface Data {
  title: string
  url: string
  icon: React.ReactNode
}
interface Props {
  data: Data[]
  sideBarLabel: string
}
export default function NavItem({ data, sideBarLabel }: Props) {
  const { t } = useTranslation('admin')
  const { pathname } = useLocation()
  const safeT = (key: string, defaultText?: string) => t(key, { defaultValue: defaultText ?? key })
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{safeT(sideBarLabel)}</SidebarGroupLabel>
      <SidebarMenu>
        {data.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              className={clsx('sidebar-btn transition-all', {
                active: pathname === item.url || pathname.match(item.url + '/')
              })}
              asChild
            >
              <Link to={item.url} title={safeT(item.title)}>
                {item.icon}
                <span>{safeT(item.title)}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
