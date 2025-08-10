import page from 'page'

export type RouteHandler = (ctx: page.Context) => void

// Simple routes: dashboard default and example paths
page('/', () => page.redirect('/dashboard'))
page('/dashboard', () => {
  window.dispatchEvent(new CustomEvent('route:change', { detail: { path: '/dashboard' } }))
})
page('/settings', () => {
  window.dispatchEvent(new CustomEvent('route:change', { detail: { path: '/settings' } }))
})
page('/about', () => {
  window.dispatchEvent(new CustomEvent('route:change', { detail: { path: '/about' } }))
})

page()
