import PaginationMain from '@/components/pagination-main'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PAGE } from '@/constants/pagination'
import { useTranslation } from 'react-i18next'

interface Props<T> {
  headers: string[]
  headerClassNames?: string[]
  data: T[] | undefined
  renderRow: (item: T, index: number) => React.ReactNode
  page?: string
  page_size: string
  pageKey?: string
  classNameWrapper?: string
  totalPage?: number
}

export default function TableMain<T>({
  data,
  headers,
  headerClassNames,
  renderRow,
  classNameWrapper = '',
  page = PAGE,
  page_size,
  pageKey = 'page'
}: Props<T>) {
  const { t } = useTranslation('admin')
  const safeT = (key: string, defaultText?: string) => t(key, { defaultValue: defaultText ?? key })
  return (
    <div className={classNameWrapper}>
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead key={header} className={headerClassNames?.[index]}>
                {safeT(header as string)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data?.length > 0 ? (
            data.map((item, index) => renderRow(item, index))
          ) : (
            <TableRow>
              <TableCell colSpan={12}>{t('No data available')}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Pagination */}
      {Number(page_size) > 0 && <PaginationMain pageKey={pageKey} page={Number(page)} page_size={Number(page_size)} />}
    </div>
  )
}
