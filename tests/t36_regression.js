// Tests for the Module 3 to 6 Try it tools. Run: node tests/t36_regression.js  (needs Node and Playwright)
// Checks the logic of each tool, drives the choice items with their keys, and confirms no page errors,
// no outside requests and no sideways scrolling at phone and Canvas-frame widths.
const { chromium } = require('playwright');
const path = require('path');
const T = f => 'file://' + path.resolve(__dirname, '../tryit/' + f);
let fail = 0; const bad = (m) => { fail++; console.log('FAIL', m); };

(async () => {
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [], reqs = [];
  p.on('pageerror', e => errs.push(String(e)));
  p.on('request', r => { const u = r.url(); if (!u.startsWith('file:') && !u.startsWith('data:')) reqs.push(u); });

  // Module 3: table builder
  await p.goto(T('t3-tables-captions.html'));
  let r = await p.evaluate(() => window.T3.build('Wafer\tR (ohm/sq)\nA\t112\nB\t71', 'Mean sheet resistance of two wafers, from five readings per wafer.', 'tab:sheet'));
  if (r.aligns.join('') !== 'lr') bad('t3 alignment ' + r.aligns.join(''));
  if (!/\\toprule[\s\S]*\\midrule[\s\S]*\\bottomrule/.test(r.latex)) bad('t3 booktabs rules');
  if (r.warn.length) bad('t3 clean table warned: ' + r.warn.join(' | '));
  r = await p.evaluate(() => window.T3.build('Wafer,R\nA,112 ohm/sq\nB,71 ohm/sq,extra', 'Short', 'table1'));
  for (const k of ['cells', 'repeats the unit', 'very short', 'tab:']) if (!r.warn.some(w => w.includes(k))) bad('t3 missing warning: ' + k);
  r = await p.evaluate(() => window.T3.build('Name\tShare\nA&B\t50%', 'A caption long enough to pass the length check here.', 'tab:x'));
  if (!/A\\&B & 50\\%/.test(r.latex)) bad('t3 escaping: ' + r.latex);

  // Module 4: .bib checker
  await p.goto(T('t4-bib-citations.html'));
  const chk = s => p.evaluate(s => { const r = window.T4.check(s); return [r.errors, r.warnings]; }, s);
  let [e, w] = await chk('@article{deal1965,\n author = {Deal, B. E. and Grove, A. S.},\n title = {General Relationship for the Thermal Oxidation of Silicon},\n journal = {Journal of Applied Physics},\n year = {1965},\n doi = {10.1063/1.1713945}\n}');
  if (e.length || w.length) bad('t4 clean entry: ' + e.concat(w).join(' | '));
  [e, w] = await chk('@article{x,\n author = {W. Shockley, W. T. Read},\n title = {On Si MOSFETs},\n journal = {Physical Review}\n pages = {835-842},\n doi = {https://doi.org/10.1/x}\n}');
  for (const k of ['comma is missing', 'needs year']) if (!e.some(x => x.includes(k))) bad('t4 missing error: ' + k);
  for (const k of ['several names', 'MOSFETs', 'two hyphens', 'without https']) if (!w.some(x => x.includes(k))) bad('t4 missing check: ' + k);
  [e] = await chk('@article{x,\n title = {A {B}\n}'); if (!e.some(x => x.includes('braces do not balance'))) bad('t4 braces');
  const pv = await p.evaluate(() => window.T4.preview(window.T4.check('@book{sze2007,\n author = {Sze, S. M. and Ng, Kwok K.},\n title = {Physics of Semiconductor Devices},\n publisher = {Wiley},\n edition = {Third},\n year = {2007}\n}')));
  if (!pv || !pv.ay.includes('Sze and Ng, 2007')) bad('t4 author-year preview ' + JSON.stringify(pv));

  // Module 5: template matcher keys
  await p.goto(T('t5-templates.html'));
  const g = await p.evaluate(() => window.T5.BRIEFS.map(b => window.T5.grade(b, b.where[0], b.layout, b.cite).all && !window.T5.grade(b, (b.where[0] + 1) % 7 === b.where[1] ? (b.where[0] + 2) % 7 : (b.where[0] + 1) % 7, b.layout, b.cite).all));
  if (g.some(x => !x)) bad('t5 brief keys ' + g.join(','));

  // Module 6: macro checker
  await p.goto(T('t6-log-macros.html'));
  const PARA = await p.inputValue('#body');
  const fixed = PARA.replace(/R_(?:s\b|\{s\}|\{\\mathrm\{s\}\}|\{\\mathrm\{sh\}\})/g, '\\Rs');
  const A = (d, s) => p.evaluate(([d, s]) => window.T6.analyze(d, s), [d, s]);
  const cases = [['\\newcommand{\\Rs}{R_{\\mathrm{s}}}', fixed, 0, 1], ['', fixed, 1, 0], ['\\newcommand{\\S}{R_{\\mathrm{s}}}', fixed.replace(/\\Rs/g, '\\S'), 1, 0],
                 ['\\newcommand{\\Rs}{R_{\\mathrm{s}}}', PARA, 1, 0], ['\\newcommand{\\Rs}{R_{\\mathrm{s}}}', fixed.replace('highest $\\Rs$', 'highest \\Rs'), 1, 0]];
  for (const [d, s, ne, ng] of cases) { const a = await A(d, s); if ((a.errors.length > 0) !== (ne > 0) || a.good.length !== ng) bad('t6 case ' + d + ' -> ' + JSON.stringify(a)); }
  await p.click('#mshow'); await p.waitForTimeout(200);
  if ((await p.$$('#mprev .katex')).length < 4) bad('t6 KaTeX preview');

  // choice items in every tool: answer each with its key and expect a full score
  for (const [f, host, score] of [['t3-tables-captions.html', 'fix', 'fixscore'], ['t3-tables-captions.html', 'caps', 'capscore'], ['t4-bib-citations.html', 'cite', 'citescore'], ['t5-templates.html', 'edit', 'escore'], ['t6-log-macros.html', 'log', 'logscore']]) {
    await p.goto(T(f));
    const keys = await p.evaluate(h => { const D = window.TOOLDATA; return ({ fix: D.FIX, caps: D.CAPS, cite: D.CITE, edit: D.EDIT, log: D.LOG })[h].map(x => x.ok); }, host);
    const items = await p.$$('#' + host + ' .item');
    for (let k = 0; k < items.length; k++) { const rs = await items[k].$$('input'); await rs[keys[k]].check(); await (await items[k].$('button')).click(); }
    const t = await p.textContent('#' + score); if (!t.includes(items.length + ' of ' + items.length)) bad(f + ' ' + host + ' score: ' + t);
    for (const wdt of [390, 800]) { await p.setViewportSize({ width: wdt, height: 800 }); const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); if (ov > 0) bad(f + ' overflow at ' + wdt + ': ' + ov); }
  }
  if (errs.length) bad('page errors ' + errs.join(' | '));
  if (reqs.length) bad('outside requests ' + reqs.join(' '));
  await b.close();
  console.log(fail ? fail + ' failure(s)' : 'All Module 3 to 6 tool tests passed.');
  process.exit(fail ? 1 : 0);
})();
