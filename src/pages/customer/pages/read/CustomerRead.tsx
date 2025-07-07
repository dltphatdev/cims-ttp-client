import customerApi from '@/apis/customer.api'
import AddTagUserDialog from '@/components/add-tag-user-dialog'
import FormattedDate from '@/components/formatted-date'
import SearchMain from '@/components/search-main'
import TableMain from '@/components/table-main'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { TableCell, TableRow } from '@/components/ui/table'
import { COMPANY, PERSONAL } from '@/constants/customerType'
import { UNVERIFIED, VERIFIED } from '@/constants/customerVerify'
import httpStatusCode from '@/constants/httpStatusCode'
import { LIMIT, PAGE } from '@/constants/pagination'
import PATH from '@/constants/path'
import { CUSTOMER_HEADER_TABLE } from '@/constants/table'
import { AppContext } from '@/contexts/app-context'
import { useQueryParams } from '@/hooks/use-query-params'
import type { Customer, CustomerType, GetCustomersParams } from '@/types/customer'
import type { UserRole } from '@/types/user'
import { isSupperAdminAndSaleAdmin } from '@/utils/common'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { isUndefined, omitBy } from 'lodash'
import { Ellipsis, Plus } from 'lucide-react'
import { useContext, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Fragment } from 'react/jsx-runtime'
import { toast } from 'sonner'

export default function CustomerRead() {
  const { profile } = useContext(AppContext)
  const queryClient = useQueryClient()
  const { t } = useTranslation('admin')
  const navigate = useNavigate()
  const [openTagSale, setOpenTagSale] = useState<boolean>(false)
  const [type, setType] = useState<CustomerType>()
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | undefined>()
  const queryParams: GetCustomersParams = useQueryParams()
  const queryConfig: GetCustomersParams = omitBy(
    {
      page: queryParams.page,
      limit: queryParams.limit,
      name: queryParams.name as string[],
      phone: queryParams.phone as string[]
    },
    isUndefined
  )
  const { data: customerData, refetch } = useQuery({
    queryKey: ['customers', queryConfig],
    queryFn: () => customerApi.getCustomers(queryConfig)
  })
  const pagination = customerData?.data?.data
  const customers = customerData?.data?.data?.customers

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
            verify: VERIFIED,
            status: 'Active'
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
            status: 'Active',
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
      if (type === 'Company') {
        updateCustomerCompanyMutation.mutate(
          {
            id,
            consultantor_ids: [],
            status: 'Deactivated',
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
      } else if (type === 'Personal') {
        updateCustomerPersonalMutation.mutate(
          {
            id,
            consultantor_ids: [],
            status: 'Deactivated',
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

  const handleAllocation = async ({
    customerId,
    saleIds,
    type
  }: {
    customerId: number
    saleIds: number[]
    type: CustomerType
  }) => {
    const payload = {
      consultantor_ids: saleIds,
      id: customerId
    }

    for (const key in payload) {
      const value = payload[key as keyof typeof payload]
      if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
        delete payload[key as keyof typeof payload]
      }
    }
    if (type === 'Company') {
      if (saleIds.length > 0) {
        updateCustomerCompanyMutation.mutate(payload, {
          onSuccess: (data) => {
            toast.success(data.data.message)
            queryClient.invalidateQueries({ queryKey: ['customer', customerId] })
            refetch()
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError: (error: any) => {
            if (error.status === httpStatusCode.UnprocessableEntity) {
              const formError = error.response?.data?.errors
              if (formError) {
                Object.keys(formError).forEach((key) => {
                  if (key === 'consultantor_ids') {
                    toast.error(formError['consultantor_ids']['msg'])
                  }
                  toast.error(formError[key as keyof FormData]['msg'] || 'Có lỗi xảy ra')
                })
              }
            }
          }
        })
      }
    } else if (type === 'Personal') {
      if (saleIds.length > 0) {
        updateCustomerPersonalMutation.mutate(payload, {
          onSuccess: (data) => {
            toast.success(data.data.message)
            queryClient.invalidateQueries({ queryKey: ['customer', customerId] })
            refetch()
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError: (error: any) => {
            if (error.status === httpStatusCode.UnprocessableEntity) {
              const formError = error.response?.data?.errors
              if (formError) {
                Object.keys(formError).forEach((key) => {
                  if (key === 'consultantor_ids') {
                    toast.error(formError['consultantor_ids']['msg'])
                  }
                  toast.error(formError[key as keyof FormData]['msg'] || 'Có lỗi xảy ra')
                })
              }
            }
          }
        })
      }
    }
  }

  const renderConsultantorDrop = (
    item: Pick<
      Customer,
      | 'id'
      | 'name'
      | 'type'
      | 'status'
      | 'verify'
      | 'tax_code'
      | 'cccd'
      | 'phone'
      | 'contact_name'
      | 'created_at'
      | 'creator'
      | 'consultantor'
      | 'address_company'
      | 'address_personal'
      | 'creator_id'
    >
  ) => {
    if (isSupperAdminAndSaleAdmin(profile?.role as UserRole) || item.creator_id === profile?.id) {
      return (
        <DropdownMenuItem
          onClick={() => {
            setSelectedCustomerId(item.id)
            setOpenTagSale(true)
            setType(item.type)
          }}
        >
          {t('Allocation')}
        </DropdownMenuItem>
      )
    }
    return
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
              totalPage={customers && customers.length > 0 ? (pagination?.totalPages as number) : 0}
              headerClassNames={['', '', '', '', '', '', '', '', '', 'text-right']}
              page={pagination?.page.toString() || PAGE}
              page_size={pagination?.limit.toString() || LIMIT}
              headers={CUSTOMER_HEADER_TABLE}
              data={customers}
              renderRow={(item, index) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.type === 'Personal' ? item.cccd : item.tax_code}</TableCell>
                    <TableCell>
                      {item.phone && (
                        <>
                          <span>{item.phone}</span>
                          <br />
                        </>
                      )}
                      <span>{item.type === 'Personal' ? item.address_personal : item.address_company}</span>
                    </TableCell>
                    <TableCell>
                      <div className='bg-[#E6F7FF] rounded-sm text-[#1890FF] w-fit px-2 py-1.5'>{t(item.type)}</div>
                    </TableCell>
                    <TableCell>{item?.creator?.fullname || ''}</TableCell>
                    <TableCell>
                      {item?.consultantor?.map((item) => (
                        <div
                          key={item.user.id}
                          className='bg-[#E6F7FF] rounded-sm text-[#1890FF] w-fit px-2 py-1.5 m-2'
                        >
                          {item.user.fullname}
                        </div>
                      ))}
                    </TableCell>
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
                            {t('Edit')}
                          </DropdownMenuItem>
                          {renderConsultantorDrop(item)}
                          {isSupperAdminAndSaleAdmin(profile?.role as UserRole) && (
                            <Fragment>
                              <DropdownMenuItem onClick={handleRevokeCustomer({ id: item.id, type: item.type })}>
                                {t('Revoke')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={handleVerifyCustomer({ id: item.id, type: item.type })}>
                                {t('Verify')}
                              </DropdownMenuItem>
                            </Fragment>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              }}
            />
          </div>
        </div>
      </div>
      <AddTagUserDialog
        openPopup={openTagSale}
        setOpenPopup={setOpenTagSale}
        onChange={(tagsInfo) => {
          if (selectedCustomerId && tagsInfo) {
            const saleIds = tagsInfo?.map((item) => item.id)
            handleAllocation({ saleIds: saleIds, customerId: selectedCustomerId, type: type as CustomerType })
          }
        }}
      />
    </Fragment>
  )
}
