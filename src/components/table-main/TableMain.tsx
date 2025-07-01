import PaginationMain from '@/components/pagination-main'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LIMIT, PAGE } from '@/constants/pagination'
import { useTranslation } from 'react-i18next'

interface Props<T> {
  headers: string[]
  headerClassNames?: string[]
  data: T[] | undefined
  renderRow: (item: T, index: number) => React.ReactNode
  page?: string
  page_size?: string
  pageKey?: string
  classNameWrapper?: string
}

export default function TableMain<T>({
  data,
  headers,
  headerClassNames,
  renderRow,
  classNameWrapper = 'p-4',
  page = PAGE,
  page_size = LIMIT,
  pageKey = 'page'
}: Props<T>) {
  const { t } = useTranslation('admin')
  return (
    <div className={classNameWrapper}>
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead key={index} className={headerClassNames?.[index]}>
                {t(header)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data?.length > 0 ? (
            data.map((item, index) => renderRow(item, index))
          ) : (
            <TableRow>
              <TableCell>{t('No data available')}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Pagination */}
      <PaginationMain pageKey={pageKey} page={Number(page)} page_size={Number(page_size)} />
    </div>
  )
}
