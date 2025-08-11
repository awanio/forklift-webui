import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import page from 'page'

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
    .actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .actions button {
      background: var(--vp-c-brand-soft);
      color: var(--vp-c-text-1);
      border: 1px solid var(--vp-c-border);
      padding: 0.35rem 0.6rem;
      border-radius: var(--radius-xs);
      cursor: pointer;
    }
    .actions button:hover {
      background: var(--vp-c-brand-2);
      color: white;
      border-color: var(--vp-c-brand-2);
    }
    .icon { display: inline-block; width: 18px; height: 18px; }
    
    .user-menu {
      position: relative;
    }
    
    .user-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.75rem !important;
    }
    
    .user-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--vp-c-brand);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 600;
    }
    
    .dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 0.5rem;
      background: var(--vp-c-bg-soft);
      border: 1px solid var(--vp-c-border);
      border-radius: var(--radius-xs);
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      min-width: 180px;
      display: none;
    }
    
    .dropdown.show {
      display: block;
    }
    
    .dropdown-item {
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--vp-c-text-1);
      text-decoration: none;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      font-size: 0.875rem;
    }
    
    .dropdown-item:hover {
      background: var(--vp-c-bg-mute);
    }
    
    .dropdown-divider {
      height: 1px;
      background: var(--vp-c-border);
      margin: 0.25rem 0;
    }
    
    .username {
      font-weight: 500;
      color: var(--vp-c-text-1);
    }
  `

  @state() private declare isDarkMode: boolean
  @state() private declare showUserMenu: boolean
  @state() private declare username: string
  private handleOutsideClick: ((e: MouseEvent) => void) | undefined

  constructor() {
    super()
    // Initialize state properties
    this.showUserMenu = false
    
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    // Use saved theme, or fall back to system preference
    this.isDarkMode = savedTheme ? savedTheme === 'dark' : prefersDark
    
    // Get username from localStorage
    this.username = localStorage.getItem('username') || 'User'
  }
  
  connectedCallback() {
    super.connectedCallback()
    // Apply the theme when component is connected
    this.applyTheme(this.isDarkMode)
    
    // Close dropdown when clicking outside
    this.handleOutsideClick = (e: MouseEvent) => {
      const path = e.composedPath()
      if (!path.includes(this)) {
        this.showUserMenu = false
      }
    }
    document.addEventListener('click', this.handleOutsideClick)
  }
  
  disconnectedCallback() {
    if (this.handleOutsideClick) {
      document.removeEventListener('click', this.handleOutsideClick)
    }
    super.disconnectedCallback()
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
  
  private toggleUserMenu(e: Event) {
    e.stopPropagation()
    this.showUserMenu = !this.showUserMenu
  }
  
  private handleLogout() {
    page('/logout')
  }

  render() {
    const initials = this.username.charAt(0).toUpperCase()
    
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
          
          <div class="user-menu">
            <button class="user-button" @click=${this.toggleUserMenu}>
              <div class="user-avatar">${initials}</div>
              <span class="username">${this.username}</span>
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            
            <div class="dropdown ${this.showUserMenu ? 'show' : ''}">
              <div class="dropdown-item">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Profile</span>
              </div>
              <div class="dropdown-item">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24m0 5.96l-4.24 4.24M20 12h-6m-6 0H2m13.22 4.22l-4.24 4.24m0-13.92L6.74 2.26"></path>
                </svg>
                <span>Settings</span>
              </div>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item" @click=${this.handleLogout}>
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    `
  }
}
