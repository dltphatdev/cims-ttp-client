import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { lazy, Suspense, useContext } from 'react'
import PATH from '@/constants/path'
import { AppContext } from '@/contexts/app-context'

const AuthLayout = lazy(() => import('@/layouts/auth'))
const MainLayout = lazy(() => import('@/layouts/main'))
const Login = lazy(() => import('@/pages/login'))
const Dashboard = lazy(() => import('@/pages/dashboard'))
const NotFound = lazy(() => import('@/pages/not-found'))
const CustomerRead = lazy(() => import('@/pages/customer/pages/read'))
const CustomerCreate = lazy(() => import('@/pages/customer/pages/create'))
const CustomerUpdate = lazy(() => import('@/pages/customer/pages/update'))
const EffectiveRead = lazy(() => import('@/pages/effective/pages/read'))
const EffectiveCreate = lazy(() => import('@/pages/effective/pages/create'))
const EffectiveUpdate = lazy(() => import('@/pages/effective/pages/update'))
const ActivitiesRead = lazy(() => import('@/pages/activities/pages/read'))
const ActivitiesCreate = lazy(() => import('@/pages/activities/pages/create'))
const ActivitiesUpdate = lazy(() => import('@/pages/activities/pages/update'))
const UserRead = lazy(() => import('@/pages/user/pages/read'))
const UserCreate = lazy(() => import('@/pages/user/pages/create'))
const UserProfile = lazy(() => import('@/pages/user/pages/profile'))
const UserUpdate = lazy(() => import('@/pages/user/pages/update'))
const ChangePassword = lazy(() => import('@/pages/user/pages/change-password'))

const ProtectedRoute = () => {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to={PATH.LOGIN} />
}

const RejectedRoute = () => {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to={PATH.HOME} />
}

const Router = () => {
  return useRoutes([
    {
      path: '',
      element: <RejectedRoute />,
      children: [
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
        }
      ]
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
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
                  <ActivitiesRead />
                </Suspense>
              )
            },
            {
              path: PATH.ACTIVITIES_CREATE,
              element: (
                <Suspense>
                  <ActivitiesCreate />
                </Suspense>
              )
            },
            {
              path: PATH.ACTIVITIES_UPDATE,
              element: (
                <Suspense>
                  <ActivitiesUpdate />
                </Suspense>
              )
            },
            {
              path: PATH.CUSTOMER,
              element: (
                <Suspense>
                  <CustomerRead />
                </Suspense>
              )
            },
            {
              path: PATH.CUSTOMER_CREATE,
              element: (
                <Suspense>
                  <CustomerCreate />
                </Suspense>
              )
            },
            {
              path: PATH.CUSTOMER_UPDATE,
              element: (
                <Suspense>
                  <CustomerUpdate />
                </Suspense>
              )
            },
            {
              path: PATH.EFFECTIVE,
              element: (
                <Suspense>
                  <EffectiveRead />
                </Suspense>
              )
            },
            {
              path: PATH.EFFECTIVE_CREATE,
              element: (
                <Suspense>
                  <EffectiveCreate />
                </Suspense>
              )
            },
            {
              path: PATH.EFFECTIVE_UPDATE,
              element: (
                <Suspense>
                  <EffectiveUpdate />
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
            },
            {
              path: PATH.USER_UPDATE,
              element: (
                <Suspense>
                  <UserProfile />
                </Suspense>
              )
            },
            {
              path: PATH.USER_DETAIL,
              element: (
                <Suspense>
                  <UserUpdate />
                </Suspense>
              )
            },
            {
              path: PATH.USER_CHANGE_PASSWORD,
              element: (
                <Suspense>
                  <ChangePassword />
                </Suspense>
              )
            }
          ]
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
