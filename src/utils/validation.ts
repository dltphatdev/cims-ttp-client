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
