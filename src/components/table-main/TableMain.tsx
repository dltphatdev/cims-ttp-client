import PaginationMain from '@/components/pagination-main'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useTranslation } from 'react-i18next'

interface Props<T> {
  headers: string[]
  data: T[] | undefined
  renderRow: (item: T, index: number) => React.ReactNode
  page: number
  page_size: number
}

export default function TableMain<T>({ data, headers, renderRow, page, page_size }: Props<T>) {
  const { t } = useTranslation('admin')
  return (
    <div className='p-4'>
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead key={index}>{t(header)}</TableHead>
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
      <PaginationMain page={page} page_size={page_size} />
    </div>
  )
}
