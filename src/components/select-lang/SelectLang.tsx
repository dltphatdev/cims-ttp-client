import { useTranslation } from 'react-i18next'
import { locales } from '@/i18n/i18n'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import MSG from '@/constants/msg'

type Language = 'vi' | 'en'

const LANGUAGES: { value: Language; label: string; flag: string }[] = [
  { value: 'vi', label: MSG.VIETNAME, flag: '/images/vi.jpg' },
  { value: 'en', label: MSG.ENGLISH, flag: '/images/en.jpg' }
]

const SelectLang = () => {
  const { i18n } = useTranslation()
  const nameLang = locales[i18n.language as keyof typeof locales]
  const current = LANGUAGES.find((item) => item.value === i18n.language)
  const handleChangeLanguage = (language: Language) => i18n.changeLanguage(language)
  return (
    <Select value={current?.value} onValueChange={(value: Language) => handleChangeLanguage(value)}>
      <SelectTrigger className='w-[150px]'>
        <SelectValue>
          {current && (
            <img
              src={current.flag}
              alt={`${current.label} flag`}
              className='inline-block w-5 h-5 mr-2 rounded-sm object-cover'
            />
          )}
          {nameLang}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map(({ value, label, flag }) => (
          <SelectItem key={label} value={value}>
            <img src={flag} alt={`${label} flag`} className='inline-block w-5 h-5 mr-2 rounded-sm object-cover' />
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default SelectLang
