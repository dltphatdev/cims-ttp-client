import * as yup from 'yup'
import { ACTIVE, DEACTIVATED } from '@/constants/customerStatus'
import { COMPANY, PERSONAL } from '@/constants/customerType'
import { UNVERIFIED as UNVERIFIED_CUSTOMER, VERIFIED as VERIFIED_CUSTOMER } from '@/constants/customerVerify'
import { FEMALE, MALE } from '@/constants/gender'
import { APPROVED, CANCELLED, NEW } from '@/constants/performanceStatus'
import { NEW as NEW_ACTIVITY, IN_PROGRESS, COMPLETED, CANCELLED as CANCELLED_ACTIVITY } from '@/constants/activity'
import { EVERY_MONTH, ONE_TIME } from '@/constants/revenue'
import { ADMIN, NONE, SALE, SUPERADMIN } from '@/constants/role'

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
  role: yup.string().oneOf([SUPERADMIN, ADMIN, SALE, NONE], 'Invalid role account').optional(),
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
  tax_code: yup.string().required('Tax code is required').max(13, 'Tax code maximum length is 13 characters'),
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
  gender: yup.string().oneOf([MALE, FEMALE], 'Gender invalid').optional(),
  consultantors: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.number().typeError('ID must be a number').required('ID is required'),
        title: yup.string().typeError('Title must be a string').required('Title is required')
      })
    )
    .min(1, 'You must select at least one consultant')
    .required('This field is required')
})

export const performanceSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name min length is 3 characters')
    .max(160, 'Name maximum length is 160 characters'),
  customer_id: yup.string().required('Customer is required'),
  note: yup.string().max(2000, 'Note maximum length is 2000 characters').optional(),
  status: yup.string().oneOf([NEW, APPROVED, CANCELLED], 'Status performance invalid').optional(),
  operating_cost: yup.string().max(100, 'Operating cost max length 100 characters'),
  customer_care_cost: yup.string().max(100, 'Customer care cost max length 100 characters'),
  commission_cost: yup.string().max(100, 'Commission cost max length 100 characters'),
  diplomatic_cost: yup.string().max(100, 'Diplomatic cost max length 100 characters'),
  reserve_cost: yup.string().max(100, 'Reserve cost max length 100 characters'),
  customer_cost: yup.string().max(100, 'Customer cost max length 100 characters')
})

export const revenueSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name min length is 3 characters')
    .max(160, 'Name maximum length is 160 characters'),
  description: yup.string().required().max(2000, 'Description maximum length is 2000 characters'),
  unit_caculate: yup
    .string()
    .required('Unit caculate is required')
    .max(160, 'Unit caculate maximum length is 255 characters'),
  type: yup.string().required().oneOf([ONE_TIME, EVERY_MONTH], 'Type invalid'),
  price: yup.string().required(),
  quantity: yup.string().required()
})

export const activitySchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name min length is 2 characters')
    .max(160, 'Name maximum length is 160 characters'),
  customer_id: yup.string().required('Customer is required'),
  contact_name: yup
    .string()
    .required('Contact name is required')
    .min(2, 'Contact name min length is 2 characters')
    .max(160, 'Contact name maximum length is 160 characters'),
  address: yup
    .string()
    .required('Address is required')
    .min(1, 'Address min length is 1 characters')
    .max(160, 'Address maximum length is 160 characters'),
  phone: yup.string().required('Phone number is required').max(10, 'Phone maximum length is 10 characters'),
  status: yup
    .string()
    .oneOf([NEW_ACTIVITY, IN_PROGRESS, CANCELLED_ACTIVITY, COMPLETED], 'Status activity invalid')
    .optional(),
  time_start: yup.date().required('Time start is required'),
  time_end: yup.date().required('Time end is required'),
  assign_at: yup.string().optional(),
  content: yup.string().max(2000, 'Content maximum length is 2000 characters').optional()
})
