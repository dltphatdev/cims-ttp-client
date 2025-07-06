const PATH = {
  LOGIN: '/login',
  HOME: '/',
  CUSTOMER: '/customer',
  CUSTOMER_CREATE: '/customer/create',
  CUSTOMER_UPDATE_PERSONAL: '/customer/update-personal/:customerId',
  CUSTOMER_UPDATE_COMPANY: '/customer/update-company/:customerId',
  ACTIVITIES: '/activities',
  ACTIVITIES_CREATE: '/activities/create',
  ACTIVITIES_UPDATE: '/activities/update/:activityId',
  PERFORMANCE: '/performance',
  PERFORMANCE_CREATE: '/performance/create',
  PERFORMANCE_UPDATE: '/performance/update/:performanceId',
  USER: '/user',
  USER_CHANGE_PASSWORD: '/user/change-password',
  USER_DETAIL: '/user/:userId',
  USER_CREATE: '/user/create',
  USER_UPDATE: '/user/profile',
  REVENUE_CREATE: '/revenue/create',
  REVENUE_UPDATE: '/revenue/update/:revenueId',
  PAGE_DOCUMENT: '/document-files'
} as const

export default PATH
