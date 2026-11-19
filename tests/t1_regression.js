// Regression tests for the Module 1 Try it checker (tryit/t1-structure-errors.html).
// Valid snippets must give no "LaTeX error" and no "Check"; broken snippets must give the expected message.
const { chromium } = require('playwright');
const wrap = b => '\\documentclass{article}\n\\usepackage{amsmath}\n\\usepackage{siunitx}\n\\usepackage{graphicx}\n\\usepackage{hyperref}\n\\title{T}\n\\author{A}\n\\begin{document}\n\\maketitle\n' + b + '\n\\end{document}';
const VALID = [
 ['inline math with \\( \\)', 'The sheet resistance \\(R_s\\) fell.'],
 ['inline math with $', 'The sheet resistance $R_s$ fell.'],
 ['display math $$', '$$ x_1 + x_2^2 $$'],
 ['display math \\[ \\]', '\\[ R_s = \\frac{\\pi}{\\ln 2}\\frac{V}{I} \\]'],
 ['equation env', '\\begin{equation}\n  t_{ox} = 50\n\\end{equation}'],
 ['align with &', '\\begin{align}\n  a &= b + c \\\\\n  d &= e\n\\end{align}'],
 ['tabular with &', '\\begin{tabular}{lr}\n  Wafer & Value \\\\\n  A & 49\n\\end{tabular}'],
 ['texttt and textsc', 'Saved in \\texttt{main.tex} by \\textsc{Lee}.'],
 ['url with _ # %', 'See \\url{https://example.com/a_b#c}.'],
 ['href', 'See \\href{https://example.com/x_y}{the guide}.'],
 ['label ref cite with _', 'As in Eq.~\\eqref{eq:r_s}, Figure~\\ref{fig_1} and \\cite{smith_2020}.'],
 ['includegraphics with _', '\\includegraphics[width=0.5\\textwidth]{my_fig.png}'],
 ['escaped specials', 'Yield rose 5\\% at \\$20, item \\#3, Smith \\& Jones, file\\_name.'],
 ['comment line', '% a note for myself about 5% yield\nText.'],
 ['verb', 'Type \\verb|a_b & c| in the editor.'],
 ['siunitx', 'The layer was \\SI{50}{\\nano\\metre} thick at \\qty{1000}{\\degreeCelsius}.'],
 ['newcommand with #', '\\newcommand{\\vect}[1]{\\mathbf{#1}}'],
 ['math env', '\\begin{math} a_1 \\end{math}'],
 ['greek and operators in math', '$\\alpha \\leq \\beta \\approx \\infty$'],
 ['itemize', '\\begin{itemize}\n  \\item one\n  \\item two\n\\end{itemize}'],
 ['section star', '\\section*{Acknowledgments}\nThanks.'],
];
const BROKEN = [
 ['misspelled section', '\\sectoin{Results}', 'is not a standard LaTeX command'],
 ['unescaped & in text', 'Smith & Jones measured it.', 'Misplaced alignment tab character'],
 ['_ in text', 'The value R_s fell.', 'Missing $ inserted'],
 ['missing brace', 'We recorded the \\textbf{thickness.', 'is never closed'],
 ['usepackage in body', '\\usepackage{xcolor}', 'Can be used only in preamble'],
 ['digit % comment', 'The yield rose 5% after the anneal.', 'starts a comment'],
 ['unescaped #', 'Item #3 failed.', 'special character'],
 ['env mismatch', '\\begin{itemize}\n\\item a\n\\end{enumerate}', 'does not match'],
];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + require('path').resolve(__dirname, '../tryit/t1-structure-errors.html'));
  let fail = 0;
  for (const [name, body] of VALID) {
    const W = await p.evaluate(src => window.T1.analyze(src).W, wrap(body));
    if (W.length) { fail++; console.log('FAIL valid:', name, JSON.stringify(W.map(w => w.sev + ': ' + w.m))); }
  }
  for (const [name, body, expect] of BROKEN) {
    const W = await p.evaluate(src => window.T1.analyze(src).W, wrap(body));
    if (!W.some(w => w.m.includes(expect))) { fail++; console.log('FAIL broken:', name, JSON.stringify(W.map(w => w.m))); }
  }
  // the two built-in examples
  const good = await p.evaluate(() => window.T1.analyze(document.getElementById('src').value).W);
  if (good.length) { fail++; console.log('FAIL: good example has issues', JSON.stringify(good)); }
  await p.click('#broken');
  const bad = await p.evaluate(() => window.T1.analyze(document.getElementById('src').value).W.map(w => w.sev));
  console.log('broken example:', bad.filter(x => x === 'error').length, 'errors,', bad.filter(x => x === 'check').length, 'checks');
  console.log(`valid ${VALID.length}, broken ${BROKEN.length}, failures ${fail}, page errors ${errs.length}`);
  await b.close(); process.exit(fail || errs.length ? 1 : 0);
})();
