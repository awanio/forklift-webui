import page from 'page'

export type RouteHandler = (ctx: page.Context) => void

// Simple routes: dashboard default and example paths
page('/', () => page.redirect('/providers'))
page('/providers', () => {
  window.dispatchEvent(new CustomEvent('route:change', { detail: { path: '/providers' } }))
})
page('/plans', () => {
  window.dispatchEvent(new CustomEvent('route:change', { detail: { path: '/plans' } }))
})
page('/mapings', () => {
  window.dispatchEvent(new CustomEvent('route:change', { detail: { path: '/mapings' } }))
})

page()
