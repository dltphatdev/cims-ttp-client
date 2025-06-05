import { useRoutes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import PATH from '@/constants/path'

const AuthLayout = lazy(() => import('@/layouts/auth'))
const MainLayout = lazy(() => import('@/layouts/main'))
const Login = lazy(() => import('@/pages/login'))
const Dashboard = lazy(() => import('@/pages/dashboard'))
const NotFound = lazy(() => import('@/pages/not-found'))

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
