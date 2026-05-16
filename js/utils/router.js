// Router for Single Page Application
export class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.isStarted = false;
    this.basePath = '/';
  }

  // Read a value from localStorage, supporting both:
  // 1) legacy raw values (stringified user / token)
  // 2) StorageManager wrapper format: { value: "<json>", timestamp, ttl, encrypted }
  readStoredValue(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      // If it's a wrapped StorageManager payload, unwrap it.
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && 'value' in parsed && 'timestamp' in parsed) {
        const inner = parsed.value;
        // inner may be JSON string (user object) or token string (JSON encoded).
        try {
          return JSON.parse(inner);
        } catch (e) {
          return inner;
        }
      }
      return parsed;
    } catch (e) {
      // Not JSON: treat as raw string.
      try { return localStorage.getItem(key); } catch (e2) { return null; }
    }
  }

  // Add a new route
  addRoute(path, handler, options = {}) {
    const route = {
      path,
      handler,
      options,
      params: this.extractParams(path)
    };
    
    this.routes.set(path, route);
    return this;
  }

  // Extract parameters from route path
  extractParams(path) {
    const params = [];
    const parts = path.split('/');
    
    parts.forEach(part => {
      if (part.startsWith(':')) {
        params.push(part.substring(1));
      }
    });
    
    return params;
  }

  // Match current path against routes
  matchRoute(path) {
    for (const [routePath, route] of this.routes) {
      const match = this.matchPath(path, routePath);
      if (match) {
        return { route, params: match.params };
      }
    }
    
    return null;
  }

  // Match path against route pattern
  matchPath(path, routePath) {
    const pathParts = path.split('/').filter(Boolean);
    const routeParts = routePath.split('/').filter(Boolean);
    
    if (pathParts.length !== routeParts.length) {
      return null;
    }
    
    const params = {};
    
    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      const pathPart = pathParts[i];
      
      if (routePart.startsWith(':')) {
        const paramName = routePart.substring(1);
        params[paramName] = pathPart;
      } else if (routePart !== pathPart) {
        return null;
      }
    }
    
    return { params };
  }

  // Navigate to a new route
  async navigate(path, options = {}) {
    const { replace = false, silent = false } = options;
    
    // Update URL
    if (replace) {
      history.replaceState(null, '', this.basePath + path);
    } else {
      history.pushState(null, '', this.basePath + path);
    }
    
    if (!silent) {
      await this.handleRoute(path);
    }
  }

  // Handle route change
  async handleRoute(path) {
    const match = this.matchRoute(path);
    
    if (!match) {
      console.warn(`No route found for path: ${path}`);
      await this.handleNotFound();
      return;
    }
    
    const { route, params } = match;
    
    // Check authentication requirements
    if (route.options.auth && !this.isAuthenticated()) {
      await this.handleUnauthorized();
      return;
    }
    
    // Check admin requirements
    if (route.options.admin && !this.isAdmin()) {
      await this.handleForbidden();
      return;
    }
    
    try {
      // Execute route handler
      await route.handler(params);
      
      // Update current route
      this.currentRoute = { path, route, params };
      
      // Emit navigation event
      document.dispatchEvent(new CustomEvent('navigation', {
        detail: { path, route, params }
      }));
      
    } catch (error) {
      console.error('Route handler error:', error);
      await this.handleError(error);
    }
  }

  // Handle 404 Not Found
  async handleNotFound() {
    const notFoundRoute = this.routes.get('*');
    if (notFoundRoute) {
      await notFoundRoute.handler();
    } else {
      console.error('404 - No route found and no wildcard route defined');
    }
  }

  // Handle 401 Unauthorized
  async handleUnauthorized() {
    console.log('Unauthorized access, redirecting to login');
    await this.navigate('/login');
  }

  // Handle 403 Forbidden
  async handleForbidden() {
    console.log('Forbidden access');
    // You could show a forbidden page here
    await this.navigate('/403');
  }

  // Handle route errors
  async handleError(error) {
    console.error('Route error:', error);
    // You could show an error page here
    await this.navigate('/error');
  }

  // Check if user is authenticated
  isAuthenticated() {
    try {
      // Primary: StorageManager/AuthManager keys
      const token = this.readStoredValue('iif-token');
      if (token) return true;
    } catch (e) { }
    try {
      // Compatibility: index.html auth keys
      if (localStorage.getItem('iif-logged-in') === '1') return true;
      if (sessionStorage.getItem('iif-logged-in') === '1') return true;
      const email = (localStorage.getItem('iif-user-email') || '').trim();
      if (email && localStorage.getItem('iif-is-admin') === '1') return true;
    } catch (e2) { }
    return false;
  }

  // Check if user is admin
  isAdmin() {
    try {
      // Primary: StorageManager/AuthManager key
      const user = this.readStoredValue('iif-user');
      if (user && user.role === 'admin') return true;
    } catch (e) { }
    try {
      // Compatibility: index.html auth keys
      if (localStorage.getItem('iif-is-admin') === '1') return true;
    } catch (e2) { }
    return false;
  }

  // Get current route
  getCurrentRoute() {
    return this.currentRoute;
  }

  // Get current path
  getCurrentPath() {
    return window.location.pathname.replace(this.basePath, '/') || '/';
  }

  // Start the router
  start() {
    if (this.isStarted) {
      return;
    }
    
    this.isStarted = true;
    
    // Handle initial route
    this.handleRoute(this.getCurrentPath());
    
    // Handle popstate events (browser back/forward)
    window.addEventListener('popstate', () => {
      this.handleRoute(this.getCurrentPath());
    });
    
    // Handle link clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && this.isInternalLink(link)) {
        e.preventDefault();
        const href = link.getAttribute('href');
        const path = href.replace(this.basePath, '/') || '/';
        this.navigate(path);
      }
    });
    
    console.log('Router started');
  }

  // Check if link is internal
  isInternalLink(link) {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http')) {
      return false;
    }
    
    return href.startsWith(this.basePath);
  }

  // Stop the router
  stop() {
    if (!this.isStarted) {
      return;
    }
    
    this.isStarted = false;
    window.removeEventListener('popstate', this.handleRoute);
    console.log('Router stopped');
  }

  // Get all routes
  getRoutes() {
    return Array.from(this.routes.entries()).map(([path, route]) => ({
      path,
      ...route
    }));
  }

  // Remove a route
  removeRoute(path) {
    return this.routes.delete(path);
  }

  // Clear all routes
  clearRoutes() {
    this.routes.clear();
    this.currentRoute = null;
  }

  // Set base path
  setBasePath(path) {
    this.basePath = path;
  }

  // Get base path
  getBasePath() {
    return this.basePath;
  }

  // Redirect to a new route
  redirect(path, options = {}) {
    return this.navigate(path, { ...options, replace: true });
  }

  // Go back in history
  back() {
    window.history.back();
  }

  // Go forward in history
  forward() {
    window.history.forward();
  }

  // Reload current route
  reload() {
    const currentPath = this.getCurrentPath();
    this.handleRoute(currentPath);
  }
}

// Create global instance
export const router = new Router();
