// Backend Server for Government Search System
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const { parseBudgetFile } = require('./lib/budget-import-parse');

const app = express();
const budgetUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 8 * 1024 * 1024 }
});
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Database Setup
const db = new sqlite3.Database('./government_data.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize Database Tables
function initializeDatabase() {
    // Users table for authentication
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Countries table
    db.run(`CREATE TABLE IF NOT EXISTS countries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name_ar TEXT NOT NULL,
        name_en TEXT NOT NULL,
        capital_ar TEXT NOT NULL,
        capital_en TEXT NOT NULL,
        region_ar TEXT NOT NULL,
        region_en TEXT NOT NULL,
        population TEXT NOT NULL,
        currency_ar TEXT NOT NULL,
        currency_en TEXT NOT NULL,
        language_ar TEXT NOT NULL,
        language_en TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Leadership table
    db.run(`CREATE TABLE IF NOT EXISTS leadership (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        country_id INTEGER,
        name_ar TEXT NOT NULL,
        name_en TEXT NOT NULL,
        title_ar TEXT NOT NULL,
        title_en TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        FOREIGN KEY (country_id) REFERENCES countries (id)
    )`);

    // Ministries table
    db.run(`CREATE TABLE IF NOT EXISTS ministries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        country_id INTEGER,
        name_ar TEXT NOT NULL,
        name_en TEXT NOT NULL,
        minister_ar TEXT NOT NULL,
        minister_en TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        website TEXT NOT NULL,
        FOREIGN KEY (country_id) REFERENCES countries (id)
    )`);

    // Executive Agencies table
    db.run(`CREATE TABLE IF NOT EXISTS executive_agencies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        country_id INTEGER,
        name_ar TEXT NOT NULL,
        name_en TEXT NOT NULL,
        responsibility_ar TEXT NOT NULL,
        responsibility_en TEXT NOT NULL,
        director_ar TEXT NOT NULL,
        director_en TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        website TEXT NOT NULL,
        FOREIGN KEY (country_id) REFERENCES countries (id)
    )`);

    // Executive Offices table
    db.run(`CREATE TABLE IF NOT EXISTS executive_offices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        country_id INTEGER,
        name_ar TEXT NOT NULL,
        name_en TEXT NOT NULL,
        responsibility_ar TEXT NOT NULL,
        responsibility_en TEXT NOT NULL,
        chief_ar TEXT NOT NULL,
        chief_en TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        website TEXT NOT NULL,
        FOREIGN KEY (country_id) REFERENCES countries (id)
    )`);

    // Exports and Imports table
    db.run(`CREATE TABLE IF NOT EXISTS trade_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        country_id INTEGER,
        type TEXT NOT NULL, -- 'export' or 'import'
        item_ar TEXT NOT NULL,
        item_en TEXT NOT NULL,
        FOREIGN KEY (country_id) REFERENCES countries (id)
    )`);

    console.log('Database tables initialized');
    insertSampleData();
}

// Insert Sample Data
function insertSampleData() {
    // Check if data already exists
    db.get("SELECT COUNT(*) as count FROM countries", (err, row) => {
        if (err || row.count > 0) return;

        // Insert Saudi Arabia
        db.run(`INSERT INTO countries (name_ar, name_en, capital_ar, capital_en, region_ar, region_en, population, currency_ar, currency_en, language_ar, language_en) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            'المملكة العربية السعودية', 'Kingdom of Saudi Arabia',
            'الرياض', 'Riyadh',
            'الشرق الأوسط', 'Middle East',
            '34.8 مليون', '34.8 million',
            'ريال سعودي', 'Saudi Riyal',
            'العربية', 'Arabic'
        ], function(err) {
            if (err) return;
            const saudiId = this.lastID;

            // Insert Leadership
            const leadership = [
                ['الملك سلمان بن عبدالعزيز', 'King Salman bin Abdulaziz', 'ملك المملكة العربية السعودية', 'King of Saudi Arabia', '+966-1-4055555', 'royalcourt@royalcourt.gov.sa'],
                ['الأمير محمد بن سلمان', 'Crown Prince Mohammed bin Salman', 'ولي العهد ورئيس مجلس الوزراء', 'Crown Prince and Prime Minister', '+966-1-4055555', 'crownprince@royalcourt.gov.sa']
            ];

            leadership.forEach(leader => {
                db.run(`INSERT INTO leadership (country_id, name_ar, name_en, title_ar, title_en, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                    [saudiId, ...leader]);
            });

            // Insert Ministries
            const ministries = [
                ['وزارة الخارجية', 'Ministry of Foreign Affairs', 'الأمير فيصل بن فرحان', 'Prince Faisal bin Farhan', '+966-1-4055555', 'info@mofa.gov.sa', 'www.mofa.gov.sa'],
                ['وزارة الداخلية', 'Ministry of Interior', 'الأمير عبدالعزيز بن سعود', 'Prince Abdulaziz bin Saud', '+966-1-4055555', 'info@moi.gov.sa', 'www.moi.gov.sa']
            ];

            ministries.forEach(ministry => {
                db.run(`INSERT INTO ministries (country_id, name_ar, name_en, minister_ar, minister_en, phone, email, website) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
                    [saudiId, ...ministry]);
            });

            // Insert Trade Data
            const exports = ['النفط', 'Oil', 'البتروكيماويات', 'Petrochemicals', 'الغاز الطبيعي', 'Natural Gas'];
            const imports = ['السيارات', 'Cars', 'الآلات', 'Machinery', 'الأغذية', 'Food'];

            for (let i = 0; i < exports.length; i += 2) {
                db.run(`INSERT INTO trade_data (country_id, type, item_ar, item_en) VALUES (?, 'export', ?, ?)`, [saudiId, exports[i], exports[i+1]]);
                db.run(`INSERT INTO trade_data (country_id, type, item_ar, item_en) VALUES (?, 'import', ?, ?)`, [saudiId, imports[i], imports[i+1]]);
            }
        });
    });
}

