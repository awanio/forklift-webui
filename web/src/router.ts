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
page('/mappings', () => {
  window.dispatchEvent(new CustomEvent('route:change', { detail: { path: '/mappings' } }))
})

page()
