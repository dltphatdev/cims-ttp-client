import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { createSearchParams, useNavigate } from 'react-router-dom'
import useQueryConfig from '@/hooks/use-query-config'
import { omit } from 'lodash'

export default function SearchMain() {
  const navigate = useNavigate()
  const queryConfig = useQueryConfig()
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const handleAddTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue)) {
      setTags([...tags, inputValue.trim()])
      setInputValue('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const removeTag = (tag: string) => {
    const isNumber = /^\d+$/.test(tag)
    if (tag) {
      setTags(tags.filter((t) => t !== tag))
      if (isNumber) {
        navigate({
          pathname: '',
          search: createSearchParams(omit(queryConfig, ['phone'])).toString()
        })
      } else {
        navigate({
          pathname: '',
          search: createSearchParams(omit(queryConfig, ['fullname'])).toString()
        })
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    e.preventDefault()
    setInputValue(value)
  }

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fullname: string[] = []
    const phone: string[] = []
    const payload: { [key: string]: string } = {}
    tags.forEach((tag) => {
      const isNumber = /^\d+$/.test(tag)
      if (isNumber) {
        phone.push(tag)
        payload.phone = phone.join(',')
      } else {
        fullname.push(tag)
        payload.fullname = fullname.join(',')
      }
    })

    navigate({
      pathname: '',
      search: createSearchParams({
        ...queryConfig,
        ...payload
      }).toString()
    })
  }

  return (
    <form className='mn:w-100 lg:w-[400px] space-y-3' onSubmit={handleSubmitForm}>
      {/* Input search with icon */}
      <div className='flex items-center border rounded-md overflow-hidden'>
        <Input
          type='text'
          placeholder={t('Search')}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className='border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
        />
        <Button type='submit' variant='ghost' className='rounded-none border-l' onClick={handleAddTag}>
          <Search className='h-4 w-4 text-muted-foreground' />
        </Button>
      </div>

      {/* Tags */}
      <div className='flex flex-wrap gap-2'>
        {tags.map((tag) => (
          <div
            key={tag}
            className='flex items-center bg-gray-100 text-blue-800 text-md rounded-md px-3 py-2 border-2 border-gray-200 capitalize'
          >
            {tag}
            <button onClick={() => removeTag(tag)} className='ml-1 hover:text-red-500'>
              <X className='w-4 h-4' />
            </button>
          </div>
        ))}
      </div>
    </form>
  )
}
