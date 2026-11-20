// Tests for the Module 2 Try it tool (tryit/t2-math.html): every model answer and listed alternative
// must be accepted, harmless grouping and spacing must be accepted, near misses must be rejected, each Fix the math
// item must mark its key as right, and a verdict must clear when the answer changes.
// Run: node tests/t2_regression.js   (needs Node and Playwright)
const { chromium } = require('playwright');
const path = require('path');
const WRONG = [ // [target index, source that must NOT be accepted]
  [0, 'V = I R + 1'], [1, 'R = R_s L/W'], [2, 'n p = n_i 2'], [3, '\\sigma = q n \\mu_n + p \\mu_p'],
  [4, 'f(E) = \\frac{1}{1 + e^(E - E_F)/k_B T}'], [4, 'f(E) = \\frac{1}{1 + e^{(E - E_F)/k_B T}}'], [4, 'f(E)=\\frac{1}{1+e^{(E-E_{\\mathrm F})/k_BT}}'],
  [5, 'x_ox^2 + A x_ox = B (t + \\tau)'], [5, 'x_{ox}^2 + A x_{ox} = B (t + \\tau)'], [0, 'V = I'], [1, 'R = R_s \\frac{W}{L}'],
];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [], reqs = [];
  p.on('pageerror', e => errs.push(String(e)));
  p.on('request', r => { const u = r.url(); if (!u.startsWith('file:') && !u.startsWith('data:')) reqs.push(u); });
  await p.goto('file://' + path.resolve(__dirname, '../tryit/t2-math.html'));
  let fail = 0;
  const T = await p.evaluate(() => window.T2.TARGETS);
  const accepts = (k, s) => p.evaluate(([a, s]) => [window.T2.TARGETS[a].src].concat(window.T2.TARGETS[a].alts).some(x => window.T2.same(s, x)), [k, s]);
  // spacing and brace variants that print the same as an accepted answer must be accepted
  const VARIANTS = [
    [0, 'V=IR'], [0, 'V = I R'], [0, 'V={IR}'], [0, '{V}={I}{R}'],
    [1, 'R=R_{s}\\frac{L}{W}'], [1, 'R = R_s\\frac LW'], [1, 'R = R_s\\,\\frac{L}{W}'], [1, 'R = {R_s}\\frac{L}{W}'],
    [2, 'np=n_i^2'], [2, 'n p = n_{i}^{2}'],
    [3, '\\sigma=q(n\\mu_n+p\\mu_p)'], [3, '\\sigma = q\\left(n\\mu_n + p\\mu_p\\right)'],
    [4, 'f(E)=\\frac{1}{1+e^{(E-E_{\\mathrm F})/(k_BT)}}'], [4, 'f(E)=\\frac{1}{1+e^{\\frac{E-E_{\\mathrm{F}}}{k_B T}}}'], [4, 'f(E) = \\frac{1}{1 + e^{(E - E_F)/(k_B T)}}'], [4, 'f(E)=\\frac{1}{1+e^{{(E-E_F)}/{(k_B T)}}}'],
    [5, 'x_{\\mathrm{ox}}^{2}+Ax_{\\mathrm{ox}}=B(t+\\tau)'],
  ];
  for (let k = 0; k < T.length; k++) for (const s of [T[k].src].concat(T[k].alts)) if (!(await accepts(k, s))) { fail++; console.log('FAIL accept listed', k, s); }
  for (const [k, s] of VARIANTS) if (!(await accepts(k, s))) { fail++; console.log('FAIL accept variant', k, s); }
  for (const [k, s] of WRONG) if (await accepts(k, s)) { fail++; console.log('FAIL reject', k, s); }
  // drive the page: type each model answer and press Check
  const tg = await p.$$('.tgt');
  for (let k = 0; k < tg.length; k++) { await (await tg[k].$('input')).fill(T[k].src); await (await tg[k].$('button.checkbtn')).click(); }
  const tscore = await p.$eval('#tscore', e => e.innerText);
  if (tscore !== `Equations checked right: ${T.length} of ${T.length}.`) { fail++; console.log('FAIL tscore', tscore); }
  // a changed answer clears its verdict and leaves the count
  await (await tg[0].$('input')).fill('V=0'); await p.waitForTimeout(50);
  const fb0 = await tg[0].$eval('.fb', e => e.textContent), t2 = await p.$eval('#tscore', e => e.innerText);
  if (!fb0.startsWith('Changed') || t2 !== `Equations checked right: ${T.length - 1} of ${T.length}.`) { fail++; console.log('FAIL stale verdict', fb0, t2); }
  await (await tg[0].$('button.checkbtn')).click();
  const fb1 = await tg[0].$eval('.fb', e => e.textContent);
  if (!fb1.startsWith('This does not match a form')) { fail++; console.log('FAIL neutral wording', fb1); }
  await (await tg[0].$('input')).fill('V = \\frac{I'); await (await tg[0].$('button.checkbtn')).click();
  if (!(await tg[0].$eval('.fb', e => e.textContent)).startsWith('LaTeX would not accept')) { fail++; console.log('FAIL parse error wording'); }
  const fx = await p.$$('#fixes .item');
  const OK = [1, 2, 0, 1, 0, 2];
  for (let k = 0; k < fx.length; k++) { await fx[k].$$eval('input', (xs, v) => xs[v].click(), OK[k]); await (await fx[k].$('button')).click(); }
  const fscore = await p.$eval('#fscore', e => e.innerText);
  if (fscore !== `You have ${fx.length} of ${fx.length} right.`) { fail++; console.log('FAIL fscore', fscore); }
  await fx[0].$$eval('input', xs => xs[0].click());
  if (!(await fx[0].$eval('.fb', e => e.textContent)).startsWith('Changed') || (await p.$eval('#fscore', e => e.innerText)) !== `You have ${fx.length - 1} of ${fx.length} right.`) { fail++; console.log('FAIL stale fix verdict'); }
  const katexOk = await p.evaluate(() => typeof katex !== 'undefined' && document.querySelectorAll('.katex').length);
  console.log(`tool 2: ${T.length} targets, ${fx.length} fix items, katex nodes ${katexOk}, failures ${fail}, page errors ${errs.length}, outside requests ${reqs.length}`);
  await b.close(); process.exit(fail || errs.length || reqs.length || !katexOk ? 1 : 0);
})();
