import './style.css'
import './theme.css'
import './router'
import './components/app-shell'

// Mount the root web component
const app = document.createElement('app-shell')
document.getElementById('app')!.appendChild(app)
