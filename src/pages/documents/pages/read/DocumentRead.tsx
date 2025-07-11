import documentApi from '@/apis/document.api'
import FormattedDate from '@/components/formatted-date'
import SearchMain from '@/components/search-main'
import TableMain from '@/components/table-main'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { TableCell, TableRow } from '@/components/ui/table'
import { LIMIT, PAGE } from '@/constants/pagination'
import PATH from '@/constants/path'
import { DOCUMENT_FILES_HEADER_TABLE } from '@/constants/table'
import { AppContext } from '@/contexts/app-context'
import { useQueryParams } from '@/hooks/use-query-params'
import type { GetDocumentsParams } from '@/types/document'
import type { UserRole } from '@/types/user'
import { isSupperAdminAndSaleAdmin } from '@/utils/common'
import { useQuery } from '@tanstack/react-query'
import { isUndefined, omitBy } from 'lodash'
import { Ellipsis, Plus } from 'lucide-react'
import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Fragment } from 'react/jsx-runtime'

export default function DocumentRead() {
  const { profile } = useContext(AppContext)
  const navigate = useNavigate()
  const { t } = useTranslation('admin')
  const queryParams: GetDocumentsParams = useQueryParams()
  const queryConfig: GetDocumentsParams = omitBy(
    {
      page: queryParams.page || PAGE,
      limit: queryParams.limit || LIMIT,
      name: queryParams.name as string[]
    },
    isUndefined
  )

  const { data: documentFiles } = useQuery({
    queryKey: ['documents', queryConfig],
    queryFn: () => documentApi.getListDocuments(queryConfig)
  })
  const documents = documentFiles?.data?.data?.documents
  const pagination = documentFiles?.data?.data
  return (
    <Fragment>
      <Helmet>
        <title>Tài liệu - TTP Telecom</title>
        <meta name='keywords' content='Tài liệu - TTP Telecom' />
        <meta name='description' content='Tài liệu - TTP Telecom' />
      </Helmet>
      <div className='@container/main'>
        <div className='py-4 md:gap-6 md:py-6'>
          <div className='px-4 lg:px-6'>
            <div className='col-span-12'>
              <div className='flex items-start flex-wrap justify-between mb-4 gap-3'>
                <SearchMain
                  queryConfig={queryConfig}
                  payloadField={{
                    text: 'name'
                  }}
                />
                {isSupperAdminAndSaleAdmin(profile?.role as UserRole) && (
                  <Button variant='outline' onClick={() => navigate(PATH.CREATE_DOCUMENT)}>
                    <Plus /> {t('Create new')}
                  </Button>
                )}
              </div>
              <TableMain
                page={pagination?.page.toString() || PAGE}
                page_size={documents && documents.length > 0 ? (pagination?.totalPages as number).toString() : '0'}
                headers={DOCUMENT_FILES_HEADER_TABLE.filter((item) =>
                  isSupperAdminAndSaleAdmin(profile?.role as UserRole) ? item : item !== 'Action'
                )}
                headerClassNames={['', '', '', '', '', 'text-right']}
                data={documents}
                renderRow={(item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell colSpan={1}>{item.name}</TableCell>
                    <TableCell>
                      <div className='bg-[#E6F7FF] rounded-sm text-[#1890FF] w-fit px-2 py-1.5 m-2'>
                        {item.creator.fullname}
                      </div>
                    </TableCell>
                    <TableCell>
                      <FormattedDate isoDate={item.created_at as string} />
                    </TableCell>
                    <TableCell>
                      <FormattedDate isoDate={item.updated_at as string} />
                    </TableCell>
                    {isSupperAdminAndSaleAdmin(profile?.role as UserRole) && (
                      <TableCell className='ml-auto text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button className='border-2 border-gray-200' variant='ghost' size='sm'>
                              <Ellipsis className='w-4 h-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem onClick={() => {}}>{t('Edit')}</DropdownMenuItem>
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
      </div>
    </Fragment>
  )
}
