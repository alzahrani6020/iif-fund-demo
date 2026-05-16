// Comprehensive Government Search JavaScript

// Global Variables
let currentLang = 'ar';
let globalData = {};
let translations = {};

// Translations
const translationsData = {
    ar: {
        title: 'البحث الحكومي العالمي الشامل',
        searchPlaceholder: 'ابحث عن دولة...',
        selectCountry: 'اختر الدولة',
        search: 'بحث',
        searching: 'جاري البحث...',
        notFound: 'لم يتم العثور على معلومات',
        tryCountries: 'جرب: السعودية، الإمارات، مصر، الأردن',
        basicInfo: 'المعلومات الأساسية',
        leadership: 'القيادة',
        ministries: 'الوزارات',
        executiveAgencies: 'الوكالات التنفيذية',
        executiveOffices: 'المكاتب التنفيذية',
        executiveDashboard: 'لوحة التحكم التنفيذية',
        exports: 'الصادرات',
        imports: 'الواردات',
        population: 'السكان',
        currency: 'العملة',
        language: 'اللغة',
        globalSearch: 'بحث عالمي',
        globalSearchPlaceholder: 'اكتب اسم الدولة للبحث...'
    },
    en: {
        title: 'Comprehensive Government Search',
        searchPlaceholder: 'Search for a country...',
        selectCountry: 'Select Country',
        search: 'Search',
        searching: 'Searching...',
        notFound: 'No information found',
        tryCountries: 'Try: Saudi Arabia, UAE, Egypt, Jordan',
        basicInfo: 'Basic Information',
        leadership: 'Leadership',
        ministries: 'Ministries',
        executiveAgencies: 'Executive Agencies',
        executiveOffices: 'Executive Offices',
        executiveDashboard: 'Executive Dashboard',
        exports: 'Exports',
        imports: 'Imports',
        population: 'Population',
        currency: 'Currency',
        language: 'Language',
        globalSearch: 'Global Search',
        globalSearchPlaceholder: 'Type country name to search...'
    }
};

// Sample Government Data
const governmentData = {
    'السعودية': {
        basicInfo: {
            name: 'المملكة العربية السعودية',
            capital: 'الرياض',
            region: 'الشرق الأوسط',
            population: '34.8 مليون',
            currency: 'ريال سعودي',
            language: 'العربية'
        },
        leadership: [
            {
                name: 'الملك سلمان بن عبدالعزيز',
                title: 'ملك المملكة العربية السعودية',
                phone: '+966-1-4055555',
                email: 'royalcourt@royalcourt.gov.sa'
            },
            {
                name: 'الأمير محمد بن سلمان',
                title: 'ولي العهد ورئيس مجلس الوزراء',
                phone: '+966-1-4055555',
                email: 'crownprince@royalcourt.gov.sa'
            }
        ],
        ministries: [
            {
                name: 'وزارة الخارجية',
                minister: 'الأمير فيصل بن فرحان',
                phone: '+966-1-4055555',
                email: 'info@mofa.gov.sa',
                website: 'www.mofa.gov.sa'
            },
            {
                name: 'وزارة الداخلية',
                minister: 'الأمير عبدالعزيز بن سعود',
                phone: '+966-1-4055555',
                email: 'info@moi.gov.sa',
                website: 'www.moi.gov.sa'
            }
        ],
        executiveAgencies: [
            {
                name: 'هيئة تطوير الرياض',
                responsibility: 'تطوير مدينة الرياض',
                director: 'الأمير محمد بن عبدالرحمن',
                phone: '+966-1-4055555',
                email: 'info@rcrc.gov.sa',
                website: 'www.rcrc.gov.sa'
            }
        ],
        executiveOffices: [
            {
                name: 'مجلس الشؤون الاقتصادية',
                responsibility: 'تنسيق السياسات الاقتصادية',
                chief: 'الأمير محمد بن سلمان',
                phone: '+966-1-4055555',
                email: 'info@cea.gov.sa',
                website: 'www.cea.gov.sa'
            }
        ],
        exports: ['النفط', 'البتروكيماويات', 'الغاز الطبيعي'],
        imports: ['السيارات', 'الآلات', 'الأغذية']
    },
    'Saudi Arabia': {
        basicInfo: {
            name: 'Kingdom of Saudi Arabia',
            capital: 'Riyadh',
            region: 'Middle East',
            population: '34.8 million',
            currency: 'Saudi Riyal',
            language: 'Arabic'
        },
        leadership: [
            {
                name: 'King Salman bin Abdulaziz',
                title: 'King of Saudi Arabia',
                phone: '+966-1-4055555',
                email: 'royalcourt@royalcourt.gov.sa'
            },
            {
                name: 'Crown Prince Mohammed bin Salman',
                title: 'Crown Prince and Prime Minister',
                phone: '+966-1-4055555',
                email: 'crownprince@royalcourt.gov.sa'
            }
        ],
        ministries: [
            {
                name: 'Ministry of Foreign Affairs',
                minister: 'Prince Faisal bin Farhan',
                phone: '+966-1-4055555',
                email: 'info@mofa.gov.sa',
                website: 'www.mofa.gov.sa'
            },
            {
                name: 'Ministry of Interior',
                minister: 'Prince Abdulaziz bin Saud',
                phone: '+966-1-4055555',
                email: 'info@moi.gov.sa',
                website: 'www.moi.gov.sa'
            }
        ],
        executiveAgencies: [
            {
                name: 'Royal Commission for Riyadh City',
                responsibility: 'Development of Riyadh City',
                director: 'Prince Mohammed bin Abdulrahman',
                phone: '+966-1-4055555',
                email: 'info@rcrc.gov.sa',
                website: 'www.rcrc.gov.sa'
            }
        ],
        executiveOffices: [
            {
                name: 'Council of Economic Affairs',
                responsibility: 'Economic policy coordination',
                chief: 'Crown Prince Mohammed bin Salman',
                phone: '+966-1-4055555',
                email: 'info@cea.gov.sa',
                website: 'www.cea.gov.sa'
            }
        ],
        exports: ['Oil', 'Petrochemicals', 'Natural Gas'],
        imports: ['Cars', 'Machinery', 'Food']
    }
};

