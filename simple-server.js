// Simple Server for Government Search System (No Dependencies Required)
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

// MIME Types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
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

// API Routes
function handleAPIRequest(req, res, pathname, query) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (pathname === '/api/countries/search') {
        const countryName = query.q;
        const lang = query.lang || 'ar';

        if (!countryName) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Search query required' }));
            return;
        }

        const results = governmentData[countryName];
        
        if (!results) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Country not found' }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results));
        return;
    }

    if (pathname === '/api/countries') {
        const lang = query.lang || 'ar';
        const countries = Object.keys(governmentData).map(name => ({
            name: name
        }));
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(countries));
        return;
    }

    // Default API response
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'API endpoint not found' }));
}

// Static file serving
function serveStaticFile(req, res, pathname) {
    const filePath = path.join(__dirname, pathname);
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code === 'ENOENT') {
                // Try serving index.html for root
                if (pathname === '/') {
                    fs.readFile(path.join(__dirname, 'index.html'), function(error, content) {
                        if (error) {
                            res.writeHead(404, { 'Content-Type': 'text/html' });
                            res.end('<h1>404 Not Found</h1><p>No index file found</p>', 'utf-8');
                        } else {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.end(content, 'utf-8');
                        }
                    });
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end('<h1>404 Not Found</h1><p>File not found: ' + pathname + '</p>', 'utf-8');
                }
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(content, 'utf-8');
        }
    });
}

// Create HTTP Server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    console.log(`${new Date().toISOString()} - ${req.method} ${pathname}`);

    // Handle API requests
    if (pathname.startsWith('/api/')) {
        handleAPIRequest(req, res, pathname, query);
        return;
    }

    // Handle static files
    serveStaticFile(req, res, pathname === '/' ? '/' : pathname);
});

// Start Server
server.listen(PORT, () => {
    console.log(`🚀 Government Search Server running on http://localhost:${PORT}`);
    console.log('');
    console.log('📁 Available files:');
    console.log('  / - Main page (index.html)');
    console.log('  /styles.css - Stylesheet');
    console.log('  /script-backend.js - Frontend JavaScript');
    console.log('');
    console.log('🔍 API endpoints:');
    console.log('  GET /api/countries/search?q=country&lang=ar - Search country');
    console.log('  GET /api/countries?lang=ar - Get all countries');
    console.log('');
    console.log('✨ Features:');
    console.log('  ✅ Bilingual support (Arabic/English)');
    console.log('  ✅ Government data search');
    console.log('  ✅ Responsive design');
    console.log('  ✅ No external dependencies');
    console.log('');
});

// Error handling
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please use a different port.`);
    } else {
        console.error('❌ Server error:', err);
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

console.log('🌐 Starting Government Search System...');
