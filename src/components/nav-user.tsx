import { BadgeCheck, ChevronsUpDown, LogOut, Plus } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { useMutation } from '@tanstack/react-query'
import userApi from '@/apis/user.api'
import { AppContext } from '@/contexts/app-context'
import { useContext } from 'react'
import { getRefreshTokenFromLS } from '@/utils/auth'
import { useTranslation } from 'react-i18next'
import CONFIG from '@/constants/config'
import { Link } from 'react-router-dom'
import PATH from '@/constants/path'

export function NavUser() {
  const { t } = useTranslation()
  const { isMobile } = useSidebar()
  const { profile, setIsAuthenticated, setProfile } = useContext(AppContext)
  const refresh_token = getRefreshTokenFromLS()
  const logoutMutation = useMutation({
    mutationFn: () => userApi.logout({ refresh_token }),
    onSuccess: () => {
      setIsAuthenticated(false)
      setProfile(null)
    }
  })
  const handleLogout = () => logoutMutation.mutate()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                <img
                  src={profile?.avatar ? CONFIG.SERVER_URL + CONFIG.UPLOAD_IMAGE + profile.avatar : '/images/empty.svg'}
                  alt={profile?.fullname || t('Fullname')}
                />
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>{profile?.fullname || t('Fullname')}</span>
                <span className='truncate text-xs'>{profile?.email || t('Email')}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <img
                    src={
                      profile?.avatar ? CONFIG.SERVER_URL + CONFIG.UPLOAD_IMAGE + profile.avatar : '/images/empty.svg'
                    }
                    alt={profile?.fullname || t('Fullname')}
                  />
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>{profile?.fullname || t('Fullname')}</span>
                  <span className='truncate text-xs'>{profile?.email || t('Email')}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                <Link to={PATH.USER_UPDATE} state={{ navTitle: t('Profile') }}>
                  {t('Profile')}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            {profile?.role === 'SuperAdmin' && (
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Plus />
                  <Link to={PATH.USER_CREATE} state={{ navTitle: t('Create new') }}>
                    {t('Create new')}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              {t('Logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
