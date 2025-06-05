import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LOGIN_VI from '@/locales/vi/login.json'
import LOGIN_EN from '@/locales/en/login.json'
import MSG from '@/constants/msg'

export const locales = {
  vi: MSG.VIETNAME,
  en: MSG.ENGLISH
}

export const resources = {
  en: {
    login: LOGIN_EN
  },
  vi: {
    login: LOGIN_VI
  }
}
export const defaultNS = 'login'

i18n.use(initReactI18next).init({
  resources,
  lng: 'vi',
  fallbackLng: 'vi',
  ns: ['login'],
  defaultNS,
  interpolation: {
    escapeValue: false
  }
})

export default i18n
