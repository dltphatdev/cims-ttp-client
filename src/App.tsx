import { useContext, useEffect } from 'react'
import Router from './router'
import { ThemeProvider } from '@/components/theme-provider'
import { AppContext } from '@/contexts/app-context'
import { eventTargetLS } from '@/utils/auth'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const router = Router()
  const { reset } = useContext(AppContext)
  useEffect(() => {
    eventTargetLS.addEventListener('clearLS', reset)
    return () => {
      eventTargetLS.removeEventListener('clearLS', reset)
    }
  }, [reset])
  return (
    <div>
      <Toaster position='top-right' />
      <ThemeProvider>{router}</ThemeProvider>
    </div>
  )
}

export default App
