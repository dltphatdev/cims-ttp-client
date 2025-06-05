import Router from './router'
import { ThemeProvider } from '@/components/theme-provider'

function App() {
  const router = Router()
  return (
    <div>
      <ThemeProvider>{router}</ThemeProvider>
    </div>
  )
}

export default App
