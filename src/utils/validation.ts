import { ADMIN, SALE, SUPERADMIN } from '@/constants/role'
import { BANNED, UNVERIFIED, VERIFIED } from '@/constants/verify'
import * as yup from 'yup'

export const getSchema = (t: (key: string) => string) => {
  return yup.object({
    email: yup
      .string()
      .required(t('Email is required'))
      .min(5, t('Email min length'))
      .max(160, t('Email max length'))
      .email(t('Email invalid')),
    password: yup
      .string()
      .required(t('Password is required'))
      .min(6, t('Password min length'))
      .max(160, t('Password max length')),
    terms: yup.boolean().oneOf([true], t('You must accept the terms and conditions'))
  })
}

export const getUserSchema = (t: (key: string) => string) => {
  return yup.object({
    fullname: yup.string().max(160, t('Maximum length is 160 characters')).optional(),
    phone: yup.string().max(20, t('Maximum length is 20 characters')).optional(),
    address: yup.string().max(160, t('Maximum length is 160 characters')).optional(),
    avatar: yup.string().max(1000, t('Maximum length is 1000 characters')).optional(),
    code: yup.string().max(1000, t('Maximum length is 6 characters')).optional(),
    date_of_birth: yup.date().optional().max(new Date(), t('Please select a date in the past')).nullable(),
    verify: yup.string().oneOf([VERIFIED, UNVERIFIED, BANNED], t('Invalid role')).optional(),
    role: yup.string().oneOf([SUPERADMIN, ADMIN, SALE], t('Invalid role')).optional(),
    password: yup.string().max(160, t('Password max length')).optional()
  })
}
