import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { PortfolioProvider } from './lib/store'
import './i18n'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PortfolioProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </PortfolioProvider>
  </StrictMode>,
)
