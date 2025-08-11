import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('nav-top')
export class NavTop extends LitElement {
  static styles = css`
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 1rem;
      border-bottom: 1px solid var(--vp-c-border);
      background: var(--vp-c-bg);
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .brand {
      font-weight: 600;
      color: var(--vp-c-brand-1);
    }
    .brand-title {
      color: var(--vp-c-text-1);
      font-weight: 600;
    }
    .actions button {
      background: var(--vp-c-brand-soft);
      color: var(--vp-c-text-1);
      border: 1px solid var(--vp-c-border);
      padding: 0.35rem 0.6rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
    }
    .actions button:hover {
      background: var(--vp-c-brand-2);
      color: white;
      border-color: var(--vp-c-brand-2);
    }
    .icon { display: inline-block; width: 18px; height: 18px; }
  `

  @state() private isDarkMode: boolean = false

  constructor() {
    super()
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    // Use saved theme, or fall back to system preference
    this.isDarkMode = savedTheme ? savedTheme === 'dark' : prefersDark
    
    // Apply the theme
    this.applyTheme(this.isDarkMode)
  }

  private applyTheme(isDark: boolean) {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  private toggleTheme() {
    this.isDarkMode = !this.isDarkMode
    
    // Save to local storage
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light')
    
    // Apply theme
    this.applyTheme(this.isDarkMode)
    
    // Dispatch event for other components if needed
    this.dispatchEvent(new CustomEvent('theme-changed', { 
      detail: { isDark: this.isDarkMode },
      bubbles: true,
      composed: true
    }))
  }

  render() {
    return html`
      <header>
        <div class="brand-title">Forklift WebUI</div>
        <div class="actions">
          <button @click=${() => this.toggleTheme()} aria-label="Toggle theme" title=${this.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
            ${this.isDarkMode ? html`
              <!-- Sun icon for dark mode -->
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ` : html`
              <!-- Moon icon for light mode -->
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            `}
          </button>
        </div>
      </header>
    `
  }
}
