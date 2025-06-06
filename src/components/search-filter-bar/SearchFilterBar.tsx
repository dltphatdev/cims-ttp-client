import CreateAction from '@/components/create-action'
import SearchMain from '@/components/search-main'

interface Props {
  path: string
}
export default function SearchFilterBar({ path }: Props) {
  return (
    <div className='flex items-start flex-wrap justify-between mb-4'>
      <SearchMain />
      <CreateAction path={path} />
    </div>
  )
}
