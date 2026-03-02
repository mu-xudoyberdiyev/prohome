import { createRoot } from 'react-dom/client'
import 'react-photo-view/dist/react-photo-view.css'
import { LoadingBarContainer } from 'react-top-loading-bar'
import { Toaster } from 'sonner'
import App from './App.jsx'
import './index.css'
import Offline from './pages/Offline.jsx'

const online = (
  <LoadingBarContainer>
    <App />
    <Toaster closeButton richColors position="bottom-right" visibleToasts={3} />
  </LoadingBarContainer>
)

const offline = <Offline />

const root = createRoot(document.getElementById('root'))

root.render(online)

// Online
window.addEventListener('online', () => {
  root.render(online)
})

// Offline
window.addEventListener('offline', () => {
  root.render(offline)
})
