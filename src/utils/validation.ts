import { ADMIN, SALE, SUPERADMIN } from '@/constants/role'
import { BANNED, UNVERIFIED, VERIFIED } from '@/constants/verify'
import * as yup from 'yup'

export const schema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .min(5, 'Email min length is 5 characters')
    .max(160, 'Email max length 160 characters')
    .email('Email invalid'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password min length is 6 characters')
    .max(160, 'Password max length is 160 characters'),
  terms: yup.boolean().oneOf([true], 'You must accept the terms and conditions')
})

export const userSchema = yup.object({
  fullname: yup.string().max(160, 'Fullname maximum length is 160 characters').optional(),
  phone: yup.string().max(20, 'Phone maximum length is 20 characters').optional(),
  address: yup.string().max(160, 'Address maximum length is 160 characters').optional(),
  avatar: yup.string().max(1000, 'Avatar maximum length is 1000 characters').optional(),
  code: yup.string().max(1000, 'Code maximum length is 6 characters').optional(),
  date_of_birth: yup.date().optional().max(new Date(), 'Please select a date in the past').nullable(),
  verify: yup.string().oneOf([VERIFIED, UNVERIFIED, BANNED], 'Invalid verify account').optional(),
  role: yup.string().oneOf([SUPERADMIN, ADMIN, SALE], 'Invalid role account').optional(),
  password: yup.string().max(160, 'Password maximum length 160 characters').optional()
})