// Authentication Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

// Admin Middleware
function requireAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
}

// API Routes

// Authentication
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`, 
            [username, email, hashedPassword], function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ error: 'Username or email already exists' });
                    }
                    return res.status(500).json({ error: 'Database error' });
                }

                const token = jwt.sign({ id: this.lastID, username, role: 'user' }, JWT_SECRET);
                res.json({ token, user: { id: this.lastID, username, role: 'user' } });
            });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        db.get(`SELECT * FROM users WHERE username = ? OR email = ?`, [username, username], async (err, user) => {
            if (err || !user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET);
            res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Search Countries
app.get('/api/countries/search', (req, res) => {
    const query = req.query.q;
    const lang = req.query.lang || 'ar';

    if (!query) {
        return res.status(400).json({ error: 'Search query required' });
    }

    const nameField = lang === 'ar' ? 'name_ar' : 'name_en';
    
    db.get(`SELECT * FROM countries WHERE ${nameField} LIKE ?`, [`%${query}%`], (err, country) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (!country) {
            return res.status(404).json({ error: 'Country not found' });
        }

        // Get related data
        const result = { basicInfo: country };

        // Get leadership
        db.all(`SELECT * FROM leadership WHERE country_id = ?`, [country.id], (err, leadership) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            result.leadership = leadership;

            // Get ministries
            db.all(`SELECT * FROM ministries WHERE country_id = ?`, [country.id], (err, ministries) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                result.ministries = ministries;

                // Get executive agencies
                db.all(`SELECT * FROM executive_agencies WHERE country_id = ?`, [country.id], (err, agencies) => {
                    if (err) return res.status(500).json({ error: 'Database error' });
                    result.executiveAgencies = agencies;

                    // Get executive offices
                    db.all(`SELECT * FROM executive_offices WHERE country_id = ?`, [country.id], (err, offices) => {
                        if (err) return res.status(500).json({ error: 'Database error' });
                        result.executiveOffices = offices;

                        // Get trade data
                        db.all(`SELECT * FROM trade_data WHERE country_id = ?`, [country.id], (err, trade) => {
                            if (err) return res.status(500).json({ error: 'Database error' });
                            
                            result.exports = trade.filter(item => item.type === 'export');
                            result.imports = trade.filter(item => item.type === 'import');

                            res.json(result);
                        });
                    });
                });
            });
        });
    });
});

/** Budget import: CSV/Excel validation + approved/actual/forecast rollups (SME / multi-country templates). */
app.post('/api/budget/parse', budgetUpload.single('file'), (req, res) => {
    if (!req.file || !req.file.buffer) {
        return res.status(400).json({ ok: false, errors: ['No file uploaded'], warnings: [] });
    }
    try {
        const out = parseBudgetFile(req.file.buffer, req.file.originalname || 'budget');
        res.status(out.ok ? 200 : 400).json(out);
    } catch (e) {
        res.status(500).json({ ok: false, errors: [String(e.message || e)], warnings: [] });
    }
});

// Get all countries (for dropdown)
app.get('/api/countries', (req, res) => {
    const lang = req.query.lang || 'ar';
    const nameField = lang === 'ar' ? 'name_ar' : 'name_en';
    
    db.all(`SELECT id, ${nameField} as name FROM countries ORDER BY name`, (err, countries) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(countries);
    });
});

// Admin only routes
app.post('/api/countries', authenticateToken, requireAdmin, (req, res) => {
    const country = req.body;
    
    db.run(`INSERT INTO countries (name_ar, name_en, capital_ar, capital_en, region_ar, region_en, population, currency_ar, currency_en, language_ar, language_en) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
        country.name_ar, country.name_en, country.capital_ar, country.capital_en,
        country.region_ar, country.region_en, country.population, country.currency_ar, country.currency_en,
        country.language_ar, country.language_en
    ], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ id: this.lastID, ...country });
    });
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('API endpoints:');
    console.log('  POST /api/auth/register - Register new user');
    console.log('  POST /api/auth/login - Login user');
    console.log('  GET /api/countries/search?q=country&lang=ar - Search country');
    console.log('  GET /api/countries?lang=ar - Get all countries');
    console.log('  POST /api/countries - Add country (admin only)');
    console.log('  POST /api/budget/parse - Parse & validate budget CSV/Excel (multipart field: file)');
});

// Error handling
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});
