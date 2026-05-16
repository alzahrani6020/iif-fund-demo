// Dashboard Manager
export class DashboardManager {
  constructor(storageManager, authManager) {
    this.storage = storageManager;
    this.auth = authManager;
    this.data = {
      investments: 0,
      clients: 0,
      returns: 0,
      countries: 0,
      activities: [],
      portfolio: [],
      notifications: [],
      documents: []
    };
  }

  async init() {
    try {
      console.log('📊 Initializing Dashboard Manager...');
      
      // Load dashboard data
      await this.loadDashboardData();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Render dashboard
      this.renderDashboard();

      // Render local system status (dev endpoints) without blocking UI
      this.renderSystemStatus();
      
      console.log('✅ Dashboard Manager initialized successfully!');
      
    } catch (error) {
      console.error('❌ Failed to initialize Dashboard Manager:', error);
      throw error;
    }
  }

  async loadDashboardData() {
    // Load data from storage or API
    this.data.investments = this.storage.get('dashboard-investments', 2500000);
    this.data.clients = this.storage.get('dashboard-clients', 156);
    this.data.returns = this.storage.get('dashboard-returns', 12.5);
    this.data.countries = this.storage.get('dashboard-countries', 28);
    
    // Load activities
    this.data.activities = this.storage.get('dashboard-activities', [
      {
        id: 1,
        type: 'investment',
        title: 'New Investment Received',
        description: '$50,000 investment in Tech Sector',
        time: '2 hours ago',
        icon: '💰'
      },
      {
        id: 2,
        type: 'client',
        title: 'New Client Registered',
        description: 'John Doe from United States',
        time: '4 hours ago',
        icon: '👤'
      },
      {
        id: 3,
        type: 'report',
        title: 'Monthly Report Generated',
        description: 'Q1 2024 Performance Report',
        time: '1 day ago',
        icon: '📊'
      }
    ]);
    
    // Load portfolio data
    this.data.portfolio = this.storage.get('dashboard-portfolio', [
      { sector: 'Technology', value: 35, color: '#3b82f6' },
      { sector: 'Healthcare', value: 25, color: '#10b981' },
      { sector: 'Finance', value: 20, color: '#f59e0b' },
      { sector: 'Real Estate', value: 15, color: '#ef4444' },
      { sector: 'Energy', value: 5, color: '#8b5cf6' }
    ]);
    
    // Load notifications
    this.data.notifications = this.storage.get('dashboard-notifications', [
      {
        id: 1,
        type: 'info',
        title: 'System Update',
        message: 'New features have been added to the dashboard',
        time: '1 hour ago',
        read: false
      },
      {
        id: 2,
        type: 'warning',
        title: 'Market Alert',
        message: 'Volatility detected in emerging markets',
        time: '3 hours ago',
        read: false
      },
      {
        id: 3,
        type: 'success',
        title: 'Investment Milestone',
        message: 'Your portfolio reached $2.5M',
        time: '1 day ago',
        read: true
      }
    ]);
    
    // Load documents
    this.data.documents = this.storage.get('dashboard-documents', [
      {
        id: 1,
        name: 'Q1 2024 Report',
        type: 'PDF',
        size: '2.4 MB',
        date: '2024-03-15',
        icon: '📄'
      },
      {
        id: 2,
        name: 'Investment Proposal',
        type: 'DOC',
        size: '1.1 MB',
        date: '2024-03-14',
        icon: '📝'
      },
      {
        id: 3,
        name: 'Market Analysis',
        type: 'XLS',
        size: '856 KB',
        date: '2024-03-13',
        icon: '📊'
      }
    ]);
  }

  setupEventListeners() {
    // Quick action buttons
    document.addEventListener('click', (e) => {
      if (e.target.matches('.quick-action-btn')) {
        const action = e.target.getAttribute('data-action');
        this.handleQuickAction(action);
      }
    });

    // View all buttons
    document.addEventListener('click', (e) => {
      if (e.target.id === 'view-all-activities') {
        this.viewAllActivities();
      } else if (e.target.id === 'view-portfolio') {
        this.viewPortfolio();
      } else if (e.target.id === 'view-all-notifications') {
        this.viewAllNotifications();
      } else if (e.target.id === 'view-markets') {
        this.viewMarkets();
      } else if (e.target.id === 'view-all-documents') {
        this.viewAllDocuments();
      }
    });
  }

  renderDashboard() {
    // Update stats
    this.updateStats();
    
    // Render activities
    this.renderActivities();
    
    // Render portfolio chart
    this.renderPortfolioChart();
    
    // Render notifications
    this.renderNotifications();
    
    // Render documents
    this.renderDocuments();
    
    // Render market ticker
    this.renderMarketTicker();
  }

