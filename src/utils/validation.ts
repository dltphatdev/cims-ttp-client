import * as yup from 'yup'
import { ACTIVE, DEACTIVATED } from '@/constants/customerStatus'
import { COMPANY, PERSONAL } from '@/constants/customerType'
import { UNVERIFIED as UNVERIFIED_CUSTOMER, VERIFIED as VERIFIED_CUSTOMER } from '@/constants/customerVerify'
import { FEMALE, MALE } from '@/constants/gender'
import { APPROVED, CANCELLED, NEW } from '@/constants/performanceStatus'

function handleConfirmPasswordYup(field: string) {
  return yup
    .string()
    .required('Password is required')
    .min(6, 'Password min length is 6 characters')
    .max(160, 'Password max length is 160 characters')
    .oneOf([yup.ref(field)], 'Confirm password not match')
}

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
  email: yup
    .string()
    .required('Email is required')
    .min(5, 'Email min length is 5 characters')
    .max(160, 'Email max length 160 characters')
    .email('Email invalid'),
  fullname: yup.string().max(160, 'Fullname maximum length is 160 characters').optional(),
  phone: yup.string().max(10, 'Phone maximum length is 10 characters').optional(),
  address: yup.string().max(160, 'Address maximum length is 160 characters').optional(),
  avatar: yup.string().max(1000, 'Avatar maximum length is 1000 characters').optional(),
  code: yup.string().max(1000, 'Code maximum length is 6 characters').optional(),
  date_of_birth: yup.date().max(new Date(), 'Please select a date in the past').optional(),
  // role: yup.string().oneOf([SUPERADMIN, ADMIN, SALE, NONE], 'Invalid role account').optional(),
  password: yup.string().max(160, 'Password maximum length 160 characters').optional()
})

export const changePasswordSchema = yup.object({
  old_password: yup
    .string()
    .required('Old password is required')
    .min(6, 'Old password min length is 6 characters')
    .max(160, 'Old password max length is 160 characters'),
  password: schema.fields['password'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  confirm_password: handleConfirmPasswordYup('password')
})

export const customerSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name min length is 3 characters')
    .max(160, 'Name maximum length is 160 characters'),
  type: yup.string().oneOf([COMPANY, PERSONAL], 'Customer type invalid').optional(),
  consultantor_id: yup.string().optional(),
  tax_code: yup.string().max(13, 'Tax code maximum length is 13 characters').optional(),
  cccd: yup
    .string()
    .required('Citizen identification')
    .min(12, 'Citizen identification card min length is 12 characters')
    .max(12, 'Citizen identification card maximum length is 12 characters'),
  website: yup.string().max(50, 'Website maximum length is 50 characters').optional(),
  surrogate: yup.string().max(160, 'Surrogate maximum length is 160 characters').optional(),
  address_company: yup.string().max(160, 'Address company maximum length is 160 characters').optional(),
  address_personal: yup.string().max(160, 'Address personal maximum length is 160 characters').optional(),
  phone: yup.string().max(10, 'Phone maximum length is 10 characters').optional(),
  email: yup.string().max(160, 'Email max length 160 characters').email('Email invalid').optional(),
  contact_name: yup.string().max(10, 'Contact name maximum length is 10 characters').optional(),
  status: yup.string().oneOf([DEACTIVATED, ACTIVE], 'Invalid customer status').optional(),
  verify: yup.string().oneOf([UNVERIFIED_CUSTOMER, VERIFIED_CUSTOMER], 'Invalid verify customer').optional(),
  attachments: yup
    .array()
    .of(yup.string().max(255, 'Each file maximum 255 characters').max(5, 'Only attach up to 5 files'))
    .optional(),
  note: yup.string().max(2000, 'Note maximum length is 2000 characters').optional(),
  assign_at: yup.string().optional(),
  date_of_birth: yup.date().max(new Date(), 'Please select a date in the past').optional(),
  gender: yup.string().oneOf([MALE, FEMALE], 'Gender invalid').optional()
})

export const performanceSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name min length is 3 characters')
    .max(160, 'Name maximum length is 160 characters'),
  customer_id: yup.string().required(),
  note: yup.string().max(2000, 'Note maximum length is 2000 characters').optional(),
  status: yup.string().oneOf([NEW, APPROVED, CANCELLED], 'Status performance invalid').optional(),
  operating_cost: yup.string().max(100, 'Operating cost max length 100 characters'),
  customer_care_cost: yup.string().max(100, 'Customer care cost max length 100 characters'),
  commission_cost: yup.string().max(100, 'Commission cost max length 100 characters'),
  diplomatic_cost: yup.string().max(100, 'Diplomatic cost max length 100 characters'),
  reserve_cost: yup.string().max(100, 'Reserve cost max length 100 characters'),
  customer_cost: yup.string().max(100, 'Customer cost max length 100 characters')
})
