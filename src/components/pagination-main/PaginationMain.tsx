import { createSearchParams, Link } from 'react-router-dom'
import clsx from 'clsx'

interface Props {
  page: number
  page_size: number
}

const RANGE = 2

export default function Pagination({ page, page_size }: Props) {
  let dotAfter = false
  let dotBefore = false

  const renderDotAfter = (index: number) => {
    if (!dotAfter) {
      dotAfter = true
      return (
        <li className='w-fit' key={index}>
          <span className='flex items-center justify-center w-[36px] h-[36px] rounded-sm border border-gray-300 cursor-not-allowed'>
            ...
          </span>
        </li>
      )
    }
    return null
  }
  const renderDotBefore = (index: number) => {
    if (!dotBefore) {
      dotBefore = true
      return (
        <li className='w-fit' key={index}>
          <span className='flex items-center justify-center w-[36px] h-[36px] rounded-sm border cursor-not-allowed'>
            ...
          </span>
        </li>
      )
    }
    return null
  }
  const renderPagination = () => {
    return Array(page_size)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < page_size - RANGE + 1) {
          return renderDotAfter(index)
        } else if (page > RANGE * 2 + 1 && page < page_size - RANGE * 2) {
          if (pageNumber > RANGE && pageNumber < page - RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > page + RANGE && pageNumber < page_size - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (page >= page_size - RANGE * 2 && pageNumber > RANGE && pageNumber < page_size - RANGE) {
          return renderDotBefore(index)
        }
        return (
          <li className='w-fit' key={index}>
            <Link
              to={{
                search: createSearchParams({
                  page: pageNumber.toString()
                }).toString()
              }}
              className={clsx('flex items-center justify-center w-[36px] h-[36px] rounded-sm border border-gray-300', {
                '!border-(--color-green) text-(--color-green)': page === pageNumber
              })}
            >
              {pageNumber}
            </Link>
          </li>
        )
      })
  }
  return (
    <div className='lg:mt-5 mn:mt-4'>
      <ul className='flex flex-wrap justify-center gap-2'>
        {page > 1 && (
          <li className='w-fit'>
            <Link
              to={{
                search: createSearchParams({
                  page: (page - 1).toString()
                }).toString()
              }}
              className='flex h-[36px] items-center justify-center border border-gray-300 w-[36px] rounded-sm'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='size-4'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
              </svg>
            </Link>
          </li>
        )}
        {renderPagination()}
        {page < page_size && (
          <li className='w-fit'>
            <Link
              to={{
                search: createSearchParams({
                  page: (page + 1).toString()
                }).toString()
              }}
              className='flex h-[36px] items-center justify-center border border-gray-300 w-[36px] rounded-sm'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='size-4'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
              </svg>
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}
