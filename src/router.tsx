import { useRoutes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import PATH from '@/constants/path'

const AuthLayout = lazy(() => import('@/layouts/auth'))
const MainLayout = lazy(() => import('@/layouts/main'))
const Login = lazy(() => import('@/pages/login'))
const Dashboard = lazy(() => import('@/pages/dashboard'))
const NotFound = lazy(() => import('@/pages/not-found'))
const Customer = lazy(() => import('@/pages/customer'))
const Effective = lazy(() => import('@/pages/effective'))
const Activities = lazy(() => import('@/pages/activities'))
const UserRead = lazy(() => import('@/pages/user/pages/read'))
const UserCreate = lazy(() => import('@/pages/user/pages/create'))

const Router = () => {
  return useRoutes([
    {
      path: '',
      element: <AuthLayout />,
      children: [
        {
          path: PATH.LOGIN,
          element: (
            <Suspense>
              <Login />
            </Suspense>
          )
        }
      ]
    },
    {
      path: '',
      element: <MainLayout />,
      children: [
        {
          path: PATH.HOME,
          index: true,
          element: (
            <Suspense>
              <Dashboard />
            </Suspense>
          )
        },
        {
          path: PATH.ACTIVITIES,
          element: (
            <Suspense>
              <Activities />
            </Suspense>
          )
        },
        {
          path: PATH.CUSTOMER,
          element: (
            <Suspense>
              <Customer />
            </Suspense>
          )
        },
        {
          path: PATH.EFFECTIVE,
          element: (
            <Suspense>
              <Effective />
            </Suspense>
          )
        },
        {
          path: PATH.USER,
          element: (
            <Suspense>
              <UserRead />
            </Suspense>
          )
        },
        {
          path: PATH.USER_CREATE,
          element: (
            <Suspense>
              <UserCreate />
            </Suspense>
          )
        }
      ]
    },
    {
      path: '*',
      element: (
        <Suspense>
          <NotFound />
        </Suspense>
      )
    }
  ])
}

export default Router