// Initialize Application
function initApp() {
    // Load saved language preference
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && ['ar', 'en'].includes(savedLang)) {
        currentLang = savedLang;
    }

    // Set language direction
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

    // Load translations
    translations = translationsData[currentLang];

    // Load data
    globalData = governmentData;

    // Setup event listeners
    setupEventListeners();

    // Update UI
    updateUI();

    console.log('✅ Comprehensive government search loaded successfully!');
    console.log('🔍 Press Ctrl+K for quick global search');
}

// Setup Event Listeners
function setupEventListeners() {
    // Search input event
    const countrySearch = document.getElementById('country-search');
    if (countrySearch) {
        countrySearch.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                searchCountry(e.target.value);
            }
        });
    }

    // Country dropdown event
    const countryDropdown = document.getElementById('country-dropdown');
    if (countryDropdown) {
        countryDropdown.addEventListener('change', function (e) {
            searchCountry(e.target.value);
        });
    }

    // Search button event
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function () {
            const searchInput = document.getElementById('country-search');
            if (searchInput) {
                searchCountry(searchInput.value);
            }
        });
    }
}

// Update UI with current language
function updateUI() {
    const t = translations;

    // Update page title
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        pageTitle.textContent = t.title;
    }

    // Update search placeholder
    const searchInput = document.getElementById('country-search');
    if (searchInput) {
        searchInput.placeholder = t.searchPlaceholder;
    }

    // Update search button
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.textContent = t.search;
    }

    // Update global search placeholder
    const globalSearchInput = document.getElementById('global-search-input');
    if (globalSearchInput) {
        globalSearchInput.placeholder = t.globalSearchPlaceholder;
    }

    // Update language toggle
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.textContent = currentLang === 'ar' ? 'EN' : 'العربية';
    }
}

// Search Country Function
function searchCountry(countryName) {
    if (!countryName || countryName.trim() === '') {
        return;
    }

    const resultsDiv = document.getElementById('results');
    const t = translations[currentLang];
    resultsDiv.innerHTML = '<div class="loading">' + t.searching + '</div>';

    // Simulate search delay
    setTimeout(function () {
        const results = globalData[countryName];

        if (!results) {
            resultsDiv.innerHTML = '<div class="error">' + t.notFound + ' "' + countryName + '". ' + t.tryCountries + '</div>';
            return;
        }

        displayResults(results);
    }, 500);
}

