/**
 * Server-side budget file parse + validation for SMEs / multi-country use.
 * Supports CSV and Excel (first sheet). Required: category, type, amount.
 * Optional: period, scenario (approved|actual|forecast), currency.
 */
'use strict';

const XLSX = require('xlsx');

function normHeader(s) {
  return String(s == null ? '' : s)
    .replace(/^\ufeff/g, '')
    .trim()
    .toLowerCase();
}

function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQ = !inQ;
      continue;
    }
    if (!inQ && ch === ',') {
      out.push(cur.trim());
      cur = '';
      continue;
    }
    cur += ch;
  }
  out.push(cur.trim());
  return out;
}

function normalizeScenario(raw) {
  const s = normHeader(raw);
  if (!s) return 'actual';
  if (/^approved|budget|معتمد|ميزانية\s*معتمدة/.test(s)) return 'approved';
  if (/^forecast|projected|متوقع|تقدير/.test(s)) return 'forecast';
  if (/^actual|فعلي|تحقق/.test(s)) return 'actual';
  return 'actual';
}

function normalizeType(raw) {
  const t = normHeader(raw);
  if (/revenue|rev\b|إيراد|ايراد|income/.test(t)) return 'revenue';
  if (/expense|exp\b|مصروف|^cost/.test(t)) return 'expense';
  return null;
}

function parseAmount(raw) {
  if (typeof raw === 'number' && !Number.isNaN(raw)) return raw;
  const n = parseFloat(String(raw).replace(/[^\d.-]/g, ''));
  return Number.isNaN(n) ? NaN : n;
}

function findColIndex(headers, names) {
  for (let j = 0; j < headers.length; j++) {
    const h = headers[j];
    for (const n of names) {
      if (h === n || h === n.toLowerCase()) return j;
    }
  }
  return -1;
}

function matrixFromCsv(buffer) {
  const text = buffer.toString('utf8').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = text.split('\n').filter((l) => l.trim().length);
  return lines.map((l) => parseCsvLine(l));
}

function matrixFromXlsx(buffer) {
  const wb = XLSX.read(buffer, { type: 'buffer' });
  const first = wb.SheetNames[0];
  if (!first) return [];
  const sheet = wb.Sheets[first];
  return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
}

function parseMatrix(matrix, errors, warnings) {
  if (!matrix || matrix.length < 2) {
    errors.push('File has no data rows.');
    return { lineItems: [], rollup: emptyRollup(), byPeriod: {} };
  }

  const headerRow = matrix[0].map(normHeader);
  const catIdx = findColIndex(headerRow, ['category', 'item', 'account', 'بند', 'description', 'name']);
  const typeIdx = findColIndex(headerRow, ['type', 'نوع', 'kind']);
  const amtIdx = findColIndex(headerRow, ['amount', 'مبلغ', 'value']);
  const periodIdx = findColIndex(headerRow, ['period', 'فترة', 'month', 'quarter', 'year']);
  const scenIdx = findColIndex(headerRow, ['scenario', 'سيناريو', 'version', 'نوع_الميزانية']);
  const curIdx = findColIndex(headerRow, ['currency', 'عملة', 'ccy']);

  if (typeIdx < 0 || amtIdx < 0) {
    errors.push('Missing required columns: need "type" and "amount" (and recommended "category").');
    return { lineItems: [], rollup: emptyRollup(), byPeriod: {} };
  }

  if (catIdx < 0) {
    warnings.push('No "category" column — using "—" for line labels.');
  }

  const lineItems = [];
  const rollup = emptyRollup();
  const byPeriod = {};
  const currencies = new Set();

  for (let r = 1; r < matrix.length; r++) {
    const row = matrix[r];
    if (!row || !row.length) continue;
    const tRaw = row[typeIdx];
    const type = normalizeType(tRaw);
    const amt = parseAmount(row[amtIdx]);
    if (type == null) {
      const s = String(tRaw || '').trim();
      if (s) errors.push(`Row ${r + 1}: invalid type "${s}" (use revenue or expense).`);
      continue;
    }
    if (Number.isNaN(amt)) {
      errors.push(`Row ${r + 1}: invalid amount.`);
      continue;
    }

    const category = catIdx >= 0 ? String(row[catIdx] != null ? row[catIdx] : '').trim() || '—' : '—';
    const period = periodIdx >= 0 ? String(row[periodIdx] != null ? row[periodIdx] : '').trim() || '' : '';
    const scenario = scenIdx >= 0 ? normalizeScenario(row[scenIdx]) : 'actual';
    const currency = curIdx >= 0 ? String(row[curIdx] != null ? row[curIdx] : '').trim().toUpperCase().slice(0, 8) || '' : '';

    if (currency) currencies.add(currency);

    lineItems.push({ category, type, amount: amt, period, scenario, currency });

    const side = type === 'revenue' ? 'revenue' : 'expense';
    if (!rollup[side][scenario]) rollup[side][scenario] = 0;
    rollup[side][scenario] += amt;

    const pKey = period || '_all';
    if (!byPeriod[pKey]) {
      byPeriod[pKey] = {
        revenue: { approved: 0, actual: 0, forecast: 0 },
        expense: { approved: 0, actual: 0, forecast: 0 }
      };
    }
    byPeriod[pKey][side][scenario] = (byPeriod[pKey][side][scenario] || 0) + amt;
  }

  if (currencies.size > 1) {
    warnings.push('Multiple currencies detected — totals assume you will reconcile FX separately.');
  }

  if (lineItems.length === 0 && errors.length === 0) {
    errors.push('No valid data rows found.');
  }

  return { lineItems, rollup, byPeriod, currencies: [...currencies] };
}

