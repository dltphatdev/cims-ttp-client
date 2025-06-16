import customerApi from '@/apis/customer.api'
import userApi from '@/apis/user.api'
import FormattedDate from '@/components/formatted-date'
import SearchMain from '@/components/search-main'
import TableMain from '@/components/table-main'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { TableCell, TableRow } from '@/components/ui/table'
import { COMPANY, PERSONAL } from '@/constants/customerType'
import { UNVERIFIED, VERIFIED } from '@/constants/customerVerify'
import httpStatusCode from '@/constants/httpStatusCode'
import { LIMIT, PAGE } from '@/constants/pagination'
import PATH from '@/constants/path'
import { CUSTOMER_HEADER_TABLE } from '@/constants/table'
import { useQueryParams } from '@/hooks/use-query-params'
import type { CustomerType, GetCustomersParams } from '@/types/customer'
import type { GetUsersParams } from '@/types/user'
import { useMutation, useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { isUndefined, omit, omitBy } from 'lodash'
import { Ellipsis, Plus } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Fragment } from 'react/jsx-runtime'
import { toast } from 'sonner'

export default function CustomerRead() {
  const { t } = useTranslation('admin')
  const navigate = useNavigate()
  const queryParams: GetCustomersParams = useQueryParams()
  const queryUserParams: GetUsersParams = useQueryParams()
  const queryConfig: GetCustomersParams = omitBy(
    {
      page: queryParams.page,
      limit: queryParams.limit,
      name: queryParams.name as string[],
      phone: queryParams.phone as string[]
    },
    isUndefined
  )

  const queryConfigUser = {
    ...omit(queryConfig, ['name']),
    fullname: queryUserParams.fullname as string[]
  }
  const { data: customerData, refetch } = useQuery({
    queryKey: ['customers', queryConfig],
    queryFn: () => customerApi.getCustomers(queryConfig)
  })
  const { data: userData } = useQuery({
    queryKey: ['users', queryConfigUser],
    queryFn: () => userApi.getUsers(queryConfigUser)
  })
  const customers = customerData?.data?.data?.customers
  const users = userData?.data?.data?.users
  const pagination = customerData?.data?.data

  const updateCustomerCompanyMutation = useMutation({
    mutationFn: customerApi.updateCustomerCompany
  })
  const updateCustomerPersonalMutation = useMutation({
    mutationFn: customerApi.updateCustomePersonal
  })

  const handleVerifyCustomer =
    ({ id, type }: { id: number; type: CustomerType }) =>
    () => {
      if (type === COMPANY) {
        updateCustomerCompanyMutation.mutate(
          {
            id,
            verify: VERIFIED
          },
          {
            onSuccess: () => {
              navigate(type === 'Company' ? `/customer/update-company/${id}` : `/customer/update-personal/${id}`)
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => {
              if (error.status === httpStatusCode.UnprocessableEntity) {
                const formError = error.response?.data?.errors
                if (formError) {
                  Object.keys(formError).forEach((key) => {
                    toast.error(formError[key as keyof FormData]['msg'] || 'Có lỗi xảy ra')
                  })
                }
              }
            }
          }
        )
      } else if (type === PERSONAL) {
        updateCustomerPersonalMutation.mutate(
          {
            id,
            verify: VERIFIED
          },
          {
            onSuccess: (data) => {
              toast.success(data.data.message)
              refetch()
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => {
              if (error.status === httpStatusCode.UnprocessableEntity) {
                const formError = error.response?.data?.errors
                if (formError) {
                  Object.keys(formError).forEach((key) => {
                    toast.error(formError[key as keyof FormData]['msg'] || 'Có lỗi xảy ra')
                  })
                }
              }
            }
          }
        )
      }
    }

  const handleRevokeCustomer =
    ({ id, type }: { id: number; type: CustomerType }) =>
    () => {
      if (type === COMPANY) {
        updateCustomerCompanyMutation.mutate(
          {
            id,
            verify: UNVERIFIED
          },
          {
            onSuccess: (data) => {
              toast.success(data.data.message)
              refetch()
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => {
              if (error.status === httpStatusCode.UnprocessableEntity) {
                const formError = error.response?.data?.errors
                if (formError) {
                  Object.keys(formError).forEach((key) => {
                    toast.error(formError[key as keyof FormData]['msg'] || 'Có lỗi xảy ra')
                  })
                }
              }
            }
          }
        )
      } else if (type === PERSONAL) {
        updateCustomerPersonalMutation.mutate(
          {
            id,
            verify: UNVERIFIED
          },
          {
            onSuccess: (data) => {
              toast.success(data.data.message)
              refetch()
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => {
              if (error.status === httpStatusCode.UnprocessableEntity) {
                const formError = error.response?.data?.errors
                if (formError) {
                  Object.keys(formError).forEach((key) => {
                    toast.error(formError[key as keyof FormData]['msg'] || 'Có lỗi xảy ra')
                  })
                }
              }
            }
          }
        )
      }
    }
  return (
    <Fragment>
      <Helmet>
        <title>Khách hàng - TTP Telecom</title>
        <meta name='keywords' content='Khách hàng - TTP Telecom' />
        <meta name='description' content='Khách hàng - TTP Telecom' />
      </Helmet>
      <div className='@container/main'>
        <div className='py-4 md:gap-6 md:py-6'>
          <div className='px-4 lg:px-6'>
            <div className='flex items-start flex-wrap justify-between mb-4 gap-3'>
              <SearchMain
                queryConfig={queryConfig}
                payloadField={{
                  text: 'name',
                  number: 'phone'
                }}
              />
              <Button variant='outline' onClick={() => navigate(PATH.CUSTOMER_CREATE)}>
                <Plus /> {t('Create new')}
              </Button>
            </div>
            <TableMain
              page={pagination?.page.toString() || PAGE}
              page_size={pagination?.limit.toString() || LIMIT}
              headers={CUSTOMER_HEADER_TABLE}
              data={customers}
              renderRow={(item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type === 'Personal' ? item.cccd : item.tax_code}</TableCell>
                  <TableCell>
                    <span>{item.phone}</span>
                    <br />
                    <span>{item.type === 'Personal' ? item.address_personal : item.address_company}</span>
                  </TableCell>
                  <TableCell>
                    <div className='bg-[#E6F7FF] rounded-sm text-[#1890FF] w-fit px-2 py-1.5'>{item.type}</div>
                  </TableCell>
                  <TableCell>{item?.creator?.fullname || ''}</TableCell>
                  <TableCell>{item?.consultantor?.fullname || ''}</TableCell>
                  <TableCell>
                    <FormattedDate isoDate={item.created_at as string} />
                  </TableCell>
                  <TableCell>
                    <span
                      className={clsx('w-[150px] border-0 shadow-none focus:hidden', {
                        'text-(--color-green-custom)': item.verify === 'Verified',
                        'text-red-500': item.verify !== 'Verified'
                      })}
                    >
                      {item.verify === 'Verified' ? t('Verified') : t('Unverified')}
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
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(
                              item.type === 'Company'
                                ? `/customer/update-company/${item.id}`
                                : `/customer/update-personal/${item.id}`
                            )
                          }
                        >
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className='[&>svg]:hidden'>Phân bổ</DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              {users?.map((item) => <DropdownMenuItem key={item.id}>{item.fullname}</DropdownMenuItem>)}
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuItem onClick={handleRevokeCustomer({ id: item.id, type: item.type })}>
                          {t('Revoke')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleVerifyCustomer({ id: item.id, type: item.type })}>
                          {t('Verify')}
                        </DropdownMenuItem>
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
