// Regression tests for the Module 1 Try it checker (checker results only; see compile_valid.js for pdflatex).
// Run: node tests/t1_regression.js   (needs Node and Playwright)
const { chromium } = require('playwright');
const path = require('path');
const { wrap, VALID, BROKEN, AFTER_END } = require('./cases.js');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.resolve(__dirname, '../tryit/t1-structure-errors.html'));
  let fail = 0;
  for (const [name, body] of VALID) {
    const W = await p.evaluate(src => window.T1.analyze(src).W, wrap(body));
    if (W.length) { fail++; console.log('FAIL valid:', name, JSON.stringify(W.map(w => w.sev + ': ' + w.m))); }
  }
  for (const [name, body, expect] of BROKEN) {
    const W = await p.evaluate(src => window.T1.analyze(src).W, wrap(body));
    if (!W.some(w => w.m.includes(expect))) { fail++; console.log('FAIL broken:', name, JSON.stringify(W.map(w => w.m))); }
  }
  const ae = await p.evaluate(src => { const r = window.T1.analyze(src); return { W: r.W, secs: r.secs.map(s => s.t) }; }, AFTER_END);
  if (ae.W.length !== 1 || ae.W[0].sev !== 'check' || !ae.W[0].m.includes('ignored') || ae.secs.includes('Unused notes')) {
    fail++; console.log('FAIL after end:', JSON.stringify(ae));
  }
  const good = await p.evaluate(() => window.T1.analyze(document.getElementById('src').value).W);
  if (good.length) { fail++; console.log('FAIL: good example has issues', JSON.stringify(good)); }
  await p.click('#broken');
  const bad = await p.evaluate(() => window.T1.analyze(document.getElementById('src').value).W.map(w => w.sev));
  console.log('broken example:', bad.filter(x => x === 'error').length, 'errors,', bad.filter(x => x === 'check').length, 'checks');
  console.log(`checker: valid ${VALID.length}, broken ${BROKEN.length}, after-end 1, failures ${fail}, page errors ${errs.length}`);
  await b.close(); process.exit(fail || errs.length ? 1 : 0);
})();
