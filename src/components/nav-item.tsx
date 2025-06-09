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
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t(sideBarLabel)}</SidebarGroupLabel>
      <SidebarMenu>
        {data.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              className={clsx('sidebar-btn transition-all', {
                active: pathname === item.url
              })}
              asChild
            >
              <Link to={item.url} state={{ navTitle: t(item.title) }} title={t(item.title)}>
                {item.icon}
                <span>{t(item.title)}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
