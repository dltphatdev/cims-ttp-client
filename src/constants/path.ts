const PATH = {
  LOGIN: '/login',
  HOME: '/',
  CUSTOMER: '/customer',
  CUSTOMER_CREATE: '/customer/create',
  CUSTOMER_UPDATE_PERSONAL: '/customer/update-personal/:customerId',
  CUSTOMER_UPDATE_COMPANY: '/customer/update-company/:customerId',
  ACTIVITIES: '/activities',
  ACTIVITIES_CREATE: '/activities/create',
  ACTIVITIES_UPDATE: '/activities/update',
  EFFECTIVE: '/effective',
  EFFECTIVE_CREATE: '/effective/create',
  EFFECTIVE_UPDATE: '/effective/update',
  USER: '/user',
  USER_CHANGE_PASSWORD: '/user/change-password',
  USER_DETAIL: '/user/:userId',
  USER_CREATE: '/user/create',
  USER_UPDATE: '/user/profile'
} as const

export default PATH
