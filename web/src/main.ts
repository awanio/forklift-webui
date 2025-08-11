import './style.css'
import './theme.css'
import './components/app-shell'
import './pages/page-login'
import './router'

// Handle routing between login and app shell
let currentView: 'login' | 'app' | null = null
const appContainer = document.getElementById('app')!

function renderView(path: string) {
  if (path === '/login') {
    if (currentView !== 'login') {
      appContainer.innerHTML = ''
      const loginPage = document.createElement('page-login')
      appContainer.appendChild(loginPage)
      currentView = 'login'
    }
  } else {
    if (currentView !== 'app') {
      appContainer.innerHTML = ''
      const appShell = document.createElement('app-shell')
      appContainer.appendChild(appShell)
      currentView = 'app'
    }
  }
}

// Listen for route changes
window.addEventListener('route:change', (e) => {
  const { path } = (e as CustomEvent).detail
  renderView(path)
})

// Initial render based on authentication
const authenticated = localStorage.getItem('authenticated') === 'true'
if (!authenticated || window.location.pathname === '/login') {
  renderView('/login')
} else {
  renderView('/providers')
}
