import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const code = fs.readFileSync(new URL('../dist/offer.js', import.meta.url), 'utf8');
let now = Date.parse('2026-11-15T23:59:59+08:00');
const elements = [{ hidden: true }, { hidden: true }];
const listeners = {};
let scheduled;
const window = { addEventListener: (event, fn) => listeners[event] = fn };
vm.runInNewContext(code, {
  window, Date: { parse: Date.parse, now: () => now },
  document: { querySelectorAll: () => elements, addEventListener: (event, fn) => listeners[event] = fn },
  clearTimeout() {}, setTimeout(fn, delay) { scheduled = { fn, delay }; }
});
assert.ok(elements.every(el => !el.hidden), 'Offer visible through November 15');
assert.equal(scheduled.delay, 1000);
now += 1000;
scheduled.fn();
assert.ok(elements.every(el => el.hidden), 'Offer expires at Taiwan midnight');
elements.push({ hidden: false });
window.syncNewStudentOffer();
assert.ok(elements.every(el => el.hidden), 'Re-rendered course cards also expire');
listeners.pageshow();
listeners.visibilitychange();
assert.ok(elements.every(el => el.hidden), 'Restored and background tabs remain expired');
console.log('Offer expiration passed: Taiwan midnight, rendered cards, restored tabs.');
