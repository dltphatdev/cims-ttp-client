import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination'

interface Props<T> {
  headers: string[]
  data: T[]
  renderRow: (item: T, index: number) => React.ReactNode
}

export default function TableMain<T>({ data, headers, renderRow }: Props<T>) {
  return (
    <div className='p-4'>
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead className='text-[rgba(0,39,102,0.88)]' key={index}>
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{data.map((item, index) => renderRow(item, index))}</TableBody>
      </Table>

      {/* Pagination */}
      <Pagination className='mt-4'>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href='#' isActive={false}>
              &lt;
            </PaginationLink>
          </PaginationItem>
          {[1, 2, 3, 4, 5].map((page) => (
            <PaginationItem key={page}>
              <PaginationLink href='#' isActive={page === 2}>
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationLink href='#' isActive={false}>
              &gt;
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