// Display Results Function
function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    const t = translations[currentLang];

    var html = '<div class="country-header">' +
        '<h2>' + results.basicInfo.name + '</h2>' +
        '<p>' + results.basicInfo.capital + ' - ' + results.basicInfo.region + '</p>' +
        '</div>' +
        '<div class="tabs">' +
        '<button class="tab active" onclick="showTab(\'basic\')">' + t.basicInfo + '</button>' +
        '<button class="tab" onclick="showTab(\'leadership\')">' + t.leadership + '</button>' +
        '<button class="tab" onclick="showTab(\'ministries\')">' + t.ministries + '</button>' +
        '<button class="tab" onclick="showTab(\'executive-agencies\')">' + (currentLang === 'ar' ? 'الوكالات التنفيذية' : 'Executive Agencies') + '</button>' +
        '<button class="tab" onclick="showTab(\'executive-offices\')">' + (currentLang === 'ar' ? 'المكاتب التنفيذية' : 'Executive Offices') + '</button>' +
        '<button class="tab" onclick="showTab(\'executive-dashboard\')">' + (currentLang === 'ar' ? 'لوحة التحكم التنفيذية' : 'Executive Dashboard') + '</button>' +
        '<button class="tab" onclick="showTab(\'exports\')">' + t.exports + '</button>' +
        '<button class="tab" onclick="showTab(\'imports\')">' + t.imports + '</button>' +
        '</div>' +
        '<div id="tab-basic" class="tab-content active">' +
        '<h4>' + t.basicInfo + '</h4>' +
        '<ul>' +
        '<li><strong>' + t.population + ':</strong> ' + results.basicInfo.population + '</li>' +
        '<li><strong>' + t.currency + ':</strong> ' + results.basicInfo.currency + '</li>' +
        '<li><strong>' + t.language + ':</strong> ' + results.basicInfo.language + '</li>' +
        '</ul>' +
        '</div>' +
        '<div id="tab-leadership" class="tab-content">' +
        '<h4>' + t.leadership + '</h4>' +
        '<div class="country-grid">';

    // Add leadership
    results.leadership.forEach(function (leader) {
        html += '<div class="info-card">' +
            '<h5>' + leader.name + '</h5>' +
            '<p><strong>' + (currentLang === 'ar' ? 'المنصب' : 'Title') + ':</strong> ' + leader.title + '</p>' +
            '<div class="contact-info">' +
            '<strong>' + (currentLang === 'ar' ? 'اتصال' : 'Contact') + ':</strong><br>' +
            '📞 ' + leader.phone + '<br>' +
            '📧 <a href="mailto:' + leader.email + '">' + leader.email + '</a>' +
            '</div>' +
            '</div>';
    });

    html += '</div></div>' +
        '<div id="tab-ministries" class="tab-content">' +
        '<h4>' + t.ministries + '</h4>' +
        '<div class="country-grid">';

    // Add ministries
    results.ministries.forEach(function (ministry) {
        html += '<div class="info-card">' +
            '<h5>' + ministry.name + '</h5>' +
            '<p><strong>' + (currentLang === 'ar' ? 'الوزير' : 'Minister') + ':</strong> ' + ministry.minister + '</p>' +
            '<div class="contact-info">' +
            '<strong>' + (currentLang === 'ar' ? 'اتصال' : 'Contact') + ':</strong><br>' +
            '📞 ' + ministry.phone + '<br>' +
            '📧 <a href="mailto:' + ministry.email + '">' + ministry.email + '</a><br>' +
            '🌐 <a href="http://' + ministry.website + '" target="_blank">' + ministry.website + '</a>' +
            '</div>' +
            '</div>';
    });

    html += '</div></div>' +
        '<div id="tab-executive-agencies" class="tab-content">' +
        '<h4>' + (currentLang === 'ar' ? 'الوكالات التنفيذية' : 'Executive Agencies') + '</h4>' +
        '<div class="country-grid">';

    // Add executive agencies
    results.executiveAgencies.forEach(function (agency) {
        html += '<div class="info-card">' +
            '<h5>' + agency.name + '</h5>' +
            '<p><strong>' + (currentLang === 'ar' ? 'المسؤولية' : 'Responsibility') + ':</strong> ' + agency.responsibility + '</p>' +
            '<p><strong>' + (currentLang === 'ar' ? 'المدير' : 'Director') + ':</strong> ' + agency.director + '</p>' +
            '<div class="contact-info">' +
            '<strong>' + (currentLang === 'ar' ? 'اتصال' : 'Contact') + ':</strong><br>' +
            '📞 ' + agency.phone + '<br>' +
            '📧 <a href="mailto:' + agency.email + '">' + agency.email + '</a><br>' +
            '🌐 <a href="http://' + agency.website + '" target="_blank">' + agency.website + '</a>' +
            '</div>' +
            '</div>';
    });

    html += '</div></div>' +
        '<div id="tab-executive-offices" class="tab-content">' +
        '<h4>' + (currentLang === 'ar' ? 'المكاتب التنفيذية' : 'Executive Offices') + '</h4>' +
        '<div class="country-grid">';

    // Add executive offices
    results.executiveOffices.forEach(function (office) {
        html += '<div class="info-card">' +
            '<h5>' + office.name + '</h5>' +
            '<p><strong>' + (currentLang === 'ar' ? 'المسؤولية' : 'Responsibility') + ':</strong> ' + office.responsibility + '</p>' +
            '<p><strong>' + (currentLang === 'ar' ? 'الرئيس' : 'Chief') + ':</strong> ' + office.chief + '</p>' +
            '<div class="contact-info">' +
            '<strong>' + (currentLang === 'ar' ? 'اتصال' : 'Contact') + ':</strong><br>' +
            '📞 ' + office.phone + '<br>' +
            '📧 <a href="mailto:' + office.email + '">' + office.email + '</a><br>' +
            '🌐 <a href="http://' + office.website + '" target="_blank">' + office.website + '</a>' +
            '</div>' +
            '</div>';
    });

    html += '</div></div>' +
        '<div id="tab-executive-dashboard" class="tab-content">' +
        '<h4>' + (currentLang === 'ar' ? 'لوحة التحكم التنفيذية' : 'Executive Dashboard') + '</h4>' +
        '<div class="country-grid">' +
        '<div class="info-card">' +
        '<h5>' + (currentLang === 'ar' ? 'نظرة عامة' : 'Overview') + '</h5>' +
        '<p>' + (currentLang === 'ar' ? 'الوصول إلى جميع لوحات التحكم التنفيذية' : 'Access to all executive dashboards') + '</p>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div id="tab-exports" class="tab-content">' +
        '<h4>' + t.exports + '</h4>' +
        '<ul>';

    // Add exports
    results.exports.forEach(function (exportItem) {
        html += '<li>' + exportItem + '</li>';
    });

    html += '</ul>' +
        '</div>' +
        '<div id="tab-imports" class="tab-content">' +
        '<h4>' + t.imports + '</h4>' +
        '<ul>';

    // Add imports
    results.imports.forEach(function (importItem) {
        html += '<li>' + importItem + '</li>';
    });

    html += '</ul>' +
        '</div>';

    resultsDiv.innerHTML = html;
}