function emptyRollup() {
  return {
    revenue: { approved: 0, actual: 0, forecast: 0 },
    expense: { approved: 0, actual: 0, forecast: 0 }
  };
}

function buildLegacyArrays(lineItems) {
  const scenarios = new Set(lineItems.map((r) => r.scenario || 'actual'));
  let pick = 'actual';
  if (scenarios.size === 1 && lineItems.length) {
    pick = lineItems[0].scenario || 'actual';
  } else if (scenarios.size > 1 && !lineItems.some((r) => r.scenario === 'actual')) {
    if (lineItems.some((r) => r.scenario === 'approved')) pick = 'approved';
    else if (lineItems.some((r) => r.scenario === 'forecast')) pick = 'forecast';
  }
  const rev = [];
  const exp = [];
  for (const row of lineItems) {
    if (scenarios.size > 1 && row.scenario !== pick) continue;
    if (row.type === 'revenue') rev.push(row.amount);
    else if (row.type === 'expense') exp.push(row.amount);
  }
  return { revenues: rev, expenses: exp, primaryScenario: pick };
}

/**
 * @param {Buffer} buffer
 * @param {string} originalName
 */
function parseBudgetFile(buffer, originalName) {
  const errors = [];
  const warnings = [];
  const name = String(originalName || '').toLowerCase();

  let matrix;
  try {
    if (/\.(csv|txt)$/i.test(name)) {
      matrix = matrixFromCsv(buffer);
    } else if (/\.(xlsx|xls)$/i.test(name)) {
      matrix = matrixFromXlsx(buffer);
    } else {
      return {
        ok: false,
        errors: ['Unsupported format. Use CSV or Excel (.csv, .xlsx, .xls).'],
        warnings: [],
        lineItems: [],
        rollup: emptyRollup(),
        byPeriod: {},
        revenues: [],
        expenses: []
      };
    }
  } catch (e) {
    return {
      ok: false,
      errors: [`Parse error: ${e.message || e}`],
      warnings: [],
      lineItems: [],
      rollup: emptyRollup(),
      byPeriod: {},
      revenues: [],
      expenses: []
    };
  }

  const { lineItems, rollup, byPeriod, currencies } = parseMatrix(matrix, errors, warnings);
  const ok = errors.length === 0 && lineItems.length > 0;
  const legacy = buildLegacyArrays(lineItems);

  return {
    ok,
    errors,
    warnings,
    lineItems,
    rollup,
    byPeriod,
    currencies,
    revenues: legacy.revenues,
    expenses: legacy.expenses,
    primaryScenario: legacy.primaryScenario,
    validatedAt: new Date().toISOString()
  };
}

module.exports = { parseBudgetFile, parseMatrix, normalizeScenario, normalizeType };
