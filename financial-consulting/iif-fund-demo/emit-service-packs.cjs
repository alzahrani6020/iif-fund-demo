'use strict';
var fs = require('fs');
var path = require('path');

var dir = __dirname;

function emit(letter, modPaths) {
  var P = {};
  for (var i = 0; i < modPaths.length; i++) {
    var chunk = require(modPaths[i]);
    for (var code in chunk) {
      if (Object.prototype.hasOwnProperty.call(chunk, code)) {
        P[code] = chunk[code];
      }
    }
  }
  var body =
    '(function(){\n' +
    '  var P = ' +
    JSON.stringify(P, null, 2) +
    ';\n' +
    '  window.IIF_SERVICE_PACKS = window.IIF_SERVICE_PACKS || {};\n' +
    '  for (var k in P) { if (P.hasOwnProperty(k)) window.IIF_SERVICE_PACKS[k] = P[k]; }\n' +
    '})();\n';
  fs.writeFileSync(path.join(dir, 'i18n-service-packs-' + letter + '.js'), body, 'utf8');
}

emit('a', [path.join(dir, 'pack-data-a.cjs')]);
emit('b', [path.join(dir, 'pack-data-b.cjs')]);
emit('c', [
  path.join(dir, 'pack-data-c.cjs'),
  path.join(dir, 'pack-data-c-rest.cjs'),
  path.join(dir, 'pack-data-c-final.cjs'),
  path.join(dir, 'pack-data-c-id-ms.cjs')
]);
emit('d', [
  path.join(dir, 'pack-data-d.cjs'),
  path.join(dir, 'pack-data-d-rest.cjs'),
  path.join(dir, 'pack-data-d-more.cjs'),
  path.join(dir, 'pack-data-d-last.cjs')
]);

function emitMergedAll() {
  var modPaths = [
    path.join(dir, 'pack-data-a.cjs'),
    path.join(dir, 'pack-data-b.cjs'),
    path.join(dir, 'pack-data-c.cjs'),
    path.join(dir, 'pack-data-c-rest.cjs'),
    path.join(dir, 'pack-data-c-final.cjs'),
    path.join(dir, 'pack-data-c-id-ms.cjs'),
    path.join(dir, 'pack-data-d.cjs'),
    path.join(dir, 'pack-data-d-rest.cjs'),
    path.join(dir, 'pack-data-d-more.cjs'),
    path.join(dir, 'pack-data-d-last.cjs')
  ];
  var P = {};
  for (var i = 0; i < modPaths.length; i++) {
    var chunk = require(modPaths[i]);
    for (var code in chunk) {
      if (Object.prototype.hasOwnProperty.call(chunk, code)) {
        P[code] = chunk[code];
      }
    }
  }
  var body =
    '/* Merged service packs — one HTTP request; regenerate: node emit-service-packs.cjs */\n' +
    '(function(){\n' +
    '  var P = ' +
    JSON.stringify(P, null, 2) +
    ';\n' +
    '  window.IIF_SERVICE_PACKS = window.IIF_SERVICE_PACKS || {};\n' +
    '  for (var k in P) { if (P.hasOwnProperty(k)) window.IIF_SERVICE_PACKS[k] = P[k]; }\n' +
    '})();\n';
  fs.writeFileSync(path.join(dir, 'i18n-service-packs-all.js'), body, 'utf8');
}

emitMergedAll();
