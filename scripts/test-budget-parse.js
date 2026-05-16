#!/usr/bin/env node
/**
 * Smoke tests for lib/budget-import-parse.js (no extra test runner).
 * Run: npm test
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { parseBudgetFile, parseMatrix } = require('../lib/budget-import-parse');

let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log('ok:', name);
  } catch (e) {
    failed++;
    console.error('FAIL:', name);
    console.error(e && e.stack ? e.stack : e);
  }
}

test('budget-template.csv parses and rolls up scenarios', () => {
  const p = path.join(__dirname, '..', 'budget-template.csv');
  const b = fs.readFileSync(p);
  const o = parseBudgetFile(b, 'budget-template.csv');
  assert.strictEqual(o.ok, true, 'expected ok');
  assert.ok(o.lineItems.length >= 3, 'line items');
  assert.strictEqual(o.primaryScenario, 'actual');
  assert.ok(Math.abs((o.rollup.revenue.actual || 0) - 118000) < 1, 'rev actual');
  assert.ok(Object.keys(o.byPeriod).includes('Q1'), 'period Q1');
});

test('missing type column yields error', () => {
  const csv = 'category,amount\nRent,1000\n';
  const o = parseBudgetFile(Buffer.from(csv, 'utf8'), 'bad.csv');
  assert.strictEqual(o.ok, false);
  assert.ok(o.errors.some((e) => /type|amount/i.test(e)));
});

test('single-scenario file: primaryScenario matches that scenario', () => {
  const csv = [
    'category,type,amount,scenario',
    'A,revenue,100,approved',
    'B,expense,40,approved'
  ].join('\n');
  const o = parseBudgetFile(Buffer.from(csv, 'utf8'), 'one.csv');
  assert.strictEqual(o.ok, true);
  assert.strictEqual(o.primaryScenario, 'approved');
  assert.strictEqual(o.revenues.length, 1);
  assert.strictEqual(o.expenses.length, 1);
});

test('parseMatrix aggregates by scenario', () => {
  const matrix = [
    ['category', 'type', 'amount', 'scenario'],
    ['x', 'revenue', '10', 'forecast'],
    ['y', 'expense', '5', 'forecast']
  ];
  const errors = [];
  const warnings = [];
  const { lineItems, rollup } = parseMatrix(matrix, errors, warnings);
  assert.strictEqual(errors.length, 0);
  assert.strictEqual(lineItems.length, 2);
  assert.strictEqual(rollup.revenue.forecast, 10);
  assert.strictEqual(rollup.expense.forecast, 5);
});

if (failed) {
  process.exit(1);
}
