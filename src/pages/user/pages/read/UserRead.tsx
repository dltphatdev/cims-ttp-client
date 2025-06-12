import userApi from '@/apis/user.api'
import FormattedDate from '@/components/formatted-date'
import SearchMain from '@/components/search-main'
import TableMain from '@/components/table-main'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { TableCell, TableRow } from '@/components/ui/table'
import { LIMIT, PAGE } from '@/constants/pagination'
import PATH from '@/constants/path'
import STATUS from '@/constants/status'
import { USER_HEADER_TABLE } from '@/constants/table'
import { AppContext } from '@/contexts/app-context'
import { useQueryParams } from '@/hooks/use-query-params'
import type { GetUsersParams } from '@/types/user'
import checkRoleUser, { checkVerifyStatus } from '@/utils/common'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { isUndefined, omitBy } from 'lodash'
import { Ellipsis, Plus } from 'lucide-react'
import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Fragment } from 'react/jsx-runtime'

export default function UserRead() {
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
  const { profile } = useContext(AppContext)
  const users = userData?.data?.data?.users
  const pagination = userData?.data?.data
  const renderHeaderForRuleUser = () => {
    if (!checkRoleUser(profile?.role as string)) {
      return USER_HEADER_TABLE.filter((item) => item !== 'Action')
    }
    return USER_HEADER_TABLE
  }
  const handleNavigateEditUser = (id: number) => navigate(`${PATH.USER}/${id}`)
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
              <Button variant='outline' onClick={() => navigate(PATH.USER_CREATE)}>
                <Plus /> {t('Create user')}
              </Button>
            </div>
            <TableMain
              page={pagination?.page.toString() || PAGE}
              page_size={pagination?.limit.toString() || LIMIT}
              headers={renderHeaderForRuleUser()}
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
                  <TableCell>
                    <span
                      className={clsx('w-[150px] border-0 shadow-none focus:hidden', {
                        'text-(--color-green-custom)': item.verify === STATUS.VERIFIED,
                        'text-red-500': item.verify === STATUS.UNVERIFIED
                      })}
                    >
                      {checkVerifyStatus({ statusVerify: item.verify, t: t })}
                    </span>
                  </TableCell>
                  <TableCell className='ml-auto text-end'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className='border-2 border-gray-200' variant='ghost' size='sm'>
                          <Ellipsis className='w-4 h-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem onClick={() => handleNavigateEditUser(item.id)}>Chỉnh sửa</DropdownMenuItem>
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
