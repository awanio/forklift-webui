import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import page from 'page'

@customElement('page-login')
export class PageLogin extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: var(--vp-c-bg);
      color: var(--vp-c-text-1);
    }
    
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 1rem;
      border-bottom: 1px solid var(--vp-c-border);
      background: var(--vp-c-bg);
    }
    
    .brand-title {
      color: var(--vp-c-text-1);
      font-weight: 600;
      font-size: 1.1rem;
    }
    
    .theme-button {
      background: var(--vp-c-brand-soft);
      color: var(--vp-c-text-1);
      border: 1px solid var(--vp-c-border);
      padding: 0.35rem 0.6rem;
      border-radius: var(--radius-xs);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .theme-button:hover {
      background: var(--vp-c-brand-2);
      color: white;
      border-color: var(--vp-c-brand-2);
    }
    
    .icon {
      display: inline-block;
      width: 18px;
      height: 18px;
    }
    
    .login-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .login-container {
      width: 100%;
      max-width: 400px;
      padding: 2rem;
    }
    
    .login-card {
      background: var(--vp-c-bg-soft);
      border: 1px solid var(--vp-c-border);
      border-radius: var(--radius-md);
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }
    
    .logo {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .logo h1 {
      font-size: 2rem;
      font-weight: 600;
      margin: 0;
      color: var(--vp-c-brand);
    }
    
    .logo p {
      margin: 0.5rem 0 0;
      color: var(--vp-c-text-2);
      font-size: 0.875rem;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--vp-c-text-1);
    }
    
    input {
      width: 100%;
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
      background: var(--vp-c-bg);
      color: var(--vp-c-text-1);
      border: 1px solid var(--vp-c-border);
      border-radius: var(--radius-xs);
      transition: all 0.2s;
      box-sizing: border-box;
    }
    
    input:focus {
      outline: none;
      border-color: var(--vp-c-brand);
      box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
    }
    
    input::placeholder {
      color: var(--vp-c-text-3);
    }
    
    .remember-me {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    
    .remember-me input[type="checkbox"] {
      width: auto;
      margin: 0;
    }
    
    .remember-me label {
      margin: 0;
      font-size: 0.875rem;
      color: var(--vp-c-text-2);
    }
    
    .login-button {
      width: 100%;
      padding: 0.75rem 1.25rem;
      font-size: 0.95rem;
      font-weight: 600;
      letter-spacing: 0.025em;
      color: white;
      background: linear-gradient(135deg, var(--vp-c-brand), var(--vp-c-brand-dark));
      border: 2px solid transparent;
      border-radius: var(--radius-xs);
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 
        0 4px 6px -1px rgba(0, 0, 0, 0.2),
        0 2px 4px -1px rgba(0, 0, 0, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;
    }
    
    .login-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.1) 0%, 
        transparent 50%, 
        rgba(0, 0, 0, 0.05) 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .login-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 
        0 7px 14px -3px rgba(0, 0, 0, 0.3),
        0 3px 6px -2px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);
      border-color: var(--vp-c-brand);
    }
    
    .login-button:hover:not(:disabled)::before {
      opacity: 1;
    }
    
    .login-button:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 
        0 2px 4px -1px rgba(0, 0, 0, 0.2),
        0 1px 2px -1px rgba(0, 0, 0, 0.12),
        inset 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .login-button:focus:not(:disabled) {
      outline: none;
      box-shadow: 
        0 4px 6px -1px rgba(0, 0, 0, 0.2),
        0 2px 4px -1px rgba(0, 0, 0, 0.12),
        0 0 0 3px var(--vp-c-brand-soft),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }
    
    .login-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background: var(--vp-c-bg-mute);
      color: var(--vp-c-text-3);
      box-shadow: none;
    }
    
    /* Loading spinner for button */
    .login-button.loading {
      color: transparent;
      position: relative;
    }
    
    .login-button.loading::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      top: 50%;
      left: 50%;
      margin-left: -8px;
      margin-top: -8px;
      border: 2px solid white;
      border-radius: 50%;
      border-top-color: transparent;
      animation: spinner 0.6s linear infinite;
    }
    
    @keyframes spinner {
      to { transform: rotate(360deg); }
    }
    
    .divider {
      position: relative;
      text-align: center;
      margin: 1.5rem 0;
    }
    
    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--vp-c-border);
    }
    
    .divider span {
      position: relative;
      padding: 0 1rem;
      background: var(--vp-c-bg-soft);
      color: var(--vp-c-text-3);
      font-size: 0.75rem;
    }
    
    .footer {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.875rem;
      color: var(--vp-c-text-2);
    }
    
    .footer a {
      color: var(--vp-c-brand);
      text-decoration: none;
    }
    
    .footer a:hover {
      text-decoration: underline;
    }
    
    .error-message {
      color: var(--vp-c-danger);
      font-size: 0.875rem;
      margin-top: 0.5rem;
      display: none;
    }
    
    .error-message.show {
      display: block;
    }
  `

  @state() private declare loading: boolean
  @state() private declare error: string
  @state() private declare isDarkMode: boolean

  constructor() {
    super()
    this.loading = false
    this.error = ''
    
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    this.isDarkMode = savedTheme ? savedTheme === 'dark' : prefersDark
  }

  private handleSubmit(e: Event) {
    e.preventDefault()
    
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    
    // Simple validation
    if (!username || !password) {
      this.error = 'Please enter username and password'
      return
    }
    
    // Simulate login process
    this.loading = true
    this.error = ''
    
    setTimeout(() => {
      // For demo purposes, accept any credentials
      // In real app, this would call an authentication API
      localStorage.setItem('authenticated', 'true')
      localStorage.setItem('username', username)
      page('/providers')
    }, 500)
  }

  connectedCallback() {
    super.connectedCallback()
    // Apply the saved theme
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
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light')
    this.applyTheme(this.isDarkMode)
  }

  render() {
    return html`
      <div class="header">
        <div class="brand-title">Forklift WebUI</div>
        <button 
          class="theme-button" 
          @click=${() => this.toggleTheme()} 
          aria-label="Toggle theme" 
          title=${this.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
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
      
      <div class="login-wrapper">
        <div class="login-container">
          <div class="login-card">
            <div class="logo">
              <h1>Forklift</h1>
              <p>Migration Toolkit for Virtualization</p>
            </div>
          
          <form @submit=${this.handleSubmit}>
            <div class="form-group">
              <label for="username">Username</label>
              <input 
                type="text" 
                id="username" 
                name="username"
                placeholder="Enter your username"
                ?disabled=${this.loading}
                @input=${() => this.error = ''}
              />
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password"
                placeholder="Enter your password"
                ?disabled=${this.loading}
                @input=${() => this.error = ''}
              />
              <div class="error-message ${this.error ? 'show' : ''}">${this.error}</div>
            </div>
            
            <div class="remember-me">
              <input type="checkbox" id="remember" name="remember" />
              <label for="remember">Remember me</label>
            </div>
            
            <button 
              type="submit" 
              class="login-button ${this.loading ? 'loading' : ''}"
              ?disabled=${this.loading}
            >
              ${this.loading ? 'Logging in...' : 'LOGIN'}
            </button>
          </form>
          
          <div class="divider">
            <span>OR</span>
          </div>
          
          <div class="footer">
            <p>Demo login - Use any credentials</p>
            <p style="margin-top: 0.5rem;">
              <a href="#">Forgot password?</a> · 
              <a href="#">Need help?</a>
            </p>
            </div>
          </div>
        </div>
      </div>
    `
  }
}
