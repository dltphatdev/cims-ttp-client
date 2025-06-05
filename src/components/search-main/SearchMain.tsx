import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X, Search } from 'lucide-react'

export default function SearchMain() {
  const [inputValue, setInputValue] = useState('')
  const [tags, setTags] = useState<string[]>(['Nguyễn văn A', '096776123'])
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
    setTags(tags.filter((t) => t !== tag))
  }
  return (
    <div className='max-w-md space-y-3'>
      {/* Input search with icon */}
      <div className='flex items-center border rounded-md overflow-hidden'>
        <Input
          type='text'
          placeholder='Search'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className='border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
        />
        <Button type='button' variant='ghost' className='rounded-none border-l' onClick={handleAddTag}>
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
    </div>
  )
}
