import { QueryClientProvider } from '@tanstack/react-query'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { HomeScreen } from '../components/HomeScreen/HomeScreen'
import { queryClient } from './queryClient'
import { theme } from './theme'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HomeScreen />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
