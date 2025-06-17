import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { createSearchParams, useNavigate } from 'react-router-dom'
import type { TQueryConfig } from '@/types/query-config'

interface Props {
  queryConfig?: TQueryConfig
  value?: string
  payloadField?: {
    text: string // field cho text, ví dụ: "name"
    number: string // field cho số, ví dụ: "phone"
  }
}

export default function SearchMain({ queryConfig, value, payloadField }: Props) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [localValue, setLocalValue] = useState<string>(value || '')
  const [tags, setTags] = useState<string[]>([])

  const handleAddTag = () => {
    const _value = value || localValue
    if (!_value) return
    const isNumber = /^\d+$/.test(_value)

    let updatedTags = [...tags]

    if (isNumber) {
      updatedTags = updatedTags.filter((tag) => !/^\d+$/.test(tag)) // loai bo tag la number
      updatedTags.push(_value)
    } else {
      updatedTags = updatedTags.filter((tag) => /^\d+$/.test(tag)) // loai bo tag la text
      updatedTags.push(_value)
    }

    setTags(updatedTags)
    setLocalValue('')

    const payload: { [key: string]: string } = {}
    updatedTags.forEach((tag) => {
      if (/^\d+$/.test(tag) && payloadField?.number) {
        payload[payloadField.number] = tag
      } else if (payloadField?.text) {
        payload[payloadField.text] = tag
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

  const removeTag = (tag: string) => {
    const updatedTags = tags.filter((t) => t !== tag)
    setTags(updatedTags)
    const textList: string[] = []
    const numberList: string[] = []
    const payload: { [key: string]: string } = {}
    updatedTags.forEach((item) => {
      const isNum = /^\d+$/.test(item)
      if (isNum) {
        numberList.push(item)
      } else {
        textList.push(item)
      }
    })

    if (payloadField?.text) {
      payload[payloadField.text] = textList.join(',')
    }
    if (payloadField?.number) {
      payload[payloadField.number] = numberList.join(',')
    }

    navigate({
      pathname: '',
      search: createSearchParams({
        ...queryConfig,
        ...payload
      }).toString()
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const _value = e.target.value
    e.preventDefault()
    setLocalValue(_value)
  }

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleAddTag()
  }

  return (
    <form className='mn:w-100 lg:w-[400px] space-y-3' onSubmit={handleSubmitForm}>
      <div className='flex items-center border rounded-md overflow-hidden'>
        <Input
          type='text'
          placeholder={t('Search')}
          value={value || localValue}
          onChange={handleInputChange}
          className='border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
        />
        <Button type='submit' variant='ghost' className='rounded-none border-l' onClick={handleAddTag}>
          <Search className='h-4 w-4 text-muted-foreground' />
        </Button>
      </div>
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
