import { useTranslation } from 'react-i18next'
import { locales } from '@/i18n/i18n'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import MSG from '@/constants/msg'

type Language = 'vi' | 'en'

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'vi', label: MSG.VIETNAME },
  { value: 'en', label: MSG.ENGLISH }
]

const SelectLang = () => {
  const { i18n } = useTranslation()
  const nameLang = locales[i18n.language as keyof typeof locales]
  const current = LANGUAGES.find((item) => item.value === i18n.language)
  const handleChangeLanguage = (language: Language) => i18n.changeLanguage(language)
  return (
    <Select value={current?.value} onValueChange={(value: Language) => handleChangeLanguage(value)}>
      <SelectTrigger className='w-[150px]'>
        <SelectValue>{nameLang}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map(({ value, label }) => (
          <SelectItem key={label} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default SelectLang