// Show Tab Function
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(function (content) {
        content.classList.remove('active');
    });

    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(function (tab) {
        tab.classList.remove('active');
    });

    // Show selected tab content
    const selectedTabContent = document.getElementById('tab-' + tabName);
    if (selectedTabContent) {
        selectedTabContent.classList.add('active');
    }

    // Add active class to clicked tab
    const selectedTab = event.target;
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
}

// Global Search Functions
function openGlobalSearch() {
    const modal = document.getElementById('global-search-modal');
    modal.classList.add('show');
    document.getElementById('global-search-input').focus();
}

function closeGlobalSearch() {
    const modal = document.getElementById('global-search-modal');
    modal.classList.remove('show');
}

function handleGlobalSearch(event) {
    if (event.key === 'Enter') {
        performGlobalSearch();
    }
}

function performGlobalSearch() {
    const searchInput = document.getElementById('global-search-input');
    const searchTerm = searchInput.value.trim();

    if (searchTerm) {
        closeGlobalSearch();
        searchCountry(searchTerm);
        searchInput.value = '';
    }
}

function quickSearch(countryName) {
    closeGlobalSearch();
    searchCountry(countryName);
}

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    updateUI();
    localStorage.setItem('preferredLanguage', currentLang);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    initApp();
});

// Close modal when clicking outside
window.onclick = function (event) {
    const modal = document.getElementById('global-search-modal');
    if (event.target === modal) {
        closeGlobalSearch();
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function (event) {
    // Ctrl/Cmd + K for global search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        openGlobalSearch();
    }
    // Escape to close modal
    if (event.key === 'Escape') {
        closeGlobalSearch();
    }
});
