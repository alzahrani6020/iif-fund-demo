// Premium Government Search JavaScript
class PremiumGovernmentSearch {
    constructor() {
        this.currentLang = 'ar';
        this.dataManager = new GovernmentDataManager();
        this.currentResults = null;
        this.init();
    }

    init() {
        console.log('🚀 Premium Government Search Initializing...');

        // Check if dataManager loaded successfully
        if (this.dataManager) {
            console.log('✅ DataManager loaded successfully');
            console.log('📊 Countries available:', this.dataManager.getAllCountries().length);

            // Test Saudi data specifically
            const saudiData = this.dataManager.searchCountry('السعودية', 'ar');
            console.log('🇸🇦 Saudi data test:', saudiData ? 'Found' : 'Not found');
            if (saudiData) {
                console.log('🏛️ Saudi embassies count:', saudiData.embassies ? saudiData.embassies.length : 0);
            }
        } else {
            console.error('❌ DataManager failed to load');
        }

        this.setupEventListeners();
        this.loadCountries();
        this.updateAnalytics();
        this.setupSearchSuggestions();
    }

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('premium-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearchInput(e));
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.performPremiumSearch();
            });
        }

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => this.showSection(item.dataset.section || 'search'));
        });
    }

    handleSearchInput(e) {
        const query = e.target.value.trim();
        const suggestions = document.getElementById('search-suggestions');

        if (query.length > 0) {
            this.showSearchSuggestions(query);
            suggestions.style.display = 'block';
        } else {
            suggestions.style.display = 'none';
        }
    }

    showSearchSuggestions(query) {
        const suggestions = document.getElementById('search-suggestions');
        const countries = this.dataManager.getAllCountries(this.currentLang);

        const matches = countries.filter(country =>
            country.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);

        suggestions.innerHTML = matches.map(country => `
            <div class="suggestion-item" onclick="selectSuggestion('${country.key}')">
                <span>${country.flag}</span>
                <span>${country.name}</span>
            </div>
        `).join('');
    }

    performPremiumSearch() {
        const searchInput = document.getElementById('premium-search');
        const query = searchInput.value.trim();

        console.log('🔍 Searching for:', query);

        if (!query) {
            console.log('⚠️ Empty query, returning...');
            return;
        }

        this.showLoading();

        setTimeout(() => {
            console.log('📊 Searching in data manager...');
            const results = this.dataManager.searchCountry(query, this.currentLang);

            console.log('📊 Search results:', results);

            if (results) {
                this.currentResults = results;
                console.log('✅ Found results, showing modal...');
                this.showResults(results);
            } else {
                console.log('❌ No results found');
                this.showNoResults(query);
            }

            this.hideLoading();
        }, 500);
    }

    showResults(results) {
        const modal = document.getElementById('premium-results-modal');
        const modalTitle = document.getElementById('modal-country-name');

        console.log('🎯 Showing results for:', results.basicInfo.name);

        modalTitle.textContent = results.basicInfo.name;

        // Show embassies directly for testing
        this.renderEmbassiesDirectly(results);

        modal.classList.add('show');
    }

    renderEmbassiesDirectly(results) {
        const content = document.getElementById('results-content');
        const embassies = results.embassies || [];

        console.log('🏛️ Rendering embassies:', embassies.length, 'found');

        content.innerHTML = `
            <div class="embassies-section">
                <h3>السفارات السعودية في الخارج</h3>
                <div class="embassies-grid">
                    ${embassies.map((embassy, index) => {
            console.log(`🏛️ Embassy ${index + 1}:`, embassy.name);
            return `
                        <div class="embassy-card">
                            <div class="embassy-header">
                                <h4>${embassy.name}</h4>
                                <p><strong>السفير:</strong> ${embassy.ambassador}</p>
                            </div>
                            <div class="embassy-details">
                                <p><strong>الدولة:</strong> ${embassy.country}</p>
                                <p><strong>العنوان:</strong> ${embassy.address}</p>
                                <p><strong>الهاتف:</strong> ${embassy.phone}</p>
                                <p><strong>البريد:</strong> ${embassy.email}</p>
                                <p><strong>الموقع:</strong> <a href="${embassy.website}" target="_blank">${embassy.website}</a></p>
                            </div>
                        </div>
                    `}).join('')}
                </div>
            </div>
        `;

        console.log('✅ Embassies rendered successfully');
    }

    renderResultsContent(results) {
        const content = document.getElementById('results-content');

        content.innerHTML = `
            <div class="result-overview">
                <div class="country-header">
                    <h2>${results.basicInfo.name}</h2>
                    <p>${results.basicInfo.capital} - ${results.basicInfo.region}</p>
                </div>

                <div class="info-grid">
                    <div class="info-item">
                        <i class="fas fa-users"></i>
                        <div>
                            <h4>السكان</h4>
                            <p>${results.basicInfo.population}</p>
                        </div>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-money-bill"></i>
                        <div>
                            <h4>العملة</h4>
                            <p>${results.basicInfo.currency}</p>
                        </div>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-language"></i>
                        <div>
                            <h4>اللغة</h4>
                            <p>${results.basicInfo.language}</p>
                        </div>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-chart-line"></i>
                        <div>
                            <h4>الناتج المحلي</h4>
                            <p>${results.basicInfo.gdp}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showNoResults(query) {
        alert(`لم يتم العثور على نتائج لـ "${query}". جرب اسم دولة آخر.`);
    }

    showLoading() {
        document.getElementById('loading-overlay').classList.add('show');
    }

    hideLoading() {
        document.getElementById('loading-overlay').classList.remove('show');
    }

    loadCountries() {
        const countriesGrid = document.getElementById('countries-grid');
        const countries = this.dataManager.getAllCountries(this.currentLang);

        countriesGrid.innerHTML = countries.map(country => `
            <div class="country-card" onclick="quickSearch('${country.key}')">
                <div class="country-flag">${country.flag}</div>
                <div class="country-name">${country.name}</div>
                <div class="country-info">انقر للمزيد من المعلومات</div>
            </div>
        `).join('');
    }

    updateAnalytics() {
        const totalCountries = this.dataManager.getCountryCount();
        document.getElementById('total-countries').textContent = totalCountries;

        // Simulate other analytics
        document.getElementById('total-leaders').textContent = totalCountries * 2;
        document.getElementById('total-ministries').textContent = totalCountries * 3;
        document.getElementById('search-count').textContent = '1,247';
    }

    showSection(section) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[onclick="showSection('${section}')"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${section}-section`).classList.add('active');

        this.currentSection = section;

        // Load section-specific data
        if (section === 'countries') {
            this.loadCountries();
        } else if (section === 'analytics') {
            this.updateAnalytics();
        } else if (section === 'compare') {
            this.loadCompareCountries();
        }
    }

    loadCompareCountries() {
        const select1 = document.getElementById('compare-country-1');
        const select2 = document.getElementById('compare-country-2');
        const countries = this.dataManager.getAllCountries(this.currentLang);

        const options = '<option value="">اختر الدولة</option>' +
            countries.map(country => `<option value="${country.key}">${country.flag} ${country.name}</option>`).join('');

        select1.innerHTML = options;
        select2.innerHTML = options;
    }

    setupSearchSuggestions() {
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-input-wrapper')) {
                document.getElementById('search-suggestions').style.display = 'none';
            }
        });
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'ar' ? 'en' : 'ar';
        document.documentElement.lang = this.currentLang;
        document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';

        // Update UI
        this.loadCountries();
        this.updateAnalytics();

        // Update language toggle button
        const langToggle = document.querySelector('.lang-toggle .lang-text');
        if (langToggle) {
            langToggle.textContent = this.currentLang === 'ar' ? 'English' : 'العربية';
        }
    }

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const themeIcon = document.querySelector('.theme-toggle i');
        if (themeIcon) {
            themeIcon.className = document.body.classList.contains('dark-theme') ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// Global functions
let premiumSearch;

function performPremiumSearch() {
    premiumSearch.performPremiumSearch();
}

function quickSearch(countryKey) {
    const country = premiumSearch.dataManager.searchCountry(countryKey, premiumSearch.currentLang);
    if (country) {
        premiumSearch.currentResults = country;
        premiumSearch.showResults(country);
    }
}

function selectSuggestion(countryKey) {
    quickSearch(countryKey);
    document.getElementById('premium-search').value = '';
    document.getElementById('search-suggestions').style.display = 'none';
}

function showSection(section) {
    premiumSearch.showSection(section);
}

function showResultTab(tab) {
    console.log('🎯 Tab clicked:', tab);

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="showResultTab('${tab}')"]`).classList.add('active');

    // Render tab content
    if (premiumSearch && premiumSearch.currentResults) {
        console.log('📊 Rendering tab:', tab);
        premiumSearch.renderResultsTab(tab);
    } else {
        console.log('⚠️ No results available');
    }
}

function closeModal() {
    document.getElementById('premium-results-modal').classList.remove('show');
}

function toggleLanguage() {
    premiumSearch.toggleLanguage();
}

function toggleTheme() {
    premiumSearch.toggleTheme();
}

function performComparison() {
    const country1 = document.getElementById('compare-country-1').value;
    const country2 = document.getElementById('compare-country-2').value;

    if (!country1 || !country2) {
        alert('الرجاء اختيار دولتين للمقارنة');
        return;
    }

    const data1 = premiumSearch.dataManager.searchCountry(country1, premiumSearch.currentLang);
    const data2 = premiumSearch.dataManager.searchCountry(country2, premiumSearch.currentLang);

    if (data1 && data2) {
        renderComparison(data1, data2);
    }
}

function renderComparison(data1, data2) {
    const results = document.getElementById('compare-results');

    results.innerHTML = `
        <div class="comparison-table">
            <h3>مقارنة بين ${data1.basicInfo.name} و ${data2.basicInfo.name}</h3>
            <table>
                <thead>
                    <tr>
                        <th>الميزة</th>
                        <th>${data1.basicInfo.name}</th>
                        <th>${data2.basicInfo.name}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>العاصمة</td>
                        <td>${data1.basicInfo.capital}</td>
                        <td>${data2.basicInfo.capital}</td>
                    </tr>
                    <tr>
                        <td>السكان</td>
                        <td>${data1.basicInfo.population}</td>
                        <td>${data2.basicInfo.population}</td>
                    </tr>
                    <tr>
                        <td>العملة</td>
                        <td>${data1.basicInfo.currency}</td>
                        <td>${data2.basicInfo.currency}</td>
                    </tr>
                    <tr>
                        <td>الناتج المحلي</td>
                        <td>${data1.basicInfo.gdp}</td>
                        <td>${data2.basicInfo.gdp}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

// Add the renderResultsTab method to PremiumGovernmentSearch class
PremiumGovernmentSearch.prototype.renderResultsTab = function (tab) {
    const content = document.getElementById('results-content');
    const results = this.currentResults;

    if (!results) return;

    switch (tab) {
        case 'overview':
            this.renderOverview(results);
            break;
        case 'leadership':
            this.renderLeadership(results);
            break;
        case 'ministries':
            this.renderMinistries(results);
            break;
        case 'agencies':
            this.renderAgencies(results);
            break;
        case 'embassies':
            this.renderEmbassies(results);
            break;
        case 'consulates':
            this.renderConsulates(results);
            break;
        case 'commercial':
            this.renderCommercialOffices(results);
            break;
        case 'economy':
            this.renderEconomy(results);
            break;
    }
}

PremiumGovernmentSearch.prototype.renderOverview = function (results) {
    const content = document.getElementById('results-content');
    content.innerHTML = `
        <div class="result-overview">
            <div class="country-header">
                <h2>${results.basicInfo.name}</h2>
                <p>${results.basicInfo.capital} - ${results.basicInfo.region}</p>
            </div>

            <div class="info-grid">
                <div class="info-item">
                    <i class="fas fa-users"></i>
                    <div>
                        <h4>السكان</h4>
                        <p>${results.basicInfo.population}</p>
                    </div>
                </div>
                <div class="info-item">
                    <i class="fas fa-money-bill"></i>
                    <div>
                        <h4>العملة</h4>
                        <p>${results.basicInfo.currency}</p>
                    </div>
                </div>
                <div class="info-item">
                    <i class="fas fa-language"></i>
                    <div>
                        <h4>اللغة</h4>
                        <p>${results.basicInfo.language}</p>
                    </div>
                </div>
                <div class="info-item">
                    <i class="fas fa-chart-line"></i>
                    <div>
                        <h4>الناتج المحلي</h4>
                        <p>${results.basicInfo.gdp}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

PremiumGovernmentSearch.prototype.renderLeadership = function (results) {
    const content = document.getElementById('results-content');
    const leadership = results.leadership || [];

    content.innerHTML = `
        <div class="leadership-section">
            <h3>القيادة الحكومية</h3>
            <div class="leadership-grid">
                ${leadership.map(leader => `
                    <div class="leader-card">
                        <div class="leader-photo">
                            <i class="fas fa-user-circle"></i>
                        </div>
                        <div class="leader-info">
                            <h4>${leader.title}: ${leader.name}</h4>
                            <p>${leader.position}</p>
                            <p><strong>الفترة:</strong> ${leader.term}</p>
                            <p><strong>الهاتف:</strong> ${leader.phone}</p>
                            <p><strong>البريد:</strong> ${leader.email}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

PremiumGovernmentSearch.prototype.renderMinistries = function (results) {
    const content = document.getElementById('results-content');
    const ministries = results.ministries || [];

    content.innerHTML = `
        <div class="ministries-section">
            <h3>الوزارات الحكومية</h3>
            <div class="ministries-grid">
                ${ministries.map(ministry => `
                    <div class="ministry-card">
                        <div class="ministry-header">
                            <h4>${ministry.name}</h4>
                            <p><strong>الوزير:</strong> ${ministry.minister}</p>
                        </div>
                        <div class="ministry-details">
                            <p><strong>المسؤولية:</strong> ${ministry.responsibility}</p>
                            <p><strong>الهاتف:</strong> ${ministry.phone}</p>
                            <p><strong>البريد:</strong> ${ministry.email}</p>
                            <p><strong>الموقع:</strong> <a href="${ministry.website}" target="_blank">${ministry.website}</a></p>
                            <p><strong>العنوان:</strong> ${ministry.address}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

PremiumGovernmentSearch.prototype.renderEmbassies = function (results) {
    const content = document.getElementById('results-content');
    const embassies = results.embassies || [];

    content.innerHTML = `
        <div class="embassies-section">
            <h3>السفارات السعودية في الخارج</h3>
            <div class="embassies-grid">
                ${embassies.map(embassy => `
                    <div class="embassy-card">
                        <div class="embassy-header">
                            <h4>${embassy.name}</h4>
                            <p><strong>السفير:</strong> ${embassy.ambassador}</p>
                        </div>
                        <div class="embassy-details">
                            <p><strong>الدولة:</strong> ${embassy.country}</p>
                            <p><strong>العنوان:</strong> ${embassy.address}</p>
                            <p><strong>الهاتف:</strong> ${embassy.phone}</p>
                            <p><strong>البريد:</strong> ${embassy.email}</p>
                            <p><strong>الموقع:</strong> <a href="${embassy.website}" target="_blank">${embassy.website}</a></p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

PremiumGovernmentSearch.prototype.renderConsulates = function (results) {
    const content = document.getElementById('results-content');
    const consulates = results.consulates || [];

    content.innerHTML = `
        <div class="consulates-section">
            <h3>القنصليات السعودية في الخارج</h3>
            <div class="consulates-grid">
                ${consulates.map(consulate => `
                    <div class="consulate-card">
                        <div class="consulate-header">
                            <h4>${consulate.name}</h4>
                            <p><strong>القنصل:</strong> ${consulate.consul}</p>
                        </div>
                        <div class="consulate-details">
                            <p><strong>الدولة:</strong> ${consulate.country}</p>
                            <p><strong>المدينة:</strong> ${consulate.city}</p>
                            <p><strong>العنوان:</strong> ${consulate.address}</p>
                            <p><strong>الهاتف:</strong> ${consulate.phone}</p>
                            <p><strong>البريد:</strong> ${consulate.email}</p>
                            <p><strong>الموقع:</strong> <a href="${consulate.website}" target="_blank">${consulate.website}</a></p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

PremiumGovernmentSearch.prototype.renderCommercialOffices = function (results) {
    const content = document.getElementById('results-content');
    const offices = results.commercialOffices || [];

    content.innerHTML = `
        <div class="commercial-section">
            <h3>الملحقيات التجارية السعودية</h3>
            <div class="commercial-grid">
                ${offices.map(office => `
                    <div class="commercial-card">
                        <div class="commercial-header">
                            <h4>${office.name}</h4>
                            <p><strong>المدير:</strong> ${office.director}</p>
                        </div>
                        <div class="commercial-details">
                            <p><strong>الدولة:</strong> ${office.country}</p>
                            <p><strong>الخدمات:</strong> ${office.services}</p>
                            <p><strong>العنوان:</strong> ${office.address}</p>
                            <p><strong>الهاتف:</strong> ${office.phone}</p>
                            <p><strong>البريد:</strong> ${office.email}</p>
                            <p><strong>الموقع:</strong> <a href="${office.website}" target="_blank">${office.website}</a></p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

PremiumGovernmentSearch.prototype.renderAgencies = function (results) {
    const content = document.getElementById('results-content');
    const agencies = results.executiveAgencies || [];

    content.innerHTML = `
        <div class="agencies-section">
            <h3>الادارات التنفيذية</h3>
            <div class="agencies-grid">
                ${agencies.map(agency => `
                    <div class="agency-card">
                        <div class="agency-header">
                            <h4>${agency.name}</h4>
                            <p><strong>المدير:</strong> ${agency.director}</p>
                        </div>
                        <div class="agency-details">
                            <p><strong>المسؤولية:</strong> ${agency.responsibility}</p>
                            <p><strong>الهاتف:</strong> ${agency.phone}</p>
                            <p><strong>البريد:</strong> ${agency.email}</p>
                            <p><strong>الموقع:</strong> <a href="${agency.website}" target="_blank">${agency.website}</a></p>
                            <p><strong>تاريخ التأسيس:</strong> ${agency.established}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

PremiumGovernmentSearch.prototype.renderEconomy = function (results) {
    const content = document.getElementById('results-content');
    const exports = results.exports || [];
    const imports = results.imports || [];

    content.innerHTML = `
        <div class="economy-section">
            <h3>البيانات الاقتصادية</h3>

            <div class="economy-grid">
                <div class="economy-card">
                    <h4>الصادرات الرئيسية</h4>
                    <div class="trade-list">
                        ${exports.map(item => `
                            <div class="trade-item">
                                <span class="trade-product">${item.product}</span>
                                <span class="trade-value">${item.value}</span>
                                <span class="trade-percentage">${item.percentage}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="economy-card">
                    <h4>الواردات الرئيسية</h4>
                    <div class="trade-list">
                        ${imports.map(item => `
                            <div class="trade-item">
                                <span class="trade-product">${item.product}</span>
                                <span class="trade-value">${item.value}</span>
                                <span class="trade-percentage">${item.percentage}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Premium Government Search...');

    // Check if GovernmentDataManager is available
    if (typeof GovernmentDataManager === 'undefined') {
        console.error('❌ GovernmentDataManager not found!');
        console.error('🔧 Available globals:', Object.keys(window));
        return;
    }

    // Check if data-manager.js is loaded
    if (typeof premiumSearch === 'undefined') {
        console.log('📊 Creating new PremiumGovernmentSearch instance...');
        premiumSearch = new PremiumGovernmentSearch();
        console.log('✅ PremiumGovernmentSearch created successfully');
        console.log('📊 Available countries:', premiumSearch.dataManager.getCountryCount());
    } else {
        console.log('✅ PremiumGovernmentSearch already exists');
    }
});
