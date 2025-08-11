import page from 'page'

export type RouteHandler = (ctx: page.Context) => void

// Authentication middleware
const requireAuth: RouteHandler = (ctx, next) => {
  const authenticated = localStorage.getItem('authenticated') === 'true'
  if (!authenticated) {
    page('/login')
  } else {
    next()
  }
}

// Public routes
page('/login', () => {
  window.dispatchEvent(new CustomEvent('route:change', { detail: { path: '/login' } }))
})

// Protected routes
page('/', requireAuth, () => page.redirect('/providers'))
page('/providers', requireAuth, () => {
  window.dispatchEvent(new CustomEvent('route:change', { detail: { path: '/providers' } }))
})
page('/plans', requireAuth, () => {
  window.dispatchEvent(new CustomEvent('route:change', { detail: { path: '/plans' } }))
})
page('/mappings', requireAuth, () => {
  window.dispatchEvent(new CustomEvent('route:change', { detail: { path: '/mappings' } }))
})

// Logout route
page('/logout', () => {
  localStorage.removeItem('authenticated')
  localStorage.removeItem('username')
  page('/login')
})

page()