  async renderSystemStatus() {
    const el = document.getElementById('dashboard-statusbar');
    if (!el) return;

    try {
      const res = await fetch('/healthz', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const searxOk = Boolean(data?.searx?.ok);
      const latency = data?.searx?.latencyMs;
      const diagSize = data?.diagnostics?.size;

      const dotClass = searxOk ? 'is-ok' : 'is-fail';
      const dotLabel = searxOk ? 'OK' : 'FAIL';
      const latencyText = typeof latency === 'number' ? `${latency}ms` : 'N/A';
      const diagText = typeof diagSize === 'number' ? String(diagSize) : 'N/A';

      el.innerHTML = `
        <span class="dashboard-statusbar__item">
          <span class="dashboard-statusbar__dot ${dotClass}" aria-hidden="true"></span>
          <span class="lang-en">SearXNG:</span><span class="lang-ar">SearXNG:</span>
          <strong>${dotLabel}</strong>
          <span class="dashboard-statusbar__muted">(${latencyText})</span>
        </span>
        <span class="dashboard-statusbar__sep" aria-hidden="true">•</span>
        <span class="dashboard-statusbar__item">
          <span class="lang-en" title="Dev-server diagnostic events (proxy/rate-limit); 0 is normal until something is logged">Diag events:</span>
          <span class="lang-ar" title="أحداث تشخيص خادم التطوير؛ 0 طبيعي إذا لم يُسجّل شيء">سجلات تشخيص:</span>
          <strong>${diagText}</strong>
        </span>
      `;
    } catch (e) {
      // لا نوقف لوحة التحكم بسبب فشل استدعاء الصحة.
      el.innerHTML = `
        <span class="lang-en">System status: unavailable — local dev only (<code>/healthz</code>).
          <a href="/healthz" target="_blank" rel="noopener">Open JSON</a> · <a href="/health.html">Health page</a>
        </span>
        <span class="lang-ar">حالة النظام غير متاحة — مع <code>npm start</code> فقط.
          <a href="/healthz" target="_blank" rel="noopener">فتح JSON</a> · <a href="/health.html">صفحة الصحة</a>
        </span>
      `;
    }
  }

  updateStats() {
    const investmentsEl = document.getElementById('total-investments');
    const clientsEl = document.getElementById('active-clients');
    const returnsEl = document.getElementById('returns');
    const countriesEl = document.getElementById('countries');
    
    if (investmentsEl) {
      investmentsEl.textContent = this.formatCurrency(this.data.investments);
    }
    
    if (clientsEl) {
      clientsEl.textContent = this.data.clients.toString();
    }
    
    if (returnsEl) {
      returnsEl.textContent = `${this.data.returns}%`;
    }
    
    if (countriesEl) {
      countriesEl.textContent = this.data.countries.toString();
    }
  }

  renderActivities() {
    const container = document.getElementById('activities-list');
    if (!container) return;
    
    const activitiesHTML = this.data.activities.map(activity => `
      <div class="activity-item">
        <div class="activity-icon">${activity.icon}</div>
        <div class="activity-content">
          <h4 class="activity-title">${activity.title}</h4>
          <p class="activity-description">${activity.description}</p>
          <span class="activity-time">${activity.time}</span>
        </div>
      </div>
    `).join('');
    
    container.innerHTML = activitiesHTML;
  }

  renderPortfolioChart() {
    const container = document.getElementById('portfolio-chart');
    if (!container) return;
    
    // Simple pie chart using CSS
    const chartHTML = `
      <div class="portfolio-chart">
        <div class="chart-legend">
          ${this.data.portfolio.map(item => `
            <div class="legend-item">
              <span class="legend-color" style="background-color: ${item.color}"></span>
              <span class="legend-label">${item.sector}</span>
              <span class="legend-value">${item.value}%</span>
            </div>
          `).join('')}
        </div>
        <div class="chart-visual">
          <div class="pie-chart">
            ${this.data.portfolio.map((item, index) => `
              <div class="pie-slice" style="
                background: ${item.color};
                transform: rotate(${this.calculateRotation(index)}deg);
                clip-path: ${this.createClipPath(index)};
              "></div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    
    container.innerHTML = chartHTML;
  }

  renderNotifications() {
    const container = document.getElementById('notifications-list');
    if (!container) return;
    
    const notificationsHTML = this.data.notifications.map(notification => `
      <div class="notification-item ${notification.read ? 'read' : 'unread'}">
        <div class="notification-type notification-${notification.type}"></div>
        <div class="notification-content">
          <h4 class="notification-title">${notification.title}</h4>
          <p class="notification-message">${notification.message}</p>
          <span class="notification-time">${notification.time}</span>
        </div>
        <button class="notification-dismiss" data-id="${notification.id}">×</button>
      </div>
    `).join('');
    
    container.innerHTML = notificationsHTML;
  }

  renderDocuments() {
    const container = document.getElementById('documents-list');
    if (!container) return;
    
    const documentsHTML = this.data.documents.map(doc => `
      <div class="document-item">
        <div class="document-icon">${doc.icon}</div>
        <div class="document-content">
          <h4 class="document-name">${doc.name}</h4>
          <div class="document-meta">
            <span class="document-type">${doc.type}</span>
            <span class="document-size">${doc.size}</span>
            <span class="document-date">${doc.date}</span>
          </div>
        </div>
        <div class="document-actions">
          <button class="btn btn--ghost btn-sm" data-action="download" data-id="${doc.id}">Download</button>
        </div>
      </div>
    `).join('');
    
    container.innerHTML = documentsHTML;
  }

  renderMarketTicker() {
    const container = document.getElementById('market-ticker');
    if (!container) return;
    
    const marketData = [
      { symbol: 'S&P 500', value: '4,512.58', change: '+1.2%', positive: true },
      { symbol: 'DOW', value: '35,061.23', change: '+0.8%', positive: true },
      { symbol: 'NASDAQ', value: '14,234.56', change: '-0.3%', positive: false },
      { symbol: 'FTSE', value: '7,890.12', change: '+0.5%', positive: true },
      { symbol: 'NIKKEI', value: '28,345.67', change: '+1.1%', positive: true }
    ];
    
    const tickerHTML = marketData.map(market => `
      <div class="market-item">
        <span class="market-symbol">${market.symbol}</span>
        <span class="market-value">${market.value}</span>
        <span class="market-change ${market.positive ? 'positive' : 'negative'}">${market.change}</span>
      </div>
    `).join('');
    
    container.innerHTML = tickerHTML;
  }

  handleQuickAction(action) {
    console.log(`🎯 Quick action: ${action}`);
    
    switch (action) {
      case 'new-investment':
        this.showNewInvestmentForm();
        break;
      case 'send-letter':
        window.location.hash = 'letters';
        break;
      case 'view-reports':
        this.showReports();
        break;
      case 'team-management':
        window.location.hash = 'team';
        break;
      case 'client-portal':
        this.showClientPortal();
        break;
      case 'settings':
        window.location.hash = 'settings';
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  }

  showNewInvestmentForm() {
    // Show investment form modal
    const modalHTML = `
      <div class="modal is-open" id="investment-modal">
        <div class="modal__content">
          <div class="modal__header">
            <h2 class="modal__title">New Investment</h2>
            <button class="modal__close" onclick="this.closest('.modal').remove()">×</button>
          </div>
          <form id="investment-form">
            <div class="form-group">
              <label>Investment Amount</label>
              <input type="number" min="1000" step="1000" required>
            </div>
            <div class="form-group">
              <label>Investment Type</label>
              <select required>
                <option value="">Select type</option>
                <option value="stocks">Stocks</option>
                <option value="bonds">Bonds</option>
                <option value="real-estate">Real Estate</option>
                <option value="commodities">Commodities</option>
              </select>
            </div>
            <div class="form-group">
              <label>Duration</label>
              <select required>
                <option value="">Select duration</option>
                <option value="short">Short Term (1-3 years)</option>
                <option value="medium">Medium Term (3-7 years)</option>
                <option value="long">Long Term (7+ years)</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn--ghost" onclick="this.closest('.modal').remove()">Cancel</button>
              <button type="submit" class="btn btn--primary">Submit Investment</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  showReports() {
    console.log('📊 Showing reports...');
    // Navigate to reports page or show reports modal
  }

  showClientPortal() {
    console.log('👥 Showing client portal...');
    // Navigate to client portal
  }

  viewAllActivities() {
    console.log('📋 Viewing all activities...');
    // Navigate to activities page
  }

  viewPortfolio() {
    console.log('💼 Viewing portfolio details...');
    // Navigate to portfolio page
  }

  viewAllNotifications() {
    console.log('🔔 Viewing all notifications...');
    // Navigate to notifications page
  }

  viewMarkets() {
    console.log('📈 Viewing market details...');
    // Navigate to markets page
  }

  viewAllDocuments() {
    console.log('📄 Viewing all documents...');
    // Navigate to documents page
  }

  // Helper methods
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  calculateRotation(index) {
    let rotation = 0;
    for (let i = 0; i < index; i++) {
      rotation += this.data.portfolio[i].value * 3.6; // 360/100 = 3.6 degrees per percentage
    }
    return rotation;
  }

  createClipPath(index) {
    const startAngle = this.calculateRotation(index);
    const endAngle = startAngle + (this.data.portfolio[index].value * 3.6);
    
    return `polygon(50% 50%, ${this.getPointOnCircle(50, 50, 50, startAngle)}, ${this.getPointOnCircle(50, 50, 50, endAngle)})`;
  }

  getPointOnCircle(cx, cy, r, angle) {
    const rad = (angle - 90) * Math.PI / 180;
    const x = cx + r * Math.cos(rad);
    const y = cy + r * Math.sin(rad);
    return `${x}% ${y}%`;
  }

  // Update dashboard data
  async refreshData() {
    console.log('🔄 Refreshing dashboard data...');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update with new data
    this.data.investments = Math.floor(this.data.investments * (1 + Math.random() * 0.1));
    this.data.clients = this.data.clients + Math.floor(Math.random() * 5);
    this.data.returns = Math.round((this.data.returns + (Math.random() - 0.5) * 2) * 10) / 10;
    
    // Save to storage
    this.storage.set('dashboard-investments', this.data.investments);
    this.storage.set('dashboard-clients', this.data.clients);
    this.storage.set('dashboard-returns', this.data.returns);
    
    // Re-render
    this.renderDashboard();
    
    console.log('✅ Dashboard data refreshed');
  }
}
