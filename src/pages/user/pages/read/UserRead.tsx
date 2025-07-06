import userApi from '@/apis/user.api'
import FormattedDate from '@/components/formatted-date'
import SearchMain from '@/components/search-main'
import TableMain from '@/components/table-main'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { TableCell, TableRow } from '@/components/ui/table'
import { LIMIT, PAGE } from '@/constants/pagination'
import PATH from '@/constants/path'
import { USER_HEADER_TABLE } from '@/constants/table'
import { AppContext } from '@/contexts/app-context'
import { useQueryParams } from '@/hooks/use-query-params'
import type { GetUsersParams, UserRole } from '@/types/user'
import { isSupperAdminAndSaleAdmin } from '@/utils/common'
import { useQuery } from '@tanstack/react-query'
import { isUndefined, omitBy } from 'lodash'
import { Ellipsis, Plus } from 'lucide-react'
import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Fragment } from 'react/jsx-runtime'

export default function UserRead() {
  const { profile } = useContext(AppContext)
  const navigate = useNavigate()
  const { t } = useTranslation('admin')
  const queryParams: GetUsersParams = useQueryParams()
  const queryConfig: GetUsersParams = omitBy(
    {
      page: queryParams.page || PAGE,
      limit: queryParams.limit || LIMIT,
      fullname: queryParams.fullname as string[],
      phone: queryParams.phone as string[]
    },
    isUndefined
  )
  const { data: userData } = useQuery({
    queryKey: ['users', queryConfig],
    queryFn: () => userApi.getUsers(queryConfig)
  })
  const users = userData?.data?.data?.users.filter((item) => item.role !== 'SuperAdmin')
  const pagination = userData?.data?.data

  const handleNavigateEditUser = (id: number) => navigate(`${PATH.USER}/${id}`)

  const createAction = () => {
    if (isSupperAdminAndSaleAdmin(profile?.role as UserRole)) {
      return (
        <Button variant='outline' onClick={() => navigate(PATH.USER_CREATE)}>
          <Plus /> {t('Create user')}
        </Button>
      )
    }
    return null
  }

  const handleCheckRuleHeaderTable = () => {
    if (isSupperAdminAndSaleAdmin(profile?.role as UserRole)) {
      return USER_HEADER_TABLE
    }
    return USER_HEADER_TABLE.filter((item) => item !== 'Action')
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
              <SearchMain
                queryConfig={queryConfig}
                payloadField={{
                  text: 'fullname',
                  number: 'phone'
                }}
              />
              {createAction()}
            </div>
            <TableMain
              totalPage={pagination?.totalPages || 0}
              page={pagination?.page.toString() || PAGE}
              page_size={pagination?.limit.toString() || LIMIT}
              headers={handleCheckRuleHeaderTable()}
              headerClassNames={['', '', '', '', '', '', 'text-right']}
              data={users}
              renderRow={(item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.fullname}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell>{item.phone}</TableCell>
                  <TableCell>
                    <FormattedDate isoDate={item.created_at as string} />
                  </TableCell>
                  {isSupperAdminAndSaleAdmin(profile?.role as UserRole) && (
                    <TableCell className='ml-auto text-end'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className='border-2 border-gray-200' variant='ghost' size='sm'>
                            <Ellipsis className='w-4 h-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem onClick={() => handleNavigateEditUser(item.id)}>
                            {t('Edit')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              )}
            />
          </div>
        </div>
      </div>
    </Fragment>
  )
}
